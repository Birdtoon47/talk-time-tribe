
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Image as ImageIcon, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import { safeGetItem, safeSetItem } from '@/utils/storage';

interface CreatePostFormProps {
  userData: any;
  onPostCreated: (newPost: any) => void;
}

const CreatePostForm = ({ userData, onPostCreated }: CreatePostFormProps) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [postMedia, setPostMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    
    const newPost = {
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
    
    // Pass the new post to parent component
    onPostCreated(newPost);
    
    // Reset form
    setNewPostContent('');
    setPostMedia(null);
    setMediaType(null);
  };

  return (
    <div className="flex items-center mb-3">
      <Avatar className="h-10 w-10 mr-3">
        <img src={userData.profilePic} alt={userData.name} />
      </Avatar>
      
      <div className="flex-1">
        <Textarea 
          placeholder={`What's on your mind, ${userData.name.split(' ')[0]}?`}
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
      </div>
    </div>
  );
};

export default CreatePostForm;
