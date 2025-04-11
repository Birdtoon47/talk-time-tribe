
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { formatDate } from '@/utils/formatters';

interface MessagesTabProps {
  onBookConsultation: () => void;
}

const MessagesTab = ({ onBookConsultation }: MessagesTabProps) => {
  const [consultations, setConsultations] = useState<any[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll just check if there are any bookings in localStorage
    const storedBookings = localStorage.getItem('talktribe_bookings');
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
      // Get only scheduled consultations
      const scheduledConsultations = bookings.filter((booking: any) => 
        booking.status === 'scheduled'
      );
      setConsultations(scheduledConsultations);
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Consultations</h2>
      
      {consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => (
            <Card key={consultation.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-app-purple" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{consultation.creatorName}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(new Date(consultation.date))}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-4 w-4" />
                    <span>{consultation.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      variant="default"
                      size="sm"
                      className="bg-app-purple"
                    >
                      Join Consultation
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Separator className="my-6" />
          
          <div className="text-center">
            <h3 className="font-medium mb-2">Need more help?</h3>
            <Button 
              className="bg-app-blue" 
              onClick={onBookConsultation}
            >
              Book Another Consultation
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 bg-white rounded-lg shadow p-6 text-center">
          <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-app-purple" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No active consultations</h3>
          <p className="text-gray-600 mb-6">Book a consultation with an expert to get personalized advice and guidance.</p>
          <Button 
            className="bg-app-purple" 
            onClick={onBookConsultation}
          >
            Book a Consultation
          </Button>
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
