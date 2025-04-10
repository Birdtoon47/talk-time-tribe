
import { useState, useEffect } from 'react';
import ReviewsList from '@/components/reviews/ReviewsList';
import WriteReviewForm from '@/components/reviews/WriteReviewForm';
import { safeGetItem } from '@/utils/storage';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, MessageSquare } from 'lucide-react';

const Reviews = () => {
  const [userData, setUserData] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [showWriteReview, setShowWriteReview] = useState(false);
  
  useEffect(() => {
    // Load user data
    const user = safeGetItem('talktribe_user', null);
    setUserData(user);
    
    // Load creators
    const creatorsList = safeGetItem('talktribe_creators', []);
    setCreators(creatorsList);
  }, []);
  
  const handleReviewSubmitted = () => {
    setShowWriteReview(false);
  };
  
  if (!userData) {
    return <div className="p-4">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reviews & Testimonials</h1>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <ReviewsList userData={userData} />
        </TabsContent>
        
        <TabsContent value="my-reviews" className="mt-4">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Reviews You've Written</h2>
            <Button 
              onClick={() => setShowWriteReview(true)}
              className="flex items-center"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Write a Review
            </Button>
          </div>
          
          {showWriteReview && (
            <Card className="mb-6">
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Select a Creator to Review</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowWriteReview(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {creators.map(creator => (
                    <Card 
                      key={creator.id}
                      className={`p-3 cursor-pointer hover:border-app-purple transition-colors ${
                        selectedCreator?.id === creator.id ? 'border-app-purple bg-app-purple/5' : ''
                      }`}
                      onClick={() => setSelectedCreator(creator)}
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <img src={creator.profilePic} alt={creator.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium">{creator.name}</p>
                          <p className="text-xs text-gray-500">{creator.expertise}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                {selectedCreator && (
                  <div className="mt-4">
                    <WriteReviewForm 
                      creatorId={selectedCreator.id}
                      creatorName={selectedCreator.name}
                      userData={userData}
                      onReviewSubmitted={handleReviewSubmitted}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}
          
          <ReviewsList 
            userData={userData} 
            creatorId={userData.id} // Show only reviews by this user
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
