
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Flag, Tag, Clock, CheckSquare } from 'lucide-react';
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

const statusColors = {
  'done': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
  'todo': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-300',
};

const statusBg = {
  'done': 'bg-green-50 dark:bg-green-900/80',
  'in-progress': 'bg-blue-50 dark:bg-blue-900/80',
  'todo': 'bg-gray-50 dark:bg-gray-900/80',
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'done':
      return <CheckSquare className="w-3 h-3 mr-1" />;
    case 'in-progress':
      return <Clock className="w-3 h-3 mr-1" />;
    default:
      return <Flag className="w-3 h-3 mr-1" />;
  }
};

function TaskNode({ data }: TaskNodeProps) {
  return (
    <div className={cn(
      'p-3 rounded-md border-2 shadow-lg w-64',
      'transition-all duration-300 hover:shadow-xl hover:scale-105',
      statusBg[data.status] || statusBg['todo'],
      // Add celebration glow for completed tasks
      data.status === 'done' && 'ring-2 ring-green-400 ring-opacity-50 animate-pulse',
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 rounded-full bg-blue-500" />
      
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-medium text-sm flex-1 line-clamp-2">
          {data.title}
        </h3>
        <div className="flex gap-1">
          <Badge 
            variant="outline"
            className={cn(
              'text-xs px-2 transition-all duration-200',
              statusColors[data.status],
              data.status === 'done' && 'animate-bounce'
            )}
          >
            {getStatusIcon(data.status)}
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
