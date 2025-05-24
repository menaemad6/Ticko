
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/types/task';
import { Calendar, Clock, Flag, Tag, Edit, Trash2, MapPin, User } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';

interface NodeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export default function NodeDetail({ isOpen, onClose, task, onEdit }: NodeDetailProps) {
  const { deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!task) return null;

  const handleEdit = () => {
    onEdit?.(task);
    onClose();
  };

  const handleDelete = async () => {
    if (!task) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      toast.success('Task deleted successfully');
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getNodeTypeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'milestone':
        return '🎯';
      case 'note':
        return '📝';
      default:
        return '✅';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{getNodeTypeIcon(task.nodeType)}</div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {task.title}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={`${getStatusColor(task.status)} font-medium`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {task.status.replace('-', ' ')}
                  </Badge>
                  <Badge className={`${getPriorityColor(task.priority)} font-medium`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority} priority
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {task.nodeType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {task.description || 'No description provided'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Due Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Due Date</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No due date set'}
              </p>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Position</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                x: {Math.round(task.position.x)}, y: {Math.round(task.position.y)}
              </p>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2 pl-6">
                {task.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Connections */}
          {task.connections && task.connections.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Connected Tasks</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 pl-6">
                {task.connections.length} connection(s)
              </p>
            </div>
          )}

          <Separator />

          {/* Timestamps */}
          <div className="space-y-2 text-xs text-gray-500 dark:text-gray-500">
            <div className="flex justify-between">
              <span>Created:</span>
              <span>{new Date(task.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span>{new Date(task.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
