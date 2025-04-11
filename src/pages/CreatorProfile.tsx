
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatorProfileComponent from '@/components/CreatorProfile';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import BookingScreen from '@/components/BookingScreen';
import { safeGetItem } from '@/utils/storage';
import PageHeader from '@/components/navigation/PageHeader';
import BottomNav from '@/components/navigation/BottomNav';

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
    
    const creatorData = JSON.parse(selectedCreator);
    
    // Get current user
    const storedUser = localStorage.getItem('talktribe_user');
    let userData = null;
    
    if (storedUser) {
      userData = JSON.parse(storedUser);
      // Add current user ID to the creator data for the follow button
      creatorData.currentUserId = userData.id;
      setCurrentUser(userData);
    }
    
    setCreator(creatorData);
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
    <div className="max-w-4xl mx-auto pb-20">
      {showBooking ? (
        <>
          <PageHeader 
            title="Book Consultation" 
            onShare={handleShare}
            showShare={true}
          />
          <BookingScreen 
            selectedCreator={creator}
            userData={currentUser}
            onClose={() => setShowBooking(false)}
          />
        </>
      ) : (
        <>
          <PageHeader 
            title="Creator Profile" 
            onShare={handleShare}
            showShare={true}
          />
          
          <div className="overflow-y-auto">
            <CreatorProfileComponent 
              userData={creator}
              isOwnProfile={creator.id === currentUser?.id}
              onBookConsultation={handleBookConsultation}
            />
          </div>
        </>
      )}
      
      <BottomNav />
    </div>
  );
};

export default CreatorProfilePage;
