
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ConsultationFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateConsultation: () => void;
  newConsultation: {
    title: string;
    description: string;
    minuteIncrement: number;
    ratePerMinute: number;
  };
  setNewConsultation: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    minuteIncrement: number;
    ratePerMinute: number;
  }>>;
  formatCurrency: (amount: number) => string;
}

const ConsultationForm = ({
  isOpen,
  onOpenChange,
  onCreateConsultation,
  newConsultation,
  setNewConsultation,
  formatCurrency
}: ConsultationFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Consultation Service</DialogTitle>
          <DialogDescription>
            Set up your consultation offering to start earning.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title" 
              placeholder="e.g., Career Coaching, Financial Advice"
              value={newConsultation.title}
              onChange={(e) => setNewConsultation({...newConsultation, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe what you offer in your consultations..."
              value={newConsultation.description}
              onChange={(e) => setNewConsultation({...newConsultation, description: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rate">Rate (per minute)</Label>
              <Input 
                id="rate" 
                type="number"
                value={newConsultation.ratePerMinute}
                onChange={(e) => setNewConsultation({...newConsultation, ratePerMinute: Number(e.target.value)})}
              />
              <p className="text-xs text-gray-500">
                {formatCurrency(newConsultation.ratePerMinute)} per minute
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="increment">Time Increment (minutes)</Label>
              <Input 
                id="increment" 
                type="number"
                value={newConsultation.minuteIncrement}
                onChange={(e) => setNewConsultation({...newConsultation, minuteIncrement: Number(e.target.value)})}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            className="bg-app-purple" 
            onClick={onCreateConsultation}
          >
            Create Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationForm;
