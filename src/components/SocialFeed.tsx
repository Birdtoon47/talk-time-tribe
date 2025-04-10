
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { safeGetItem, safeSetItem, clearOldPosts } from '@/utils/storage';
import { formatRelativeTime } from '@/utils/formatTime';
import CreatePostForm from './social/CreatePostForm';
import PostItem from './social/PostItem';

interface SocialFeedProps {
  userData: any;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  content: string;
  media?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  content: string;
  timestamp: number;
}

const SocialFeed = ({ userData }: SocialFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    // First, clear old posts to ensure we have space
    clearOldPosts(30);
    
    // Load posts from localStorage
    const storedPosts = safeGetItem('talktribe_social_feed', []);
    let combinedPosts = [];
    
    if (storedPosts && storedPosts.length > 0) {
      combinedPosts = [...storedPosts];
    } else {
      // Initialize with mock posts only if nothing in localStorage
      const mockPosts: Post[] = [
        {
          id: '1',
          userId: '101',
          userName: 'Sarah Johnson',
          userProfilePic: 'https://i.pravatar.cc/150?img=1',
          content: 'Just finished my latest tech tutorial! Excited to share insights on AI development with beginners. Book a consultation if you want personalized career guidance!',
          likes: 24,
          isLiked: false,
          comments: [
            {
              id: 'c1',
              userId: '102',
              userName: 'Mike Williams',
              userProfilePic: 'https://i.pravatar.cc/150?img=3',
              content: 'Great content as always, Sarah! Looking forward to the consultation.',
              timestamp: Date.now() - 3600000
            }
          ],
          timestamp: Date.now() - 86400000
        },
        {
          id: '2',
          userId: '102',
          userName: 'Mike Williams',
          userProfilePic: 'https://i.pravatar.cc/150?img=3',
          content: 'New financial advice video dropping tomorrow! Get ready to learn about smart investment strategies for beginners.',
          media: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop',
          mediaType: 'image',
          likes: 42,
          isLiked: true,
          comments: [],
          timestamp: Date.now() - 43200000
        },
        {
          id: '3',
          userId: '103',
          userName: 'Jessica Lee',
          userProfilePic: 'https://i.pravatar.cc/150?img=5',
          content: 'Just wrapped up an amazing workout session with a client! Remember, consistency is key to achieving your fitness goals. Book a consultation to discuss your personalized fitness plan!',
          likes: 18,
          isLiked: false,
          comments: [
            {
              id: 'c2',
              userId: '101',
              userName: 'Sarah Johnson',
              userProfilePic: 'https://i.pravatar.cc/150?img=1',
              content: 'Your energy is contagious, Jessica! 💪',
              timestamp: Date.now() - 1800000
            },
            {
              id: 'c3',
              userId: '102',
              userName: 'Mike Williams',
              userProfilePic: 'https://i.pravatar.cc/150?img=3',
              content: 'Great work! Looking to book a session soon.',
              timestamp: Date.now() - 900000
            }
          ],
          timestamp: Date.now() - 21600000
        }
      ];
      
      // Save mock posts to localStorage
      safeSetItem('talktribe_social_feed', mockPosts);
      combinedPosts = [...mockPosts];
    }
    
    // Load user posts to show in feed
    const userPosts = safeGetItem('talktribe_posts', []);
    if (userPosts && userPosts.length > 0) {
      // Filter out posts that already exist in the feed (by id)
      const newUserPosts = userPosts.filter((userPost: any) => 
        !combinedPosts.some((feedPost: any) => feedPost.id === userPost.id)
      );
      
      // Combine with existing feed posts
      if (newUserPosts.length > 0) {
        combinedPosts = [...newUserPosts, ...combinedPosts];
      }
    }
    
    // Sort by timestamp (newest first)
    combinedPosts.sort((a: any, b: any) => {
      const timeA = typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime();
      const timeB = typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
    
    // Ensure each post has a comments array to prevent "length of undefined" errors
    const sanitizedPosts = combinedPosts.map((post: any) => {
      return {
        ...post,
        comments: Array.isArray(post.comments) ? post.comments : []
      };
    });
    
    setPosts(sanitizedPosts);
  }, []);
  
  // Save posts to localStorage whenever they change, but not on every render
  useEffect(() => {
    if (posts.length > 0) {
      // Limit the number of posts before saving to avoid exceeding storage limits
      const postsToSave = posts.slice(0, 50);
      safeSetItem('talktribe_social_feed', postsToSave);
    }
  }, [posts]);
  
  const handleToggleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          };
        }
        return post;
      })
    );
  };
  
  const handleAddComment = (postId: string, commentContent: string) => {
    if (!commentContent?.trim()) {
      return;
    }
    
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: userData.id,
      userName: userData.name,
      userProfilePic: userData.profilePic,
      content: commentContent,
      timestamp: Date.now()
    };
    
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          // Ensure post.comments is an array before spreading it
          const comments = Array.isArray(post.comments) ? post.comments : [];
          return {
            ...post,
            comments: [...comments, newComment]
          };
        }
        return post;
      })
    );
  };
  
  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <div className="p-4 space-y-6">
      <Card className="p-4">
        <CreatePostForm 
          userData={userData}
          onPostCreated={handlePostCreated}
        />
      </Card>
      
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id}>
            <PostItem 
              post={post}
              userData={userData}
              onToggleLike={handleToggleLike}
              onAddComment={handleAddComment}
              formatTimestamp={formatRelativeTime}
            />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
