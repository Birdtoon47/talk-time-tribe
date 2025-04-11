
import { Home, Calendar, User, MessageSquare, PlusCircle } from 'lucide-react';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCreateConsultation: () => void;
}

const TabBar = ({ activeTab, setActiveTab, openCreateConsultation }: TabBarProps) => {
  return (
    <div className="grid grid-cols-5 bg-white border-t text-center">
      <button
        className={`p-3 flex flex-col items-center justify-center ${activeTab === 'feed' ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => setActiveTab('feed')}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Feed</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${activeTab === 'bookings' ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => setActiveTab('bookings')}
      >
        <Calendar className="h-6 w-6" />
        <span className="text-xs mt-1">Bookings</span>
      </button>
      
      <button
        className="p-3 flex flex-col items-center justify-center text-app-purple"
        onClick={openCreateConsultation}
      >
        <div className="bg-app-purple text-white rounded-full p-2">
          <PlusCircle className="h-5 w-5" />
        </div>
        <span className="text-xs mt-1">Create</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${activeTab === 'messages' ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => setActiveTab('messages')}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs mt-1">Consults</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${activeTab === 'profile' ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => setActiveTab('profile')}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
};

export default TabBar;
