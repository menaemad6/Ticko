
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Flag, Tag } from 'lucide-react';

interface NodeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export default function NodeDetail({ isOpen, onClose, task }: NodeDetailProps) {
  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.title}
            <Badge
              variant="outline"
              className={`ml-2 ${
                task.priority === 'high'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : task.priority === 'medium'
                  ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}
            >
              <Flag className="w-3 h-3 mr-1" />
              {task.priority}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {task.description || 'No description provided'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Calendar className="w-4 h-4 mr-1" /> Due Date
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No due date'}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Clock className="w-4 h-4 mr-1" /> Status
              </h4>
              <p className="capitalize text-sm text-gray-600 dark:text-gray-400">
                {task.status.replace('-', ' ')}
              </p>
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1 flex items-center">
                <Tag className="w-4 h-4 mr-1" /> Tags
              </h4>
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
            <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
            <p>Last Updated: {new Date(task.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
