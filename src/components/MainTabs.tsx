
import { useState } from 'react';
import { toast } from 'sonner';
import SocialFeed from './SocialFeed';
import BookingScreen from './BookingScreen';
import CreatorProfile from './CreatorProfile';
import Header from './navigation/Header';
import TabBar from './navigation/TabBar';
import MessagesTab from './tabs/MessagesTab';
import ConsultationForm from './consultation/ConsultationForm';
import useCreatorData from '@/hooks/useCreatorData';

interface MainTabsProps {
  userData: any;
  onLogout: () => void;
  onUpdateUserData: (updatedData: any) => void;
}

const MainTabs = ({ userData, onLogout, onUpdateUserData }: MainTabsProps) => {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [currentUserData, setCurrentUserData] = useState(userData);
  const [isCreateConsultationOpen, setIsCreateConsultationOpen] = useState(false);
  const [newConsultation, setNewConsultation] = useState({
    title: '',
    description: '',
    minuteIncrement: 5,
    ratePerMinute: 5000
  });
  
  const { creators, updateCreatorsList } = useCreatorData(currentUserData);
  
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
    updateCreatorsList(updatedData);
    
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
      
      // Save with safe utility
      updateCreatorsList(updatedUserData);
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
      updateCreatorsList(updatedUserData);
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
      <Header 
        userData={currentUserData}
        creators={creators}
        onSelectCreator={handleSelectCreator}
        onLogout={onLogout}
        onUpdateUserData={handleUpdateUserData}
      />
      
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
          <MessagesTab onBookConsultation={() => setActiveTab('bookings')} />
        )}
      </div>
      
      <TabBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCreateConsultation={() => setIsCreateConsultationOpen(true)}
      />
      
      <ConsultationForm 
        isOpen={isCreateConsultationOpen}
        onOpenChange={setIsCreateConsultationOpen}
        onCreateConsultation={handleCreateConsultation}
        newConsultation={newConsultation}
        setNewConsultation={setNewConsultation}
        formatCurrency={formatCurrency}
      />
    </div>
  );
};

export default MainTabs;
