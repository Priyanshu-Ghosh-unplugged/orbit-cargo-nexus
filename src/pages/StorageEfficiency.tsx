
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getMockStorageEfficiency } from '@/services/api';
import { BarChart2, AlertTriangle, Lightbulb } from 'lucide-react';

const StorageEfficiency = () => {
  const efficiencyData = getMockStorageEfficiency();
  
  // Helper function to get a color based on efficiency value
  const getEfficiencyColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 65) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Format data for the bar chart
  const chartData = efficiencyData.byModule.map(module => ({
    name: module.name,
    efficiency: module.efficiency,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Storage Efficiency</h1>
        <p className="text-muted-foreground">
          Analyze and optimize storage utilization across all ISS modules
        </p>
      </div>
      
      {/* Overall Efficiency Card */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Overall Efficiency</CardTitle>
            <CardDescription>Station-wide storage utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full border-8 border-muted opacity-30"></div>
                
                {/* Progress circle */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="10"
                    strokeDasharray={`${efficiencyData.overall * 2.83} 283`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="text-primary"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                  />
                </svg>
                
                {/* Central percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{efficiencyData.overall}%</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  {efficiencyData.overall >= 80 
                    ? 'Excellent storage efficiency' 
                    : efficiencyData.overall >= 65 
                      ? 'Good storage efficiency' 
                      : 'Needs optimization'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Efficiency by Module
            </CardTitle>
            <CardDescription>Comparative analysis across modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 100]} 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Efficiency']} 
                    labelFormatter={(label) => `${label} Module`}
                  />
                  <Bar 
                    dataKey="efficiency" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Efficiency Table */}
      <Card>
        <CardHeader>
          <CardTitle>Module Breakdown</CardTitle>
          <CardDescription>Detailed efficiency metrics for each module</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Efficiency Score</TableHead>
                <TableHead>Visual</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {efficiencyData.byModule.map((module) => (
                <TableRow key={module.name}>
                  <TableCell className="font-medium">{module.name}</TableCell>
                  <TableCell>{module.efficiency}%</TableCell>
                  <TableCell>
                    <div className="w-full max-w-md">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getEfficiencyColor(module.efficiency)}`} 
                          style={{ width: `${module.efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {module.efficiency >= 80 ? (
                      <span className="text-green-500 text-sm font-medium">Optimal</span>
                    ) : module.efficiency >= 65 ? (
                      <span className="text-yellow-500 text-sm font-medium">Adequate</span>
                    ) : (
                      <span className="text-red-500 text-sm font-medium">Needs attention</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* AI Suggestions */}
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Optimization Suggestions
          </CardTitle>
          <CardDescription>AI-generated recommendations to improve storage efficiency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {efficiencyData.suggestions.map((suggestion, index) => (
            <Alert key={index}>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Suggestion {index + 1}</AlertTitle>
              <AlertDescription>{suggestion}</AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
      
      {/* Optimization Tips */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Used Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Items accessed more than 10 times in the past month. Consider relocating for easier access.
            </p>
            <ul className="space-y-2">
              {[
                { name: 'Medical Kit Alpha', location: 'Destiny/A5', access: 24 },
                { name: 'Food Container F12', location: 'Unity/B3', access: 18 },
                { name: 'Maintenance Tools T7', location: 'Zvezda/C2', access: 16 },
              ].map((item) => (
                <li key={item.name} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                  <span className="text-sm">{item.access}x</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Space Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Storage areas with lowest space utilization that can be repurposed.
            </p>
            <ul className="space-y-2">
              {[
                { location: 'Columbus/D7', usage: 23 },
                { location: 'Harmony/A1', usage: 31 },
                { location: 'Kibo/E4', usage: 35 },
              ].map((area) => (
                <li key={area.location} className="flex justify-between items-center">
                  <p className="font-medium">{area.location}</p>
                  <Progress value={area.usage} className="h-2 w-1/3" />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Inefficient Arrangements</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Storage arrangements that could benefit from reorganization.
            </p>
            <ul className="space-y-3">
              {[
                'Items in Destiny/B8 have incompatible masses nearby, causing access issues',
                'Zarya/C1 contains high-priority items behind low-priority items',
                'Kibo/E2 has mixed cargo types that should be separated',
              ].map((issue, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-red-500">•</span>
                  <span className="text-sm">{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorageEfficiency;
