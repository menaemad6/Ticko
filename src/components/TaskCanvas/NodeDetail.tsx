import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Task } from '@/types/task';
import { Calendar, Clock, Flag, Tag, Edit, Trash2, MapPin, User } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, Milestone as MilestoneIcon, StickyNote } from 'lucide-react';

interface NodeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
}

export default function NodeDetail({ isOpen, onClose, task, onEdit }: NodeDetailProps) {
  const { deleteTask, updateTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descValue, setDescValue] = useState(task?.description || '');
  const [localTask, setLocalTask] = useState(task || undefined);

  useEffect(() => { setLocalTask(task || undefined); }, [task]);

  if (!task || !localTask) return null;

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
        return <MilestoneIcon className="w-7 h-7 text-purple-600 dark:text-purple-400" />;
      case 'note':
        return <StickyNote className="w-7 h-7 text-amber-500 dark:text-amber-400" />;
      default:
        return <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />;
    }
  };

  // Inline status update
  const handleStatusChange = async (value: string) => {
    if (value !== localTask.status) {
      setLocalTask({ ...localTask, status: value });
      updateTask(localTask.id, { ...localTask, status: value });
    }
  };

  // Inline priority update
  const handlePriorityChange = async (value: string) => {
    if (value !== localTask.priority) {
      setLocalTask({ ...localTask, priority: value });
      updateTask(localTask.id, { ...localTask, priority: value });
    }
  };

  // Inline description update
  const handleDescriptionSave = async () => {
    if (descValue !== localTask.description) {
      setLocalTask({ ...localTask, description: descValue });
      updateTask(localTask.id, { ...localTask, description: descValue });
    }
    setEditingDescription(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl border-0 p-0 md:p-0">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between p-6 pb-0">
            <div className="flex items-center gap-4 flex-1">
              <div className="drop-shadow-lg select-none flex items-center justify-center">
                {getNodeTypeIcon(task.nodeType)}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {task.title}
                </DialogTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Status Select */}
                  <Select value={localTask.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className={`w-[120px] ${getStatusColor(localTask.status)} font-semibold px-3 py-1 text-xs rounded-full shadow-sm uppercase tracking-wide border-none focus:ring-2 focus:ring-blue-400`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* Priority Select */}
                  <Select value={localTask.priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger className={`w-[120px] ${getPriorityColor(localTask.priority)} font-semibold px-3 py-1 text-xs rounded-full shadow-sm uppercase tracking-wide border-none focus:ring-2 focus:ring-red-400`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="capitalize px-3 py-1 text-xs rounded-full border-gray-300 dark:border-gray-700">
                    {localTask.nodeType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="hover:bg-blue-50 hover:border-blue-300 shadow-md"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-2 pb-4 sm:px-6 sm:pb-6">
          {/* Description Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-3 sm:p-4 shadow border border-gray-100 dark:border-gray-800 relative">
            <h4 className="text-base font-semibold mb-2 text-gray-800 dark:text-gray-200 tracking-tight flex items-center justify-between">
              Description
              {!editingDescription ? (
                <Button size="icon" variant="ghost" className="ml-2" onClick={() => { setEditingDescription(true); setDescValue(task.description || ''); }}>
                  <Edit className="w-4 h-4" />
                </Button>
              ) : null}
            </h4>
            {!editingDescription ? (
              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {localTask.description || 'No description provided'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-base text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 resize-none min-h-[80px]"
                  value={descValue}
                  onChange={e => setDescValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" onClick={handleDescriptionSave}>
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingDescription(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl p-4 border border-blue-100 dark:border-blue-900 shadow-sm">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Due Date:</span>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'No due date set'}
            </span>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
