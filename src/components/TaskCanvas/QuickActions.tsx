
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Tag, User, Grid2x2, Zap, Archive, BarChart3, Timer } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { toast } from 'sonner';

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled = false }) => {
  const { tasks, updateTask, addTask, deleteTask } = useTasks();

  const handleAddTask = () => {
    onAction('addTask');
  };

  const handleBulkCreateTasks = async () => {
    const taskTemplates = [
      { title: 'Review project requirements', priority: 'high' as const },
      { title: 'Set up development environment', priority: 'medium' as const },
      { title: 'Create initial wireframes', priority: 'medium' as const },
      { title: 'Plan testing strategy', priority: 'low' as const },
      { title: 'Schedule team meeting', priority: 'medium' as const },
    ];

    let createdCount = 0;
    for (const template of taskTemplates) {
      try {
        await addTask({
          title: template.title,
          description: 'Auto-generated task from bulk creation',
          status: 'todo',
          priority: template.priority,
          tags: ['bulk-created'],
          position: { 
            x: 100 + (createdCount * 50), 
            y: 100 + (createdCount * 100) 
          },
          nodeType: 'task',
          connections: [],
        });
        createdCount++;
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
    
    toast.success(`Created ${createdCount} tasks successfully`);
  };

  const handleArchiveCompleted = async () => {
    const completedTasks = tasks.filter(task => task.status === 'done');
    
    if (completedTasks.length === 0) {
      toast.info('No completed tasks to archive');
      return;
    }

    let archivedCount = 0;
    for (const task of completedTasks) {
      try {
        await deleteTask(task.id);
        archivedCount++;
      } catch (error) {
        console.error('Error archiving task:', error);
      }
    }
    
    toast.success(`Archived ${archivedCount} completed tasks`);
  };

  const handleShowStats = () => {
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    const inProgressCount = tasks.filter(task => task.status === 'in-progress').length;
    const doneCount = tasks.filter(task => task.status === 'done').length;
    const totalTasks = tasks.length;
    
    const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
    
    toast.success(
      `Task Stats: ${todoCount} Todo, ${inProgressCount} In Progress, ${doneCount} Done. Completion: ${completionRate}%`,
      { duration: 5000 }
    );
  };

  const handleDueDateAlerts = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueSoon = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate <= tomorrow && task.status !== 'done';
    });

    if (dueSoon.length === 0) {
      toast.info('No tasks due soon');
      return;
    }

    const overdue = dueSoon.filter(task => new Date(task.dueDate!) < today);
    const dueToday = dueSoon.filter(task => {
      const dueDate = new Date(task.dueDate!);
      return dueDate.toDateString() === today.toDateString();
    });

    let alertMessage = `${dueSoon.length} tasks need attention: `;
    if (overdue.length > 0) alertMessage += `${overdue.length} overdue, `;
    if (dueToday.length > 0) alertMessage += `${dueToday.length} due today`;

    toast.warning(alertMessage, { duration: 6000 });
  };

  const handleScheduleView = () => {
    // Arrange tasks by due date
    const tasksWithDates = tasks.filter(task => task.dueDate);
    const tasksWithoutDates = tasks.filter(task => !task.dueDate);
    
    // Sort tasks with dates by due date
    tasksWithDates.sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    // Arrange in vertical columns by due date
    let currentY = 50;
    const columnWidth = 300;
    
    // Tasks with dates - arrange by due date in columns
    tasksWithDates.forEach((task, index) => {
      const column = Math.floor(index / 5); // 5 tasks per column
      const row = index % 5;
      
      updateTask(task.id, {
        position: {
          x: 50 + (column * columnWidth),
          y: currentY + (row * 120)
        }
      });
    });

    // Tasks without dates - put in a separate column
    tasksWithoutDates.forEach((task, index) => {
      const column = Math.ceil(tasksWithDates.length / 5);
      updateTask(task.id, {
        position: {
          x: 50 + (column * columnWidth),
          y: currentY + (index * 120)
        }
      });
    });

    toast.success('Tasks arranged by schedule');
  };

  const handleGroupByTags = () => {
    // Group tasks by their tags
    const tagGroups: { [key: string]: Task[] } = {};
    const untaggedTasks: Task[] = [];

    tasks.forEach(task => {
      if (task.tags && task.tags.length > 0) {
        task.tags.forEach(tag => {
          if (!tagGroups[tag]) {
            tagGroups[tag] = [];
          }
          tagGroups[tag].push(task);
        });
      } else {
        untaggedTasks.push(task);
      }
    });

    // Arrange tasks in groups
    let currentX = 50;
    const columnWidth = 300;
    
    Object.keys(tagGroups).forEach((tag, groupIndex) => {
      tagGroups[tag].forEach((task, taskIndex) => {
        updateTask(task.id, {
          position: {
            x: currentX + (groupIndex * columnWidth),
            y: 50 + (taskIndex * 120)
          }
        });
      });
    });

    // Place untagged tasks in the last column
    const groupCount = Object.keys(tagGroups).length;
    untaggedTasks.forEach((task, index) => {
      updateTask(task.id, {
        position: {
          x: currentX + (groupCount * columnWidth),
          y: 50 + (index * 120)
        }
      });
    });

    toast.success('Tasks grouped by tags');
  };

  const handleGroupByStatus = () => {
    // Group tasks by status
    const statusGroups: { [key: string]: Task[] } = {
      'todo': [],
      'in-progress': [],
      'done': []
    };

    tasks.forEach(task => {
      statusGroups[task.status].push(task);
    });

    // Arrange tasks in status columns
    const columnWidth = 350;
    const statuses = ['todo', 'in-progress', 'done'];
    
    statuses.forEach((status, columnIndex) => {
      statusGroups[status].forEach((task, taskIndex) => {
        updateTask(task.id, {
          position: {
            x: 50 + (columnIndex * columnWidth),
            y: 50 + (taskIndex * 120)
          }
        });
      });
    });

    toast.success('Tasks grouped by status');
  };

  const handleGridLayout = () => {
    // Arrange tasks in a grid pattern
    const tasksPerRow = 4;
    const cellWidth = 280;
    const cellHeight = 150;

    tasks.forEach((task, index) => {
      const row = Math.floor(index / tasksPerRow);
      const col = index % tasksPerRow;
      
      updateTask(task.id, {
        position: {
          x: 50 + (col * cellWidth),
          y: 50 + (row * cellHeight)
        }
      });
    });

    toast.success('Tasks arranged in grid layout');
  };

  const actions = [
    { 
      id: 'addTask',
      icon: Plus, 
      label: 'Add Task', 
      description: 'Create a new task node',
      color: 'bg-blue-500 hover:bg-blue-600',
      handler: handleAddTask
    },
    { 
      id: 'bulkCreate',
      icon: Zap, 
      label: 'Bulk Create Tasks', 
      description: 'Create multiple sample tasks',
      color: 'bg-purple-500 hover:bg-purple-600',
      handler: handleBulkCreateTasks
    },
    { 
      id: 'archiveCompleted',
      icon: Archive, 
      label: 'Archive Completed', 
      description: 'Remove all completed tasks',
      color: 'bg-gray-500 hover:bg-gray-600',
      handler: handleArchiveCompleted
    },
    { 
      id: 'showStats',
      icon: BarChart3, 
      label: 'Show Task Stats', 
      description: 'Display task completion statistics',
      color: 'bg-emerald-500 hover:bg-emerald-600',
      handler: handleShowStats
    },
    { 
      id: 'dueDateAlerts',
      icon: Timer, 
      label: 'Due Date Alerts', 
      description: 'Check for overdue and upcoming tasks',
      color: 'bg-red-500 hover:bg-red-600',
      handler: handleDueDateAlerts
    },
    { 
      id: 'scheduleView',
      icon: Calendar, 
      label: 'Schedule View', 
      description: 'Arrange tasks by due date',
      color: 'bg-green-500 hover:bg-green-600',
      handler: handleScheduleView
    },
    { 
      id: 'manageTags',
      icon: Tag, 
      label: 'Group by Tags', 
      description: 'Organize tasks by their tags',
      color: 'bg-purple-500 hover:bg-purple-600',
      handler: handleGroupByTags
    },
    { 
      id: 'assignUsers',
      icon: User, 
      label: 'Group by Status', 
      description: 'Arrange tasks by completion status',
      color: 'bg-orange-500 hover:bg-orange-600',
      handler: handleGroupByStatus
    },
    { 
      id: 'gridLayout',
      icon: Grid2x2, 
      label: 'Grid Layout', 
      description: 'Arrange tasks in a grid pattern',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      handler: handleGridLayout
    }
  ];

  return (
    <div className="space-y-2">
      {actions.map((action) => {
        const IconComponent = action.icon;
        return (
          <Button
            key={action.id}
            variant="ghost"
            size="sm"
            onClick={() => !disabled && action.handler()}
            disabled={disabled}
            className="w-full justify-start gap-3 h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <div className={`p-1.5 rounded ${action.color} text-white`}>
              <IconComponent className="w-3 h-3" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{action.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
