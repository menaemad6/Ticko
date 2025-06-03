
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { 
  LayoutDashboard, 
  ListChecks, 
  Settings, 
  HelpCircle, 
  Plus, 
  Rocket,
  BarChart3,
  Lightbulb,
  BrainCircuit,
  FileJson2,
  Image,
  CopyCheck,
  Filter,
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet"
import { TaskTemplatesModal } from './TaskTemplatesModal';
import { ProjectAnalyticsModal } from './ProjectAnalyticsModal';
import { PreferencesModal } from './PreferencesModal';
import { Button } from '@/components/ui/button';
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface TaskSidebarProps {
  onQuickAction: ((action: string) => void) | undefined;
  onTemplateSelect: ((templateName: string) => void) | undefined;
  isActionInProgress: boolean;
}

interface QuickActionsProps {
  onAction: ((action: string) => void) | undefined;
  isActionInProgress: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction, isActionInProgress }) => {
  const { toast } = useToast()

  const handleAction = (action: string) => {
    if (onAction) {
      onAction(action);
    } else {
      toast({
        title: "Not available",
        description: "This action is not available at this time.",
      })
    }
  };

  const quickActionItems = [
    { action: 'addTask', label: 'Add Task', icon: Plus },
    { action: 'arrangeInLayers', label: 'Arrange in Layers', icon: LayoutDashboard },
    { action: 'applyFilters', label: 'Apply Filters', icon: Filter },
    { action: 'exportCanvas', label: 'Export Canvas', icon: FileJson2 },
    { action: 'importCanvas', label: 'Import Canvas', icon: FileJson2 },
    { action: 'duplicateCanvas', label: 'Duplicate Canvas', icon: CopyCheck },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {quickActionItems.map((item, index) => (
            <SidebarMenuItem key={item.action}>
              <SidebarMenuButton 
                onClick={() => handleAction(item.action)}
                disabled={isActionInProgress}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
              {index === 2 && <Separator className="my-2 dark:bg-gray-800" />}
              {index === 5 && <Separator className="my-2 dark:bg-gray-800" />}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export function TaskSidebar({ onQuickAction, onTemplateSelect, isActionInProgress }: TaskSidebarProps) {
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);

  const handleTemplateSelect = (templateName: string) => {
    if (onTemplateSelect) {
      onTemplateSelect(templateName);
    }
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r-0" data-demo="sidebar">
      <SidebarHeader>
        <div className="p-2">
          <h2 className="text-lg font-semibold">Task Canvas</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col gap-0">
        <div data-demo="quick-actions">
          <QuickActions 
            onAction={onQuickAction}
            isActionInProgress={isActionInProgress}
          />
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Rocket className="h-4 w-4" />
                      <span>Task Templates</span>
                    </SidebarMenuButton>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-[420px]">
                    <SheetHeader>
                      <SheetTitle>Task Templates</SheetTitle>
                      <SheetDescription>
                        Choose a template to quickly create a set of tasks.
                      </SheetDescription>
                    </SheetHeader>
                    <TaskTemplatesModal />
                  </SheetContent>
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Sheet>
                  <SheetTrigger asChild>
                    <SidebarMenuButton>
                      <Settings className="h-4 w-4" />
                      <span>Canvas Preferences</span>
                    </SidebarMenuButton>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-[420px]">
                    <SheetHeader>
                      <SheetTitle>Canvas Preferences</SheetTitle>
                      <SheetDescription>
                        Customize the canvas to your liking.
                      </SheetDescription>
                    </SheetHeader>
                    <PreferencesModal />
                  </SheetContent>
                </Sheet>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <HelpCircle className="h-4 w-4" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
