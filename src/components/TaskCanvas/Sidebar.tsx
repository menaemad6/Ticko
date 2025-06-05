
import React, { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarItem,
  SidebarItemGroup,
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
    <SidebarItemGroup label="Quick Actions">
      <SidebarItem 
        onClick={() => handleAction('addTask')} 
        icon={Plus}
        disabled={isActionInProgress}
      >
        Add Task
      </SidebarItem>
      <SidebarItem 
        onClick={() => handleAction('arrangeInLayers')} 
        icon={LayoutDashboard}
        disabled={isActionInProgress}
      >
        Arrange in Layers
      </SidebarItem>
      {/* <SidebarItem 
        onClick={() => handleAction('scheduleView')} 
        icon={ListChecks}
        disabled={isActionInProgress}
      >
        Schedule View
      </SidebarItem> */}
      <SidebarItem 
        onClick={() => handleAction('applyFilters')} 
        icon={Filter}
        disabled={isActionInProgress}
      >
        Apply Filters
      </SidebarItem>
      <Separator className="my-2 dark:bg-gray-800" />
      <SidebarItem 
        onClick={() => handleAction('exportCanvas')} 
        icon={FileJson2}
        disabled={isActionInProgress}
      >
        Export Canvas
      </SidebarItem>
      <SidebarItem 
        onClick={() => handleAction('importCanvas')} 
        icon={FileJson2}
        disabled={isActionInProgress}
      >
        Import Canvas
      </SidebarItem>
      <SidebarItem 
        onClick={() => handleAction('duplicateCanvas')} 
        icon={CopyCheck}
        disabled={isActionInProgress}
      >
        Duplicate Canvas
      </SidebarItem>
      {/* <SidebarItem 
        onClick={() => handleAction('exportAsImage')} 
        icon={Image}
        disabled={isActionInProgress}
      >
        Export as Image
      </SidebarItem> */}
      <Separator className="my-2 dark:bg-gray-800" />
      {/* <SidebarItem 
        onClick={() => handleAction('toggleFocusMode')} 
        icon={Lightbulb}
        disabled={isActionInProgress}
      >
        Toggle Focus Mode
      </SidebarItem> */}
    </SidebarItemGroup>
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
        
        <SidebarItemGroup label="Templates">
          <Sheet>
            <SheetTrigger asChild>
              <SidebarItem icon={Rocket}>
                Task Templates
              </SidebarItem>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[420px]">
              <SheetHeader>
                <SheetTitle>Task Templates</SheetTitle>
                <SheetDescription>
                  Choose a template to quickly create a set of tasks.
                </SheetDescription>
              </SheetHeader>
              <TaskTemplatesModal onTemplateSelect={handleTemplateSelect} />
            </SheetContent>
          </Sheet>
        </SidebarItemGroup>

        {/* <SidebarItemGroup label="Analytics">
          <Sheet>
            <SheetTrigger asChild>
              <SidebarItem icon={BarChart3}>
                Project Analytics
              </SidebarItem>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-[420px]">
              <SheetHeader>
                <SheetTitle>Project Analytics</SheetTitle>
                <SheetDescription>
                  View analytics for your project.
                </SheetDescription>
              </SheetHeader>
              <ProjectAnalyticsModal />
            </SheetContent>
          </Sheet>
        </SidebarItemGroup> */}

        <SidebarItemGroup label="Settings">
          <Sheet>
            <SheetTrigger asChild>
              <SidebarItem icon={Settings}>
                Canvas Preferences
              </SidebarItem>
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
        </SidebarItemGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarRail>
          <SidebarItem icon={HelpCircle}>
            Help
          </SidebarItem>
        </SidebarRail>
      </SidebarFooter>
    </Sidebar>
  );
}
