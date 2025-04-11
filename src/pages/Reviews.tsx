
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import ReviewsList from '@/components/reviews/ReviewsList';
import WriteReviewForm from '@/components/reviews/WriteReviewForm';

interface ReviewsListProps {
  reviewsList: any[];
}

interface WriteReviewFormProps {
  consultationData: any;
  onSubmitReview: (review: any) => void;
  userData: any;
}

const Reviews = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [pendingReviews, setPendingReviews] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('received');
  
  useEffect(() => {
    // Get user data
    const storedUser = localStorage.getItem('talktribe_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Get reviews
    const allReviews = safeGetItem('talktribe_reviews', []);
    setReviews(allReviews);
    
    // Get pending reviews (consultations that need reviews)
    const pendingReviewsList = safeGetItem('talktribe_pending_reviews', []);
    setPendingReviews(pendingReviewsList);
  }, []);
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleSubmitReview = (review: any) => {
    // Add the new review to the list
    const updatedReviews = [...reviews, review];
    safeSetItem('talktribe_reviews', updatedReviews);
    setReviews(updatedReviews);
    
    // Remove from pending reviews
    const updatedPending = pendingReviews.filter(
      pending => pending.id !== review.consultationId
    );
    safeSetItem('talktribe_pending_reviews', updatedPending);
    setPendingReviews(updatedPending);
  };
  
  // Filter reviews based on the active tab
  const receivedReviews = user ? reviews.filter(
    (review) => review.receiverId === user.id
  ) : [];
  
  const givenReviews = user ? reviews.filter(
    (review) => review.reviewerId === user.id
  ) : [];
  
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Reviews</h1>
      </div>
      
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="given">Given</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="received">
            {receivedReviews.length > 0 ? (
              <ReviewsList reviewsList={receivedReviews} />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">You haven't received any reviews yet.</p>
                {user?.isCreator && (
                  <p className="text-sm text-gray-400 mt-2">
                    Complete consultations with clients to receive reviews.
                  </p>
                )}
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="given">
            {givenReviews.length > 0 ? (
              <ReviewsList reviewsList={givenReviews} />
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">You haven't given any reviews yet.</p>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pending">
            {pendingReviews.length > 0 ? (
              <div className="space-y-4">
                {pendingReviews.map((pending) => (
                  <WriteReviewForm
                    key={pending.id}
                    consultationData={pending}
                    onSubmitReview={handleSubmitReview}
                    userData={user}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No pending reviews to write.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Completed consultations will appear here for you to review.
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reviews;
