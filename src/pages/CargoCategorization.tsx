
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Package, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { getPlacementRecommendations, searchItems } from '@/services/api';

interface PlacementFormValues {
  cargoType: string;
  name: string;
  weight: string;
  priority: string;
  dimensions: string;
  accessFrequency: string;
}

const CargoCategorization = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PlacementFormValues>({
    defaultValues: {
      cargoType: '',
      name: '',
      weight: '',
      dimensions: '',
      priority: 'medium',
      accessFrequency: 'low'
    }
  });
  
  // Cargo categories
  const cargoTypes = [
    { value: 'food', label: 'Food and Nutrition' },
    { value: 'equipment', label: 'Scientific Equipment' },
    { value: 'medical', label: 'Medical Supplies' },
    { value: 'personal', label: 'Personal Items' },
    { value: 'maintenance', label: 'Maintenance Tools' },
    { value: 'experiments', label: 'Experimental Materials' },
    { value: 'clothing', label: 'Clothing and Textiles' },
    { value: 'electronics', label: 'Electronics and Computers' },
  ];
  
  // Handle cargo search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      const response = await searchItems({ itemName: searchQuery });
      
      // Mock data for demo
      setTimeout(() => {
        setSearchResults([
          { id: 'ITM-1243', name: 'Protein Bar Box', type: 'food', location: 'Unity/A3/Shelf-2', lastAccess: '2025-03-15' },
          { id: 'ITM-9857', name: 'Water Filter Kit', type: 'equipment', location: 'Destiny/B7/Cabinet-4', lastAccess: '2025-02-22' },
          { id: 'ITM-3324', name: 'Soil Sample Container', type: 'experiments', location: 'Columbus/C2/Drawer-1', lastAccess: '2025-04-01' },
        ]);
        setIsSearching(false);
      }, 1000);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: "There was a problem with your search request.",
        variant: "destructive",
      });
      setIsSearching(false);
    }
  };
  
  // Handle placement recommendation
  const onSubmit = async (data: PlacementFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Transform the form data to match the API's expected structure
      const parsedWeight = data.weight ? parseFloat(data.weight) : undefined;
      let parsedDimensions;
      
      // Parse dimensions if provided (format expected: "L x W x H")
      if (data.dimensions) {
        const dims = data.dimensions.split('x').map(d => parseFloat(d.trim()));
        if (dims.length === 3 && !dims.some(isNaN)) {
          parsedDimensions = {
            length: dims[0],
            width: dims[1],
            height: dims[2]
          };
        }
      }
      
      const apiPayload = {
        type: data.cargoType,
        weight: parsedWeight,
        dimensions: parsedDimensions,
        priority: data.priority as 'high' | 'medium' | 'low'
      };
      
      const response = await getPlacementRecommendations(apiPayload);
      
      // Mock data for demo
      setTimeout(() => {
        setRecommendation({
          module: 'Columbus',
          section: 'C4',
          location: 'Shelf-3',
          confidence: 92,
          alternatives: [
            { module: 'Destiny', section: 'D2', location: 'Cabinet-1', confidence: 87 },
            { module: 'Harmony', section: 'H5', location: 'Drawer-9', confidence: 73 }
          ],
          reasoning: [
            'Based on cargo dimensions and available space',
            'Proximity to related items',
            'Optimal for access frequency requirements',
            'Adheres to safety regulations for this cargo type'
          ],
          instructions: 'Place item with barcode facing outward. Log placement in system after securing with appropriate restraints.'
        });
        setIsSubmitting(false);
      }, 1500);
    } catch (error) {
      console.error('Recommendation error:', error);
      toast({
        title: "Request failed",
        description: "There was a problem getting placement recommendations.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Cargo Categorization</h1>
        <p className="text-muted-foreground">
          Search for items or get AI-powered placement recommendations for new cargo.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Cargo Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Item Search
            </CardTitle>
            <CardDescription>
              Find existing cargo items and their locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                placeholder="Search by item name or ID" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mt-4">
                <Table>
                  <TableCaption>Found {searchResults.length} items</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Access</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.lastAccess}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Placement Recommendation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Placement Recommendations
            </CardTitle>
            <CardDescription>
              Get AI suggestions for optimal placement of new cargo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="cargoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cargo type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cargoTypes.map(type => (
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Item Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter item name" {...field} />
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
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="L x W x H" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="accessFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Access Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High (Daily)</SelectItem>
                            <SelectItem value="medium">Medium (Weekly)</SelectItem>
                            <SelectItem value="low">Low (Monthly+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Getting recommendations...' : 'Get Placement Recommendations'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      {/* Recommendation Results */}
      {recommendation && (
        <Card className="border-primary/20">
          <CardHeader className="bg-primary/5">
            <CardTitle>Placement Recommendation</CardTitle>
            <CardDescription>
              AI-generated recommendation based on your cargo specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Primary Recommendation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Module:</span>
                    <span className="font-medium">{recommendation.module}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Section:</span>
                    <span className="font-medium">{recommendation.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{recommendation.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-medium ${recommendation.confidence > 85 ? 'text-space-success' : 'text-amber-500'}`}>
                      {recommendation.confidence}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Reasoning</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {recommendation.reasoning.map((reason: string, index: number) => (
                    <li key={index} className="text-muted-foreground">{reason}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Alternative Locations</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendation.alternatives.map((alt: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{alt.module}</TableCell>
                      <TableCell>{alt.section}</TableCell>
                      <TableCell>{alt.location}</TableCell>
                      <TableCell>{alt.confidence}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="bg-accent/30 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Placement Instructions</h3>
              <p className="text-muted-foreground">{recommendation.instructions}</p>
            </div>
          </CardContent>
          <CardFooter className="border-t border-border">
            <div className="flex flex-col md:flex-row w-full gap-4 justify-between">
              <Button variant="outline">Show on ISS Map</Button>
              <Button>Confirm Placement</Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default CargoCategorization;
