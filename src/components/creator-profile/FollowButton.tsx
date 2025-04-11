
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { safeGetItem, safeSetItem } from '@/utils/storage';

interface FollowButtonProps {
  currentUserId: string;
  creatorId: string;
  onFollow?: (isFollowing: boolean) => void;
}

const FollowButton = ({ currentUserId, creatorId, onFollow }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if the user is already following this creator
    const following = safeGetItem(`talktribe_following_${currentUserId}`, []);
    setIsFollowing(following.includes(creatorId));
  }, [currentUserId, creatorId]);
  
  const handleFollow = () => {
    if (!currentUserId) {
      toast.error('Please log in to follow creators');
      return;
    }
    
    // Don't allow following yourself
    if (currentUserId === creatorId) {
      toast.error('You cannot follow yourself');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const following = safeGetItem(`talktribe_following_${currentUserId}`, []);
      
      if (isFollowing) {
        // Unfollow
        const updatedFollowing = following.filter((id: string) => id !== creatorId);
        safeSetItem(`talktribe_following_${currentUserId}`, updatedFollowing);
        setIsFollowing(false);
        toast.success('Unfollowed successfully');
      } else {
        // Follow
        const updatedFollowing = [...following, creatorId];
        safeSetItem(`talktribe_following_${currentUserId}`, updatedFollowing);
        setIsFollowing(true);
        toast.success('Following successfully');
      }
      
      // Update followers count for creator
      const followers = safeGetItem(`talktribe_followers_${creatorId}`, []);
      if (isFollowing) {
        // Remove follower
        const updatedFollowers = followers.filter((id: string) => id !== currentUserId);
        safeSetItem(`talktribe_followers_${creatorId}`, updatedFollowers);
      } else {
        // Add follower
        const updatedFollowers = [...followers, currentUserId];
        safeSetItem(`talktribe_followers_${creatorId}`, updatedFollowers);
      }
      
      if (onFollow) {
        onFollow(!isFollowing);
      }
      
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      className={isFollowing ? "border-app-purple text-app-purple" : "bg-app-purple"}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  );
};

export default FollowButton;
