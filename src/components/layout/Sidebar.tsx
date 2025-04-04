
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Package, 
  Trash2, 
  BarChart2, 
  Clock, 
  FileDown, 
  Menu, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import UserProfile from '../profile/UserProfile';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const NavItem = ({ to, icon: Icon, label, isCollapsed }: NavItemProps) => (
  <NavLink 
    to={to}
    className={({ isActive }) => cn(
      'flex items-center gap-3 rounded-md px-3 py-2 transition-all duration-200',
      isActive 
        ? 'bg-accent text-primary' 
        : 'hover:bg-accent/50 text-muted-foreground hover:text-primary',
      isCollapsed && 'justify-center px-0'
    )}
  >
    <Icon size={20} />
    {!isCollapsed && <span>{label}</span>}
  </NavLink>
);

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/cargo', icon: Package, label: 'Cargo Management' },
    { to: '/waste', icon: Trash2, label: 'Waste Management' },
    { to: '/storage', icon: BarChart2, label: 'Storage Efficiency' },
    { to: '/logs', icon: Clock, label: 'Activity Logs' },
    { to: '/import-export', icon: FileDown, label: 'Import/Export' },
  ];

  return (
    <div 
      className={cn(
        'h-full bg-card transition-all duration-300 border-r border-border flex flex-col',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            VyomSetu
          </h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </Button>
      </div>

      {!isCollapsed && user && (
        <div className="px-4 py-2 mb-6">
          <p className="text-xs text-muted-foreground">Welcome,</p>
          <p className="font-semibold">{user.name || 'User'}</p>
          <p className="text-xs capitalize text-muted-foreground">{user.role || 'Astronaut'}</p>
        </div>
      )}

      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <NavItem 
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div 
        className={cn(
          'p-4 flex items-center gap-2 bg-accent/50 mt-auto cursor-pointer hover:bg-accent/80 transition-colors',
          isCollapsed && 'justify-center'
        )}
        onClick={() => setProfileOpen(true)}
      >
        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
          {/* Add null check for user and user.name */}
          {user?.name ? user.name.charAt(0) : 'U'}
        </div>
        {!isCollapsed && (
          <div className="truncate">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
          </div>
        )}
      </div>
      
      <UserProfile open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
};

export default Sidebar;
