
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Star, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import VideoCall from './VideoCall';
import CreatorProfile from './CreatorProfile';

interface BookingScreenProps {
  userData: any;
  creators: any[];
}

const BookingScreen = ({ userData, creators }: BookingScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: browse, 1: select time, 2: payment, 3: success
  const [callActive, setCallActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(0);
  
  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.bio.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStartBooking = (creator: any) => {
    setSelectedCreator(creator);
    setBookingStep(1);
  };
  
  const handleViewProfile = (creator: any) => {
    setSelectedCreator(creator);
    setBookingStep(4); // Special step for viewing profile
  };
  
  const handleSelectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
    setBookingStep(2);
  };
  
  const handlePayment = () => {
    // In a real app, this would call a payment API
    const totalAmount = selectedCreator.ratePerMinute * selectedDuration;
    
    // Simulating payment processing
    setTimeout(() => {
      // Update creator's earnings
      if (selectedCreator.id === userData.id) {
        const updatedUserData = {
          ...userData,
          balance: (userData.balance || 0) + totalAmount
        };
        localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
      }
      
      toast.success('Payment successful!');
      setBookingStep(3);
    }, 1500);
  };
  
  const startConsultation = () => {
    setCallActive(true);
  };
  
  const endConsultation = () => {
    setCallActive(false);
    setBookingStep(0);
    setSelectedCreator(null);
    toast.success('Consultation ended. Thank you!');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (callActive) {
    return (
      <VideoCall 
        creator={selectedCreator}
        duration={selectedDuration}
        onEndCall={endConsultation}
      />
    );
  }
  
  if (bookingStep === 4) {
    return (
      <CreatorProfile 
        userData={selectedCreator}
        onBookConsultation={() => handleStartBooking(selectedCreator)}
      />
    );
  }
  
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {bookingStep === 0 ? 'Book a Consultation' : 
         bookingStep === 1 ? 'Select Duration' :
         bookingStep === 2 ? 'Payment' : 'Ready for Consultation'}
      </h2>
      
      {bookingStep === 0 && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search creators..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {filteredCreators.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No creators found
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCreators.map(creator => (
                <Card key={creator.id} className="overflow-hidden">
                  <div className="p-4 flex">
                    <img 
                      src={creator.profilePic} 
                      alt={creator.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold">{creator.name}</h3>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 text-sm">{creator.ratings}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{creator.bio}</p>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-gray-500 text-sm mr-4">
                          <DollarSign className="h-3 w-3 mr-1" />
                          <span>{formatCurrency(creator.ratePerMinute)}/min</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{creator.minuteIncrement} min increments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 flex border-t">
                    <Button 
                      variant="outline" 
                      className="mr-2 flex-1"
                      onClick={() => handleViewProfile(creator)}
                    >
                      View Profile
                    </Button>
                    <Button 
                      className="flex-1 bg-app-purple"
                      onClick={() => handleStartBooking(creator)}
                    >
                      Book
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      {bookingStep === 1 && selectedCreator && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <img 
              src={selectedCreator.profilePic} 
              alt={selectedCreator.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <h3 className="font-bold">{selectedCreator.name}</h3>
              <p className="text-sm text-gray-600">
                {formatCurrency(selectedCreator.ratePerMinute)} per minute
              </p>
            </div>
          </div>
          
          <h4 className="font-medium mb-3">Select Duration</h4>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            {[selectedCreator.minuteIncrement, selectedCreator.minuteIncrement * 2, selectedCreator.minuteIncrement * 3, selectedCreator.minuteIncrement * 4].map(minutes => (
              <Button 
                key={minutes}
                variant="outline"
                className="py-6"
                onClick={() => handleSelectDuration(minutes)}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{minutes} min</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(selectedCreator.ratePerMinute * minutes)}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setBookingStep(0);
                setSelectedCreator(null);
              }}
            >
              Back
            </Button>
          </div>
        </div>
      )}
      
      {bookingStep === 2 && selectedCreator && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold text-center mb-4">Payment Summary</h3>
          
          <div className="border-t border-b py-4 my-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Creator:</span>
              <span className="font-medium">{selectedCreator.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{selectedDuration} minutes</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium">{formatCurrency(selectedCreator.ratePerMinute)}/minute</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-4 pt-2 border-t">
              <span>Total:</span>
              <span>{formatCurrency(selectedCreator.ratePerMinute * selectedDuration)}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-app-green"
              onClick={handlePayment}
            >
              Pay Now
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setBookingStep(1)}
            >
              Back
            </Button>
          </div>
        </div>
      )}
      
      {bookingStep === 3 && selectedCreator && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-16 h-16 bg-app-green rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-6">
            You're all set for your {selectedDuration} minute consultation with {selectedCreator.name}.
          </p>
          
          <Button 
            className="w-full bg-app-blue mb-3"
            onClick={startConsultation}
          >
            Start Consultation Now
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              setBookingStep(0);
              setSelectedCreator(null);
            }}
          >
            Book Another Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingScreen;
