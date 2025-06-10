
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { Calendar, Flag, Tag, Edit, Trash2, CheckSquare, Bot, Sparkles, Trophy } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Milestone as MilestoneIcon, StickyNote } from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';

interface NodeDetailProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit?: (task: Task) => void;
  onGetAIHelp?: (task: Task) => void;
}

export default function NodeDetail({ isOpen, onClose, task, onEdit, onGetAIHelp }: NodeDetailProps) {
  const { deleteTask, updateTask } = useTasks();
  const { celebrate } = useCelebration();
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

  const handleAIHelp = () => {
    onGetAIHelp?.(task);
    onClose();
  };

  const handleFinish = async () => {
    if (localTask.status !== 'done') {
      setLocalTask({ ...localTask, status: 'done' });
      await updateTask(localTask.id, { ...localTask, status: 'done' });
      celebrate('task-complete');
    }
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/20 dark:via-green-950/20 dark:to-teal-950/20';
      case 'in-progress':
        return 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20';
      default:
        return 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20';
    }
  };

  const handleStatusChange = async (value: string) => {
    if (value === 'todo' || value === 'in-progress' || value === 'done') {
      if (value !== localTask.status) {
        setLocalTask({ ...localTask, status: value });
        updateTask(localTask.id, { ...localTask, status: value });
      }
    }
  };

  const handlePriorityChange = async (value: string) => {
    if (value === 'low' || value === 'medium' || value === 'high') {
      if (value !== localTask.priority) {
        setLocalTask({ ...localTask, priority: value });
        updateTask(localTask.id, { ...localTask, priority: value });
      }
    }
  };

  const handleDescriptionSave = async () => {
    if (descValue !== localTask.description) {
      setLocalTask({ ...localTask, description: descValue });
      updateTask(localTask.id, { ...localTask, description: descValue });
    }
    setEditingDescription(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl shadow-2xl rounded-3xl border-0 p-0 ${getStatusBg(localTask.status)}`}>
        <DialogHeader className="space-y-6 pt-8">
          <div className="flex flex-col gap-6 p-8 pb-0">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
                  <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                    {task.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <Select value={localTask.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className={`w-32 ${getStatusColor(localTask.status)} font-semibold px-4 py-2 text-sm rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-blue-400`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={localTask.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger className={`w-32 ${getPriorityColor(localTask.priority)} font-semibold px-4 py-2 text-sm rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-red-400`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="capitalize px-4 py-2 text-sm rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                      {localTask.nodeType}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="hover:bg-blue-50 hover:border-blue-300 shadow-lg rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-lg rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>

            {/* Finish Button - Only show if task is not done */}
            {localTask.status !== 'done' && (
              <div className="flex justify-center">
                <Button
                  onClick={handleFinish}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-12 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Trophy className="w-6 h-6 mr-3" />
                  Finish Task
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 px-8 pb-8">
          {/* AI Help Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl p-6 border border-purple-100 dark:border-purple-800 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">Get AI Help</h4>
                  <p className="text-gray-600 dark:text-gray-300">Let AI assist you with this task</p>
                </div>
              </div>
              <Button
                onClick={handleAIHelp}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Bot className="w-5 h-5 mr-2" />
                Ask AI
              </Button>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-2xl p-6 shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-800">
            <h4 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center justify-between">
              Description
              {!editingDescription ? (
                <Button size="icon" variant="ghost" className="rounded-xl" onClick={() => { setEditingDescription(true); setDescValue(task.description || ''); }}>
                  <Edit className="w-4 h-4" />
                </Button>
              ) : null}
            </h4>
            {!editingDescription ? (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {localTask.description || 'No description provided'}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <textarea
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 resize-none min-h-[100px] text-lg"
                  value={descValue}
                  onChange={e => setDescValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3 justify-end">
                  <Button onClick={handleDescriptionSave} className="rounded-xl">
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)} className="rounded-xl">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-950/40 rounded-2xl p-6 border border-blue-100 dark:border-blue-900 shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-lg">Due Date</span>
              <p className="text-gray-600 dark:text-gray-300">
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'No due date set'}
              </p>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="bg-purple-50 dark:bg-purple-950/40 rounded-2xl p-6 border border-purple-100 dark:border-purple-900 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-xl flex items-center justify-center">
                  <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-lg">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {task.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
