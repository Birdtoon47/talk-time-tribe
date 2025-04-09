
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GiftFormProps {
  giftRecipientEmail: string;
  setGiftRecipientEmail: (email: string) => void;
  giftMessage: string;
  setGiftMessage: (message: string) => void;
}

const GiftForm: React.FC<GiftFormProps> = ({
  giftRecipientEmail,
  setGiftRecipientEmail,
  giftMessage,
  setGiftMessage
}) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-medium mb-4">Gift Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="recipientEmail">Recipient Email</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="friend@example.com"
            value={giftRecipientEmail}
            onChange={(e) => setGiftRecipientEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="giftMessage">Gift Message (Optional)</Label>
          <Input
            id="giftMessage"
            placeholder="Here's a consultation with an expert I thought you'd enjoy!"
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
          />
        </div>
      </div>
    </Card>
  );
};

export default GiftForm;
