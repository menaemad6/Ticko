
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Milestone } from 'lucide-react';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MilestoneNodeProps {
  data: Task;
}

function MilestoneNode({ data }: MilestoneNodeProps) {
  return (
    <div className={cn(
      'p-3 rounded-md border-2 shadow-lg',
      'border-purple-400 bg-purple-50 dark:bg-purple-950/50 dark:border-purple-700',
      'w-48 transition-shadow hover:shadow-xl'
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-purple-500" />
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Milestone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-medium text-sm">{data.title}</h3>
        </div>
      </div>
      
      {data.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {data.description}
        </p>
      )}
      
      {data.dueDate && (
        <Badge
          variant="outline"
          className="mt-2 w-full justify-center text-xs border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
        >
          Due {new Date(data.dueDate).toLocaleDateString()}
        </Badge>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-purple-500" />
    </div>
  );
}

export default MilestoneNode;
