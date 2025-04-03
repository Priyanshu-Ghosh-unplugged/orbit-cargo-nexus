
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { FileUp, FileDown, FileText, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { importItems } from '@/services/api';

const ImportExport = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      toast({
        title: 'Invalid file format',
        description: 'Please upload a CSV file',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 150);
    
    try {
      // In a real app, this would call your API
      // const response = await importItems(file);
      
      // Mock successful upload for demo
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        setUploadResults({
          success: true,
          itemsProcessed: 48,
          itemsAdded: 36,
          itemsUpdated: 12,
          errors: 2,
          warnings: [
            'Item MED-456 already exists with different attributes',
            'Item TOOL-789 has missing weight information',
          ],
        });
        
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
        
        toast({
          title: 'Upload successful',
          description: 'Your CSV file has been processed',
        });
      }, 3000);
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      setIsUploading(false);
      
      toast({
        title: 'Upload failed',
        description: 'There was a problem processing your file',
        variant: 'destructive',
      });
    }
  };
  
  const handleDownloadTemplate = () => {
    toast({
      description: 'CSV template download started',
    });
    // In a real app, this would download a template CSV file
  };
  
  const handleDownloadData = () => {
    toast({
      description: 'Current inventory data export started',
    });
    // In a real app, this would export the current inventory data
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Import & Export</h1>
        <p className="text-muted-foreground">
          Manage cargo inventory data with CSV imports and exports
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>
              Upload a CSV file to import cargo inventory data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isUploading ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}
              >
                {isUploading ? (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 mx-auto text-primary" />
                    <div className="space-y-2">
                      <h3 className="font-medium">Processing your file</h3>
                      <Progress value={uploadProgress} className="h-2 w-full max-w-xs mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        {uploadProgress < 100 
                          ? 'Validating and importing data...'
                          : 'Processing complete!'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="space-y-4 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileUp className="h-12 w-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="font-medium mb-1">Click to upload CSV file</h3>
                      <p className="text-sm text-muted-foreground">
                        or drag and drop your file here
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {!isUploading && (
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadTemplate}
                    className="text-sm"
                  >
                    Download Template
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
            
            {/* Upload Results */}
            {uploadResults && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2 text-green-500">
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Import Completed</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{uploadResults.itemsProcessed}</div>
                    <div className="text-xs text-muted-foreground">Items Processed</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{uploadResults.itemsAdded}</div>
                    <div className="text-xs text-muted-foreground">Items Added</div>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold">{uploadResults.itemsUpdated}</div>
                    <div className="text-xs text-muted-foreground">Items Updated</div>
                  </div>
                </div>
                
                {uploadResults.warnings.length > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-1">Warnings:</div>
                      <ul className="text-sm list-disc pl-4 space-y-1">
                        {uploadResults.warnings.map((warning: string, index: number) => (
                          <li key={index}>{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download current inventory data in various formats
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Complete Inventory</h3>
                    <p className="text-sm text-muted-foreground">
                      Export all cargo items with detailed metadata
                    </p>
                  </div>
                  <Button onClick={handleDownloadData}>
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Storage Locations</h3>
                    <p className="text-sm text-muted-foreground">
                      Export current storage map by module and location
                    </p>
                  </div>
                  <Button variant="outline">
                    Export CSV
                  </Button>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Waste Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Export waste inventory ready for return
                    </p>
                  </div>
                  <Button variant="outline">
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-2">Export History</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p>complete_inventory_2025-04-01.csv</p>
                    <p className="text-xs text-muted-foreground">2025-04-01 14:23:15</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p>waste_manifest_2025-03-25.csv</p>
                    <p className="text-xs text-muted-foreground">2025-03-25 09:15:42</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p>storage_locations_2025-03-15.csv</p>
                    <p className="text-xs text-muted-foreground">2025-03-15 18:07:33</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <FileDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Import Format Documentation</CardTitle>
          <CardDescription>Guidelines for preparing your CSV files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Required CSV Format</h3>
              <p className="text-muted-foreground mb-2">
                Your CSV file must include the following columns in the exact order shown:
              </p>
              <div className="bg-muted/30 p-3 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  item_id,name,type,weight_kg,dimensions_cm,priority,access_frequency,current_module,current_section,hazardous,expiry_date
                </code>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Column Descriptions</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>item_id:</strong> <span className="text-muted-foreground">Unique identifier for the item</span></li>
                  <li><strong>name:</strong> <span className="text-muted-foreground">Descriptive name of the item</span></li>
                  <li><strong>type:</strong> <span className="text-muted-foreground">Item category (food, medical, etc.)</span></li>
                  <li><strong>weight_kg:</strong> <span className="text-muted-foreground">Weight in kilograms</span></li>
                  <li><strong>dimensions_cm:</strong> <span className="text-muted-foreground">Format: LxWxH</span></li>
                  <li><strong>priority:</strong> <span className="text-muted-foreground">high, medium, low</span></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">More Columns</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>access_frequency:</strong> <span className="text-muted-foreground">high, medium, low</span></li>
                  <li><strong>current_module:</strong> <span className="text-muted-foreground">ISS module name</span></li>
                  <li><strong>current_section:</strong> <span className="text-muted-foreground">Section identifier</span></li>
                  <li><strong>hazardous:</strong> <span className="text-muted-foreground">yes or no</span></li>
                  <li><strong>expiry_date:</strong> <span className="text-muted-foreground">YYYY-MM-DD (if applicable)</span></li>
                </ul>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                For bulk imports, we recommend downloading our template and filling in your data.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportExport;
