import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserReview from './UserReview';
import { Button } from '@/components/ui/button';
import { Star, MessageSquareQuote, SlidersHorizontal } from 'lucide-react';
import { safeGetItem, safeSetItem } from '@/utils/storage';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userProfilePic: string;
  creatorId: string;
  rating: number;
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
}

interface ReviewsListProps {
  creatorId?: string; // If provided, only shows reviews for a specific creator
  userData?: any;
  reviewsList?: Review[]; // Added reviewsList to the interface
}

const ReviewsList = ({ creatorId, userData, reviewsList }: ReviewsListProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Load reviews from localStorage (or could be fetched from an API) if not provided
  const allReviews = reviewsList || safeGetItem<Review[]>('talktribe_reviews', []);
  
  // Filter reviews based on tab and creatorId if provided
  const filteredReviews = allReviews.filter(review => {
    // Filter by creator if specified
    if (creatorId && review.creatorId !== creatorId) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'success' && !review.isSuccess) {
      return false;
    }
    
    // Filter by rating if one is selected
    if (filterRating && review.rating !== filterRating) {
      return false;
    }
    
    return true;
  });
  
  // Sort reviews: success stories first, then by helpfulness, then by date
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    // Success stories first
    if (a.isSuccess && !b.isSuccess) return -1;
    if (!a.isSuccess && b.isSuccess) return 1;
    
    // Then by helpfulness
    if (a.helpfulCount !== b.helpfulCount) {
      return b.helpfulCount - a.helpfulCount;
    }
    
    // Then by date (newest first)
    return b.timestamp - a.timestamp;
  });
  
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Reviews & Testimonials</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center text-xs"
        >
          <SlidersHorizontal className="h-3 w-3 mr-1" />
          Filters
        </Button>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
          </TabsList>
        </div>
        
        {showFilters && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium mb-2">Filter by Rating</p>
            <div className="flex space-x-2">
              {[null, 5, 4, 3, 2, 1].map((rating) => (
                <Button
                  key={rating === null ? 'all' : rating}
                  variant={filterRating === rating ? "default" : "outline"}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterRating(rating)}
                >
                  {rating === null ? 'All' : (
                    <div className="flex items-center">
                      {rating}
                      <Star className="h-3 w-3 ml-1" />
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <TabsContent value="all" className="mt-0">
          {sortedReviews.length > 0 ? (
            <div>
              {sortedReviews.map(review => (
                <UserReview key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquareQuote className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No reviews yet</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="success" className="mt-0">
          {sortedReviews.length > 0 ? (
            <div>
              {sortedReviews.map(review => (
                <UserReview key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquareQuote className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No success stories yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ReviewsList;
