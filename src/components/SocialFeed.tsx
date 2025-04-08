
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send, Image } from 'lucide-react';
import { toast } from 'sonner';

interface SocialFeedProps {
  userData: any;
}

interface Post {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  content: string;
  image?: string;
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
  
  useEffect(() => {
    // Load mock posts
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
        image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop',
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
    
    setPosts(mockPosts);
  }, []);
  
  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      toast.error('Please enter some content for your post');
      return;
    }
    
    const newPost: Post = {
      id: Date.now().toString(),
      userId: userData.id,
      userName: userData.name,
      userProfilePic: userData.profilePic,
      content: newPostContent,
      likes: 0,
      isLiked: false,
      comments: [],
      timestamp: Date.now()
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Post created successfully!');
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
        
        <div className="flex justify-between">
          <Button variant="outline" className="text-gray-600">
            <Image className="h-4 w-4 mr-2" />
            Add Image
          </Button>
          
          <Button 
            onClick={handleCreatePost}
            className="bg-app-purple"
            disabled={!newPostContent.trim()}
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
              
              {post.image && (
                <img 
                  src={post.image} 
                  alt="Post content" 
                  className="w-full h-64 object-cover rounded-md mb-3"
                />
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
