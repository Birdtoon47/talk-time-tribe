
import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingScreenProps {
  userData: any;
  creators: any[];
  selectedCreator?: any;
}

interface Booking {
  id: string;
  creatorId: string;
  userId: string;
  date: string;
  time: string;
  duration: number;
  consultationType: 'video' | 'audio' | 'chat';
  totalPrice: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  creatorName: string;
  creatorProfilePic: string;
}

const BookingScreen = ({ userData, creators = [], selectedCreator }: BookingScreenProps) => {
  const [availableCreators, setAvailableCreators] = useState(creators || []);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  const [activeTab, setActiveTab] = useState('date');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showMyBookings, setShowMyBookings] = useState(false);
  
  // Load existing bookings from localStorage
  useEffect(() => {
    const storedBookings = localStorage.getItem('talktribe_bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);
  
  // Listen for the custom event
  useEffect(() => {
    const handleSelectCreator = (event: CustomEvent) => {
      setSelectedCreator(event.detail);
    };
    
    window.addEventListener('select-creator' as any, handleSelectCreator as any);
    
    // Reset state when booking is completed
    const handleBookingCompleted = () => {
      setSelectedCreator(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setSelectedDuration(null);
      setConsultationType('video');
      setActiveTab('date');
    };
    
    window.addEventListener('booking-completed' as any, handleBookingCompleted);
    
    return () => {
      window.removeEventListener('select-creator' as any, handleSelectCreator as any);
      window.removeEventListener('booking-completed' as any, handleBookingCompleted);
    };
  }, []);

  const handleBookConsultation = () => {
    if (!selectedCreator || !selectedDate || !selectedTime || !selectedDuration) {
      toast.error('Please select all required booking information');
      return;
    }
    
    // Create new booking
    const newBooking: Booking = {
      id: Date.now().toString(),
      creatorId: selectedCreator.id,
      userId: userData.id,
      date: selectedDate.toISOString(),
      time: selectedTime,
      duration: selectedDuration,
      consultationType,
      totalPrice: calculateTotalPrice(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      creatorName: selectedCreator.name,
      creatorProfilePic: selectedCreator.profilePic
    };
    
    // Add to existing bookings
    const updatedBookings = [...bookings, newBooking];
    
    // Save to localStorage
    localStorage.setItem('talktribe_bookings', JSON.stringify(updatedBookings));
    
    // Update state
    setBookings(updatedBookings);
    
    // Reset form
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedDuration(null);
    setConsultationType('video');
    setActiveTab('date');
    
    // Show success message
    toast.success('Consultation booked successfully!');
    
    // Notify creator (in a real app, this would send a notification)
    // For demo purposes, we'll just log to console
    console.log(`Booking created for creator: ${selectedCreator.name}`, newBooking);
    
    // Dispatch an event to reset the creator selection
    window.dispatchEvent(new CustomEvent('booking-completed'));
  };
  
  const formatCurrency = (amount: number) => {
    const currencyCode = userData.currencyCode || 'IDR';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Filter bookings by user ID (those the user has booked)
  const userBookings = bookings.filter(booking => booking.userId === userData.id);
  
  // Filter bookings by creator ID (those booked with the user as creator)
  const creatorBookings = userData.isCreator ? bookings.filter(booking => booking.creatorId === userData.id) : [];
  
  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    );
    
    localStorage.setItem('talktribe_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    toast.success('Booking cancelled successfully');
  };
  
  const handleCompleteBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'completed' } : booking
    );
    
    localStorage.setItem('talktribe_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    toast.success('Booking marked as completed');
  };

  if (showMyBookings) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Consultations</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowMyBookings(false)}
          >
            Back to Booking
          </Button>
        </div>

        <Tabs defaultValue="booked">
          <TabsList className="mb-4">
            <TabsTrigger value="booked">Consultations I Booked</TabsTrigger>
            {userData.isCreator && (
              <TabsTrigger value="received">Consultations With Me</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="booked">
            {userBookings.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500 mb-2">You haven't booked any consultations yet</p>
                <Button onClick={() => setShowMyBookings(false)}>Book a Consultation</Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {userBookings.map(booking => (
                  <Card key={booking.id} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarImage src={booking.creatorProfilePic} alt={booking.creatorName} />
                        <AvatarFallback>{booking.creatorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{booking.creatorName}</h3>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} • {booking.time} • {booking.duration} min
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {booking.consultationType} consultation
                        </span>
                      </div>
                      
                      {booking.status === 'scheduled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {userData.isCreator && (
            <TabsContent value="received">
              {creatorBookings.length === 0 ? (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">You don't have any booked consultations yet</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {creatorBookings.map(booking => (
                    <Card key={booking.id} className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h3 className="font-medium">Consultation with User #{booking.userId}</h3>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {booking.time} • {booking.duration} min
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            booking.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {booking.consultationType} • {formatCurrency(booking.totalPrice)}
                          </span>
                        </div>
                        
                        {booking.status === 'scheduled' && (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleCompleteBooking(booking.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }
  
  if (!selectedCreator) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book a Consultation</h2>
          
          <Button 
            variant="outline"
            onClick={() => setShowMyBookings(true)}
            className="flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            My Bookings
          </Button>
        </div>
        
        {availableCreators.length === 0 ? (
          <p className="text-gray-500">No creators available at the moment</p>
        ) : (
          <div className="space-y-4">
            {availableCreators.map(creator => (
              <Card key={creator.id} className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (creator.id !== userData.id) {
                    window.dispatchEvent(new CustomEvent('select-creator', { detail: creator }));
                  } else {
                    toast.error("You cannot book a consultation with yourself");
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const navigateToNextTab = (current: string, next: string) => {
    setActiveTab(next);
  };
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
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
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.dispatchEvent(new CustomEvent('booking-completed'))}
        >
          Back
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
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
            onClick={() => navigateToNextTab('date', 'time')}
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
            onClick={() => navigateToNextTab('time', 'type')}
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
            onClick={() => navigateToNextTab('type', 'payment')}
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
