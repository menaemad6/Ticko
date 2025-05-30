
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Target, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  Calendar,
  Tag,
  User,
  BarChart3
} from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

interface ProjectAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectAnalyticsModal: React.FC<ProjectAnalyticsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { tasks } = useTasks();

  // Calculate statistics
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Priority breakdown
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low').length;

  // Node type breakdown
  const taskNodes = tasks.filter(task => task.nodeType === 'task').length;
  const milestoneNodes = tasks.filter(task => task.nodeType === 'milestone').length;
  const noteNodes = tasks.filter(task => task.nodeType === 'note').length;

  // Due date analysis
  const today = new Date();
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < today && task.status !== 'done';
  }).length;

  const dueTodayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString() && task.status !== 'done';
  }).length;

  // Tag analysis
  const allTags = tasks.flatMap(task => task.tags || []);
  const uniqueTags = [...new Set(allTags)];
  const tagCount = uniqueTags.length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Project Analytics
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Overview Card */}
          <Card className="col-span-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Project Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
                  <div className="text-sm text-gray-500">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                  <div className="text-sm text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{inProgressTasks}</div>
                  <div className="text-sm text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{todoTasks}</div>
                  <div className="text-sm text-gray-500">To Do</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Completion Rate</span>
                  <span className="text-sm font-bold">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Task Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">To Do</span>
                <Badge variant="secondary">{todoTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Progress</span>
                <Badge variant="default">{inProgressTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Completed</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">{completedTasks}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Priority Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Priority Levels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Priority</span>
                <Badge variant="destructive">{highPriorityTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Priority</span>
                <Badge variant="default">{mediumPriorityTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Priority</span>
                <Badge variant="secondary">{lowPriorityTasks}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Due Date Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Due Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overdue</span>
                <Badge variant="destructive">{overdueTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Due Today</span>
                <Badge variant="default">{dueTodayTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">With Due Dates</span>
                <Badge variant="secondary">
                  {tasks.filter(task => task.dueDate).length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Node Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Node Types
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tasks</span>
                <Badge variant="default">{taskNodes}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Milestones</span>
                <Badge variant="secondary">{milestoneNodes}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notes</span>
                <Badge variant="outline">{noteNodes}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags & Labels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Unique Tags</span>
                <Badge variant="default">{tagCount}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tagged Tasks</span>
                <Badge variant="secondary">
                  {tasks.filter(task => task.tags && task.tags.length > 0).length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Untagged Tasks</span>
                <Badge variant="outline">
                  {tasks.filter(task => !task.tags || task.tags.length === 0).length}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
