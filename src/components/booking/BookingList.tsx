
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check } from 'lucide-react';

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

interface BookingListProps {
  bookings: Booking[];
  isCreatorView?: boolean;
  formatCurrency: (amount: number) => string;
  onCancelBooking: (bookingId: string) => void;
  onCompleteBooking?: (bookingId: string) => void;
}

const BookingList = ({ 
  bookings, 
  isCreatorView = false, 
  formatCurrency, 
  onCancelBooking, 
  onCompleteBooking 
}: BookingListProps) => {
  if (bookings.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 mb-2">
          {isCreatorView 
            ? "You don't have any booked consultations yet"
            : "You haven't booked any consultations yet"
          }
        </p>
        {!isCreatorView && (
          <Button onClick={() => window.dispatchEvent(new CustomEvent('booking-completed'))}>
            Book a Consultation
          </Button>
        )}
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {bookings.map(booking => (
        <Card key={booking.id} className="p-4">
          <div className="flex items-center gap-3 mb-2">
            {!isCreatorView ? (
              <>
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
              </>
            ) : (
              <div>
                <h3 className="font-medium">Consultation with User #{booking.userId}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(booking.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} • {booking.time} • {booking.duration} min
                </p>
              </div>
            )}
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
                {isCreatorView 
                  ? `${booking.consultationType} • ${formatCurrency(booking.totalPrice)}`
                  : `${booking.consultationType} consultation`
                }
              </span>
            </div>
            
            {booking.status === 'scheduled' && (
              isCreatorView ? (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => onCompleteBooking && onCompleteBooking(booking.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    onClick={() => onCancelBooking(booking.id)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50"
                  onClick={() => onCancelBooking(booking.id)}
                >
                  Cancel
                </Button>
              )
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BookingList;
