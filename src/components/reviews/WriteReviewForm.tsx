
import { useState, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, Upload, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { toast } from 'sonner';

interface WriteReviewFormProps {
  creatorId: string;
  creatorName: string;
  userData: any;
  onReviewSubmitted: () => void;
}

const WriteReviewForm = ({ creatorId, creatorName, userData, onReviewSubmitted }: WriteReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasBeforeAfter, setHasBeforeAfter] = useState(false);
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [description, setDescription] = useState('');
  
  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
  };
  
  const handleImageChange = (type: 'before' | 'after', e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          if (type === 'before') {
            setBeforeImage(event.target.result as string);
          } else {
            setAfterImage(event.target.result as string);
          }
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('Please write a review before submitting');
      return;
    }
    
    if (hasBeforeAfter && (!beforeImage || !afterImage || !description.trim())) {
      toast.error('Please complete the before/after section');
      return;
    }
    
    // Create the review object
    const newReview = {
      id: Date.now().toString(),
      userId: userData.id,
      userName: userData.name,
      userProfilePic: userData.profilePic,
      creatorId,
      rating,
      content,
      helpfulCount: 0,
      timestamp: Date.now(),
      isSuccess,
      ...(hasBeforeAfter && {
        beforeAfter: {
          before: beforeImage,
          after: afterImage,
          description
        }
      })
    };
    
    // Get existing reviews and add the new one
    const existingReviews = safeGetItem<any[]>('talktribe_reviews', []);
    safeSetItem('talktribe_reviews', [...existingReviews, newReview]);
    
    // Show success message
    toast.success('Review submitted successfully');
    
    // Reset form
    setContent('');
    setRating(5);
    setIsSuccess(false);
    setHasBeforeAfter(false);
    setBeforeImage('');
    setAfterImage('');
    setDescription('');
    
    // Call callback
    onReviewSubmitted();
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Write a Review for {creatorName}</h3>
      
      <div className="mb-4">
        <Label className="block mb-2">Rating</Label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button 
              key={star}
              type="button"
              onClick={() => handleStarClick(star)}
              className="focus:outline-none"
            >
              <Star 
                className={`h-6 w-6 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="review-content" className="block mb-2">Your Review</Label>
        <Textarea
          id="review-content"
          placeholder="Share your experience..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex items-center mb-4">
        <Checkbox
          id="success-story"
          checked={isSuccess}
          onCheckedChange={() => setIsSuccess(!isSuccess)}
        />
        <Label htmlFor="success-story" className="ml-2">
          Mark as a Success Story
        </Label>
      </div>
      
      <div className="flex items-center mb-4">
        <Checkbox
          id="before-after"
          checked={hasBeforeAfter}
          onCheckedChange={() => setHasBeforeAfter(!hasBeforeAfter)}
        />
        <Label htmlFor="before-after" className="ml-2">
          Include Before/After Results
        </Label>
      </div>
      
      {hasBeforeAfter && (
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <div className="mb-3">
            <Label htmlFor="transformation-description" className="block mb-2 text-sm">
              Describe Your Transformation
            </Label>
            <Textarea
              id="transformation-description"
              placeholder="What improved or changed for you?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block mb-2 text-sm">Before Image</Label>
              {!beforeImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <Label htmlFor="before-image" className="cursor-pointer text-app-purple flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Upload Image</span>
                  </Label>
                  <Input 
                    id="before-image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageChange('before', e)}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={beforeImage} 
                    alt="Before" 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setBeforeImage('')}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <Label className="block mb-2 text-sm">After Image</Label>
              {!afterImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <Label htmlFor="after-image" className="cursor-pointer text-app-purple flex flex-col items-center">
                    <Upload className="h-8 w-8 mb-2" />
                    <span>Upload Image</span>
                  </Label>
                  <Input 
                    id="after-image" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageChange('after', e)}
                  />
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={afterImage} 
                    alt="After" 
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setAfterImage('')}
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Button 
        onClick={handleSubmit}
        className="w-full"
        disabled={!content.trim()}
      >
        Submit Review
      </Button>
    </Card>
  );
};

export default WriteReviewForm;
