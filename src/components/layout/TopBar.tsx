
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  const notifications = [
    { id: 1, text: "Warning: Kibo module at 91% capacity", read: false },
    { id: 2, text: "Destiny module needs attention", read: false },
    { id: 3, text: "New cargo arriving in 3 days", read: true },
  ];
  
  return (
    <header className="bg-card border-b border-border px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/ac6af88d-fd0f-408c-a07c-95d193802de5.png" 
          alt="VyomSetu Logo" 
          className="h-8 w-8"
        />
        <div>
          <h1 className="text-xl font-semibold">VyomSetu</h1>
          <p className="text-sm text-muted-foreground">Optimize your space station operations</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-xs flex items-center justify-center text-white">
                {notifications.filter(n => !n.read).length}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <DropdownMenuItem key={notification.id} className="cursor-pointer">
                  <div className="flex items-start gap-2 py-1">
                    <div className={`h-2 w-2 mt-1.5 rounded-full ${notification.read ? 'bg-muted' : 'bg-destructive'}`} />
                    <span>{notification.text}</span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-2 px-4 text-center text-muted-foreground">
                No new notifications
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut size={18} />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
