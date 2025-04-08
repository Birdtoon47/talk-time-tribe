
import { useState, useEffect } from 'react';
import { Home, Calendar, User, MessageSquare, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import SocialFeed from './SocialFeed';
import BookingScreen from './BookingScreen';
import CreatorProfile from './CreatorProfile';
import { Button } from '@/components/ui/button';

interface MainTabsProps {
  userData: any;
  onLogout: () => void;
}

const MainTabs = ({ userData, onLogout }: MainTabsProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [creators, setCreators] = useState<any[]>([]);
  
  useEffect(() => {
    // Load mock creators data
    const mockCreators = [
      {
        id: '1',
        name: 'Sarah Johnson',
        profilePic: 'https://i.pravatar.cc/150?img=1',
        bio: 'Tech influencer & software developer. Book consultations for career advice!',
        ratePerMinute: 5000,
        minuteIncrement: 5,
        ratings: 4.8,
        totalConsults: 124
      },
      {
        id: '2',
        name: 'Mike Williams',
        profilePic: 'https://i.pravatar.cc/150?img=3',
        bio: 'Financial advisor & investment specialist. Get your money questions answered!',
        ratePerMinute: 7500,
        minuteIncrement: 10,
        ratings: 4.9,
        totalConsults: 78
      },
      {
        id: '3',
        name: 'Jessica Lee',
        profilePic: 'https://i.pravatar.cc/150?img=5',
        bio: 'Fitness coach & nutrition expert. Book a session to discuss your health goals!',
        ratePerMinute: 4000,
        minuteIncrement: 15,
        ratings: 4.7,
        totalConsults: 215
      }
    ];
    
    if (userData.isCreator) {
      // Add the current user as a creator
      mockCreators.push({
        id: userData.id,
        name: userData.name,
        profilePic: userData.profilePic,
        bio: 'Your personal bio goes here. Edit your profile to update it!',
        ratePerMinute: 5000,
        minuteIncrement: 5,
        ratings: 5.0,
        totalConsults: 0
      });
    }
    
    setCreators(mockCreators);
  }, [userData]);
  
  const handleLogout = () => {
    localStorage.removeItem('talktribe_user');
    toast.success('Logged out successfully');
    onLogout();
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <h1 className="text-xl font-bold text-app-purple">TalkTimeTribe</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'feed' && <SocialFeed userData={userData} />}
        {activeTab === 'bookings' && <BookingScreen userData={userData} creators={creators} />}
        {activeTab === 'profile' && <CreatorProfile userData={userData} isOwnProfile={true} />}
        {activeTab === 'messages' && (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            <p className="text-gray-500">Your consultation messages will appear here.</p>
            
            <div className="mt-6 bg-white rounded-lg shadow p-4 text-center">
              <p className="text-gray-600">No active consultations</p>
              <Button 
                className="mt-4 bg-app-blue" 
                onClick={() => setActiveTab('bookings')}
              >
                Book a Consultation
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-4 bg-white border-t text-center">
        <button
          className={`p-3 flex flex-col items-center justify-center ${activeTab === 'feed' ? 'text-app-purple' : 'text-gray-500'}`}
          onClick={() => setActiveTab('feed')}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Feed</span>
        </button>
        
        <button
          className={`p-3 flex flex-col items-center justify-center ${activeTab === 'bookings' ? 'text-app-purple' : 'text-gray-500'}`}
          onClick={() => setActiveTab('bookings')}
        >
          <Calendar className="h-6 w-6" />
          <span className="text-xs mt-1">Bookings</span>
        </button>
        
        <button
          className={`p-3 flex flex-col items-center justify-center ${activeTab === 'messages' ? 'text-app-purple' : 'text-gray-500'}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="text-xs mt-1">Consults</span>
        </button>
        
        <button
          className={`p-3 flex flex-col items-center justify-center ${activeTab === 'profile' ? 'text-app-purple' : 'text-gray-500'}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default MainTabs;
