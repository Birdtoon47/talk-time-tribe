
import { Avatar } from '@/components/ui/avatar';

interface CommentProps {
  comment: {
    id: string;
    userId: string;
    userName: string;
    userProfilePic: string;
    content: string;
    timestamp: number;
  };
  formatTimestamp: (timestamp: number) => string;
}

const PostComment = ({ comment, formatTimestamp }: CommentProps) => {
  return (
    <div className="py-2">
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
  );
};

export default PostComment;
