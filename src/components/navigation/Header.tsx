
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import InboxDropdown from '@/components/InboxDropdown';
import SettingsModal from '@/components/SettingsModal';

interface HeaderProps {
  userData: any;
  creators: any[];
  onSelectCreator: (creator: any) => void;
  onLogout: () => void;
  onUpdateUserData: (updatedData: any) => void;
}

const Header = ({ 
  userData, 
  creators, 
  onSelectCreator, 
  onLogout, 
  onUpdateUserData 
}: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-3 bg-white border-b">
      <h1 className="text-xl font-bold text-app-purple">TalkTimeTribe</h1>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/creators')} 
          className="flex items-center gap-1"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Creators</span>
        </Button>
        
        <SearchBar 
          creators={creators} 
          onSelectCreator={onSelectCreator} 
        />
        
        <NotificationsDropdown />
        
        <InboxDropdown userData={userData} />
        
        <SettingsModal 
          userData={userData} 
          onLogout={onLogout}
          onUpdateUserData={onUpdateUserData}
        />
      </div>
    </div>
  );
};

export default Header;
