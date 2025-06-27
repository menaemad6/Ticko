
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TasksView() {
  const { tasks } = useTasks();

  const taskColumns = [
    {
      status: 'todo' as const,
      title: 'To Do',
      icon: AlertCircle,
      color: 'border-red-500/30 bg-red-500/5',
      badgeColor: 'bg-red-500/20 text-red-200 border-red-500/30',
    },
    {
      status: 'in-progress' as const,
      title: 'In Progress',
      icon: Clock,
      color: 'border-yellow-500/30 bg-yellow-500/5',
      badgeColor: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
    },
    {
      status: 'done' as const,
      title: 'Done',
      icon: CheckCircle,
      color: 'border-green-500/30 bg-green-500/5',
      badgeColor: 'bg-green-500/20 text-green-200 border-green-500/30',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-200 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-200 border-green-500/30';
      default:
        return 'bg-purple-500/20 text-purple-200 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">All Tasks</h2>
          <p className="text-purple-200">Manage and organize your tasks</p>
        </div>
        <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Link to="/canvas">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {taskColumns.map((column) => {
          const columnTasks = tasks.filter(task => task.status === column.status);
          const Icon = column.icon;
          
          return (
            <Card key={column.status} className={`bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl ${column.color}`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Icon className="w-5 h-5" />
                  <span>{column.title}</span>
                  <Badge className={column.badgeColor}>
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {columnTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Icon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No {column.title.toLowerCase()} tasks</p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div 
                      key={task.id}
                      className="p-4 rounded-lg bg-slate-800/50 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white text-sm">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <p className="text-purple-300 text-xs mb-2">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs bg-purple-800/20 border-purple-600/30 text-purple-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs bg-purple-800/20 border-purple-600/30 text-purple-200"
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
