
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ISSCrossSection from '@/components/iss/CrossSection';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Calendar, Package, Truck, RefreshCw } from 'lucide-react';
import { simulateDay, getMockWasteData } from '@/services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);
  const wasteData = getMockWasteData();
  
  const handleTimeSimulation = async () => {
    setIsSimulating(true);
    
    try {
      await simulateDay();
      toast({
        title: "Simulation complete",
        description: "Time simulation for one day has been processed.",
      });
    } catch (error) {
      toast({
        title: "Simulation failed",
        description: "There was an error running the time simulation.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}</h1>
        <p className="text-muted-foreground">
          Here's the current status of the International Space Station cargo systems.
        </p>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Date (ISS)</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toISOString().split('T')[0]}</div>
            <p className="text-xs text-muted-foreground">UTC time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Resupply</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 days</div>
            <p className="text-xs text-muted-foreground">SpaceX Dragon CRS-28</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cargo Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,487</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waste Ready</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wasteData.total} kg</div>
            <p className="text-xs text-muted-foreground">Next pickup: {wasteData.nextPickup}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* ISS Visualization */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <ISSCrossSection />
        </CardContent>
      </Card>
      
      {/* Time Simulation */}
      <Card>
        <CardHeader>
          <CardTitle>Time Simulation</CardTitle>
          <CardDescription>
            Simulate passage of time to see how cargo and waste management evolves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleTimeSimulation} 
              disabled={isSimulating}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {isSimulating ? 'Simulating...' : 'Simulate One Day'}
            </Button>
            <p className="text-sm text-muted-foreground">
              This will process all scheduled operations and update storage status.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest cargo operations on the station</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 1, user: 'Astronaut Zhang', action: 'Retrieved', item: 'Medical Kit #42', time: '10 minutes ago', module: 'Columbus' },
              { id: 2, user: 'Astronaut Johnson', action: 'Placed', item: 'Food Container B-15', time: '2 hours ago', module: 'Unity' },
              { id: 3, user: 'Astronaut Kumar', action: 'Relocated', item: 'Science Experiment P-98', time: '5 hours ago', module: 'Destiny' },
              { id: 4, user: 'Astronaut Miller', action: 'Disposed', item: 'Waste Package W-11', time: '6 hours ago', module: 'Zvezda' },
            ].map(activity => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{activity.action} {activity.item}</p>
                  <p className="text-sm text-muted-foreground">{activity.user} • {activity.module} module</p>
                </div>
                <p className="text-sm text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
