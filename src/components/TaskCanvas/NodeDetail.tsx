
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { Calendar, Flag, Tag, Edit, Trash2, CheckSquare, Bot, Sparkles, Trophy, Star, Zap } from 'lucide-react';
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
  const [isFinishing, setIsFinishing] = useState(false);

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
      setIsFinishing(true);
      
      // Add a small delay for better UX
      setTimeout(async () => {
        setLocalTask({ ...localTask, status: 'done' });
        await updateTask(localTask.id, { ...localTask, status: 'done' });
        celebrate('task-complete');
        setIsFinishing(false);
        
        // Close modal after celebration
        setTimeout(() => {
          onClose();
        }, 1500);
      }, 800);
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
      <DialogContent className={`w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-3xl border-0 p-0 m-2 sm:m-4 ${getStatusBg(localTask.status)}`}>
        <DialogHeader className="space-y-4 sm:space-y-6 pt-4 sm:pt-8">
          <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-8 pb-0">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center flex-shrink-0">
                  <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight break-words">
                    {task.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Select value={localTask.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className={`w-28 sm:w-32 ${getStatusColor(localTask.status)} font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-blue-400`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={localTask.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger className={`w-28 sm:w-32 ${getPriorityColor(localTask.priority)} font-semibold px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-red-400`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="capitalize px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                      {localTask.nodeType}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="hover:bg-blue-50 hover:border-blue-300 shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 flex-1 sm:flex-none"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">Edit</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600 shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 flex-1 sm:flex-none"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm">{isDeleting ? 'Deleting...' : 'Delete'}</span>
                </Button>
              </div>
            </div>

            {/* Modern Finish Button - Only show if task is not done */}
            {localTask.status !== 'done' && (
              <div className="flex justify-center relative">
                <div className="relative group">
                  {/* Animated background elements */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl blur-sm opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-700"></div>
                  
                  <Button
                    onClick={handleFinish}
                    disabled={isFinishing}
                    className={`
                      relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
                      hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 
                      text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-2xl 
                      shadow-2xl transform transition-all duration-300 
                      text-sm sm:text-lg border-0 overflow-hidden
                      ${isFinishing ? 'scale-110 animate-pulse' : 'hover:scale-105 active:scale-95'}
                    `}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      <div className="absolute top-2 left-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
                      <div className="absolute top-6 right-6 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-3 left-8 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                      {isFinishing ? (
                        <>
                          <div className="flex space-x-1">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" style={{ animationDelay: '0.5s' }} />
                          </div>
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                          <span>Complete Task</span>
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 px-4 sm:px-8 pb-4 sm:pb-8">
          {/* AI Help Section */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100 dark:border-purple-800 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Get AI Help</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Let AI assist you with this task</p>
                </div>
              </div>
              <Button
                onClick={handleAIHelp}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
              >
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="text-sm sm:text-base">Ask AI</span>
              </Button>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-800">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 flex items-center justify-between">
              Description
              {!editingDescription ? (
                <Button size="icon" variant="ghost" className="rounded-lg sm:rounded-xl h-8 w-8 sm:h-10 sm:w-10" onClick={() => { setEditingDescription(true); setDescValue(task.description || ''); }}>
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              ) : null}
            </h4>
            {!editingDescription ? (
              <p className="text-sm sm:text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                {localTask.description || 'No description provided'}
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                <textarea
                  className="w-full rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4 text-sm sm:text-base md:text-lg text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 resize-none min-h-[80px] sm:min-h-[100px]"
                  value={descValue}
                  onChange={e => setDescValue(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-2 sm:gap-3 justify-end">
                  <Button onClick={handleDescriptionSave} className="rounded-lg sm:rounded-xl text-sm sm:text-base px-4 sm:px-6">
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingDescription(false)} className="rounded-lg sm:rounded-xl text-sm sm:text-base px-4 sm:px-6">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3 sm:gap-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-900 shadow-lg backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-800 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm sm:text-base md:text-lg block">Due Date</span>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
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
            <div className="bg-purple-50 dark:bg-purple-950/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-100 dark:border-purple-900 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-800 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-lg">Tags</h4>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {task.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium break-words"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      
      {/* Custom styles for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Dialog>
  );
}
