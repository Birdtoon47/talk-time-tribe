
import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/utils/formatters';

interface OrderSummaryProps {
  bookingDetails: any;
  processingPayment: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  formatCurrency: (amount: number, code: string) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  bookingDetails,
  processingPayment,
  handleSubmit,
  formatCurrency
}) => {
  return (
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
              <Check className="h-4 w-4 mr-1" />
              Yes
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Type</span>
          <span className="text-app-purple font-medium">
            {bookingDetails.consultationPaymentType === 'free' ? 'Free Consultation' : 'Paid Consultation'}
          </span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>
          {bookingDetails.consultationPaymentType === 'free' 
            ? 'Free' 
            : formatCurrency(bookingDetails.totalPrice, bookingDetails.userId.currencyCode || 'IDR')}
        </span>
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
          bookingDetails.consultationPaymentType === 'free' ? 'Complete Booking' : 'Complete Payment'
        )}
      </Button>
    </Card>
  );
};

export default OrderSummary;
