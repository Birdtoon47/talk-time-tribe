
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

const queryClient = new QueryClient();

const App = () => {
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/creators" element={<Creators />} />
            <Route path="/creator-profile" element={<CreatorProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
