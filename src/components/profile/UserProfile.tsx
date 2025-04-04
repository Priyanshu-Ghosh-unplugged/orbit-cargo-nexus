
import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { User, Settings, ShieldCheck, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserProfileProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UserProfile = ({ open, onOpenChange }: UserProfileProps) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || 'Astronaut and cargo specialist with 5 years of ISS experience.',
    preferredModule: 'Columbus',
    notificationPreferences: {
      email: true,
      app: true,
      criticalAlerts: true
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved."
    });
  };

  const handleLogout = () => {
    logout();
    onOpenChange(false);
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Your Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.avatarUrl} alt={user?.name} />
            <AvatarFallback className="text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-bold">{user?.name}</h2>
          <p className="text-muted-foreground">{user?.role || 'Astronaut'}</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formState.name} 
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formState.email} 
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                value={formState.bio} 
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredModule">Preferred Module</Label>
              <Input 
                id="preferredModule" 
                name="preferredModule" 
                value={formState.preferredModule} 
                onChange={handleInputChange}
              />
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Activity Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/30 p-3 rounded-md flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Last Active</p>
                    <p className="text-xs text-muted-foreground">Today, 09:42 UTC</p>
                  </div>
                </div>
                <div className="bg-accent/30 p-3 rounded-md flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-xs text-muted-foreground">{user?.role || 'Astronaut'}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    defaultChecked={formState.notificationPreferences.email}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="appNotifications">App Notifications</Label>
                  <input
                    type="checkbox"
                    id="appNotifications"
                    defaultChecked={formState.notificationPreferences.app}
                    className="h-4 w-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="criticalAlerts">Critical Alerts</Label>
                  <input
                    type="checkbox"
                    id="criticalAlerts"
                    defaultChecked={formState.notificationPreferences.criticalAlerts}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Display Settings</h3>
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <select 
                  id="theme" 
                  className="w-full border border-input rounded-md h-10 px-3"
                  defaultValue="system"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            
            <Button className="mt-2 w-full" variant="outline">
              Change Password
            </Button>
            
            <div className="pt-2 border-t border-border">
              <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
              <Button variant="destructive" className="w-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveProfile}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
