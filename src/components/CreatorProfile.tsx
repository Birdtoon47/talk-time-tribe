import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { v4 as uuidv4 } from 'uuid';
import UserPosts from './UserPosts';
import ProfileHeader from './creator-profile/ProfileHeader';
import ProfileInfoCard from './creator-profile/ProfileInfoCard';
import BalanceCard from './creator-profile/BalanceCard';
import ServicesTab from './creator-profile/ServicesTab';
import { formatCurrency } from '@/utils/currency';
import { loadCreatorServices, saveCreatorService, deleteCreatorService } from '@/utils/services';
import { Creator, ProfileData, Service } from '@/types/creator';

interface CreatorProfileProps {
  userData: Creator;
  isOwnProfile?: boolean;
  onBookConsultation?: (creatorData: any) => void;
  onUpdateUserData?: (updatedData: any) => void;
}

const CreatorProfile = ({ 
  userData, 
  isOwnProfile = false,
  onBookConsultation,
  onUpdateUserData
}: CreatorProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState<ProfileData>({
    name: userData.name,
    bio: userData.bio || 'No bio available yet.',
    ratePerMinute: userData.ratePerMinute || 5000,
    minuteIncrement: userData.minuteIncrement || 5,
    profilePic: userData.profilePic
  });
  const [services, setServices] = useState<Service[]>([]);
  const [isAddBalanceOpen, setIsAddBalanceOpen] = useState(false);
  const [amountToAdd, setAmountToAdd] = useState(100000);
  
  useEffect(() => {
    // Load creator services
    const storedServices = loadCreatorServices(userData.id);
    setServices(storedServices);
  }, [userData.id]);
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    const updatedUserData = {
      ...userData,
      ...profileData
    };
    
    // Update in localStorage
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    
    if (onUpdateUserData) {
      onUpdateUserData(updatedUserData);
    }
    
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };
  
  const handleAvatarChange = (imageDataUrl: string) => {
    setProfileData({
      ...profileData,
      profilePic: imageDataUrl
    });
    
    // If not in edit mode, save immediately
    if (!isEditing) {
      const updatedUserData = {
        ...userData,
        profilePic: imageDataUrl
      };
      
      localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
      
      if (onUpdateUserData) {
        onUpdateUserData(updatedUserData);
      }
    }
  };
  
  const handleWithdraw = () => {
    if (userData.balance < 50000) {
      toast.error('You need at least IDR 50,000 to withdraw');
      return;
    }
    
    // Calculate platform fee (10%)
    const platformFee = Math.round(userData.balance * 0.1);
    const withdrawAmount = userData.balance - platformFee;
    
    // In a real app, this would call an API to process the withdrawal
    const updatedUserData = {
      ...userData,
      balance: 0,
      totalWithdrawn: (userData.totalWithdrawn || 0) + withdrawAmount
    };
    
    // Create a new withdrawal record
    const withdrawal = {
      id: uuidv4(),
      userId: userData.id,
      amount: withdrawAmount,
      fee: platformFee,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedCompletionDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
    };
    
    // Save the withdrawal record
    const withdrawals = safeGetItem(`talktribe_withdrawals_${userData.id}`, []);
    safeSetItem(`talktribe_withdrawals_${userData.id}`, [withdrawal, ...withdrawals]);
    
    // Update the user data
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    
    if (onUpdateUserData) {
      onUpdateUserData(updatedUserData);
    }
    
    // Simulate changing status after some time (for testing)
    setTimeout(() => {
      const withdrawals = safeGetItem(`talktribe_withdrawals_${userData.id}`, []);
      const updatedWithdrawals = withdrawals.map((w: any) => {
        if (w.id === withdrawal.id) {
          return { ...w, status: 'processing', updatedAt: new Date().toISOString() };
        }
        return w;
      });
      safeSetItem(`talktribe_withdrawals_${userData.id}`, updatedWithdrawals);
    }, 10000); // After 10 seconds
    
    setTimeout(() => {
      const withdrawals = safeGetItem(`talktribe_withdrawals_${userData.id}`, []);
      const updatedWithdrawals = withdrawals.map((w: any) => {
        if (w.id === withdrawal.id) {
          return { ...w, status: 'completed', updatedAt: new Date().toISOString() };
        }
        return w;
      });
      safeSetItem(`talktribe_withdrawals_${userData.id}`, updatedWithdrawals);
    }, 20000); // After 20 seconds
    
    toast.success(`Withdrawal of ${formatCurrency(withdrawAmount, userData.currencyCode)} initiated! (${formatCurrency(platformFee, userData.currencyCode)} platform fee applied)`);
  };
  
  const handleAddBalance = () => {
    // For testing purposes - adds balance to the user account
    const updatedUserData = {
      ...userData,
      balance: (userData.balance || 0) + amountToAdd
    };
    
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    
    if (onUpdateUserData) {
      onUpdateUserData(updatedUserData);
    }
    
    setIsAddBalanceOpen(false);
    toast.success(`Added ${formatCurrency(amountToAdd, userData.currencyCode)} to your balance`);
  };
  
  const handleCreateService = (service: Service) => {
    const updatedServices = saveCreatorService(service);
    setServices(updatedServices);
  };
  
  const handleDeleteService = (serviceId: string) => {
    const updatedServices = deleteCreatorService(userData.id, serviceId);
    setServices(updatedServices);
  };
  
  const formatCurrencyWithUserPreference = (amount: number) => {
    return formatCurrency(amount, userData.currencyCode);
  };
  
  return (
    <div className="p-4">
      <ProfileHeader 
        userData={userData}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        profileData={profileData}
        handleAvatarChange={handleAvatarChange}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileInfoCard 
            userData={userData}
            isOwnProfile={isOwnProfile}
            isEditing={isEditing}
            profileData={profileData}
            setProfileData={setProfileData}
            handleAvatarChange={handleAvatarChange}
            handleSaveProfile={handleSaveProfile}
            onBookConsultation={onBookConsultation}
            formatCurrency={formatCurrencyWithUserPreference}
          />
          
          {isOwnProfile && userData.isCreator && (
            <BalanceCard 
              userData={userData}
              isOwnProfile={isOwnProfile}
              handleWithdraw={handleWithdraw}
              formatCurrency={formatCurrencyWithUserPreference}
              setIsAddBalanceOpen={setIsAddBalanceOpen}
              isAddBalanceOpen={isAddBalanceOpen}
              amountToAdd={amountToAdd}
              setAmountToAdd={setAmountToAdd}
              handleAddBalance={handleAddBalance}
            />
          )}
        </TabsContent>
        
        <TabsContent value="services">
          <ServicesTab 
            userData={userData}
            isOwnProfile={isOwnProfile}
            services={services}
            handleDeleteService={handleDeleteService}
            onBookConsultation={onBookConsultation}
            formatCurrency={formatCurrencyWithUserPreference}
          />
        </TabsContent>
        
        <TabsContent value="posts">
          <UserPosts userData={userData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreatorProfile;
