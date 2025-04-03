
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getMockIssOccupancy } from '@/services/api';

interface ModuleData {
  name: string;
  id: string;
  occupancy: number;
  warning: boolean;
}

const ISSCrossSection = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const issData = getMockIssOccupancy();

  // Helper function to determine color based on occupancy level
  const getOccupancyColor = (percentage: number) => {
    if (percentage > 85) return 'bg-space-warning text-black';
    if (percentage > 70) return 'bg-amber-400 text-black';
    return 'bg-space-success text-white';
  };

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">ISS Cross Section</h2>
        <p className="text-muted-foreground">Interactive visualization of module occupancy</p>
      </div>
      
      <div className="relative w-full h-[500px] bg-black/30 rounded-xl overflow-hidden border border-accent p-4">
        {/* SVG cross-section of ISS */}
        <svg 
          viewBox="0 0 1000 400" 
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0px 0px 10px rgba(155, 135, 245, 0.3))' }}
        >
          {/* Main truss structure */}
          <line x1="100" y1="200" x2="900" y2="200" stroke="hsl(var(--primary))" strokeWidth="8" />
          
          {/* Solar panels */}
          <g className="animate-pulse-glow">
            <rect x="100" y="80" width="120" height="40" fill="#525252" />
            <rect x="100" y="280" width="120" height="40" fill="#525252" />
            <rect x="780" y="80" width="120" height="40" fill="#525252" />
            <rect x="780" y="280" width="120" height="40" fill="#525252" />
          </g>
          
          {/* Draw modules with occupancy coloring */}
          {issData.modules.map((module, index) => {
            // Calculate positions
            const moduleWidth = 70;
            const moduleHeight = 40;
            const startX = 200 + index * 80;
            const isTop = index % 2 === 0;
            const y = isTop ? 160 : 200;
            const fill = module.warning ? 'url(#warningPattern)' : 'hsl(var(--secondary))';
            
            return (
              <g key={module.id} onClick={() => setSelectedModule(module)} className="cursor-pointer hover:opacity-80 transition-opacity">
                <rect 
                  x={startX} 
                  y={y} 
                  width={moduleWidth} 
                  height={moduleHeight} 
                  fill={fill}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  rx="5"
                  className="interactive-element"
                />
                <text 
                  x={startX + moduleWidth/2} 
                  y={y + moduleHeight/2} 
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize="12"
                >{module.name}</text>
                <circle 
                  cx={startX + moduleWidth - 10} 
                  cy={y + 10} 
                  r="5" 
                  fill={module.warning ? '#F97316' : '#10B981'} 
                />
              </g>
            );
          })}
          
          {/* Warning pattern definition */}
          <defs>
            <pattern id="warningPattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
              <rect width="10" height="10" fill="hsl(var(--secondary))" />
              <line x1="0" y1="0" x2="10" y2="10" stroke="rgba(249, 115, 22, 0.5)" strokeWidth="2" />
            </pattern>
          </defs>
        </svg>
        
        {/* Module info overlay when selected */}
        {selectedModule && (
          <div className="absolute bottom-4 right-4 w-80 bg-card p-4 rounded-lg border border-border animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">{selectedModule.name} Module</h3>
              <button 
                onClick={() => setSelectedModule(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Occupancy</span>
                  <span className={selectedModule.occupancy > 85 ? 'text-space-warning' : ''}>
                    {selectedModule.occupancy}%
                  </span>
                </div>
                <Progress value={selectedModule.occupancy} className="h-2" />
              </div>
              
              <div className="text-sm">
                <p className={selectedModule.warning ? 'text-space-warning font-medium' : ''}>
                  {selectedModule.warning 
                    ? 'Warning: This module requires attention'
                    : 'Status: Normal operations'}
                </p>
              </div>
              
              <div className="pt-2">
                <button className="text-sm text-primary hover:underline">
                  View detailed storage map
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Overall station metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm text-muted-foreground mb-1">Overall Occupancy</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{issData.overall.occupancy}%</span>
            <Progress value={issData.overall.occupancy} className="h-3 w-2/3" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm text-muted-foreground mb-1">Storage Efficiency</h3>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{issData.overall.efficiency}%</span>
            <Progress value={issData.overall.efficiency} className="h-3 w-2/3" />
          </div>
        </div>
        
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm text-muted-foreground mb-1">Active Warnings</h3>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold">{issData.overall.warnings}</span>
            <span className={`text-sm ${issData.overall.warnings > 0 ? 'text-space-warning' : 'text-space-success'}`}>
              {issData.overall.warnings > 0 
                ? 'Modules need attention'
                : 'All systems normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ISSCrossSection;
