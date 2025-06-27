
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/types/task';
import { format, isSameDay, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  tasks: Task[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get tasks for the selected date
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      try {
        const taskDate = parseISO(task.dueDate);
        return isSameDay(taskDate, date);
      } catch {
        return false;
      }
    });
  };

  // Get dates that have tasks
  const getDatesWithTasks = () => {
    const dates = new Set<string>();
    tasks.forEach(task => {
      if (task.dueDate) {
        try {
          const taskDate = parseISO(task.dueDate);
          dates.add(format(taskDate, 'yyyy-MM-dd'));
        } catch {
          // Ignore invalid dates
        }
      }
    });
    return dates;
  };

  const datesWithTasks = getDatesWithTasks();
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-500/10 text-green-700 border-green-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'todo':
        return <Circle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Calendar Section */}
      <div className="w-1/2 p-6 border-r border-border">
        <div className="h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Calendar</h2>
            <p className="text-sm text-muted-foreground">
              Select a date to view tasks scheduled for that day
            </p>
          </div>
          
          <div className="flex-1 flex items-start justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
              modifiers={{
                hasTask: (date) => datesWithTasks.has(format(date, 'yyyy-MM-dd'))
              }}
              modifiersStyles={{
                hasTask: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  color: 'hsl(var(--primary))',
                  fontWeight: 'bold',
                  position: 'relative',
                }
              }}
            />
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-primary/20 border-2 border-primary/40"></div>
              <span>Dates with tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="w-1/2 p-6 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Tasks for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>

        <div className="flex-1 overflow-auto">
          {selectedDateTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Calendar className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No tasks scheduled</h3>
              <p className="text-sm text-center">
                {selectedDate ? 'No tasks are scheduled for this date.' : 'Select a date to view tasks.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(task.status)}
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                    </div>
                    <Badge className={cn("text-xs", getPriorityColor(task.priority))}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {task.status.replace('-', ' ')}
                      </Badge>
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {task.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {task.dueDate && (
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(parseISO(task.dueDate), 'h:mm a')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
