
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CheckoutHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border-b container max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-app-purple">TalkTimeTribe</h1>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default CheckoutHeader;
