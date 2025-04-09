
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreditCard, Gift, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [consultationType2, setConsultationType2] = useState<'paid' | 'free'>('paid');
  const [isGift, setIsGift] = useState(false);

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
      consultationPaymentType: consultationType2,
      totalPrice: consultationType2 === 'free' ? 0 : totalPrice,
      isGift,
      userId: userData
    };
    
    // For free consultations, book directly
    if (consultationType2 === 'free') {
      onBookConsultation();
      return;
    }
    
    // For paid consultations, navigate to checkout page
    navigate('/checkout', { state: { bookingDetails } });
  };

  const canOfferFree = userData.isCreator || (userData.credits && userData.credits > 0);

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
          
          <div className="py-3 border-b">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-500">Consultation Payment</span>
              <span className="text-xs text-gray-400">
                {userData.isCreator ? 'You can offer free consultations' : 
                  userData.credits ? `You have ${userData.credits} free credits` : ''}
              </span>
            </div>
            
            <RadioGroup 
              defaultValue="paid" 
              value={consultationType2} 
              onValueChange={(value) => setConsultationType2(value as 'paid' | 'free')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid" className="cursor-pointer">Paid Consultation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="free" 
                  id="free" 
                  disabled={!canOfferFree}
                />
                <Label 
                  htmlFor="free" 
                  className={`cursor-pointer flex items-center ${!canOfferFree ? 'text-gray-400' : ''}`}
                >
                  Free Consultation
                  {!canOfferFree && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>You need to be a creator or have free credits to offer this.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {consultationType2 === 'paid' && (
            <div className="py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="gift-switch" className="cursor-pointer">Send as a gift</Label>
                </div>
                <Switch
                  id="gift-switch"
                  checked={isGift}
                  onCheckedChange={setIsGift}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-lg">
              {consultationType2 === 'free' ? 'FREE' : formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </Card>
      
      <Button 
        className="w-full bg-app-purple"
        onClick={handleProceedToCheckout}
      >
        {consultationType2 === 'free' ? 'Book Free Consultation' : 'Pay & Book Consultation'}
      </Button>
    </div>
  );
};

export default PaymentDetails;
