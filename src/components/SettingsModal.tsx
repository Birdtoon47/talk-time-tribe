
import { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Settings, 
  CreditCard, 
  Bank, 
  LogOut,
  DollarSign,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

interface SettingsModalProps {
  userData: any;
  onLogout: () => void;
  onUpdateUserData: (updatedData: any) => void;
}

const SettingsModal = ({ userData, onLogout, onUpdateUserData }: SettingsModalProps) => {
  const [bankInfo, setBankInfo] = useState({
    accountName: userData.bankInfo?.accountName || '',
    accountNumber: userData.bankInfo?.accountNumber || '',
    bankName: userData.bankInfo?.bankName || ''
  });
  
  const [paypalEmail, setPaypalEmail] = useState(userData.paypalEmail || '');
  const [stripeConnected, setStripeConnected] = useState(!!userData.stripeConnected);
  const [currencyCode, setCurrencyCode] = useState(userData.currencyCode || 'IDR');
  
  const handleSaveBankInfo = () => {
    const updatedUserData = {
      ...userData,
      bankInfo
    };
    
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    onUpdateUserData(updatedUserData);
    toast.success('Bank information saved successfully');
  };
  
  const handleSavePaypal = () => {
    if (!paypalEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    const updatedUserData = {
      ...userData,
      paypalEmail
    };
    
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    onUpdateUserData(updatedUserData);
    toast.success('PayPal email saved successfully');
  };
  
  const handleConnectStripe = () => {
    // In a real app, this would redirect to Stripe Connect onboarding
    const updatedUserData = {
      ...userData,
      stripeConnected: true
    };
    
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    onUpdateUserData(updatedUserData);
    setStripeConnected(true);
    toast.success('Stripe account connected successfully');
  };
  
  const handleCurrencyChange = (code: string) => {
    const updatedUserData = {
      ...userData,
      currencyCode: code
    };
    
    localStorage.setItem('talktribe_user', JSON.stringify(updatedUserData));
    onUpdateUserData(updatedUserData);
    setCurrencyCode(code);
    toast.success(`Currency changed to ${code}`);
  };
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        
        <Tabs defaultValue="payment" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="payment" className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                Add payment methods to receive your earnings
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bank className="h-5 w-5 text-app-purple" />
                  <h4 className="font-medium">Bank Transfer</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      value={bankInfo.bankName}
                      onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                      placeholder="e.g., BCA, Mandiri"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input 
                      id="accountName" 
                      value={bankInfo.accountName}
                      onChange={(e) => setBankInfo({...bankInfo, accountName: e.target.value})}
                      placeholder="Account holder name"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      value={bankInfo.accountNumber}
                      onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                      placeholder="Your account number"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSaveBankInfo}
                    className="w-full bg-app-purple"
                  >
                    Save Bank Information
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-5 w-5 text-app-blue" />
                  <h4 className="font-medium">PayPal</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="paypalEmail">PayPal Email</Label>
                    <Input 
                      id="paypalEmail" 
                      type="email"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSavePaypal}
                    className="w-full bg-app-blue"
                  >
                    Save PayPal Email
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-app-green" />
                  <h4 className="font-medium">Stripe</h4>
                </div>
                
                {stripeConnected ? (
                  <div className="bg-green-50 text-green-700 rounded p-2 text-sm">
                    Your Stripe account is connected ✓
                  </div>
                ) : (
                  <Button 
                    onClick={handleConnectStripe}
                    className="w-full bg-app-green"
                  >
                    Connect Stripe Account
                  </Button>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="currency" className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Currency Settings</h3>
              <p className="text-sm text-muted-foreground">
                Choose the currency for your consultation rates
              </p>
            </div>
            
            <div className="space-y-2">
              {['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'AUD'].map((code) => (
                <div 
                  key={code}
                  className={`flex items-center justify-between p-3 rounded-lg border ${code === currencyCode ? 'bg-muted' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{code}</span>
                  </div>
                  
                  <Button
                    variant={code === currencyCode ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCurrencyChange(code)}
                    className={code === currencyCode ? "bg-app-purple" : ""}
                  >
                    {code === currencyCode ? 'Selected' : 'Select'}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Account Settings</h3>
              <p className="text-sm text-muted-foreground">
                Manage your account
              </p>
            </div>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            
            <div className="text-xs text-center text-muted-foreground mt-6">
              TalkTimeTribe v1.0.0
              <div className="mt-1">© 2025 TalkTimeTribe</div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsModal;
