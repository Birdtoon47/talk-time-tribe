
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Share, Image as ImageIcon, Trash2, X, Video } from 'lucide-react';
import { toast } from 'sonner';
import { safeGetItem, safeSetItem, clearOldPosts } from '@/utils/storage';

interface UserPostsProps {
  userData: any;
}

const UserPosts = ({ userData }: UserPostsProps) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // First, clear old posts to ensure we have storage space
    clearOldPosts(30);
    
    // Load posts from localStorage using safe utility
    const allPosts = safeGetItem('talktribe_posts', []);
    // Filter to show only the user's posts
    const userPosts = allPosts.filter((post: any) => post.userId === userData.id);
    
    // Sort posts by timestamp (newest first)
    userPosts.sort((a: any, b: any) => {
      const timeA = typeof a.timestamp === 'number' ? a.timestamp : new Date(a.timestamp).getTime();
      const timeB = typeof b.timestamp === 'number' ? b.timestamp : new Date(b.timestamp).getTime();
      return timeB - timeA;
    });
    
    // Ensure each post has a comments array to prevent "length of undefined" errors
    const sanitizedPosts = userPosts.map((post: any) => {
      return {
        ...post,
        comments: Array.isArray(post.comments) ? post.comments : []
      };
    });
    
    setPosts(sanitizedPosts);
  }, [userData.id]);
  
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Stricter file size limit - 2MB maximum to avoid localStorage issues
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File is too large. Please select a file under 2MB.');
        return;
      }
      
      // Determine file type
      const isVideo = file.type.startsWith('video/');
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPostMedia(e.target.result as string);
          setMediaType(isVideo ? 'video' : 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmitPost = () => {
    if (newPostText.trim() === '' && !postMedia) {
      toast.error('Please add text or media to your post');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new post object with numeric timestamp
    const newPost = {
      id: Date.now().toString(),
      userId: userData.id,
      userName: userData.name,
      userProfilePic: userData.profilePic,
      text: newPostText,
      content: newPostText, // Add content field for consistency with SocialFeed
      media: postMedia,
      mediaType: mediaType,
      timestamp: Date.now(), // Use numeric timestamp
      likes: 0,
      isLiked: false,
      comments: []
    };
    
    // Get existing posts using safe utility
    const allPosts = safeGetItem('talktribe_posts', []);
    
    // Add new post at the beginning
    const updatedPosts = [newPost, ...allPosts];
    
    // Limit number of posts to save to avoid storage issues
    const postsToSave = updatedPosts.slice(0, 30);
    
    // Save to localStorage using safe utility
    const success1 = safeSetItem('talktribe_posts', postsToSave);
    
    // Also save to social feed
    const socialFeedPosts = safeGetItem('talktribe_social_feed', []);
    const updatedSocialFeedPosts = [newPost, ...socialFeedPosts];
    const socialFeedPostsToSave = updatedSocialFeedPosts.slice(0, 30);
    const success2 = safeSetItem('talktribe_social_feed', socialFeedPostsToSave);
    
    if (!success1 || !success2) {
      toast.warning('Your post was saved but media might be compressed due to storage limitations');
    }
    
    // Update state
    setPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setNewPostText('');
    setPostMedia(null);
    setMediaType(null);
    setIsSubmitting(false);
    
    toast.success('Post created successfully');
  };
  
  const handleDeletePost = (postId: string) => {
    // Get all posts using safe utility
    const allPosts = safeGetItem('talktribe_posts', []);
    
    // Filter out the post to delete
    const updatedPosts = allPosts.filter((post: any) => post.id !== postId);
    
    // Save to localStorage using safe utility
    safeSetItem('talktribe_posts', updatedPosts);
    
    // Update state
    setPosts(prev => prev.filter(post => post.id !== postId));
    
    toast.success('Post deleted');
  };
  
  const formatDate = (dateString: string | number) => {
    if (!dateString) return 'Just now';
    
    let date: Date;
    if (typeof dateString === 'number') {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Just now';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={userData.profilePic} alt={userData.name} />
            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="resize-none mb-3"
            />
            
            {postMedia && (
              <div className="relative mb-3">
                {mediaType === 'image' ? (
                  <img 
                    src={postMedia} 
                    alt="Post preview" 
                    className="w-full rounded-lg object-cover max-h-56"
                  />
                ) : (
                  <video 
                    src={postMedia} 
                    controls 
                    className="w-full rounded-lg max-h-56"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full h-6 w-6 opacity-80"
                  onClick={() => {
                    setPostMedia(null);
                    setMediaType(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('accept', 'image/*');
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <ImageIcon className="h-4 w-4 mr-1" />
                  <span>Image</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.setAttribute('accept', 'video/*');
                      fileInputRef.current.click();
                    }
                  }}
                >
                  <Video className="h-4 w-4 mr-1" />
                  <span>Video</span>
                </Button>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaUpload}
                  className="hidden"
                />
              </div>
              
              <Button
                onClick={handleSubmitPost}
                disabled={isSubmitting || (newPostText.trim() === '' && !postMedia)}
                className="bg-app-purple"
                size="sm"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't posted anything yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <Card key={post.id} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.userProfilePic} alt={post.userName} />
                    <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{post.userName}</h3>
                    <p className="text-xs text-gray-500">{formatDate(post.timestamp)}</p>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500"
                  onClick={() => handleDeletePost(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {post.text && (
                <p className="my-3">{post.text}</p>
              )}
              
              {post.media && (
                <div className="mt-3 mb-4">
                  {(post.mediaType === 'image' || !post.mediaType) ? (
                    <img 
                      src={post.media} 
                      alt="Post" 
                      className="w-full rounded-lg object-cover max-h-96"
                    />
                  ) : (
                    <video 
                      src={post.media} 
                      controls 
                      className="w-full rounded-lg max-h-96"
                    />
                  )}
                </div>
              )}
              
              <div className="flex justify-between items-center mt-4 text-gray-500 text-sm">
                <button className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes || 0}</span>
                </button>
                
                <button className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
                </button>
                
                <button className="flex items-center gap-1">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
