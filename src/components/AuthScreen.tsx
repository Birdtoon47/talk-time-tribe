
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface AuthScreenProps {
  onAuthenticated: (userData: any) => void;
}

const AuthScreen = ({ onAuthenticated }: AuthScreenProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  
  const handleLogin = () => {
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo, authenticate with any non-empty values
      if (loginEmail && loginPassword) {
        // Mock user data
        const userData = {
          id: '123',
          name: 'John Doe',
          email: loginEmail,
          isCreator: true,
          balance: 0,
          profilePic: 'https://i.pravatar.cc/150?img=32'
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('talktribe_user', JSON.stringify(userData));
        
        toast.success('Login successful!');
        onAuthenticated(userData);
      } else {
        toast.error('Please enter email and password');
      }
    }, 1000);
  };
  
  const handleRegister = () => {
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsLoading(false);
      
      // For demo, register with any non-empty values
      if (name && email && password) {
        // Mock user data
        const userData = {
          id: '123',
          name: name,
          email: email,
          isCreator: isCreator,
          balance: 0,
          profilePic: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('talktribe_user', JSON.stringify(userData));
        
        toast.success('Registration successful!');
        onAuthenticated(userData);
      } else {
        toast.error('Please fill all fields');
      }
    }, 1000);
  };
  
  return (
    <div className="app-gradient min-h-screen flex flex-col">
      <div className="py-10 text-center">
        <h1 className="text-4xl font-bold text-app-purple">TalkTimeTribe</h1>
        <p className="text-app-dark mt-2">Connect with your audience through monetized consultations</p>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-app-purple hover:bg-app-purple/90" 
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-email">Email</label>
                <Input 
                  id="reg-email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="reg-password">Password</label>
                <Input 
                  id="reg-password" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="creator-checkbox"
                  checked={isCreator}
                  onChange={(e) => setIsCreator(e.target.checked)}
                  className="rounded border-gray-300 text-app-purple focus:ring-app-purple"
                />
                <label htmlFor="creator-checkbox" className="text-sm">
                  I want to register as a content creator
                </label>
              </div>
              
              <Button 
                className="w-full bg-app-purple hover:bg-app-purple/90" 
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <div className="py-6 text-center text-gray-500 text-sm">
        <p>© 2025 TalkTimeTribe. All rights reserved.</p>
      </div>
    </div>
  );
};

export default AuthScreen;
