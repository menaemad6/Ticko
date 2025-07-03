import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { Calendar, Flag, Tag, Edit, Trash2, CheckSquare, Bot, Sparkles, Trophy, Star, Zap, X } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCelebration } from '@/hooks/useCelebration';
import './sidebar-scrollbar.css';

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
      <DialogContent className={`w-[95vw] max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl max-h-[98vh] sm:max-h-[90vh] overflow-hidden backdrop-blur-xl shadow-2xl rounded-xl sm:rounded-2xl md:rounded-3xl border-0 p-0 m-1 sm:m-4 ${getStatusBg(localTask.status)}`}>
        <div className="flex flex-col h-full max-h-[98vh] sm:max-h-[90vh]">
          {/* Mobile-friendly header with close button */}
          <DialogHeader className="space-y-3 sm:space-y-4 md:space-y-6 pt-3 sm:pt-6 md:pt-8 px-3 sm:px-6 md:px-8 flex-shrink-0 relative">
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-accent"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
              <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 w-full">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-2xl bg-sidebar-primary/10 dark:bg-sidebar-primary/20 backdrop-blur-sm shadow-lg flex items-center justify-center flex-shrink-0 border border-sidebar-border">
                  <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-sidebar-foreground mb-2 sm:mb-3 leading-tight break-words pr-8 sm:pr-0">
                    {task.title}
                  </DialogTitle>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3">
                    <Select value={localTask.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className={`w-24 sm:w-28 md:w-32 ${getStatusColor(localTask.status)} font-semibold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-sidebar-primary/50`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={localTask.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger className={`w-24 sm:w-28 md:w-32 ${getPriorityColor(localTask.priority)} font-semibold px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-destructive/50`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="capitalize px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm rounded-lg sm:rounded-xl bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                      {localTask.nodeType}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action buttons - 50% width each on all screen sizes */}
            <div className="flex flex-row gap-2 sm:gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm bg-sidebar-background border-sidebar-border w-1/2"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">Edit</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive shadow-lg rounded-lg sm:rounded-xl backdrop-blur-sm bg-sidebar-background border-sidebar-border w-1/2"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </Button>
            </div>

            {/* Modern Finish Button - Only show if task is not done */}
            {localTask.status !== 'done' && (
              <div className="flex justify-center relative">
                <div className="relative group mt-2 sm:mt-3 mb-4 sm:mb-6">
                  {/* Animated background elements */}
                  <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-sidebar-primary via-blue-500 to-purple-500 rounded-xl sm:rounded-2xl blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500"></div>
                  <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl sm:rounded-2xl blur-sm opacity-30 group-hover:opacity-50 animate-pulse transition-opacity duration-700"></div>
                  
                  <Button
                    onClick={handleFinish}
                    disabled={isFinishing}
                    className={`
                      relative bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 
                      hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 
                      text-white font-bold px-6 sm:px-8 md:px-12 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl 
                      shadow-2xl transform transition-all duration-300 
                      text-sm sm:text-base md:text-lg border-0 overflow-hidden w-full sm:w-auto
                      ${isFinishing ? 'scale-110 animate-pulse' : 'hover:scale-105 active:scale-95'}
                    `}
                  >
                    {/* Shimmer effect using CSS animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_2s_infinite]"></div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
                      <div className="absolute top-1 sm:top-2 left-2 sm:left-4 w-1 h-1 bg-white/40 rounded-full animate-ping"></div>
                      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute bottom-2 sm:bottom-3 left-6 sm:left-8 w-1 h-1 bg-white/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <div className="relative flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
                      {isFinishing ? (
                        <>
                          <div className="flex space-x-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin" />
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-spin" style={{ animationDelay: '0.5s' }} />
                          </div>
                          <span>Completing...</span>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 animate-bounce" />
                          <span>Complete Task</span>
                          <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
                        </>
                      )}
                    </div>
                  </Button>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 mt-6 overflow-y-auto custom-scrollbar space-y-4 sm:space-y-6 md:space-y-8 px-3 sm:px-6 md:px-8 pb-3 sm:pb-6 md:pb-8">
            {/* Enhanced AI Help Section */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br from-sidebar-primary/5 via-blue-500/5 to-purple-500/5 dark:from-sidebar-primary/10 dark:via-blue-500/10 dark:to-purple-500/10 border border-sidebar-border shadow-2xl backdrop-blur-sm">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/5 via-transparent to-blue-500/5 animate-pulse"></div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-sidebar-primary/10 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-xl"></div>
              
              <div className="relative p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
                    {/* Enhanced AI Icon */}
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-sidebar-primary to-blue-500 rounded-xl sm:rounded-2xl blur opacity-75 animate-pulse"></div>
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-sidebar-primary via-blue-500 to-purple-500 rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl sm:rounded-2xl md:rounded-3xl"></div>
                        <Bot className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white relative z-10" />
                        {/* Floating sparkles */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-sidebar-primary to-blue-600 bg-clip-text text-transparent">
                          AI Assistant
                        </h4>
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sidebar-primary animate-pulse" />
                      </div>
                      <p className="text-xs sm:text-sm md:text-base text-sidebar-foreground/80 leading-relaxed">
                        Get intelligent suggestions, task breakdowns, and personalized productivity tips powered by advanced AI
                      </p>
                      
                      {/* Feature highlights */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-sidebar-accent/50 rounded-full text-xs font-medium text-sidebar-accent-foreground">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Smart Analysis
                        </div>
                        <div className="flex items-center gap-1 px-2 sm:px-3 py-1 bg-sidebar-accent/50 rounded-full text-xs font-medium text-sidebar-accent-foreground">
                          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          Instant Help
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <div className="relative w-full">
                    <div className="absolute -inset-1 bg-gradient-to-r from-sidebar-primary via-blue-500 to-purple-500 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    <Button
                      onClick={handleAIHelp}
                      className="relative w-full bg-gradient-to-r from-sidebar-primary via-blue-500 to-purple-500 hover:from-sidebar-primary/90 hover:via-blue-600 hover:to-purple-600 text-white font-bold px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border-0 overflow-hidden group"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-[shimmer_3s_infinite]"></div>
                      
                      <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-xs sm:text-sm md:text-base font-semibold">Get AI Help</span>
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 animate-pulse" />
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-sidebar-accent/30 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg backdrop-blur-sm border border-sidebar-border">
              <h4 className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-sidebar-foreground flex items-center justify-between">
                Description
                {!editingDescription ? (
                  <Button size="icon" variant="ghost" className="rounded-lg sm:rounded-xl h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 hover:bg-sidebar-accent" onClick={() => { setEditingDescription(true); setDescValue(task.description || ''); }}>
                    <Edit className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                  </Button>
                ) : null}
              </h4>
              {!editingDescription ? (
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-sidebar-foreground/80 leading-relaxed break-words">
                  {localTask.description || 'No description provided'}
                </p>
              ) : (
                <div className="flex flex-col gap-2 sm:gap-3">
                  <textarea
                    className="w-full rounded-lg sm:rounded-xl border border-sidebar-border bg-sidebar-background p-2.5 sm:p-3 md:p-4 text-xs sm:text-sm md:text-base lg:text-lg text-sidebar-foreground focus:ring-2 focus:ring-sidebar-primary/50 resize-none min-h-[60px] sm:min-h-[80px] md:min-h-[100px]"
                    value={descValue}
                    onChange={e => setDescValue(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2 sm:gap-3 justify-end">
                    <Button onClick={handleDescriptionSave} className="rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 bg-sidebar-primary hover:bg-sidebar-primary/90">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditingDescription(false)} className="rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 border-sidebar-border hover:bg-sidebar-accent">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 bg-sidebar-accent/30 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-sidebar-border shadow-lg backdrop-blur-sm">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-sidebar-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-sidebar-border">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-sidebar-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-sidebar-foreground text-xs sm:text-sm md:text-base lg:text-lg block">Due Date</span>
                <p className="text-xs sm:text-sm md:text-base text-sidebar-foreground/70 break-words">
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
              <div className="bg-sidebar-accent/30 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 border border-sidebar-border shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-sidebar-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 border border-sidebar-border">
                    <Tag className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-sidebar-primary" />
                  </div>
                  <h4 className="font-semibold text-sidebar-foreground text-xs sm:text-sm md:text-base lg:text-lg">Tags</h4>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
                  {task.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/20 border-sidebar-border px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium break-words"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      
      {/* Custom styles for shimmer animation using Tailwind's arbitrary values */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </Dialog>
  );
}
