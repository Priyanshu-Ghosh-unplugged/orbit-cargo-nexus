
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { getMockIssOccupancy } from '@/services/api';
import { modulePositions } from './moduleLayout';


interface ModuleData {
  name: string;
  id: string;
  occupancy: number;
  warning: boolean;
}

const ISSCrossSection = () => {
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragged, setDragged] = useState(false);


  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!zoomed) return;
    setIsDragging(true);
    setDragged(false); // reset dragged
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isDragging || !zoomed || !dragStart) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
  
    // Only set dragged true when movement is significant
    if (Math.abs(newX - offset.x) > 2 || Math.abs(newY - offset.y) > 2) {
      setDragged(true);
    }
  
    setOffset({ x: newX, y: newY });
  };
  
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  



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
        <h2 className="text-2xl font-bold mb-2">ISS at a Glance</h2>
        <p className="text-muted-foreground">Interactive visualization of module occupancy</p>
      </div>
      


      <div className="relative w-full h-[500px] bg-black/30 rounded-xl overflow-hidden border border-accent p-4">
        {/* SVG cross-section of ISS */}
        <svg 
          viewBox="0 0 1000 400"
          className="w-full h-full transition-transform duration-500 ease-in-out"
          style={{
            filter: 'drop-shadow(0px 0px 10px rgba(155, 135, 245, 0.3))',
            backgroundImage: "url('/iss_main.png')",
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoomed ? 2 : 1})`,
            transformOrigin: transformOrigin,
            cursor: zoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
          }}
          onClick={(e) => {
            if (dragged) return; // Don't zoom if dragging
          
            if (!zoomed) {
              const rect = e.currentTarget.getBoundingClientRect();
              const offsetX = e.clientX - rect.left;
              const offsetY = e.clientY - rect.top;
              const percentX = (offsetX / rect.width) * 100;
              const percentY = (offsetY / rect.height) * 100;
              setTransformOrigin(`${percentX}% ${percentY}%`);
              setZoomed(true);
            } else {
              setZoomed(false);
              setOffset({ x: 0, y: 0 });
            }
          }}
          
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Main truss structure */}
          {/* <line x1="100" y1="200" x2="900" y2="200" stroke="hsl(var(--primary))" strokeWidth="8" /> */}
          
          {/* Solar panels */}
          {/* <g className="animate-pulse-glow">
            <rect x="100" y="80" width="120" height="40" fill="#525252" />
            <rect x="100" y="280" width="120" height="40" fill="#525252" />
            <rect x="780" y="80" width="120" height="40" fill="#525252" />
            <rect x="780" y="280" width="120" height="40" fill="#525252" />
          </g> */}
          
          {/* Draw modules with occupancy coloring */}
          {issData.modules.map((module, index) => {
            // Calculate positions
            const { x: startX, y, rotate, width, height, fontSize } = modulePositions[module.name] || { x: 0, y: 0 };


            const moduleWidth = width ?? 70;
            const moduleHeight = height ?? 40;

            const fill = module.warning ? 'url(#warningPattern)' : 'hsl(var(--secondary))';

            return (
              <g
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                transform={rotate ? `rotate(90, ${startX + moduleWidth / 2}, ${y + moduleHeight / 2})` : ''}
              >
                <rect
                  x={startX}
                  y={y}
                  width={moduleWidth}
                  height={moduleHeight}
                  fill={fill}
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  rx="5"
                  className="interactive-element"
                />
                <text
                  x={startX + moduleWidth / 2}
                  y={y + moduleHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="white"
                  fontSize={fontSize ?? 12}
                >
                  {module.name}
                </text>
                <circle
                  cx={startX + moduleWidth - 6}
                  cy={y + 10}
                  r="2"
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
