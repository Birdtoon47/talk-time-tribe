
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Edit, Star, DollarSign, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';

interface CreatorProfileProps {
  userData: any;
  isOwnProfile?: boolean;
  onBookConsultation?: (creatorData: any) => void;
}

const CreatorProfile = ({ 
  userData, 
  isOwnProfile = false,
  onBookConsultation
}: CreatorProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: userData.name,
    bio: userData.bio || 'No bio available yet.',
    ratePerMinute: userData.ratePerMinute || 5000,
    minuteIncrement: userData.minuteIncrement || 5
  });
  
  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    const updatedUserData = {
      ...userData,
      ...profileData
    };
    
    // Update in localStorage
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };
  
  const handleWithdraw = () => {
    if (userData.balance < 50000) {
      toast.error('You need at least IDR 50,000 to withdraw');
      return;
    }
    
    // In a real app, this would call an API to process the withdrawal
    toast.success('Withdrawal request submitted!');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">
          {isOwnProfile ? 'Your Profile' : userData.name}
        </h2>
        
        {isOwnProfile && !isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <img 
              src={userData.profilePic} 
              alt={userData.name} 
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
            />
            
            <div className="ml-6">
              {isEditing ? (
                <Input 
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="font-bold text-xl mb-2"
                />
              ) : (
                <h3 className="font-bold text-xl">{userData.name}</h3>
              )}
              
              <div className="flex items-center text-yellow-500 mt-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-sm">
                  {userData.ratings || '5.0'} ({userData.totalConsults || '0'} consultations)
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-2">About</h4>
            {isEditing ? (
              <Textarea 
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder="Tell others about yourself..."
                className="h-24"
              />
            ) : (
              <p className="text-gray-600">
                {profileData.bio || 'No bio available yet.'}
              </p>
            )}
          </div>
          
          {(userData.isCreator || !isOwnProfile) && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Consultation Pricing</h4>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-sm">Rate per minute</span>
                  </div>
                  
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={profileData.ratePerMinute}
                      onChange={(e) => setProfileData({...profileData, ratePerMinute: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-bold">
                      {formatCurrency(profileData.ratePerMinute)} <span className="text-xs font-normal">/minute</span>
                    </p>
                  )}
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Time increment</span>
                  </div>
                  
                  {isEditing ? (
                    <Input 
                      type="number"
                      value={profileData.minuteIncrement}
                      onChange={(e) => setProfileData({...profileData, minuteIncrement: parseInt(e.target.value)})}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-bold">
                      {profileData.minuteIncrement} <span className="text-xs font-normal">minutes</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {isOwnProfile && userData.isCreator && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Earnings</h4>
              
              <Card className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Current Balance</p>
                    <p className="font-bold text-xl">{formatCurrency(userData.balance || 0)}</p>
                  </div>
                  
                  <Button 
                    onClick={handleWithdraw}
                    disabled={userData.balance < 50000}
                    className="bg-app-green"
                  >
                    Withdraw
                  </Button>
                </div>
                
                {userData.balance < 50000 && (
                  <p className="text-xs text-gray-500 mt-2">
                    You need at least IDR 50,000 to withdraw
                  </p>
                )}
              </Card>
            </div>
          )}
          
          {isEditing ? (
            <div className="mt-6 flex space-x-2">
              <Button 
                onClick={handleSaveProfile}
                className="bg-app-purple"
              >
                Save Changes
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            !isOwnProfile && onBookConsultation && (
              <Button 
                className="w-full mt-6 bg-app-purple"
                onClick={() => onBookConsultation(userData)}
              >
                Book Consultation
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
