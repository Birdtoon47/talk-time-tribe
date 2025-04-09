
import React from 'react';
import { Home, Calendar, ShoppingCart, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutBottomNav = () => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-5 bg-white border-t text-center">
      <button
        className="p-3 flex flex-col items-center justify-center text-gray-500"
        onClick={() => navigate('/')}
      >
        <Home className="h-6 w-6" />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        className="p-3 flex flex-col items-center justify-center text-gray-500"
        onClick={() => navigate('/')}
      >
        <Calendar className="h-6 w-6" />
        <span className="text-xs mt-1">Bookings</span>
      </button>
      
      <button
        className="p-3 flex flex-col items-center justify-center text-app-purple"
        onClick={() => navigate('/')}
      >
        <ShoppingCart className="h-6 w-6" />
        <span className="text-xs mt-1">Checkout</span>
      </button>
      
      <button
        className="p-3 flex flex-col items-center justify-center text-gray-500"
        onClick={() => navigate('/')}
      >
        <MessageSquare className="h-6 w-6" />
        <span className="text-xs mt-1">Consults</span>
      </button>
      
      <button
        className="p-3 flex flex-col items-center justify-center text-gray-500"
        onClick={() => navigate('/')}
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">Profile</span>
      </button>
    </div>
  );
};

export default CheckoutBottomNav;
