
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatDate, formatTime } from '@/utils/formatters';
import { createBookingNotification } from '@/utils/notifications';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { toast } from 'sonner';
import { ArrowLeft, Check, CreditCard, Gift } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails;
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [giftRecipientEmail, setGiftRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  useEffect(() => {
    // If no booking details or if it's a free consultation, redirect back to home
    if (!bookingDetails || (bookingDetails.consultationPaymentType === 'free')) {
      navigate('/');
    }
  }, [bookingDetails, navigate]);
  
  if (!bookingDetails) {
    return (
      <div className="container max-w-md mx-auto p-4">
        <Card className="p-6">
          <h1 className="text-xl font-bold mb-4">Checkout Error</h1>
          <p className="mb-4">No booking details found. Please try booking again.</p>
          <Button onClick={() => navigate('/')} className="w-full">Return to Home</Button>
        </Card>
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
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
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
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
        isPaid: true,
        consultationPaymentType: bookingDetails.consultationPaymentType
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
      toast.success('Payment successful!');
      
      // Dispatch events
      window.dispatchEvent(new CustomEvent('booking-completed'));
      window.dispatchEvent(new CustomEvent('messages-changed'));
      window.dispatchEvent(new CustomEvent('notification-added'));
      
      // Redirect back to home
      navigate('/');
    }, 2000);
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Payment Method</h2>
            
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
              <div className="flex items-center space-x-2 p-2 border rounded-md mb-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Credit/Debit Card
                  </div>
                </Label>
              </div>
              
              {bookingDetails.isGift && (
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <RadioGroupItem value="gift" id="gift" />
                  <Label htmlFor="gift" className="flex-1 cursor-pointer">
                    <div className="flex items-center">
                      <Gift className="mr-2 h-4 w-4" />
                      Send as Gift
                    </div>
                  </Label>
                </div>
              )}
            </RadioGroup>
            
            {paymentMethod === 'card' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={handleExpiryDateChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
            
            {bookingDetails.isGift && paymentMethod === 'gift' && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="recipientEmail">Recipient Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="friend@example.com"
                    value={giftRecipientEmail}
                    onChange={(e) => setGiftRecipientEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="giftMessage">Gift Message (Optional)</Label>
                  <Input
                    id="giftMessage"
                    placeholder="Here's a consultation with an expert I thought you'd enjoy!"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="p-6 sticky top-4">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={bookingDetails.creatorProfilePic} alt={bookingDetails.creatorName} />
                <AvatarFallback>{bookingDetails.creatorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{bookingDetails.creatorName}</p>
                <p className="text-sm text-gray-500">
                  {bookingDetails.duration}-minute {bookingDetails.consultationType} consultation
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span>{bookingDetails.date ? formatDate(new Date(bookingDetails.date)) : '-'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span>{bookingDetails.time}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span>{bookingDetails.duration} minutes</span>
              </div>
              
              {bookingDetails.isGift && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Gift</span>
                  <span className="flex items-center">
                    <Gift className="h-4 w-4 mr-1" />
                    Yes
                  </span>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(bookingDetails.totalPrice, bookingDetails.userId.currencyCode || 'IDR')}</span>
            </div>
            
            <Button 
              className="w-full mt-6 bg-app-purple"
              disabled={processingPayment}
              onClick={handleSubmit}
            >
              {processingPayment ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Complete Payment'
              )}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
