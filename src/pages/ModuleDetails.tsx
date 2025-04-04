
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Info, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ModuleDetails = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  
  // Mock data - in a real app this would come from an API call based on moduleId
  const moduleData = {
    name: moduleId || "Unknown",
    totalItems: 187,
    totalMass: 456.3,
    efficiency: 72,
    hazardous: false,
    radioactive: true,
    averageShelfLife: "264 days",
    categories: [
      { name: "Food", percentage: 35, count: 65, mass: 145.8, shelfLife: "180 days" },
      { name: "Medical", percentage: 15, count: 28, mass: 68.4, shelfLife: "365 days" },
      { name: "Technical", percentage: 25, count: 47, mass: 114.1, shelfLife: "730 days" },
      { name: "Scientific", percentage: 18, count: 34, mass: 82.1, shelfLife: "120 days" },
      { name: "Personal", percentage: 7, count: 13, mass: 32.4, shelfLife: "365 days" }
    ],
    recentActivity: [
      { id: 1, action: "Accessed", item: "Food Container F-12", date: "04-04-2025", user: "Astronaut Chen" },
      { id: 2, action: "Relocated", item: "Medical Kit M-08", date: "04-03-2025", user: "Astronaut Martinez" },
      { id: 3, action: "Inventoried", item: "Tool Set T-15", date: "04-02-2025", user: "Astronaut Johnson" }
    ]
  };
  
  // Format for pie chart
  const categoryData = moduleData.categories.map(category => ({
    name: category.name,
    value: category.percentage
  }));
  
  // Custom colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate('/storage')}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-0.5">{moduleData.name} Module</h1>
          <p className="text-muted-foreground">
            Storage details and inventory analysis
          </p>
        </div>
      </div>
      
      {/* Module Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Module Overview</CardTitle>
            <CardDescription>Summary statistics and efficiency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{moduleData.totalItems}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Mass</p>
                <p className="text-2xl font-bold">{moduleData.totalMass} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Storage Efficiency</p>
                <div className="flex items-center gap-2">
                  <Progress value={moduleData.efficiency} className="h-2 flex-1" />
                  <span>{moduleData.efficiency}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Shelf Life</p>
                <p className="text-xl font-medium">{moduleData.averageShelfLife}</p>
              </div>
            </div>
            
            {moduleData.hazardous && (
              <Alert className="mb-4 bg-orange-100 text-orange-800 border-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Hazardous materials present</AlertTitle>
                <AlertDescription>
                  This module contains items classified as hazardous. Special handling procedures apply.
                </AlertDescription>
              </Alert>
            )}
            
            {moduleData.radioactive && (
              <Alert className="bg-red-100 text-red-800 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Radioactive materials present</AlertTitle>
                <AlertDescription>
                  This module contains radioactive materials. Radiation safety protocols must be followed.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Items by category in this module</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Category Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Cargo Categories
          </CardTitle>
          <CardDescription>
            Detailed breakdown of cargo by category, count, mass, and shelf life
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Item Count</TableHead>
                <TableHead>Mass (kg)</TableHead>
                <TableHead>Average Shelf Life</TableHead>
                <TableHead>Storage Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleData.categories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell>{category.mass.toFixed(1)}</TableCell>
                  <TableCell>{category.shelfLife}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={category.percentage} className="h-2 w-24" />
                      <span className="text-sm">{category.percentage}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest interactions with items in this module</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>User</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleData.recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="font-medium">{activity.item}</TableCell>
                  <TableCell>{activity.user}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Info Section */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="h-5 w-5" />
            Access Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <p>This module is accessible through the {moduleData.name} airlock. Standard cargo protocols apply for all operations.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleDetails;
