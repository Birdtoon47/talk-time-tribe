
import { Home, Users, MessageSquare, Calendar, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t grid grid-cols-5 z-50">
      <button
        className={`p-3 flex flex-col items-center justify-center ${isActive('/') ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => navigate('/')}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${isActive('/creators') ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => navigate('/creators')}
      >
        <Users className="h-6 w-6" />
        <span className="text-xs mt-1">Creators</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${isActive('/reviews') ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => navigate('/reviews')}
      >
        <Calendar className="h-6 w-6" />
        <span className="text-xs mt-1">Reviews</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${isActive('/bookings') || isActive('/creator-profile') ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => navigate('/bookings')}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs mt-1">Bookings</span>
      </button>
      
      <button
        className={`p-3 flex flex-col items-center justify-center ${isActive('/profile') ? 'text-app-purple' : 'text-gray-500'}`}
        onClick={() => navigate('/profile')}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
