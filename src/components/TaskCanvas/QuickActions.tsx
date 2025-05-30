
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Tag, User, Grid2x2 } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { Task } from '@/types/task';
import { toast } from 'sonner';

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled = false }) => {
  const { tasks, updateTask } = useTasks();

  const handleAddTask = () => {
    onAction('addTask');
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
