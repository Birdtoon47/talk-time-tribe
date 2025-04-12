
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  const [siteName, setSiteName] = useState("TalkTimeTribe");
  const [siteDescription, setSiteDescription] = useState("Connect with creators for personalized consultations");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [enableEmails, setEnableEmails] = useState(true);
  const [enableActivityLogs, setEnableActivityLogs] = useState(true);

  const handleSaveGeneralSettings = () => {
    // Handle saving general settings
    console.log("Saving general settings...");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">System Settings</h2>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your site information and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Input 
                  id="site-description" 
                  value={siteDescription} 
                  onChange={(e) => setSiteDescription(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Site Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                    Logo
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Default Timezone</Label>
                <select className="w-full rounded-md border p-2">
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>Europe/London</option>
                  <option>Asia/Tokyo</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneralSettings}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch 
                  checked={enableEmails} 
                  onCheckedChange={setEnableEmails} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Enable in-app push notifications
                  </p>
                </div>
                <Switch 
                  checked={enableNotifications} 
                  onCheckedChange={setEnableNotifications} 
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activity Logs</p>
                  <p className="text-sm text-muted-foreground">
                    Track and log all system activities
                  </p>
                </div>
                <Switch 
                  checked={enableActivityLogs} 
                  onCheckedChange={setEnableActivityLogs} 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-password-policy">Password Policy</Label>
                <select className="w-full rounded-md border p-2">
                  <option>Strong (min 8 chars, special chars required)</option>
                  <option>Medium (min 8 chars)</option>
                  <option>Basic (min 6 chars)</option>
                </select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <select className="w-full rounded-md border p-2">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
