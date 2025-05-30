import React, { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarFooter, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
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
  Zap,
  LogOut,
  User,
  BarChart3,
  Calendar,
  Tag,
  Plus,
  RefreshCw,
  FileText,
  FolderOpen,
  Archive,
  Clock,
  Target,
  PanelLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QuickActions } from './QuickActions';
import { PreferencesModal, CanvasPreferences } from './PreferencesModal';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { Progress } from '@/components/ui/progress';
import './sidebar-scrollbar.css';
import { ProjectAnalyticsModal } from './ProjectAnalyticsModal';
import { TaskTemplatesModal } from './TaskTemplatesModal';
import { FilterModal, NodeFilters } from './FilterModal';
import { useToast } from '@/hooks/use-toast';

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
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const { user, signOut } = useAuth();
  const { tasks, loading, refreshTasks, deleteAllTasks } = useTasks();
  const { state, isMobile, openMobile, toggleSidebar } = useSidebar();
  const { toast } = useToast();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  const taskManagementActions = [
    { 
      id: 'createBulkTasks',
      icon: Plus, 
      label: 'Bulk Create Tasks', 
      description: 'Create multiple tasks at once'
    },
    { 
      id: 'archiveTasks',
      icon: Archive, 
      label: 'Archive Completed', 
      description: 'Archive all completed tasks'
    },
    { 
      id: 'reportGeneration',
      icon: BarChart3, 
      label: 'Generate Report', 
      description: 'Create progress reports'
    },
    { 
      id: 'dueDateReminder',
      icon: Clock, 
      label: 'Due Date Alerts', 
      description: 'Set up deadline notifications'
    }
  ];

  const projectActions = [
    { 
      id: 'projectAnalytics',
      icon: Target, 
      label: 'Project Analytics', 
      description: 'View detailed project metrics',
      handler: () => setIsAnalyticsOpen(true)
    },
    { 
      id: 'taskTemplates',
      icon: FileText, 
      label: 'Task Templates', 
      description: 'Create tasks from templates',
      handler: () => setIsTemplatesOpen(true)
    },
    { 
      id: 'refreshData',
      icon: RefreshCw, 
      label: 'Refresh Data', 
      description: 'Sync with latest changes',
      handler: () => {
        refreshTasks();
        toast({
          title: "Data refreshed",
          description: "Successfully refreshed all tasks and connections.",
        });
      }
    }
  ];

  const toolActions = [
    { 
      id: 'exportCanvas',
      icon: Download, 
      label: 'Export Canvas', 
      description: 'Download your canvas as image or JSON',
      handler: () => {
        onQuickAction?.('exportCanvas');
        toast({
          title: "Export started",
          description: "Your canvas is being exported. Download will start shortly.",
        });
      }
    },
    { 
      id: 'importCanvas',
      icon: Upload, 
      label: 'Import Canvas', 
      description: 'Import canvas from file',
      handler: () => {
        onQuickAction?.('importCanvas');
        toast({
          title: "Import canvas",
          description: "Please select a JSON file to import.",
        });
      }
    },
    { 
      id: 'duplicateCanvas',
      icon: Copy, 
      label: 'Duplicate Canvas', 
      description: 'Create a copy of current canvas',
      handler: () => {
        onQuickAction?.('duplicateCanvas');
        toast({
          title: "Canvas duplicated",
          description: "A copy of your canvas has been created.",
        });
      }
    },
    { 
      id: 'clearCanvas',
      icon: Trash2, 
      label: 'Clear Canvas', 
      description: 'Remove all nodes and start fresh',
      handler: async () => {
        if (window.confirm('Are you sure you want to clear all tasks? This action cannot be undone.')) {
          try {
            await deleteAllTasks();
            toast({
              title: "Canvas cleared",
              description: "All tasks have been removed from the canvas.",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to clear canvas. Please try again.",
              variant: "destructive",
            });
          }
        }
      }
    }
  ];

  const viewActions = [
    { 
      id: 'filterNodes',
      icon: Filter, 
      label: 'Filter Nodes', 
      description: 'Show/hide nodes by type or status',
      handler: () => setIsFilterModalOpen(true)
    },
    { 
      id: 'layerView',
      icon: Layers, 
      label: 'Layer View', 
      description: 'Organize nodes in layers',
      handler: () => {
        onQuickAction?.('arrangeInLayers');
        toast({
          title: "Layer view applied",
          description: "Nodes have been organized in layers by type.",
        });
      }
    },
    { 
      id: 'focusMode',
      icon: Zap, 
      label: 'Focus Mode', 
      description: 'Hide distractions and focus on tasks',
      handler: () => {
        setFocusMode(!focusMode);
        onQuickAction?.('toggleFocusMode');
        toast({
          title: focusMode ? "Focus mode disabled" : "Focus mode enabled",
          description: focusMode ? "UI controls are now visible." : "UI distractions hidden for better focus.",
        });
      }
    }
  ];

  const handleTemplateClick = (templateName: string) => {
    if (!isActionInProgress) {
      onTemplateSelect?.(templateName);
    }
  };

  const handleToolAction = (actionId: string) => {
    if (!isActionInProgress) {
      // Check if it's a project action with custom handler
      const projectAction = projectActions.find(action => action.id === actionId);
      if (projectAction && projectAction.handler) {
        projectAction.handler();
        return;
      }
      
      // Check if it's a view action with custom handler
      const viewAction = viewActions.find(action => action.id === actionId);
      if (viewAction && viewAction.handler) {
        viewAction.handler();
        return;
      }
      
      // Check if it's a tool action with custom handler
      const toolAction = toolActions.find(action => action.id === actionId);
      if (toolAction && toolAction.handler) {
        toolAction.handler();
        return;
      }
      
      onQuickAction?.(actionId);
    }
  };

  const handlePreferencesChange = (preferences: CanvasPreferences) => {
    console.log('Preferences updated:', preferences);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleApplyFilters = (filters: NodeFilters) => {
    onQuickAction?.('applyFilters');
    toast({
      title: "Filters applied",
      description: "Node visibility has been updated based on your filters.",
    });
  };

  return (
    <>
      {/* Floating trigger button to open sidebar when collapsed (desktop) or closed (mobile) */}
      {isMobile && !openMobile ? (
        <div
          className="fixed left-4 top-4 z-40 sm:hidden"
        >
          <SidebarTrigger
            className="bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground shadow-lg rounded-full p-4 flex items-center justify-center hover:scale-105 transition-transform border-none"
          />
        </div>
      ) : null}
      <Sidebar
        className="w-80 border-r"
        collapsible="offcanvas"
        style={isMobile ? ({ ['--sidebar-width']: '90vw' } as Record<string, string>) : undefined}
      >
        <SidebarHeader className="p-4 border-b bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 dark:from-gray-950/80 dark:via-gray-900/80 dark:to-purple-950/80 rounded-t-xl shadow-sm relative">
          <div className="flex items-center gap-3 mb-4">
            <img src="/placeholder.svg" alt="Logo" className="w-8 h-8 rounded shadow-sm border border-gray-200 dark:border-gray-800 bg-white" />
            <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm select-none">
              TaskWeaver
            </h2>
            {!isMobile && (
              <div className="ml-auto">
                <SidebarTrigger
                  className="bg-transparent hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full p-2 transition-colors border-none"
                  title={state === 'collapsed' ? 'Expand sidebar' : 'Collapse sidebar'}
                />
              </div>
            )}
            {isActionInProgress && (
              <Badge variant="secondary" className="ml-2">
                Processing...
              </Badge>
            )}
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-3 bg-gray-200 dark:bg-gray-700" />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {completedTasks} of {totalTasks} tasks completed
              </div>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-4 space-y-6 bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 dark:from-gray-950/80 dark:via-gray-900/80 dark:to-purple-950/80 rounded-b-xl shadow-sm border-t border-gray-200 dark:border-gray-800 custom-scrollbar">
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



          {/* Task Management */}
          {/* <Separator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Task Management
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <QuickActions onAction={onQuickAction || (() => {})} disabled={isActionInProgress} />
            </SidebarGroupContent>
          </SidebarGroup> */}



          <Separator />

          {/* Project Tools */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Project Tools
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {projectActions.map((action) => {
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
                    <div className="p-1.5 rounded bg-indigo-500 text-white">
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
            <SidebarGroupContent className="flex flex-col space-y-2 min-w-0">
              {toolActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToolAction(action.id)}
                    disabled={isActionInProgress}
                    className="w-full justify-start gap-3 h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-800 flex-nowrap min-w-0"
                  >
                    <div className="p-1.5 rounded bg-cyan-500 text-white flex-shrink-0">
                      <IconComponent className="w-3 h-3" />
                    </div>
                    <div className="text-left min-w-0">
                      <div className="text-sm font-medium truncate">{action.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{action.description}</div>
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
        </SidebarContent>

        <SidebarFooter className="p-4 border-t bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 dark:from-gray-950/80 dark:via-gray-900/80 dark:to-purple-950/80 rounded-b-xl shadow-sm border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-3">
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
            
            <Button 
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start gap-2 font-semibold text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 shadow-md border-0 transition-colors"
              disabled={isActionInProgress}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs">Sign Out</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Modals */}
      <PreferencesModal 
        isOpen={isPreferencesOpen} 
        onClose={() => setIsPreferencesOpen(false)}
        onPreferencesChange={handlePreferencesChange}
      />
      
      <ProjectAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />
      
      <TaskTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />
      
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
}
