
import React from 'react';
import { Panel } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Minimize, Plus } from 'lucide-react';

interface CustomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAddNode: () => void;
}

const CustomControls: React.FC<CustomControlsProps> = ({ 
  onZoomIn, 
  onZoomOut, 
  onFitView,
  onAddNode
}) => {
  return (
    <Panel position="top-right" className="flex gap-2" data-demo="canvas-controls">
      <Button
        variant="outline"
        size="icon"
        onClick={onAddNode}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
        data-demo="add-task-btn"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onFitView}
        className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
      >
        <Minimize className="h-4 w-4" />
      </Button>
    </Panel>
  );
};

export default CustomControls;
