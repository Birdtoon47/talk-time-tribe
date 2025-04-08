
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  MessageSquare, 
  CreditCard, 
  ChevronRight 
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingScreenProps {
  userData: any;
  creators: any[];
  selectedCreator?: any;
}

const BookingScreen = ({ userData, creators, selectedCreator }: BookingScreenProps) => {
  const [availableCreators, setAvailableCreators] = useState(creators || []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  
  const handleBookConsultation = () => {
    if (!selectedCreator || !selectedDate || !selectedTime || !selectedDuration) {
      toast.error('Please select all required booking information');
      return;
    }
    
    // Here we would typically make an API call to book the consultation
    // For now, we'll just show a success message
    toast.success('Consultation booked successfully!');
  };
  
  const formatCurrency = (amount: number) => {
    const currencyCode = userData.currencyCode || 'IDR';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (!selectedCreator) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Book a Consultation</h2>
        
        {availableCreators.length === 0 ? (
          <p className="text-gray-500">No creators available at the moment</p>
        ) : (
          <div className="space-y-4">
            {availableCreators.map(creator => (
              <Card key={creator.id} className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (creator.id !== userData.id) {
                    window.dispatchEvent(new CustomEvent('select-creator', { detail: creator }));
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={creator.profilePic} alt={creator.name} />
                    <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{creator.name}</h3>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <p className="text-sm text-gray-500 line-clamp-1">{creator.bio}</p>
                    
                    <div className="mt-1 text-xs text-gray-500">
                      <span className="font-medium text-app-purple">
                        {formatCurrency(creator.ratePerMinute)} / {creator.minuteIncrement} min
                      </span>
                      <span className="mx-2">•</span>
                      <span>⭐ {creator.ratings} ({creator.totalConsults} consults)</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i <= 21; i++) {
      slots.push(`${i}:00`);
      if (i < 21) slots.push(`${i}:30`);
    }
    return slots;
  };
  
  const generateDurationOptions = () => {
    const { minuteIncrement } = selectedCreator;
    const options = [];
    for (let i = 1; i <= 12; i++) {
      options.push(minuteIncrement * i);
    }
    return options;
  };
  
  const calculateTotalPrice = () => {
    if (!selectedCreator || !selectedDuration) return 0;
    return (selectedCreator.ratePerMinute / selectedCreator.minuteIncrement) * selectedDuration;
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={selectedCreator.profilePic} alt={selectedCreator.name} />
          <AvatarFallback>{selectedCreator.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-lg font-bold">{selectedCreator.name}</h2>
          <p className="text-xs text-gray-500">
            {formatCurrency(selectedCreator.ratePerMinute)} / {selectedCreator.minuteIncrement} min
            <span className="mx-1">•</span>
            <span>⭐ {selectedCreator.ratings}</span>
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="date" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="date">Date</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="type">Type</TabsTrigger>
          <TabsTrigger value="payment">Pay</TabsTrigger>
        </TabsList>
        
        <TabsContent value="date" className="space-y-4">
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
            onClick={() => {
              if (selectedDate) {
                document.querySelector('button[value="time"]')?.click();
              }
            }}
          >
            Continue
          </Button>
        </TabsContent>
        
        <TabsContent value="time" className="space-y-4">
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
            onClick={() => {
              if (selectedTime && selectedDuration) {
                document.querySelector('button[value="type"]')?.click();
              }
            }}
          >
            Continue
          </Button>
        </TabsContent>
        
        <TabsContent value="type" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3">Consultation Type</h3>
            
            <div className="space-y-3">
              <button
                className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'video' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
                onClick={() => setConsultationType('video')}
              >
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'video' ? 'border-app-purple' : 'border-gray-300'}`}>
                  {consultationType === 'video' && (
                    <div className="h-3 w-3 rounded-full bg-app-purple" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Video Call</h4>
                    <Video className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Face-to-face video consultation</p>
                </div>
              </button>
              
              <button
                className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'audio' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
                onClick={() => setConsultationType('audio')}
              >
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'audio' ? 'border-app-purple' : 'border-gray-300'}`}>
                  {consultationType === 'audio' && (
                    <div className="h-3 w-3 rounded-full bg-app-purple" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Audio Call</h4>
                    <Phone className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Voice-only consultation</p>
                </div>
              </button>
              
              <button
                className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'chat' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
                onClick={() => setConsultationType('chat')}
              >
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'chat' ? 'border-app-purple' : 'border-gray-300'}`}>
                  {consultationType === 'chat' && (
                    <div className="h-3 w-3 rounded-full bg-app-purple" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Text Chat</h4>
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Text-based consultation</p>
                </div>
              </button>
            </div>
          </Card>
          
          <Button 
            className="w-full bg-app-purple"
            onClick={() => {
              document.querySelector('button[value="payment"]')?.click();
            }}
          >
            Continue
          </Button>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Payment Details</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-500">Creator</span>
                <span className="font-medium">{selectedCreator.name}</span>
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
                  {formatCurrency(calculateTotalPrice())}
                </span>
              </div>
            </div>
          </Card>
          
          <Button 
            className="w-full bg-app-purple"
            onClick={handleBookConsultation}
          >
            Pay & Book Consultation
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingScreen;
