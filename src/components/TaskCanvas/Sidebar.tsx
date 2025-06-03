
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
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

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('addTask')} 
              disabled={isActionInProgress}
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('arrangeInLayers')} 
              disabled={isActionInProgress}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Arrange in Layers</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('applyFilters')} 
              disabled={isActionInProgress}
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <li className="my-2">
            <Separator className="dark:bg-gray-800" />
          </li>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('exportCanvas')} 
              disabled={isActionInProgress}
            >
              <FileJson2 className="h-4 w-4" />
              <span>Export Canvas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('importCanvas')} 
              disabled={isActionInProgress}
            >
              <FileJson2 className="h-4 w-4" />
              <span>Import Canvas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => handleAction('duplicateCanvas')} 
              disabled={isActionInProgress}
            >
              <CopyCheck className="h-4 w-4" />
              <span>Duplicate Canvas</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <li className="my-2">
            <Separator className="dark:bg-gray-800" />
          </li>
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
        Task Canvas
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
