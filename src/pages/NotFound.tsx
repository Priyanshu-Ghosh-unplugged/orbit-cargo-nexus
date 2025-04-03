
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-32 w-32 rounded-full bg-primary/20 animate-pulse"></div>
          </div>
          <h1 className="text-9xl font-bold text-primary relative">404</h1>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>
        </div>
        
        <div className="pt-4">
          <Button onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
