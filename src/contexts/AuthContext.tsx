
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
  profile?: {
    id: string;
    name: string;
    email: string;
    role: string;
    bio?: string;
    avatar_url?: string;
    preferred_module?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demonstration
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'astronaut@iss.space',
  name: 'Commander Davis',
  role: 'astronaut',
  bio: 'Astronaut and cargo specialist with ISS experience.',
  avatarUrl: '/placeholder.svg',
  profile: {
    id: 'mock-user-id',
    name: 'Commander Davis',
    email: 'astronaut@iss.space',
    role: 'astronaut',
    bio: 'Astronaut and cargo specialist with ISS experience.',
    avatar_url: '/placeholder.svg',
    preferred_module: 'Columbus'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize auth state with mock data
  useEffect(() => {
    const storedAuth = localStorage.getItem('iss_cargo_auth');
    
    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock login - in a real app, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Auto-login for demo purposes
      setUser(MOCK_USER);
      localStorage.setItem('iss_cargo_auth', JSON.stringify(MOCK_USER));
      
      toast({
        title: "Login successful",
        description: "Welcome back, Commander Davis!"
      });
      
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock registration - in a real app, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const newUser = {
        ...MOCK_USER,
        name,
        email,
        profile: {
          ...MOCK_USER.profile,
          name,
          email
        }
      };
      
      setUser(newUser);
      localStorage.setItem('iss_cargo_auth', JSON.stringify(newUser));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created!"
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Mock logout
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      
      setUser(null);
      localStorage.removeItem('iss_cargo_auth');
      
      toast({
        title: "Signed out",
        description: "You have been successfully logged out."
      });
      
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Sign out failed",
        description: "Could not sign out",
        variant: "destructive"
      });
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    
    // In a real app, you would fetch the latest profile data
    // For this mock version, we'll just use what we have
    toast({
      title: "Profile refreshed",
      description: "Latest profile data loaded"
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
