
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { createBookingNotification } from '@/utils/notifications';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { toast } from 'sonner';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutBottomNav from '@/components/checkout/CheckoutBottomNav';
import PaymentMethodCard from '@/components/checkout/PaymentMethodCard';
import GiftForm from '@/components/checkout/GiftForm';
import OrderSummary from '@/components/checkout/OrderSummary';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [giftRecipientEmail, setGiftRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<any[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [ewalletProvider, setEwalletProvider] = useState('');
  const [ewalletNumber, setEwalletNumber] = useState('');
  const [showAddNewPayment, setShowAddNewPayment] = useState(false);
  
  // Mock user data for the header and navbar
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // Load saved payment methods
    const methods = safeGetItem('talktribe_payment_methods', []);
    setSavedPaymentMethods(methods);
    
    // Load user data
    const user = safeGetItem('talktribe_user', null);
    setUserData(user);
  }, []);
  
  useEffect(() => {
    // If no booking details or if it's a free consultation, redirect back to home
    if (!bookingDetails) {
      navigate('/');
    }
  }, [bookingDetails, navigate]);
  
  if (!bookingDetails) {
    // Render loading or error state
    return (
      <div className="container max-w-md mx-auto p-4">
        <h1>Checkout Error</h1>
        <p>No booking details found. Please try booking again.</p>
        <button onClick={() => navigate('/')}>Return to Home</button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces every 4 digits
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add space every 4 characters
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    
    setCardNumber(parts.join(' '));
  };
  
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiry date as MM/YY
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiryDate(value);
    }
  };
  
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) return;
    setCvv(value);
  };

  const savePaymentMethod = () => {
    let newMethod;
    
    if (paymentMethod === 'card' && cardNumber && cardName && expiryDate && cvv) {
      newMethod = {
        id: Date.now().toString(),
        type: 'card',
        cardNumber: cardNumber.replace(/\s/g, '').slice(-4),
        cardName,
        expiryDate,
      };
    } else if (paymentMethod === 'bank' && bankAccountNumber && bankName && accountHolderName) {
      newMethod = {
        id: Date.now().toString(),
        type: 'bank',
        bankName,
        accountNumber: bankAccountNumber.slice(-4),
        accountHolderName,
      };
    } else if (paymentMethod === 'ewallet' && ewalletProvider && ewalletNumber) {
      newMethod = {
        id: Date.now().toString(),
        type: 'ewallet',
        provider: ewalletProvider,
        number: ewalletNumber.slice(-4),
      };
    } else {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (newMethod) {
      const updatedMethods = [...savedPaymentMethods, newMethod];
      setSavedPaymentMethods(updatedMethods);
      setSelectedPaymentMethodId(newMethod.id);
      safeSetItem('talktribe_payment_methods', updatedMethods);
      toast.success('Payment method saved');
      setShowAddNewPayment(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For free consultations, skip payment validation
    if (bookingDetails.consultationPaymentType === 'free') {
      processBooking();
      return;
    }
    
    // Validate fields for paid consultations
    if (!selectedPaymentMethodId && !showAddNewPayment) {
      toast.error('Please select a payment method');
      return;
    }
    
    if (showAddNewPayment) {
      if (paymentMethod === 'card') {
        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
          toast.error('Please enter a valid card number');
          return;
        }
        
        if (!cardName) {
          toast.error('Please enter the name on card');
          return;
        }
        
        if (!expiryDate || expiryDate.length < 5) {
          toast.error('Please enter a valid expiry date');
          return;
        }
        
        if (!cvv || cvv.length < 3) {
          toast.error('Please enter a valid CVV');
          return;
        }
      } else if (paymentMethod === 'bank') {
        if (!bankAccountNumber || bankAccountNumber.length < 8) {
          toast.error('Please enter a valid account number');
          return;
        }
        
        if (!bankName) {
          toast.error('Please enter the bank name');
          return;
        }
        
        if (!accountHolderName) {
          toast.error('Please enter the account holder name');
          return;
        }
      } else if (paymentMethod === 'ewallet') {
        if (!ewalletProvider) {
          toast.error('Please select an e-wallet provider');
          return;
        }
        
        if (!ewalletNumber || ewalletNumber.length < 8) {
          toast.error('Please enter a valid e-wallet number');
          return;
        }
      }
    }
    
    if (bookingDetails.isGift) {
      if (!giftRecipientEmail) {
        toast.error('Please enter recipient email');
        return;
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(giftRecipientEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }
    
    // Process payment
    processBooking();
  };

  const processBooking = () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // If adding a new payment method, save it first
      if (showAddNewPayment) {
        savePaymentMethod();
      }
      
      // Create a new booking
      const newBooking = {
        id: Date.now().toString(),
        creatorId: bookingDetails.creatorId,
        userId: bookingDetails.userId.id,
        date: bookingDetails.date,
        time: bookingDetails.time,
        duration: bookingDetails.duration,
        consultationType: bookingDetails.consultationType,
        totalPrice: bookingDetails.totalPrice,
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        creatorName: bookingDetails.creatorName,
        creatorProfilePic: bookingDetails.creatorProfilePic,
        isGift: bookingDetails.isGift,
        giftRecipientEmail: bookingDetails.isGift ? giftRecipientEmail : undefined,
        giftMessage: bookingDetails.isGift ? giftMessage : undefined,
        isPaid: bookingDetails.consultationPaymentType !== 'free',
        consultationPaymentType: bookingDetails.consultationPaymentType,
        paymentMethodId: selectedPaymentMethodId
      };
      
      // Save to localStorage
      const existingBookings = safeGetItem('talktribe_bookings', []);
      const updatedBookings = [...existingBookings, newBooking];
      safeSetItem('talktribe_bookings', updatedBookings);
      
      // Create notification for the booking
      createBookingNotification(
        bookingDetails.creatorName, 
        'confirmed', 
        bookingDetails.date
      );
      
      // Send a direct message to the creator
      const message = {
        id: Date.now().toString(),
        senderId: bookingDetails.userId.id,
        senderName: bookingDetails.userId.name,
        senderProfilePic: bookingDetails.userId.profilePic,
        receiverId: bookingDetails.creatorId,
        content: `I've booked a ${bookingDetails.duration}-minute ${bookingDetails.consultationType} consultation with you on ${formatDate(new Date(bookingDetails.date))} at ${bookingDetails.time}.`,
        isRead: false,
        timestamp: new Date().toISOString(),
        bookingId: newBooking.id
      };
      
      const existingMessages = safeGetItem('talktribe_messages', []);
      safeSetItem('talktribe_messages', [...existingMessages, message]);
      
      // Show success message
      toast.success(bookingDetails.consultationPaymentType === 'free' 
        ? 'Booking successful!' 
        : 'Payment successful!');
      
      // Dispatch events
      window.dispatchEvent(new CustomEvent('booking-completed'));
      window.dispatchEvent(new CustomEvent('messages-changed'));
      window.dispatchEvent(new CustomEvent('notification-added'));
      
      // Redirect back to home
      navigate('/');
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex-none">
        <CheckoutHeader />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-2xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-6">
              <PaymentMethodCard 
                savedPaymentMethods={savedPaymentMethods}
                selectedPaymentMethodId={selectedPaymentMethodId}
                setSelectedPaymentMethodId={setSelectedPaymentMethodId}
                showAddNewPayment={showAddNewPayment}
                setShowAddNewPayment={setShowAddNewPayment}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                savePaymentMethod={savePaymentMethod}
                cardNumber={cardNumber}
                setCardNumber={setCardNumber}
                cardName={cardName}
                setCardName={setCardName}
                expiryDate={expiryDate}
                setExpiryDate={setExpiryDate}
                cvv={cvv}
                setCvv={setCvv}
                bankAccountNumber={bankAccountNumber}
                setBankAccountNumber={setBankAccountNumber}
                bankName={bankName}
                setBankName={setBankName}
                accountHolderName={accountHolderName}
                setAccountHolderName={setAccountHolderName}
                ewalletProvider={ewalletProvider}
                setEwalletProvider={setEwalletProvider}
                ewalletNumber={ewalletNumber}
                setEwalletNumber={setEwalletNumber}
                handleCardNumberChange={handleCardNumberChange}
                handleExpiryDateChange={handleExpiryDateChange}
                handleCvvChange={handleCvvChange}
                handleSubmit={handleSubmit}
              />
              
              {bookingDetails.isGift && (
                <GiftForm
                  giftRecipientEmail={giftRecipientEmail}
                  setGiftRecipientEmail={setGiftRecipientEmail}
                  giftMessage={giftMessage}
                  setGiftMessage={setGiftMessage}
                />
              )}
            </div>
            
            <div className="md:col-span-2">
              <OrderSummary
                bookingDetails={bookingDetails}
                processingPayment={processingPayment}
                handleSubmit={handleSubmit}
                formatCurrency={formatCurrency}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex-none">
        <CheckoutBottomNav />
      </div>
    </div>
  );
};

export default Checkout;
