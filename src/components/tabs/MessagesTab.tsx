
import { Button } from '@/components/ui/button';

interface MessagesTabProps {
  onBookConsultation: () => void;
}

const MessagesTab = ({ onBookConsultation }: MessagesTabProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      <p className="text-gray-500">Your consultation messages will appear here.</p>
      
      <div className="mt-6 bg-white rounded-lg shadow p-4 text-center">
        <p className="text-gray-600">No active consultations</p>
        <Button 
          className="mt-4 bg-app-blue" 
          onClick={onBookConsultation}
        >
          Book a Consultation
        </Button>
      </div>
    </div>
  );
};

export default MessagesTab;
