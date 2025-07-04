
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTasks } from '@/hooks/useTasks';
import { CheckCircle, Clock, AlertCircle, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TaskForm } from '@/components/TaskForm';
import { Task } from '@/types/task';

export function TasksView() {
  const { tasks, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const taskColumns = [
    {
      status: 'todo' as const,
      title: 'To Do',
      icon: AlertCircle,
      color: 'border-red-200/50 bg-red-50/50 dark:border-red-800/50 dark:bg-red-900/10',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      headerColor: 'bg-red-50/50 dark:bg-red-900/20',
    },
    {
      status: 'in-progress' as const,
      title: 'In Progress',
      icon: Clock,
      color: 'border-orange-200/50 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-900/10',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
      headerColor: 'bg-orange-50/50 dark:bg-orange-900/20',
    },
    {
      status: 'done' as const,
      title: 'Done',
      icon: CheckCircle,
      color: 'border-green-200/50 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/10',
      badgeColor: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      headerColor: 'bg-green-50/50 dark:bg-green-900/20',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      default:
        return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800';
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus });
    }
    setDraggedTask(null);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: any) => {
    if (selectedTask) {
      updateTask(selectedTask.id, taskData);
    }
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Task Management
          </h2>
          <p className="text-muted-foreground mt-1">Organize and track your tasks across different stages</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-border hover:bg-accent">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
            <Link to="/canvas">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {taskColumns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.status);
          const Icon = column.icon;
          
          return (
            <Card key={column.status} className={`bg-card border-border shadow-lg ${column.color}`}>
              <CardHeader className={`${column.headerColor} border-b border-border`}>
                <CardTitle className="text-foreground flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <span className="text-lg font-bold">{column.title}</span>
                  </div>
                  <Badge variant="outline" className={column.badgeColor}>
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent 
                className="p-4 space-y-3 max-h-96 overflow-y-auto"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.status)}
              >
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-medium mb-1">No {column.title.toLowerCase()} tasks</p>
                    <p className="text-xs">Tasks will appear here</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onClick={() => handleTaskClick(task)}
                      className={`p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-200 cursor-pointer group ${
                        draggedTask?.id === task.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <p className="text-primary text-xs mb-3 font-medium">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs bg-muted text-muted-foreground border-border"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-muted text-muted-foreground border-border"
                            >
                              +{task.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Task Detail Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="max-w-2xl">
          <TaskForm
            isOpen={isTaskModalOpen}
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedTask(null);
            }}
            onSave={handleTaskSave}
            task={selectedTask}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
