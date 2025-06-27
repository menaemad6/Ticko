
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { CheckCircle, Clock, AlertCircle, Plus, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TasksView() {
  const { tasks } = useTasks();

  const taskColumns = [
    {
      status: 'todo' as const,
      title: 'To Do',
      icon: AlertCircle,
      color: 'border-red-200/50 bg-gradient-to-br from-red-50/50 to-red-100/30',
      badgeColor: 'bg-red-100 text-red-700 border-red-200',
      headerColor: 'bg-gradient-to-r from-red-50 to-red-100/50',
    },
    {
      status: 'in-progress' as const,
      title: 'In Progress',
      icon: Clock,
      color: 'border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-orange-100/30',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
      headerColor: 'bg-gradient-to-r from-orange-50 to-orange-100/50',
    },
    {
      status: 'done' as const,
      title: 'Done',
      icon: CheckCircle,
      color: 'border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-100/30',
      badgeColor: 'bg-green-100 text-green-700 border-green-200',
      headerColor: 'bg-gradient-to-r from-green-50 to-green-100/50',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-purple-600 bg-clip-text text-transparent">
            Task Management
          </h2>
          <p className="text-slate-600 mt-1">Organize and track your tasks across different stages</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="border-slate-300 hover:bg-slate-50 hover:border-slate-400"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
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
            <Card key={column.status} className={`bg-white/80 backdrop-blur-sm border-slate-200/50 shadow-xl shadow-purple-100/50 rounded-2xl overflow-hidden ${column.color}`}>
              <CardHeader className={`${column.headerColor} border-b border-slate-200/50`}>
                <CardTitle className="text-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <span className="text-lg font-bold">{column.title}</span>
                  </div>
                  <Badge variant="outline" className={column.badgeColor}>
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-medium mb-1">No {column.title.toLowerCase()} tasks</p>
                    <p className="text-xs">Tasks will appear here</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/50 hover:shadow-md hover:bg-white/80 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-purple-600 transition-colors">
                          {task.title}
                        </h4>
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-slate-600 text-xs mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <p className="text-purple-600 text-xs mb-3 font-medium">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs bg-purple-50 border-purple-200 text-purple-700"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-slate-50 border-slate-200 text-slate-600"
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
    </div>
  );
}
