
import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Creator {
  id: string;
  name: string;
  profilePic: string;
  bio: string;
  ratePerMinute: number;
  minuteIncrement: number;
  ratings: number;
  totalConsults: number;
}

interface CreatorListProps {
  creators: Creator[];
  userId: string;
  formatCurrency: (amount: number) => string;
  onSelectCreator: (creator: Creator) => void;
}

const CreatorList = ({ creators, userId, formatCurrency, onSelectCreator }: CreatorListProps) => {
  if (creators.length === 0) {
    return <p className="text-gray-500">No creators available at the moment</p>;
  }
  
  return (
    <div className="space-y-4">
      {creators.map(creator => (
        <Card 
          key={creator.id} 
          className="p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            if (creator.id !== userId) {
              onSelectCreator(creator);
            } else {
              toast.error("You cannot book a consultation with yourself");
            }
          }}
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={creator.profilePic} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{creator.name}</h3>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              
              <p className="text-sm text-gray-500 line-clamp-1">{creator.bio}</p>
              
              <div className="mt-1 text-xs text-gray-500">
                <span className="font-medium text-app-purple">
                  {formatCurrency(creator.ratePerMinute)} / {creator.minuteIncrement} min
                </span>
                <span className="mx-2">•</span>
                <span>⭐ {creator.ratings} ({creator.totalConsults} consults)</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CreatorList;
