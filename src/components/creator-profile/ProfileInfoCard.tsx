
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Star, DollarSign, Clock } from 'lucide-react';
import AvatarUpload from '../AvatarUpload';

interface ProfileInfoCardProps {
  userData: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  profileData: any;
  setProfileData: (data: any) => void;
  handleAvatarChange: (imageDataUrl: string) => void;
  handleSaveProfile: () => void;
  onBookConsultation?: (creatorData: any) => void;
  formatCurrency: (amount: number) => string;
}

const ProfileInfoCard = ({ 
  userData, 
  isOwnProfile, 
  isEditing, 
  profileData,
  setProfileData,
  handleAvatarChange,
  handleSaveProfile,
  onBookConsultation,
  formatCurrency
}: ProfileInfoCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center">
          {isEditing || isOwnProfile ? (
            <AvatarUpload 
              currentImage={profileData.profilePic} 
              onImageChange={handleAvatarChange}
              size="lg"
            />
          ) : (
            <img 
              src={userData.profilePic} 
              alt={userData.name} 
              className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-md"
            />
          )}
          
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
              onClick={() => setProfileData({
                name: userData.name,
                bio: userData.bio || 'No bio available yet.',
                ratePerMinute: userData.ratePerMinute || 5000,
                minuteIncrement: userData.minuteIncrement || 5,
                profilePic: userData.profilePic
              })}
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
  );
};

export default ProfileInfoCard;
