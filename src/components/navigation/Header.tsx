import { Button } from '@/components/ui/button';
import { Users, Calendar, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import InboxDropdown from '@/components/InboxDropdown';
import SettingsModal from '@/components/SettingsModal';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Separator } from '../ui/separator';
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
  return <div className="sticky top-0 z-50 w-full bg-white border-b">
      
      <Separator />
    </div>;
};
export default Header;