import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-6 flex items-center justify-between border-b border-border">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          VyomSetu
        </h1>
        <div className="flex items-center gap-4">
          {user ? (
            <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </>
          )}
        </div>
      </header>
      
      {/* Hero section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Next-Gen Payload Management for the ISS
              </h1>
              <p className="text-xl text-muted-foreground">
                Optimize cargo organization and waste management on the 
                International Space Station with AI-powered recommendations.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => user ? navigate('/dashboard') : navigate('/login')}>
                {user ? 'Go to Dashboard' : 'Get Started'}
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative bg-black/30 border border-accent rounded-xl overflow-hidden animate-float">
              <svg 
                viewBox="0 0 800 600" 
                className="w-full h-full"
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(155, 135, 245, 0.3))' }}
              >
                <line x1="100" y1="300" x2="700" y2="300" stroke="hsl(var(--primary))" strokeWidth="8" />
                
                <rect x="100" y="150" width="100" height="40" fill="#525252" />
                <rect x="100" y="410" width="100" height="40" fill="#525252" />
                <rect x="600" y="150" width="100" height="40" fill="#525252" />
                <rect x="600" y="410" width="100" height="40" fill="#525252" />
                
                <rect x="250" y="260" width="70" height="40" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="2" rx="5" />
                <rect x="330" y="300" width="70" height="40" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="2" rx="5" />
                <rect x="410" y="260" width="70" height="40" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="2" rx="5" />
                <rect x="490" y="300" width="70" height="40" fill="hsl(var(--secondary))" stroke="hsl(var(--primary))" strokeWidth="2" rx="5" />
                
                <circle cx="400" cy="300" r="150" fill="url(#glowGradient)" opacity="0.2" />
              </svg>
              
              <defs>
                <radialGradient id="glowGradient" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 px-4 md:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform helps astronauts and mission control optimize 
              cargo management on the International Space Station.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive ISS Cross-Section</h3>
              <p className="text-muted-foreground">
                Visualize storage occupancy across the entire space station with our 
                detailed interactive model.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Placement</h3>
              <p className="text-muted-foreground">
                Receive intelligent recommendations on where to place new cargo
                based on item type, usage frequency, and available space.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-xl border border-border">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" x2="10" y1="11" y2="17" />
                  <line x1="14" x2="14" y1="11" y2="17" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Waste Management</h3>
              <p className="text-muted-foreground">
                Track, categorize, and optimize waste disposal to ensure efficient 
                use of limited space on the station.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-2xl p-8 md:p-12 bg-gradient-to-r from-space-deep-blue via-space-nasa-blue to-space-purple text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Space Station Operations?</h2>
              <p className="text-lg mb-6">
                Join space agencies worldwide using VyomSetu to streamline 
                payload management and improve operational efficiency.
              </p>
              <Button
                size="lg"
                variant="secondary" 
                onClick={() => user ? navigate('/dashboard') : navigate('/register')}
              >
                {user ? 'Access Dashboard' : 'Get Started For Free'}
              </Button>
            </div>
            
            <div className="flex justify-center">
              <div className="relative h-48 w-48">
                <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-white opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-8 rounded-full bg-white opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-12 rounded-full bg-white opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }} />
                <div className="absolute inset-16 rounded-full bg-white opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-4 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                VyomSetu
              </h2>
              <p className="text-muted-foreground">
                The premier solution for space station payload management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Team</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {new Date().getFullYear()} VyomSetu. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
