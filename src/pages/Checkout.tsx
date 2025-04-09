
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { CheckCircle, ArrowLeft, CreditCard, Clock } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { addNotification } from '@/utils/notifications';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvc: '',
  });

  useEffect(() => {
    // Get booking details from state passed via navigation
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
    } else {
      // If no booking details, redirect back to bookings
      navigate('/');
      toast.error("Booking details not found");
    }
  }, [location, navigate]);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
    }
    
    // Format CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setFormData({
      ...formData,
      [name]: formattedValue,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDetails) {
      toast.error("Booking details not found");
      return;
    }
    
    // Validate form data
    if (paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvc) {
        toast.error("Please fill all payment details");
        return;
      }
      
      if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        toast.error("Invalid card number");
        return;
      }
      
      if (formData.expiry.length !== 5) {
        toast.error("Invalid expiry date");
        return;
      }
      
      if (formData.cvc.length !== 3) {
        toast.error("Invalid CVC");
        return;
      }
    }
    
    // Process payment
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // Add the booking to localStorage
      const bookings = safeGetItem('talktribe_bookings', []);
      const newBooking = {
        ...bookingDetails,
        id: Date.now().toString(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };
      
      const updatedBookings = [...bookings, newBooking];
      safeSetItem('talktribe_bookings', updatedBookings);
      
      // Create a notification for the creator
      addNotification({
        title: 'New Booking!',
        message: `${bookingDetails.userId.name} has booked a ${bookingDetails.consultationType} consultation with you.`,
        type: 'success',
        link: '/'
      });
      
      // Create a welcome message
      const messages = safeGetItem('talktribe_messages', []);
      const welcomeMessage = {
        id: Date.now().toString(),
        senderId: bookingDetails.creatorId,
        senderName: bookingDetails.creatorName,
        senderProfilePic: bookingDetails.creatorProfilePic,
        receiverId: bookingDetails.userId.id,
        content: `Hi ${bookingDetails.userId.name}, thanks for booking a consultation with me! I'm looking forward to our session on ${new Date(bookingDetails.date).toLocaleDateString()} at ${bookingDetails.time}. Feel free to message me if you have any questions before then.`,
        isRead: false,
        timestamp: new Date().toISOString(),
        bookingId: newBooking.id
      };
      
      const updatedMessages = [...messages, welcomeMessage];
      safeSetItem('talktribe_messages', updatedMessages);
      
      // Trigger events to update state across the app
      window.dispatchEvent(new CustomEvent('messages-changed'));
      window.dispatchEvent(new CustomEvent('booking-completed'));
      
      setIsProcessing(false);
      setIsSuccess(true);
      
      // After a brief delay, redirect back to the app
      setTimeout(() => {
        navigate('/');
        toast.success("Your consultation has been booked successfully!");
      }, 3000);
    }, 2000);
  };

  if (!bookingDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate('/')}
        disabled={isProcessing || isSuccess}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <div className="grid md:grid-cols-5 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Complete your consultation booking</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                <p className="text-muted-foreground">
                  Your consultation has been booked. Redirecting you back to the app...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select 
                    value={paymentMethod} 
                    onValueChange={handlePaymentMethodChange}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input 
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc"
                          name="cvc"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={handleInputChange}
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === 'paypal' && (
                  <div className="bg-blue-50 p-4 rounded-md text-center">
                    <p className="mb-2">You'll be redirected to PayPal to complete your payment.</p>
                  </div>
                )}
                
                {paymentMethod === 'bank' && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="mb-2">Bank Transfer Details:</p>
                    <p>Bank: Example Bank</p>
                    <p>Account Number: 123456789</p>
                    <p>Routing Number: 987654321</p>
                    <p className="mt-2 text-sm">Please include your name and booking reference in the transfer.</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full mt-6 bg-app-purple"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay {bookingDetails.totalPrice ? formatCurrency(bookingDetails.totalPrice) : ''}
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Consultation with {bookingDetails.creatorName}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Date: {new Date(bookingDetails.date).toLocaleDateString()}</p>
                  <p>Time: {bookingDetails.time}</p>
                  <p>Duration: {bookingDetails.duration} minutes</p>
                  <p className="capitalize">Type: {bookingDetails.consultationType}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(bookingDetails.totalPrice)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatCurrency(0)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(bookingDetails.totalPrice)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start">
            <p className="text-xs text-muted-foreground">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
