
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimeSelectorProps {
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  selectedDuration: number | null;
  setSelectedDuration: (duration: number) => void;
  minuteIncrement: number;
  onContinue: () => void;
}

const TimeSelector = ({ 
  selectedTime, 
  setSelectedTime, 
  selectedDuration, 
  setSelectedDuration,
  minuteIncrement, 
  onContinue 
}: TimeSelectorProps) => {
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 21; i++) {
      slots.push(`${i}:00`);
      if (i < 21) slots.push(`${i}:30`);
    }
    return slots;
  };
  
  const generateDurationOptions = () => {
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(minuteIncrement * i);
    }
    return options;
  };
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          <span>Select Time</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-2">
          {generateTimeSlots().map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={selectedTime === time ? "bg-app-purple" : ""}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </Button>
          ))}
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-medium mb-3">Select Duration</h3>
        
        <div className="grid grid-cols-3 gap-2">
          {generateDurationOptions().map((duration) => (
            <Button
              key={duration}
              variant={selectedDuration === duration ? "default" : "outline"}
              className={selectedDuration === duration ? "bg-app-purple" : ""}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration} min
            </Button>
          ))}
        </div>
      </Card>
      
      <Button 
        disabled={!selectedTime || !selectedDuration} 
        className="w-full bg-app-purple"
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default TimeSelector;
