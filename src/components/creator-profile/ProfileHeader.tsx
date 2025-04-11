
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import AvatarUpload from '../AvatarUpload';

interface ProfileHeaderProps {
  userData: any;
  isOwnProfile: boolean;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  profileData: any;
  handleAvatarChange: (imageDataUrl: string) => void;
}

const ProfileHeader = ({ 
  userData, 
  isOwnProfile, 
  isEditing, 
  setIsEditing, 
  profileData,
  handleAvatarChange
}: ProfileHeaderProps) => {
  return (
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
  );
};

export default ProfileHeader;
