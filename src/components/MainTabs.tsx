import { useState, useEffect } from 'react';
import { Home, Calendar, User, MessageSquare, PlusCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SocialFeed from './SocialFeed';
import BookingScreen from './BookingScreen';
import CreatorProfile from './CreatorProfile';
import SearchBar from './SearchBar';
import SettingsModal from './SettingsModal';
import NotificationsDropdown from './NotificationsDropdown';
import InboxDropdown from './InboxDropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { safeSetItem, safeGetItem } from '@/utils/storage';
import { formatCurrency } from '@/utils/formatters';

interface MainTabsProps {
  userData: any;
  onLogout: () => void;
  onUpdateUserData: (updatedData: any) => void;
}

const MainTabs = ({ userData, onLogout, onUpdateUserData }: MainTabsProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [creators, setCreators] = useState<any[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState(userData);
  const [isCreateConsultationOpen, setIsCreateConsultationOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    title: '',
    description: '',
    minuteIncrement: 5,
    ratePerMinute: 5000
  });
  
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
    
    // Use our safe storage utility to get creators
    const storedCreators = safeGetItem('talktribe_creators', []);
    let allCreators = storedCreators.length > 0 ? storedCreators : mockCreators;
    
    if (userData.isCreator) {
      // Check if the current user already exists in the creators list
      const existingCreatorIndex = allCreators.findIndex((c: any) => c.id === userData.id);
      
      if (existingCreatorIndex !== -1) {
        // Update the existing creator entry
        allCreators[existingCreatorIndex] = {
          id: userData.id,
          name: userData.name,
          profilePic: userData.profilePic,
          bio: userData.bio || 'Your personal bio goes here. Edit your profile to update it!',
          ratePerMinute: userData.ratePerMinute || 5000,
          minuteIncrement: userData.minuteIncrement || 5,
          ratings: userData.ratings || 5.0,
          totalConsults: userData.totalConsults || 0
        };
      } else {
        // Add the current user as a creator
        allCreators.push({
          id: userData.id,
          name: userData.name,
          profilePic: userData.profilePic,
          bio: userData.bio || 'Your personal bio goes here. Edit your profile to update it!',
          ratePerMinute: userData.ratePerMinute || 5000,
          minuteIncrement: userData.minuteIncrement || 5,
          ratings: 5.0,
          totalConsults: 0
        });
      }
      
      // Save the updated creators list using our safe storage utility
      safeSetItem('talktribe_creators', allCreators);
    }
    
    setCreators(allCreators);
  }, [userData]);
  
  const handleSelectCreator = (creator: any) => {
    // If the selected creator is the current user, go to profile tab
    if (creator.id === currentUserData.id) {
      setActiveTab('profile');
      return;
    }
    
    setSelectedCreator(creator);
    setActiveTab('bookings');
  };
  
  const handleUpdateUserData = (updatedData: any) => {
    setCurrentUserData(updatedData);
    
    // Also update in creators list if user is a creator
    if (updatedData.isCreator) {
      setCreators(prev => {
        const updatedCreators = [...prev];
        const index = updatedCreators.findIndex(c => c.id === updatedData.id);
        
        if (index !== -1) {
          updatedCreators[index] = {
            ...updatedCreators[index],
            name: updatedData.name,
            profilePic: updatedData.profilePic,
            bio: updatedData.bio,
            ratePerMinute: updatedData.ratePerMinute,
            minuteIncrement: updatedData.minuteIncrement
          };
        }
        
        // Save with safe utility
        safeSetItem('talktribe_creators', updatedCreators);
        return updatedCreators;
      });
    }
    
    // Pass the updated data back to the parent component
    onUpdateUserData(updatedData);
  };
  
  const handleCreateConsultation = () => {
    if (!currentUserData.isCreator) {
      // Update user data to make them a creator
      const updatedUserData = {
        ...currentUserData,
        isCreator: true,
        ratePerMinute: newConsultation.ratePerMinute,
        minuteIncrement: newConsultation.minuteIncrement,
        bio: newConsultation.description
      };
      
      setCurrentUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      
      // Add the user to the creators list
      const updatedCreators = [...creators];
      const index = updatedCreators.findIndex(c => c.id === currentUserData.id);
      
      if (index !== -1) {
        updatedCreators[index] = {
          ...updatedCreators[index],
          bio: newConsultation.description,
          ratePerMinute: newConsultation.ratePerMinute,
          minuteIncrement: newConsultation.minuteIncrement
        };
      } else {
        updatedCreators.push({
          id: currentUserData.id,
          name: currentUserData.name,
          profilePic: currentUserData.profilePic,
          bio: newConsultation.description,
          ratePerMinute: newConsultation.ratePerMinute,
          minuteIncrement: newConsultation.minuteIncrement,
          ratings: 5.0,
          totalConsults: 0
        });
      }
      
      setCreators(updatedCreators);
      // Save with safe utility
      safeSetItem('talktribe_creators', updatedCreators);
    } else {
      // Just update the existing creator profile
      const updatedUserData = {
        ...currentUserData,
        ratePerMinute: newConsultation.ratePerMinute,
        minuteIncrement: newConsultation.minuteIncrement,
        bio: newConsultation.description || currentUserData.bio
      };
      
      setCurrentUserData(updatedUserData);
      onUpdateUserData(updatedUserData);
      
      // Update the creator in the creators list
      const updatedCreators = [...creators];
      const index = updatedCreators.findIndex(c => c.id === currentUserData.id);
      
      if (index !== -1) {
        updatedCreators[index] = {
          ...updatedCreators[index],
          bio: newConsultation.description || updatedCreators[index].bio,
          ratePerMinute: newConsultation.ratePerMinute,
          minuteIncrement: newConsultation.minuteIncrement
        };
      }
      
      setCreators(updatedCreators);
      // Save with safe utility
      safeSetItem('talktribe_creators', updatedCreators);
    }
    
    // Close the dialog and show success message
    setIsCreateConsultationOpen(false);
    toast.success('Consultation service created successfully!');
    // Reset the form
    setNewConsultation({
      title: '',
      description: '',
      minuteIncrement: 5,
      ratePerMinute: 5000
    });
    
    // Navigate to profile tab to see the changes
    setActiveTab('profile');
  };
  
  const formatCurrency = (amount: number) => {
    const currencyCode = currentUserData.currencyCode || 'IDR';
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: currencyCode,
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex justify-between items-center px-4 py-3 bg-white border-b">
        <h1 className="text-xl font-bold text-app-purple">TalkTimeTribe</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/creators')} 
            className="flex items-center gap-1"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Creators</span>
          </Button>
          
          <SearchBar 
            creators={creators} 
            onSelectCreator={handleSelectCreator} 
          />
          
          <NotificationsDropdown />
          
          <InboxDropdown userData={userData} />
          
          <SettingsModal 
            userData={currentUserData} 
            onLogout={onLogout}
            onUpdateUserData={handleUpdateUserData}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'feed' && <SocialFeed userData={currentUserData} />}
        {activeTab === 'bookings' && (
          <BookingScreen 
            userData={currentUserData} 
            creators={creators} 
            selectedCreator={selectedCreator}
          />
        )}
        {activeTab === 'profile' && (
          <CreatorProfile 
            userData={currentUserData} 
            isOwnProfile={true} 
            onUpdateUserData={handleUpdateUserData}
          />
        )}
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
      
      <div className="grid grid-cols-5 bg-white border-t text-center">
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
          className="p-3 flex flex-col items-center justify-center text-app-purple"
          onClick={() => setIsCreateConsultationOpen(true)}
        >
          <div className="bg-app-purple text-white rounded-full p-2">
            <PlusCircle className="h-5 w-5" />
          </div>
          <span className="text-xs mt-1">Create</span>
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
      
      <Dialog open={isCreateConsultationOpen} onOpenChange={setIsCreateConsultationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Consultation Service</DialogTitle>
            <DialogDescription>
              Set up your consultation offering to start earning.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., Career Coaching, Financial Advice"
                value={newConsultation.title}
                onChange={(e) => setNewConsultation({...newConsultation, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe what you offer in your consultations..."
                value={newConsultation.description}
                onChange={(e) => setNewConsultation({...newConsultation, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">Rate (per minute)</Label>
                <Input 
                  id="rate" 
                  type="number"
                  value={newConsultation.ratePerMinute}
                  onChange={(e) => setNewConsultation({...newConsultation, ratePerMinute: Number(e.target.value)})}
                />
                <p className="text-xs text-gray-500">
                  {formatCurrency(newConsultation.ratePerMinute)} per minute
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="increment">Time Increment (minutes)</Label>
                <Input 
                  id="increment" 
                  type="number"
                  value={newConsultation.minuteIncrement}
                  onChange={(e) => setNewConsultation({...newConsultation, minuteIncrement: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              className="bg-app-purple" 
              onClick={handleCreateConsultation}
            >
              Create Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainTabs;
