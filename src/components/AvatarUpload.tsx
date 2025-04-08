
import { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  currentImage: string;
  onImageChange: (imageDataUrl: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const AvatarUpload = ({ 
  currentImage, 
  onImageChange,
  size = 'md'
}: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageChange(e.target.result as string);
          setIsUploading(false);
          toast.success('Avatar updated');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="relative group">
      <Avatar className={`${sizeClasses[size]} border-4 border-white shadow-md group-hover:opacity-90 transition-opacity`}>
        <AvatarImage src={currentImage} alt="Profile" className="object-cover" />
        <AvatarFallback>
          {isUploading ? (
            <RefreshCw className="h-6 w-6 animate-spin" />
          ) : (
            <Camera className="h-6 w-6" />
          )}
        </AvatarFallback>
      </Avatar>
      
      <div 
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={triggerFileInput}
      >
        <Camera className="h-6 w-6 text-white" />
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;
