
import { useState, useEffect } from "react";
import AuthScreen from "@/components/AuthScreen";
import MainTabs from "@/components/MainTabs";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("talktribe_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticated = (userData: any) => {
    // Save user data to localStorage for persistence
    localStorage.setItem("talktribe_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("talktribe_user");
    setUser(null);
  };
  
  const handleUpdateUserData = (updatedData: any) => {
    // Save updated user data to localStorage
    localStorage.setItem("talktribe_user", JSON.stringify(updatedData));
    setUser(updatedData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow">
          <h1 className="text-3xl font-bold text-app-purple">TalkTimeTribe</h1>
          <p className="text-center mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <div className="h-full mobile-container">
        {user ? (
          <MainTabs 
            userData={user} 
            onLogout={handleLogout} 
            onUpdateUserData={handleUpdateUserData}
          />
        ) : (
          <AuthScreen onAuthenticated={handleAuthenticated} />
        )}
      </div>
    </div>
  );
};

export default Index;
