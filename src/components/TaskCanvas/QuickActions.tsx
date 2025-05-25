
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Tag, User, Grid2x2 } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
  disabled?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction, disabled = false }) => {
  const actions = [
    { 
      id: 'addTask',
      icon: Plus, 
      label: 'Add Task', 
      description: 'Create a new task node',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    { 
      id: 'scheduleView',
      icon: Calendar, 
      label: 'Schedule View', 
      description: 'Arrange tasks by due date',
      color: 'bg-green-500 hover:bg-green-600'
    },
    { 
      id: 'manageTags',
      icon: Tag, 
      label: 'Group by Tags', 
      description: 'Organize tasks by their tags',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    { 
      id: 'assignUsers',
      icon: User, 
      label: 'Group by Status', 
      description: 'Arrange tasks by completion status',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    { 
      id: 'gridLayout',
      icon: Grid2x2, 
      label: 'Grid Layout', 
      description: 'Arrange tasks in a grid pattern',
      color: 'bg-indigo-500 hover:bg-indigo-600'
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
            onClick={() => !disabled && onAction(action.id)}
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
