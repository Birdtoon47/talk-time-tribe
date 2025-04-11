
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Users } from 'lucide-react';
import { ProfileData } from '@/types/creator';
import FollowButton from './FollowButton';

interface ProfileInfoCardProps {
  userData: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  handleAvatarChange: (image: string) => void;
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
  handleSaveProfile,
  onBookConsultation,
  formatCurrency
}: ProfileInfoCardProps) => {
  const [followersCount, setFollowersCount] = useState(0);

  const handleFollowChange = (isFollowing: boolean) => {
    setFollowersCount(prev => isFollowing ? prev + 1 : prev - 1);
  };

  return (
    <Card className="p-6">
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              className="mt-1"
              rows={3}
            />
          </div>
          
          {userData.isCreator && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rate">Rate (per minute)</Label>
                  <Input
                    id="rate"
                    type="number"
                    value={profileData.ratePerMinute}
                    onChange={(e) => setProfileData({...profileData, ratePerMinute: Number(e.target.value)})}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(profileData.ratePerMinute)} per minute
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="increment">Increment (minutes)</Label>
                  <Input
                    id="increment"
                    type="number"
                    value={profileData.minuteIncrement}
                    onChange={(e) => setProfileData({...profileData, minuteIncrement: Number(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="pt-2">
            <Button 
              onClick={handleSaveProfile}
              className="w-full bg-app-purple"
            >
              Save Profile
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{userData.name}</h3>
                {userData.isCreator && (
                  <div className="flex items-center mt-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm ml-1">{userData.ratings || '5.0'}</span>
                    <span className="text-xs text-gray-500 ml-1">
                      ({userData.totalConsults || 0} consultations)
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 whitespace-pre-wrap">{userData.bio}</p>
              
              {userData.isCreator && (
                <div className="flex flex-wrap gap-4 items-center mt-2">
                  <div>
                    <p className="text-sm text-gray-500">Rate</p>
                    <p className="font-medium">
                      {formatCurrency(userData.ratePerMinute)} / minute
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Min. Duration</p>
                    <p className="font-medium">{userData.minuteIncrement} minutes</p>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">
                      {followersCount} followers
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {!isOwnProfile && userData.isCreator && (
              <div className="flex flex-col space-y-2">
                {onBookConsultation && (
                  <Button 
                    onClick={() => onBookConsultation(userData)}
                    className="bg-app-green"
                  >
                    Book Consultation
                  </Button>
                )}
                
                <FollowButton 
                  currentUserId={userData.currentUserId || ''} 
                  creatorId={userData.id}
                  onFollow={handleFollowChange}
                />
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default ProfileInfoCard;
