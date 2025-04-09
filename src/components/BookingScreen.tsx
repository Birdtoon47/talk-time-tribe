
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import components
import BookingHeader from './booking/BookingHeader';
import CreatorList from './booking/CreatorList';
import BookingList from './booking/BookingList';
import BookingTabs from './booking/BookingTabs';
import DateSelector from './booking/DateSelector';
import TimeSelector from './booking/TimeSelector';
import ConsultationTypeSelector from './booking/ConsultationTypeSelector';
import PaymentDetails from './booking/PaymentDetails';

// Import utilities
import { formatCurrency } from '@/utils/formatters';

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

const BookingScreen = ({ userData, creators = [], selectedCreator: initialSelectedCreator }: BookingScreenProps) => {
  const [availableCreators] = useState(creators || []);
  const [selectedCreator, setSelectedCreator] = useState(initialSelectedCreator);
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
  
  const formatCurrencyWithUserCode = (amount: number) => {
    const currencyCode = userData.currencyCode || 'IDR';
    return formatCurrency(amount, currencyCode);
  };
  
  // Filter bookings by user ID (those the user has booked)
  const userBookings = bookings.filter(booking => booking.userId === userData.id);
  
  // Filter bookings by creator ID (those booked with the user as creator)
  const creatorBookings = userData.isCreator ? bookings.filter(booking => booking.creatorId === userData.id) : [];
  
  const handleCancelBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'cancelled' as 'scheduled' | 'completed' | 'cancelled' } : booking
    );
    
    localStorage.setItem('talktribe_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    toast.success('Booking cancelled successfully');
  };
  
  const handleCompleteBooking = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: 'completed' as 'scheduled' | 'completed' | 'cancelled' } : booking
    );
    
    localStorage.setItem('talktribe_bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
    toast.success('Booking marked as completed');
  };

  const calculateTotalPrice = () => {
    if (!selectedCreator || !selectedDuration) return 0;
    return (selectedCreator.ratePerMinute / selectedCreator.minuteIncrement) * selectedDuration;
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const toggleMyBookings = () => {
    setShowMyBookings(!showMyBookings);
  };

  if (showMyBookings) {
    return (
      <div className="p-4">
        <BookingHeader 
          title="My Consultations"
          showMyBookings={true}
          onToggleMyBookings={toggleMyBookings}
        />

        <Tabs defaultValue="booked">
          <TabsList className="mb-4">
            <TabsTrigger value="booked">Consultations I Booked</TabsTrigger>
            {userData.isCreator && (
              <TabsTrigger value="received">Consultations With Me</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="booked">
            <BookingList 
              bookings={userBookings}
              formatCurrency={formatCurrencyWithUserCode}
              onCancelBooking={handleCancelBooking}
            />
          </TabsContent>
          
          {userData.isCreator && (
            <TabsContent value="received">
              <BookingList 
                bookings={creatorBookings}
                isCreatorView={true}
                formatCurrency={formatCurrencyWithUserCode}
                onCancelBooking={handleCancelBooking}
                onCompleteBooking={handleCompleteBooking}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }
  
  if (!selectedCreator) {
    return (
      <div className="p-4">
        <BookingHeader 
          title="Book a Consultation"
          onToggleMyBookings={toggleMyBookings}
        />
        
        <CreatorList 
          creators={availableCreators}
          userId={userData.id}
          formatCurrency={formatCurrencyWithUserCode}
          onSelectCreator={(creator) => {
            window.dispatchEvent(new CustomEvent('select-creator', { detail: creator }));
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <BookingHeader 
        selectedCreator={selectedCreator}
        onBack={() => window.dispatchEvent(new CustomEvent('booking-completed'))}
        formatCurrency={formatCurrencyWithUserCode}
        title=""
        onToggleMyBookings={toggleMyBookings}
      />
      
      <BookingTabs activeTab={activeTab} onTabChange={handleTabChange}>
        <TabsContent value="date">
          <DateSelector 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            onContinue={() => setActiveTab('time')}
          />
        </TabsContent>
        
        <TabsContent value="time">
          <TimeSelector 
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
            minuteIncrement={selectedCreator.minuteIncrement}
            onContinue={() => setActiveTab('type')}
          />
        </TabsContent>
        
        <TabsContent value="type">
          <ConsultationTypeSelector 
            consultationType={consultationType}
            setConsultationType={setConsultationType}
            onContinue={() => setActiveTab('payment')}
          />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentDetails 
            creatorName={selectedCreator.name}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            selectedDuration={selectedDuration}
            consultationType={consultationType}
            totalPrice={calculateTotalPrice()}
            onBookConsultation={handleBookConsultation}
            formatCurrency={formatCurrencyWithUserCode}
          />
        </TabsContent>
      </BookingTabs>
    </div>
  );
};

export default BookingScreen;
