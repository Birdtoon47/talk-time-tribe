
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import PostComment from './PostComment';

interface CommentSectionProps {
  postId: string;
  comments: any[];
  userData: any;
  isExpanded: boolean;
  onAddComment: (postId: string, commentText: string) => void;
  formatTimestamp: (timestamp: number) => string;
}

const CommentSection = ({ 
  postId, 
  comments, 
  userData, 
  isExpanded, 
  onAddComment, 
  formatTimestamp 
}: CommentSectionProps) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(postId, commentText);
      setCommentText('');
    }
  };

  // Only show comments if there are any and the section is expanded or has few comments
  const shouldShowComments = 
    Array.isArray(comments) && 
    comments.length > 0 && 
    (isExpanded || comments.length < 3);

  return (
    <>
      {shouldShowComments && (
        <div className="px-4 py-2 bg-gray-50">
          {comments.map(comment => (
            <PostComment 
              key={comment.id} 
              comment={comment} 
              formatTimestamp={formatTimestamp} 
            />
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
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmitComment();
              }
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 text-app-purple"
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default CommentSection;
