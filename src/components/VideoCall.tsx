
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

interface VideoCallProps {
  creator: any;
  duration: number;
  onEndCall: () => void;
}

const VideoCall = ({ creator, duration, onEndCall }: VideoCallProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onEndCall();
          }, 1000);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onEndCall]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col h-full bg-black relative">
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
        <div className="bg-black/70 px-4 py-2 rounded-full text-white font-medium">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      {/* Main Video (Creator) */}
      <div className="flex-1 relative">
        {isVideoOff ? (
          <div className="h-full flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="h-24 w-24 rounded-full bg-app-purple/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-white">{creator.name.charAt(0)}</span>
              </div>
              <p className="text-white">{creator.name}</p>
            </div>
          </div>
        ) : (
          // This would be a real video stream in a full implementation
          <img 
            src={creator.profilePic} 
            alt={creator.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      
      {/* Self Video (Small overlay) */}
      <div className="absolute bottom-24 right-4 h-36 w-28 rounded-lg overflow-hidden border-2 border-white shadow-lg">
        {/* This would be the user's own camera feed */}
        <div className="h-full bg-gray-800 flex items-center justify-center">
          <span className="text-white">You</span>
        </div>
      </div>
      
      {/* Control bar */}
      <div className="bg-black p-4 flex items-center justify-around">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full h-12 w-12 ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-14 w-14 bg-red-500 text-white"
          onClick={onEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`rounded-full h-12 w-12 ${isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'}`}
          onClick={() => setIsVideoOff(!isVideoOff)}
        >
          {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
