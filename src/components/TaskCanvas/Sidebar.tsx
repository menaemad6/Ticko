
import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar';
import { CheckSquare, Milestone, StickyNote, Plus, Search, Calendar, Tag, User, Grid2x2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface DraggableNodeProps {
  type: 'task' | 'milestone' | 'note';
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon, color, description }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg border-2 border-dashed ${color} cursor-grab hover:opacity-80 transition-all hover:scale-105`}
      draggable
      onDragStart={(event) => onDragStart(event, type)}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    className="w-full justify-start gap-2 h-8"
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Button>
);

interface TaskSidebarProps {
  onQuickAction?: (action: string) => void;
  onTemplateSelect?: (templateName: string) => void;
}

export function TaskSidebar({ onQuickAction, onTemplateSelect }: TaskSidebarProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');

  const nodeTypes = [
    {
      type: 'task' as const,
      label: 'Task Node',
      icon: <CheckSquare className="w-5 h-5 text-blue-600" />,
      color: 'border-blue-300 bg-blue-50 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/30',
      description: 'Create actionable work items with status tracking'
    },
    {
      type: 'milestone' as const,
      label: 'Milestone Node',
      icon: <Milestone className="w-5 h-5 text-purple-600" />,
      color: 'border-purple-300 bg-purple-50 hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-950/30',
      description: 'Mark important project checkpoints and goals'
    },
    {
      type: 'note' as const,
      label: 'Note Node',
      icon: <StickyNote className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-300 bg-amber-50 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/30',
      description: 'Document context, ideas, and important information'
    }
  ];

  const templates = [
    { name: 'Sprint Planning', nodes: 5, color: 'bg-green-100 text-green-800' },
    { name: 'Project Roadmap', nodes: 10, color: 'bg-blue-100 text-blue-800' },
    { name: 'Bug Tracking', nodes: 7, color: 'bg-red-100 text-red-800' },
    { name: 'Feature Development', nodes: 9, color: 'bg-purple-100 text-purple-800' }
  ];

  const quickActions = [
    { 
      icon: <Plus className="w-4 h-4" />, 
      label: 'Add Task', 
      action: 'addTask',
      onClick: () => onQuickAction?.('addTask')
    },
    { 
      icon: <Calendar className="w-4 h-4" />, 
      label: 'Schedule View', 
      action: 'scheduleView',
      onClick: () => onQuickAction?.('scheduleView')
    },
    { 
      icon: <Tag className="w-4 h-4" />, 
      label: 'Manage Tags', 
      action: 'manageTags',
      onClick: () => onQuickAction?.('manageTags')
    },
    { 
      icon: <User className="w-4 h-4" />, 
      label: 'Assign Users', 
      action: 'assignUsers',
      onClick: () => onQuickAction?.('assignUsers')
    },
    { 
      icon: <Grid2x2 className="w-4 h-4" />, 
      label: 'Grid Layout', 
      action: 'gridLayout',
      onClick: () => onQuickAction?.('gridLayout')
    }
  ];

  const handleTemplateClick = (templateName: string) => {
    onTemplateSelect?.(templateName);
  };

  return (
    <Sidebar className="w-80 border-r">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          <CheckSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Task Canvas</h2>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4 space-y-6">
        {/* Node Types */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Drag & Drop Nodes
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3">
            {nodeTypes.map((nodeType) => (
              <DraggableNode
                key={nodeType.type}
                type={nodeType.type}
                label={nodeType.label}
                icon={nodeType.icon}
                color={nodeType.color}
                description={nodeType.description}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-1">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                icon={action.icon}
                label={action.label}
                onClick={action.onClick}
              />
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Templates */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Project Templates
          </SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3">
            {templates.map((template, index) => (
              <div
                key={index}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleTemplateClick(template.name)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">{template.name}</h4>
                  <Badge variant="secondary" className={template.color}>
                    {template.nodes} nodes
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Pre-configured workflow template
                </p>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator />

        {/* Canvas Settings */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Canvas Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 h-8"
              onClick={() => console.log('Canvas preferences clicked')}
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs">Preferences</span>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
