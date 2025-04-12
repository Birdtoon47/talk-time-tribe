
import { Button } from '@/components/ui/button';
import { Users, Calendar, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import NotificationsDropdown from '@/components/NotificationsDropdown';
import InboxDropdown from '@/components/InboxDropdown';
import SettingsModal from '@/components/SettingsModal';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
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

  return (
    <div className="flex flex-col bg-white border-b w-full">
      <div className="flex justify-between items-center px-4 py-3 max-w-screen-2xl mx-auto w-full">
        <h1 
          className="text-xl font-bold text-app-purple cursor-pointer" 
          onClick={() => navigate('/')}
        >
          TalkTimeTribe
        </h1>
        
        <div className="flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 px-3">Explore</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[220px]">
                    <li>
                      <NavigationMenuLink
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md w-full"
                        )}
                        onClick={() => navigate('/creators')}
                      >
                        <Users className="h-4 w-4" />
                        <span>Creators</span>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md w-full"
                        )}
                        onClick={() => navigate('/reviews')}
                      >
                        <Calendar className="h-4 w-4" />
                        <span>Reviews</span>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md w-full"
                        )}
                        onClick={() => {
                          // Navigate to profile if it's the user themself
                          if (userData.isCreator) {
                            sessionStorage.setItem('selected_creator', JSON.stringify(userData));
                            navigate('/creator-profile');
                          }
                        }}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink
                        className={cn(
                          "flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md w-full"
                        )}
                        onClick={() => navigate('/admin')}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
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
    </div>
  );
};

export default Header;
