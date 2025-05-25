import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader } from '@/components/ui/sidebar';
import { 
  CheckSquare, 
  Milestone, 
  StickyNote, 
  Search, 
  Settings, 
  Filter, 
  Download, 
  Upload, 
  Trash2, 
  Copy,
  Layers,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuickActions } from './QuickActions';
import { PreferencesModal, CanvasPreferences } from './PreferencesModal';

interface DraggableNodeProps {
  type: 'task' | 'milestone' | 'note';
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  disabled?: boolean;
}

const DraggableNode: React.FC<DraggableNodeProps> = ({ type, label, icon, color, description, disabled = false }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg border-2 border-dashed ${color} transition-all ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-grab hover:opacity-80 hover:scale-105'
      }`}
      draggable={!disabled}
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

interface TaskSidebarProps {
  onQuickAction?: (action: string) => void;
  onTemplateSelect?: (templateName: string) => void;
  isActionInProgress?: boolean;
}

export function TaskSidebar({ onQuickAction, onTemplateSelect, isActionInProgress = false }: TaskSidebarProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

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
    { name: 'Sprint Planning', nodes: 5, color: 'bg-green-100 text-green-800', description: 'Agile sprint workflow' },
    { name: 'Project Roadmap', nodes: 10, color: 'bg-blue-100 text-blue-800', description: 'Full project lifecycle' },
    { name: 'Bug Tracking', nodes: 7, color: 'bg-red-100 text-red-800', description: 'Bug resolution process' },
    { name: 'Feature Development', nodes: 9, color: 'bg-purple-100 text-purple-800', description: 'Feature development cycle' }
  ];

  const toolActions = [
    { 
      id: 'exportCanvas',
      icon: Download, 
      label: 'Export Canvas', 
      description: 'Download your canvas as image or JSON'
    },
    { 
      id: 'importCanvas',
      icon: Upload, 
      label: 'Import Canvas', 
      description: 'Import canvas from file'
    },
    { 
      id: 'duplicateCanvas',
      icon: Copy, 
      label: 'Duplicate Canvas', 
      description: 'Create a copy of current canvas'
    },
    { 
      id: 'clearCanvas',
      icon: Trash2, 
      label: 'Clear Canvas', 
      description: 'Remove all nodes and start fresh'
    }
  ];

  const viewActions = [
    { 
      id: 'filterNodes',
      icon: Filter, 
      label: 'Filter Nodes', 
      description: 'Show/hide nodes by type or status'
    },
    { 
      id: 'layerView',
      icon: Layers, 
      label: 'Layer View', 
      description: 'Organize nodes in layers'
    },
    { 
      id: 'focusMode',
      icon: Zap, 
      label: 'Focus Mode', 
      description: 'Hide distractions and focus on tasks'
    }
  ];

  const handleTemplateClick = (templateName: string) => {
    if (!isActionInProgress) {
      onTemplateSelect?.(templateName);
    }
  };

  const handleToolAction = (actionId: string) => {
    if (!isActionInProgress) {
      onQuickAction?.(actionId);
    }
  };

  const handlePreferencesChange = (preferences: CanvasPreferences) => {
    // Preferences are automatically saved to localStorage in the modal
    console.log('Preferences updated:', preferences);
  };

  return (
    <>
      <Sidebar className="w-80 border-r">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold">Task Canvas</h2>
            {isActionInProgress && (
              <Badge variant="secondary" className="ml-auto">
                Processing...
              </Badge>
            )}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8 text-sm"
              disabled={isActionInProgress}
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
                  disabled={isActionInProgress}
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
            <SidebarGroupContent>
              <QuickActions onAction={onQuickAction || (() => {})} disabled={isActionInProgress} />
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          {/* View & Tools */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              View & Tools
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {viewActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolAction(action.id)}
                    disabled={isActionInProgress}
                    className="w-full justify-start gap-3 h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="p-1.5 rounded bg-gray-500 text-white">
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <Separator />

          {/* Canvas Tools */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Canvas Tools
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {toolActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolAction(action.id)}
                    disabled={isActionInProgress}
                    className="w-full justify-start gap-3 h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <div className="p-1.5 rounded bg-cyan-500 text-white">
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
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
                  className={`p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors group ${
                    isActionInProgress 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                  }`}
                  onClick={() => handleTemplateClick(template.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-medium transition-colors ${
                      !isActionInProgress ? 'group-hover:text-blue-600' : ''
                    }`}>
                      {template.name}
                    </h4>
                    <Badge variant="secondary" className={template.color}>
                      {template.nodes} nodes
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {template.description}
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
                onClick={() => setIsPreferencesOpen(true)}
                disabled={isActionInProgress}
              >
                <Settings className="w-4 h-4" />
                <span className="text-xs">Preferences</span>
              </Button>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <PreferencesModal 
        isOpen={isPreferencesOpen} 
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesChange={handlePreferencesChange}
      />
    </>
  );
}
