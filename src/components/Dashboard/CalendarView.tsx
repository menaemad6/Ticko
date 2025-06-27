
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTasks } from '@/hooks/useTasks';
import { format, isSameDay, parseISO } from 'date-fns';
import { CalendarDays, Clock, CheckCircle } from 'lucide-react';

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks } = useTasks();

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate)
  );

  // Get dates that have tasks
  const datesWithTasks = tasks
    .filter(task => task.dueDate)
    .map(task => parseISO(task.dueDate!));

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <CalendarDays className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Calendar */}
      <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <CalendarDays className="w-5 h-5" />
            <span>Task Calendar</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full bg-slate-900/30 rounded-lg border border-purple-800/30 text-white pointer-events-auto"
            modifiers={{
              hasTasks: datesWithTasks,
            }}
            modifiersStyles={{
              hasTasks: {
                backgroundColor: 'rgba(147, 51, 234, 0.3)',
                color: 'white',
                fontWeight: 'bold',
              },
            }}
          />
        </CardContent>
      </Card>

      {/* Tasks for Selected Date */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-purple-800/20 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">
            Tasks for {format(selectedDate, 'MMM dd, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-400">No tasks scheduled for this date</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasksForSelectedDate.map((task) => (
                <div 
                  key={task.id}
                  className="p-4 rounded-lg bg-slate-800/50 border border-purple-700/30 hover:border-purple-600/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <h4 className="font-medium text-white text-sm">{task.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className="text-xs bg-purple-800/20 border-purple-600/30 text-purple-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
