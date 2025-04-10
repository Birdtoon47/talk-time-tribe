
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send, Image as ImageIcon, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import { safeGetItem, safeSetItem, clearOldPosts } from '@/utils/storage';

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
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});
  const [expandedComments, setExpandedComments] = useState<{[key: string]: boolean}>({});
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
    
    setPosts(combinedPosts);
  }, []);
  
  // Save posts to localStorage whenever they change, but not on every render
  useEffect(() => {
    if (posts.length > 0) {
      // Limit the number of posts before saving to avoid exceeding storage limits
      const postsToSave = posts.slice(0, 50);
      safeSetItem('talktribe_social_feed', postsToSave);
    }
  }, [posts]);
  
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // More strict size limit to prevent storage issues - 2MB max
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size exceeds 2MB limit");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPostMedia(event.target.result as string);
          setMediaType(type);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCreatePost = () => {
    if (!newPostContent.trim() && !postMedia) {
      toast.error('Please enter some content or add media for your post');
      return;
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: userData.id,
      userName: userData.name,
      userProfilePic: userData.profilePic,
      content: newPostContent,
      media: postMedia || undefined,
      mediaType: mediaType || undefined,
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: Date.now(),
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setPostMedia(null);
    setMediaType(null);
    
    // Save to both social feed and user posts
    const socialFeedPosts = safeGetItem('talktribe_social_feed', []);
    const updatedSocialFeedPosts = [newPost, ...socialFeedPosts];
    
    // Limit number of saved posts
    const socialFeedPostsToSave = updatedSocialFeedPosts.slice(0, 30);
    const success1 = safeSetItem('talktribe_social_feed', socialFeedPostsToSave);
    
    // Also save to talktribe_posts for user's profile
    const userPosts = safeGetItem('talktribe_posts', []);
    const updatedUserPosts = [newPost, ...userPosts];
    const userPostsToSave = updatedUserPosts.slice(0, 30);
    const success2 = safeSetItem('talktribe_posts', userPostsToSave);
    
    if (!success1 || !success2) {
      toast.warning('Your post was saved but media might be compressed due to storage limitations');
    } else {
      toast.success('Post created successfully!');
    }
  };
  
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
  
  const handleAddComment = (postId: string) => {
    const commentContent = commentInputs[postId];
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
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      })
    );
    
    // Clear the input
    setCommentInputs({...commentInputs, [postId]: ''});
  };
  
  const toggleComments = (postId: string) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };
  
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp) return 'Just now';
    
    const now = Date.now();
    const diffInSeconds = Math.floor((now - timestamp) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };
  
  return (
    <div className="p-4 space-y-6">
      <Card className="p-4">
        <div className="flex items-center mb-3">
          <Avatar className="h-10 w-10 mr-3">
            <img src={userData.profilePic} alt={userData.name} />
          </Avatar>
          <p className="text-gray-600">What's on your mind, {userData.name.split(' ')[0]}?</p>
        </div>
        
        <Textarea 
          placeholder="Share an update..." 
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="mb-3"
        />
        
        {postMedia && (
          <div className="relative mb-3 border rounded-md overflow-hidden">
            {mediaType === 'image' ? (
              <img 
                src={postMedia} 
                alt="Post preview" 
                className="w-full max-h-56 object-contain" 
              />
            ) : (
              <video 
                src={postMedia} 
                controls 
                className="w-full max-h-56" 
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
        
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                }
              }}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-600"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "video/*";
                  fileInputRef.current.click();
                }
              }}
            >
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden"
              onChange={(e) => {
                if (e.target.accept.includes('image')) {
                  handleMediaUpload(e, 'image');
                } else {
                  handleMediaUpload(e, 'video');
                }
              }}
            />
          </div>
          
          <Button 
            onClick={handleCreatePost}
            className="bg-app-purple"
            disabled={!newPostContent.trim() && !postMedia}
          >
            Post
          </Button>
        </div>
      </Card>
      
      <div className="space-y-4">
        {posts.map(post => (
          <Card key={post.id} className="overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Avatar className="h-10 w-10 mr-3">
                  <img src={post.userProfilePic} alt={post.userName} />
                </Avatar>
                <div>
                  <p className="font-medium">{post.userName}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(post.timestamp)}</p>
                </div>
              </div>
              
              <p className="mb-3">{post.content}</p>
              
              {post.media && (
                <div className="mb-3">
                  {(!post.mediaType || post.mediaType === 'image') ? (
                    <img 
                      src={post.media} 
                      alt="Post content" 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  ) : (
                    <video 
                      src={post.media} 
                      controls 
                      className="w-full h-64 object-cover rounded-md"
                    />
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-gray-500 text-sm pt-2">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`flex items-center ${post.isLiked ? 'text-app-purple' : ''}`}
                    onClick={() => handleToggleLike(post.id)}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center ml-2"
                    onClick={() => toggleComments(post.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span>{post.comments.length}</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {(expandedComments[post.id] || post.comments.length < 3) && post.comments.length > 0 && (
              <div className="px-4 py-2 bg-gray-50">
                {post.comments.map(comment => (
                  <div key={comment.id} className="py-2">
                    <div className="flex">
                      <Avatar className="h-8 w-8 mr-2">
                        <img src={comment.userProfilePic} alt={comment.userName} />
                      </Avatar>
                      <div className="bg-white p-2 rounded-lg flex-1">
                        <p className="text-xs font-medium">{comment.userName}</p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimestamp(comment.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="p-3 bg-gray-50 border-t flex">
              <Avatar className="h-8 w-8 mr-2">
                <img src={userData.profilePic} alt={userData.name} />
              </Avatar>
              <div className="flex-1 flex items-center">
                <Input
                  placeholder="Write a comment..."
                  className="flex-1 bg-white"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({...commentInputs, [post.id]: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment(post.id);
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 text-app-purple"
                  onClick={() => handleAddComment(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;
