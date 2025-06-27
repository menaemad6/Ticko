
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/hooks/useTasks';
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { CalendarDays, Clock, CheckCircle, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks } = useTasks();

  // Filter tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate)
  );

  // Get dates that have tasks in the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const datesWithTasks = tasks
    .filter(task => task.dueDate)
    .map(task => parseISO(task.dueDate!))
    .filter(date => date >= monthStart && date <= monthEnd);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <CalendarDays className="w-4 h-4 text-purple-500" />;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Calendar Overview
          </h2>
          <p className="text-muted-foreground mt-1">Manage your schedule and track your tasks</p>
        </div>
        <Button 
          onClick={goToToday}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="xl:col-span-3 bg-card border-border shadow-lg">
          <CardHeader className="bg-muted/50 border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground flex items-center space-x-3">
                <CalendarDays className="w-6 h-6 text-primary" />
                <span className="text-2xl font-bold">
                  {format(currentDate, 'MMMM yyyy')}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="h-10 w-10 rounded-full border-border hover:bg-accent"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="h-10 w-10 rounded-full border-border hover:bg-accent"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentDate}
              onMonthChange={setCurrentDate}
              className="w-full rounded-lg border-0"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-lg font-semibold text-foreground",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-accent rounded-full",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-muted-foreground rounded-md w-12 font-medium text-sm",
                row: "flex w-full mt-2",
                cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-lg transition-colors",
                day_range_end: "day-range-end",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary shadow-lg",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              modifiers={{
                hasTasks: datesWithTasks,
              }}
            />
          </CardContent>
        </Card>

        {/* Tasks for Selected Date */}
        <Card className="bg-card border-border shadow-lg">
          <CardHeader className="bg-muted/50 border-b border-border">
            <CardTitle className="text-foreground text-lg">
              {format(selectedDate, 'MMM dd, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 max-h-96 overflow-y-auto">
            {tasksForSelectedDate.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-2">No tasks scheduled</p>
                <p className="text-muted-foreground text-sm">Your day is free!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasksForSelectedDate.map((task) => (
                  <div 
                    key={task.id}
                    className="p-4 rounded-xl bg-muted/20 border border-border hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-semibold text-foreground text-sm">{task.title}</h4>
                      </div>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    {task.description && (
                      <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    
                    {task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="text-xs bg-muted text-muted-foreground border-border"
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
    </div>
  );
}
