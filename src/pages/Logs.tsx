
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Clock, Search, Download, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { getLogs } from '@/services/api';

const Logs = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); // 7 days ago
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [actionType, setActionType] = useState<string | undefined>(undefined);
  const [itemId, setItemId] = useState('');
  const [userId, setUserId] = useState('');
  const [logs, setLogs] = useState<Array<any>>([]);
  
  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        ...(actionType && { actionType }),
        ...(itemId && { itemId }),
        ...(userId && { userId }),
      };
      
      const response = await getLogs(params);
      
      // Mock data for demo
      setTimeout(() => {
        const mockLogs = [
          { id: 1, timestamp: '2025-04-02T14:32:15Z', user: 'Astronaut Zhang', action: 'placement', item: 'Medical Kit #42', location: 'Columbus/B3' },
          { id: 2, timestamp: '2025-04-02T11:18:42Z', user: 'Astronaut Johnson', action: 'retrieval', item: 'Tool Set T-15', location: 'Unity/A2' },
          { id: 3, timestamp: '2025-04-01T22:05:33Z', user: 'Astronaut Kumar', action: 'disposal', item: 'Waste Package W-7', location: 'Waste Management' },
          { id: 4, timestamp: '2025-04-01T16:40:19Z', user: 'Astronaut Miller', action: 'rearrangement', item: 'Food Container F-22', location: 'Zvezda/C4' },
          { id: 5, timestamp: '2025-04-01T09:15:27Z', user: 'Astronaut Garcia', action: 'placement', item: 'Science Sample S-15', location: 'Destiny/D1' },
          { id: 6, timestamp: '2025-03-31T19:22:01Z', user: 'Astronaut Dubois', action: 'retrieval', item: 'Camera Equipment C-8', location: 'Harmony/E3' },
          { id: 7, timestamp: '2025-03-31T13:48:55Z', user: 'Astronaut Lopez', action: 'rearrangement', item: 'Personal Items P-3', location: 'Crew Quarters' },
          { id: 8, timestamp: '2025-03-30T21:33:17Z', user: 'Astronaut Kim', action: 'placement', item: 'Water Filter W-4', location: 'Node 3/H2' },
        ];
        setLogs(mockLogs);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch logs',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (logs.length === 0) {
      toast({
        description: 'No logs available to download',
      });
      return;
    }
    
    // In a real app, this would generate a CSV file
    toast({
      title: 'Download initiated',
      description: 'Logs are being downloaded as CSV',
    });
  };
  
  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  };
  
  // Helper function to get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'placement':
        return 'bg-green-100 text-green-800';
      case 'retrieval':
        return 'bg-blue-100 text-blue-800';
      case 'rearrangement':
        return 'bg-purple-100 text-purple-800';
      case 'disposal':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity Logs</h1>
        <p className="text-muted-foreground">
          Track and search ISS cargo management activities
        </p>
      </div>
      
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search Filters
          </CardTitle>
          <CardDescription>
            Filter logs by date range, action type, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      {startDate ? format(startDate, 'PPP') : <span>From date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                    >
                      {endDate ? format(endDate, 'PPP') : <span>To date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="All action types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All action types</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                  <SelectItem value="retrieval">Retrieval</SelectItem>
                  <SelectItem value="rearrangement">Rearrangement</SelectItem>
                  <SelectItem value="disposal">Disposal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Item ID (Optional)</Label>
              <Input
                placeholder="e.g. MED-123"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>User ID (Optional)</Label>
              <Input
                placeholder="e.g. AST-456"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setStartDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
                setEndDate(new Date());
                setActionType(undefined);
                setItemId('');
                setUserId('');
              }}
            >
              Reset Filters
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={logs.length === 0}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
              
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {isLoading ? 'Searching...' : 'Search Logs'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Log Results
          </CardTitle>
          <CardDescription>
            {logs.length > 0 
              ? `Found ${logs.length} logs matching your criteria`
              : 'Search results will appear here'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {formatDate(log.timestamp)}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>{log.item}</TableCell>
                    <TableCell>{log.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No logs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters or selecting a different date range
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Analytics Insights */}
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle>Log Analytics</CardTitle>
          <CardDescription>Quick insights from activity patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium">Most Active Users</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Astronaut Zhang</span>
                  <span className="text-sm">42 actions</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Astronaut Miller</span>
                  <span className="text-sm">38 actions</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Astronaut Kumar</span>
                  <span className="text-sm">29 actions</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Activity Distribution</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Placement</span>
                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: '35%' }}></div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Retrieval</span>
                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: '42%' }}></div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Rearrangement</span>
                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: '15%' }}></div>
                  </div>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Disposal</span>
                  <div className="w-24 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: '8%' }}></div>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Most Accessed Items</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Medical Kit #42</span>
                  <span className="text-sm">24 accesses</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Food Container F-22</span>
                  <span className="text-sm">18 accesses</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tool Set T-15</span>
                  <span className="text-sm">15 accesses</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
