
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorProfileComponent from '@/components/CreatorProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import BookingScreen from '@/components/BookingScreen';

interface BookingScreenProps {
  selectedCreator: any;
  userData: any;
  onClose: () => void;
}

const CreatorProfilePage = () => {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<any>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    // Get selected creator from session storage
    const selectedCreator = sessionStorage.getItem('selected_creator');
    if (!selectedCreator) {
      navigate('/creators');
      return;
    }
    
    setCreator(JSON.parse(selectedCreator));
    
    // Get current user
    const storedUser = localStorage.getItem('talktribe_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [navigate]);
  
  const handleBookConsultation = (creatorData: any) => {
    if (!currentUser) {
      toast.error('Please log in to book a consultation');
      return;
    }
    
    setShowBooking(true);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${creator.name} - TalkTimeTribe Consultant`,
        text: `Check out ${creator.name}'s consulting profile on TalkTimeTribe!`,
        url: window.location.href,
      })
      .then(() => toast.success('Shared successfully'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Profile link copied to clipboard'))
        .catch(() => toast.error('Failed to copy link'));
    }
  };
  
  if (!creator) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {showBooking ? (
        <BookingScreen 
          selectedCreator={creator}
          userData={currentUser}
          onClose={() => setShowBooking(false)}
        />
      ) : (
        <>
          <div className="flex items-center justify-between p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/creators')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <h1 className="text-xl font-bold">Creator Profile</h1>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            <CreatorProfileComponent 
              userData={creator}
              isOwnProfile={creator.id === currentUser?.id}
              onBookConsultation={handleBookConsultation}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CreatorProfilePage;
