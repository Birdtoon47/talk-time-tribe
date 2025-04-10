
import { Avatar } from '@/components/ui/avatar';
import { useState } from 'react';
import { formatRelativeTime } from '@/utils/formatTime';
import { FileText, Headphones } from 'lucide-react';

interface CommentProps {
  comment: {
    id: string;
    userId: string;
    userName: string;
    userProfilePic: string;
    content: string;
    timestamp: number;
    richText?: boolean;
    audioNote?: string;
    files?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  };
  formatTimestamp: (timestamp: number) => string;
}

const PostComment = ({ comment, formatTimestamp }: CommentProps) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  const toggleAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    if (audioPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log('Audio playback error:', e));
    }
    setAudioPlaying(!audioPlaying);
  };

  return (
    <div className="py-2">
      <div className="flex">
        <Avatar className="h-8 w-8 mr-2">
          <img src={comment.userProfilePic} alt={comment.userName} />
        </Avatar>
        <div className="bg-white p-2 rounded-lg flex-1">
          <p className="text-xs font-medium">{comment.userName}</p>
          
          {comment.richText ? (
            <div className="text-sm" dangerouslySetInnerHTML={{ __html: comment.content }} />
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
          
          {comment.audioNote && (
            <div className="mt-1 flex items-center text-xs text-gray-700">
              <button 
                onClick={() => toggleAudio(comment.audioNote as string)}
                className="flex items-center text-app-purple"
              >
                <Headphones className="h-3 w-3 mr-1" />
                <span>{audioPlaying ? 'Pause voice note' : 'Play voice note'}</span>
              </button>
            </div>
          )}
          
          {comment.files && comment.files.length > 0 && (
            <div className="mt-1">
              {comment.files.map((file, index) => (
                <a 
                  key={index}
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-blue-600 hover:underline"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  {file.name}
                </a>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">{formatTimestamp(comment.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
