
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Video, Phone, MessageSquare } from 'lucide-react';

interface ConsultationTypeSelectorProps {
  consultationType: 'video' | 'audio' | 'chat';
  setConsultationType: (type: 'video' | 'audio' | 'chat') => void;
  onContinue: () => void;
}

const ConsultationTypeSelector = ({ 
  consultationType, 
  setConsultationType, 
  onContinue 
}: ConsultationTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-medium mb-3">Consultation Type</h3>
        
        <div className="space-y-3">
          <button
            className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'video' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
            onClick={() => setConsultationType('video')}
          >
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'video' ? 'border-app-purple' : 'border-gray-300'}`}>
              {consultationType === 'video' && (
                <div className="h-3 w-3 rounded-full bg-app-purple" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Video Call</h4>
                <Video className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Face-to-face video consultation</p>
            </div>
          </button>
          
          <button
            className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'audio' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
            onClick={() => setConsultationType('audio')}
          >
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'audio' ? 'border-app-purple' : 'border-gray-300'}`}>
              {consultationType === 'audio' && (
                <div className="h-3 w-3 rounded-full bg-app-purple" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Audio Call</h4>
                <Phone className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Voice-only consultation</p>
            </div>
          </button>
          
          <button
            className={`flex items-center w-full border rounded-lg p-3 ${consultationType === 'chat' ? 'border-app-purple bg-app-purple/5' : 'border-gray-200'}`}
            onClick={() => setConsultationType('chat')}
          >
            <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-3 ${consultationType === 'chat' ? 'border-app-purple' : 'border-gray-300'}`}>
              {consultationType === 'chat' && (
                <div className="h-3 w-3 rounded-full bg-app-purple" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Text Chat</h4>
                <MessageSquare className="h-5 w-5 text-gray-500" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Text-based consultation</p>
            </div>
          </button>
        </div>
      </Card>
      
      <Button 
        className="w-full bg-app-purple"
        onClick={onContinue}
      >
        Continue
      </Button>
    </div>
  );
};

export default ConsultationTypeSelector;
