
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { format, startOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export function WeeklyCalendarView() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { tasks } = useTasks();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(parseISO(task.dueDate), day)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'todo':
        return 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityLeftBorder = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-orange-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Weekly Calendar</h2>
          <p className="text-muted-foreground mt-1">
            {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentWeek(new Date())}
            className="px-4"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button asChild>
            <Link to="/canvas">
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Link>
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Week Header */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-4 text-sm font-medium text-muted-foreground bg-muted/50">
              Time
            </div>
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="p-4 text-center border-l">
                <div className="text-sm font-medium">
                  {format(day, 'EEE')}
                </div>
                <div className={`text-2xl font-bold mt-1 ${
                  isSameDay(day, new Date()) 
                    ? 'text-primary' 
                    : 'text-foreground'
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b min-h-[80px]">
                <div className="p-3 text-sm text-muted-foreground bg-muted/30 border-r flex items-start">
                  {time}
                </div>
                {weekDays.map((day) => {
                  const dayTasks = getTasksForDay(day);
                  return (
                    <div key={`${day.toISOString()}-${time}`} className="p-2 border-l relative min-h-[80px]">
                      {/* Show tasks on the first time slot only */}
                      {time === '07:00' && dayTasks.map((task, index) => (
                        <div
                          key={task.id}
                          className={`
                            mb-1 p-2 rounded-md text-xs border-l-4 cursor-pointer
                            ${getStatusColor(task.status)}
                            ${getPriorityLeftBorder(task.priority)}
                            hover:shadow-sm transition-shadow
                          `}
                          style={{ 
                            marginTop: index * 2,
                            zIndex: index + 1 
                          }}
                        >
                          <div className="font-medium truncate">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-muted-foreground truncate mt-1">
                              {task.description}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Legend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500/20 border border-green-500/30 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded"></div>
              <span className="text-sm">In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500/20 border border-orange-500/30 rounded"></div>
              <span className="text-sm">To Do</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-l-4 border-l-red-500 bg-muted rounded"></div>
              <span className="text-sm">High Priority</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
