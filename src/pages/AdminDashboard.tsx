
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3, 
  LogOut,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminPayments from '@/components/admin/AdminPayments';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import AdminSettings from '@/components/admin/AdminSettings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<string>('overview');

  const handleLogout = () => {
    // Handle logout logic here
    navigate('/');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUsers />;
      case 'payments':
        return <AdminPayments />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-2">
            <h2 className="text-xl font-semibold text-app-purple">Admin Panel</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActivePage('overview')} 
                      isActive={activePage === 'overview'}
                      tooltip="Dashboard"
                    >
                      <LayoutDashboard className="mr-2 h-5 w-5" />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActivePage('users')} 
                      isActive={activePage === 'users'}
                      tooltip="Users"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      <span>Users</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Finance</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActivePage('payments')} 
                      isActive={activePage === 'payments'}
                      tooltip="Payments"
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      <span>Payments</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActivePage('analytics')} 
                      isActive={activePage === 'analytics'}
                      tooltip="Analytics"
                    >
                      <BarChart3 className="mr-2 h-5 w-5" />
                      <span>Analytics</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>System</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setActivePage('settings')} 
                      isActive={activePage === 'settings'}
                      tooltip="Settings"
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-red-500" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span>Logout</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="relative">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-4 text-xl font-bold">
                {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h1>
            </div>
            <Button onClick={() => navigate('/')} className="text-sm">
              Back to App
            </Button>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
