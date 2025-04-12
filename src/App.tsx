
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";
import Reviews from "./pages/Reviews";
import Creators from "./pages/Creators";
import CreatorProfile from "./pages/CreatorProfile";
import AdminDashboard from "./pages/AdminDashboard";
import Header from "./components/navigation/Header";

const queryClient = new QueryClient();

const App = () => {
  // Load user data
  const [userData, setUserData] = useState<any>(null);
  const [creators, setCreators] = useState<any[]>([]);
  
  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('talktribe_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    
    // Load creators
    const storedUsers = localStorage.getItem('talktribe_users');
    if (storedUsers) {
      const users = JSON.parse(storedUsers);
      setCreators(users.filter((user: any) => user.isCreator));
    }
  }, []);

  // Listen for the custom 'notification-added' event
  useEffect(() => {
    const handleNotificationAdded = () => {
      // Play a sound or show a visual indicator
      // This is a simple implementation - in a real app you might use a sound library
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Audio play prevented by browser', e));
      } catch (error) {
        console.log('Audio not supported', error);
      }
    };
    
    window.addEventListener('notification-added', handleNotificationAdded);
    
    return () => {
      window.removeEventListener('notification-added', handleNotificationAdded);
    };
  }, []);

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('talktribe_user');
    setUserData(null);
  };

  const handleUpdateUserData = (updatedData: any) => {
    setUserData(updatedData);
    localStorage.setItem('talktribe_user', JSON.stringify(updatedData));
  };

  const handleSelectCreator = (creator: any) => {
    sessionStorage.setItem('selected_creator', JSON.stringify(creator));
  };

  // Only show the header on specific pages
  const showHeaderRoutes = ['/creators', '/reviews', '/creator-profile', '/bookings'];
  const shouldShowHeader = () => {
    return showHeaderRoutes.some(route => window.location.pathname === route);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {shouldShowHeader() && userData && (
            <Header 
              userData={userData} 
              creators={creators} 
              onSelectCreator={handleSelectCreator}
              onLogout={handleLogout}
              onUpdateUserData={handleUpdateUserData}
            />
          )}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/creator-profile" element={<CreatorProfile />} />
            <Route path="/bookings" element={<Index />} /> {/* Redirect to Index since we're integrating it */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
