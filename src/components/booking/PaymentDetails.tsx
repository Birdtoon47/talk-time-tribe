
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentDetailsProps {
  creatorName: string;
  creatorId: string;
  creatorProfilePic: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  selectedDuration: number | null;
  consultationType: 'video' | 'audio' | 'chat';
  totalPrice: number;
  onBookConsultation: () => void;
  formatCurrency: (amount: number) => string;
  userData: any;
}

const PaymentDetails = ({ 
  creatorName,
  creatorId,
  creatorProfilePic,
  selectedDate,
  selectedTime,
  selectedDuration,
  consultationType,
  totalPrice,
  onBookConsultation,
  formatCurrency,
  userData
}: PaymentDetailsProps) => {
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    // Create booking details object to pass to checkout page
    const bookingDetails = {
      creatorId,
      creatorName,
      creatorProfilePic,
      date: selectedDate?.toISOString(),
      time: selectedTime,
      duration: selectedDuration,
      consultationType,
      totalPrice,
      userId: userData
    };
    
    // Navigate to checkout page with booking details
    navigate('/checkout', { state: { bookingDetails } });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center">
          <CreditCard className="h-4 w-4 mr-2" />
          <span>Payment Details</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Creator</span>
            <span className="font-medium">{creatorName}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Date</span>
            <span className="font-medium">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) : '-'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Time</span>
            <span className="font-medium">{selectedTime || '-'}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium">{selectedDuration ? `${selectedDuration} minutes` : '-'}</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-500">Consultation Type</span>
            <span className="font-medium capitalize">{consultationType}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-lg">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </Card>
      
      <Button 
        className="w-full bg-app-purple"
        onClick={handleProceedToCheckout}
      >
        Pay & Book Consultation
      </Button>
    </div>
  );
};

export default PaymentDetails;
