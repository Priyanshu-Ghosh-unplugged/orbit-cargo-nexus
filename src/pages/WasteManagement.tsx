
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { getMockWasteData } from '@/services/api';
import { Trash2, ArrowUp, ArrowDown, Minus, PieChart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Use recharts for the pie chart
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WasteFormValues {
  wasteType: string;
  description: string;
  weight: string;
  containerId: string;
  hazardous: string;
}

const WasteManagement = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const wasteData = getMockWasteData();
  
  // Form for logging new waste
  const form = useForm<WasteFormValues>({
    defaultValues: {
      wasteType: '',
      description: '',
      weight: '',
      containerId: '',
      hazardous: 'no'
    }
  });
  
  // Waste types
  const wasteTypes = [
    { value: 'biological', label: 'Biological Waste' },
    { value: 'packaging', label: 'Packaging Materials' },
    { value: 'technical', label: 'Technical/Electronic Waste' },
    { value: 'food', label: 'Food Waste' },
    { value: 'medical', label: 'Medical Waste' },
    { value: 'clothing', label: 'Textile/Clothing Waste' },
    { value: 'paper', label: 'Paper Products' },
    { value: 'mixed', label: 'Mixed/Unsorted Waste' },
  ];

  const onSubmit = async (data: WasteFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call your waste management API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Waste logged successfully",
        description: "The waste item has been added to the management system.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Failed to log waste",
        description: "There was a problem logging the waste item.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format data for pie chart
  const pieChartData = wasteData.categories.map(category => ({
    name: category.type,
    value: category.amount,
  }));
  
  // Custom colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  
  // Helper function for trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <ArrowUp className="h-4 w-4 text-red-500" />;
    if (trend === 'decreasing') return <ArrowDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Waste Management</h1>
        <p className="text-muted-foreground">
          Track, categorize and manage waste for efficient return to Earth
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Waste Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Waste Overview
            </CardTitle>
            <CardDescription>
              Current waste composition and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Waste:</span>
                <span className="text-xl font-semibold">{wasteData.total} kg</span>
              </div>
              <Progress value={75} className="h-2 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 kg</span>
                <span>Return capacity: 175 kg</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Waste by Category</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount (kg)</TableHead>
                    <TableHead className="text-right">Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wasteData.categories.map((category) => (
                    <TableRow key={category.type}>
                      <TableCell>{category.type}</TableCell>
                      <TableCell className="text-right">{category.amount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center">
                          {getTrendIcon(category.trend)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Log New Waste */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Log New Waste
            </CardTitle>
            <CardDescription>
              Record new waste items for proper tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="wasteType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waste Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select waste type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wasteTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of waste" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="containerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Container ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. WC-1234" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="hazardous"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hazardous Material</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Is this waste hazardous?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="yes">Yes (Requires special handling)</SelectItem>
                          <SelectItem value="no">No (Standard disposal)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging...' : 'Log Waste Item'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Waste Return Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Return Schedule</CardTitle>
          <CardDescription>Upcoming opportunities to return waste to Earth</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Maximum Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">SpaceX Dragon CRS-28</TableCell>
                <TableCell>{wasteData.nextPickup}</TableCell>
                <TableCell>175 kg</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                    Scheduled
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Manifest</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Progress MS-25</TableCell>
                <TableCell>2025-05-20</TableCell>
                <TableCell>120 kg</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    Planning
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">Request Space</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Cygnus NG-20</TableCell>
                <TableCell>2025-06-10</TableCell>
                <TableCell>200 kg</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    Tentative
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" disabled>Not Available</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Waste Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Waste Analysis</CardTitle>
          <CardDescription>Insights and patterns from waste generation data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Top Waste Sources</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Food packaging</span>
                  <span>28%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Experiment materials</span>
                  <span>22%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Personal hygiene</span>
                  <span>18%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Equipment packaging</span>
                  <span>15%</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Optimization Opportunities</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Reduce food packaging by 15%</li>
                <li>Implement reusable container system</li>
                <li>Optimize experiment waste protocols</li>
                <li>Compost suitable organic matter</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Weekly Trend</h3>
              <div className="h-24 bg-accent/40 rounded-md flex items-end p-2">
                {[65, 48, 72, 53, 60, 55, 68].map((value, i) => (
                  <div 
                    key={i}
                    className="flex-1 mx-1 rounded-sm bg-primary"
                    style={{ height: `${value}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WasteManagement;
