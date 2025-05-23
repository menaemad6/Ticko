
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { StickyNote } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface NoteNodeProps {
  data: Task;
}

function NoteNode({ data }: NoteNodeProps) {
  return (
    <div className={cn(
      'p-3 rounded-md border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-700',
      'shadow-lg min-w-40 max-w-60 transition-shadow hover:shadow-xl',
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-amber-500" />
      
      <div className="flex items-center gap-2 mb-1">
        <StickyNote className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        <h3 className="font-medium text-sm">{data.title}</h3>
      </div>
      
      {data.description && (
        <div className="bg-amber-100/50 dark:bg-amber-900/30 p-2 rounded text-xs mt-1 border border-amber-200 dark:border-amber-800/50">
          {data.description}
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-amber-500" />
    </div>
  );
}

export default NoteNode;
