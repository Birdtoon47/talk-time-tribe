
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';

interface BookingHeaderProps {
  title: string;
  showMyBookings?: boolean;
  onToggleMyBookings: () => void;
  selectedCreator?: {
    name: string;
    profilePic: string;
    ratings: number;
    ratePerMinute: number;
    minuteIncrement: number;
  };
  onBack?: () => void;
  formatCurrency?: (amount: number) => string;
}

const BookingHeader = ({ 
  title, 
  showMyBookings = false, 
  onToggleMyBookings, 
  selectedCreator, 
  onBack,
  formatCurrency 
}: BookingHeaderProps) => {
  
  if (selectedCreator) {
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={selectedCreator.profilePic} alt={selectedCreator.name} />
            <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-lg font-bold">{selectedCreator.name}</h2>
            <p className="text-xs text-gray-500">
              {formatCurrency && formatCurrency(selectedCreator.ratePerMinute)} / {selectedCreator.minuteIncrement} min
              <span className="mx-1">•</span>
              <span>⭐ {selectedCreator.ratings}</span>
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
        >
          Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      
      <Button 
        variant="outline"
        onClick={onToggleMyBookings}
        className="flex items-center gap-1"
      >
        <Calendar className="h-4 w-4" />
        {showMyBookings ? 'Back to Booking' : 'My Bookings'}
      </Button>
    </div>
  );
};

export default BookingHeader;
