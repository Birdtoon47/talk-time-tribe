
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  showShare?: boolean;
  onShare?: () => void;
  rightContent?: React.ReactNode;
}

const PageHeader = ({ 
  title, 
  showBackButton = true, 
  showShare = false,
  onShare,
  rightContent
}: PageHeaderProps) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-0 z-10 bg-white w-full">
      <div className="flex items-center justify-between p-4 w-full">
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {showShare && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
            >
              <Share2 className="h-5 w-5" />
            </Button>
          )}
          {rightContent}
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
