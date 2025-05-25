import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flag, Tag } from 'lucide-react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskNodeProps {
  data: Task;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
};

const nodeTypeColors = {
  task: 'border-blue-400 bg-blue-50 dark:bg-blue-950/50 dark:border-blue-700',
  milestone: 'border-purple-400 bg-purple-50 dark:bg-purple-950/50 dark:border-purple-700',
  note: 'border-amber-400 bg-amber-50 dark:bg-amber-950/50 dark:border-amber-700',
};

const statusColors = {
  'done': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  'todo': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300',
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

function TaskNode({ data }: TaskNodeProps) {
  return (
    <div className={cn(
      'p-3 rounded-md border-2 shadow-lg w-64',
      'transition-shadow hover:shadow-xl',
      nodeTypeColors[data.nodeType || 'task'],
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-blue-500" />
      
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-sm flex-1 line-clamp-2">
          {data.title}
        </h3>
        <div className="flex gap-1">
          <Badge 
            variant="outline"
            className={cn('text-xs px-2', statusColors[data.status])}
          >
            <Flag className="w-3 h-3 mr-1" />
            {data.status.replace('-', ' ')}
          </Badge>
        </div>
      </div>
      
      {data.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
          {data.description}
        </p>
      )}
      
      <div className="mt-3 flex flex-wrap gap-2">
        {data.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(data.dueDate)}</span>
          </div>
        )}
        
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-1.5 py-0 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >
                <Tag className="w-2 h-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {data.tags.length > 2 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                +{data.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 rounded-full bg-blue-500" />
    </div>
  );
}

export default TaskNode;
