
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  onContinue: () => void;
}

const DateSelector = ({ selectedDate, setSelectedDate, onContinue }: DateSelectorProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Select Date</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
            const date = new Date();
            date.setDate(date.getDate() + dayOffset);
            const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
            
            return (
              <Button
                key={dayOffset}
                variant={isSelected ? "default" : "outline"}
                className={isSelected ? "bg-app-purple" : ""}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-center">
                  <div className="text-xs">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-bold">
                    {date.getDate()}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </Card>
      
      <Button 
        disabled={!selectedDate} 
        className="w-full bg-app-purple"
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default DateSelector;
