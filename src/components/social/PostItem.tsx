
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle } from 'lucide-react';
import CommentSection from './CommentSection';

interface PostItemProps {
  post: any;
  userData: any;
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  formatTimestamp: (timestamp: number) => string;
}

const PostItem = ({ 
  post, 
  userData, 
  onToggleLike, 
  onAddComment, 
  formatTimestamp 
}: PostItemProps) => {
  const [expandedComments, setExpandedComments] = useState(false);
  
  const toggleComments = () => {
    setExpandedComments(!expandedComments);
  };

  return (
    <div className="overflow-hidden">
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
              onClick={() => onToggleLike(post.id)}
            >
              <Heart className={`h-4 w-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="flex items-center ml-2"
              onClick={toggleComments}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>{Array.isArray(post.comments) ? post.comments.length : 0}</span>
            </Button>
          </div>
        </div>
      </div>
      
      <CommentSection 
        postId={post.id}
        comments={post.comments}
        userData={userData}
        isExpanded={expandedComments}
        onAddComment={onAddComment}
        formatTimestamp={formatTimestamp}
      />
    </div>
  );
};

export default PostItem;
