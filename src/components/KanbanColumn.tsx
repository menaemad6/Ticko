
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskNode } from './TaskNode';
import { Task, Column } from '@/types/task';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: Task['status']) => void;
  draggedTask: Task | null;
  onTaskClick: (task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  draggedTask,
  onTaskClick,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, column.status);
  };

  const isDropZoneActive = draggedTask && draggedTask.status !== column.status;

  return (
    <Card className="flex-1 min-h-96 bg-gray-50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {column.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className="bg-white text-gray-600 border"
          >
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent
        className={cn(
          'space-y-3 min-h-80 transition-all duration-200',
          isDropZoneActive && 'bg-blue-50 border-2 border-dashed border-blue-300'
        )}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isDropZoneActive && (
          <div className="flex items-center justify-center py-8 text-blue-600 font-medium">
            Drop task here to move to {column.title}
          </div>
        )}
        
        {tasks.map((task) => (
          <TaskNode
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggedTask?.id === task.id}
            onClick={onTaskClick}
          />
        ))}
        
        {tasks.length === 0 && !isDropZoneActive && (
          <div className="flex items-center justify-center py-12 text-gray-400">
            No tasks yet
          </div>
        )}
      </CardContent>
    </Card>
  );
};
