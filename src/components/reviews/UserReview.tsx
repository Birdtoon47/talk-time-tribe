
import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, ThumbsUp, MessageSquareQuote } from 'lucide-react';
import { formatRelativeTime } from '@/utils/formatTime';

interface UserReviewProps {
  review: {
    id: string;
    userId: string;
    userName: string;
    userProfilePic: string;
    creatorId: string;
    rating: number; // 1-5
    content: string;
    helpfulCount: number;
    isHelpful?: boolean;
    timestamp: number;
    beforeAfter?: {
      before: string;
      after: string;
      description: string;
    };
    isSuccess?: boolean;
  };
}

const UserReview = ({ review }: UserReviewProps) => {
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  
  const handleMarkHelpful = () => {
    if (!isHelpful) {
      setHelpfulCount(prev => prev + 1);
      setIsHelpful(true);
    } else {
      setHelpfulCount(prev => prev - 1);
      setIsHelpful(false);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start">
        <Avatar className="h-10 w-10 mr-3">
          <img src={review.userProfilePic} alt={review.userName} />
        </Avatar>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{review.userName}</p>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs text-gray-500 ml-2">
                  {formatRelativeTime(review.timestamp)}
                </span>
              </div>
            </div>
            
            {review.isSuccess && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                <MessageSquareQuote className="h-3 w-3 mr-1" />
                Success Story
              </div>
            )}
          </div>
          
          <p className="my-2">{review.content}</p>
          
          {review.beforeAfter && (
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs mb-2"
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              >
                {showBeforeAfter ? 'Hide' : 'Show'} Before/After Results
              </Button>
              
              {showBeforeAfter && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm mb-2">{review.beforeAfter.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium mb-1">Before</p>
                      <img 
                        src={review.beforeAfter.before} 
                        alt="Before" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">After</p>
                      <img 
                        src={review.beforeAfter.after} 
                        alt="After" 
                        className="w-full h-32 object-cover rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center mt-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center ${isHelpful ? 'text-app-purple' : ''}`}
              onClick={handleMarkHelpful}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${isHelpful ? 'fill-current' : ''}`} />
              <span>{helpfulCount} found helpful</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserReview;
