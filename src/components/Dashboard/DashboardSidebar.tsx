
import React, { useState } from 'react';
import { 
  Calendar, 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  PenTool,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskForm } from '@/components/TaskForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useTasks } from '@/hooks/useTasks';

const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Calendar',
    url: '/dashboard?view=calendar',
    icon: Calendar,
  },
  {
    title: 'Tasks',
    url: '/dashboard?view=tasks',
    icon: CheckSquare,
  },
  {
    title: 'Analytics',
    url: '/dashboard?view=analytics',
    icon: BarChart3,
  },
];

const quickActions = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    external: true,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const { addTask } = useTasks();
  const currentPath = location.pathname + location.search;
  const isCollapsed = state === 'collapsed';

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard?view=overview';
    }
    return currentPath === url;
  };

  const handleTaskSave = (taskData: any) => {
    addTask(taskData);
    setIsTaskModalOpen(false);
  };

  return (
    <>
      <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 bg-primary-foreground rounded-md opacity-90"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-foreground">
                  Dashboard
                </span>
                <Badge variant="outline" className="text-xs bg-primary text-primary-foreground border-0 shadow-sm">
                  Pro
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupLabel className={`text-muted-foreground text-xs font-semibold uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-foreground rounded-xl transition-all duration-200"
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className={`text-muted-foreground text-xs font-semibold uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5" />
                          {!isCollapsed && <span className="font-medium">Create Task</span>}
                        </div>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <TaskForm 
                        isOpen={isTaskModalOpen}
                        onClose={() => setIsTaskModalOpen(false)}
                        onSave={handleTaskSave}
                      />
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
                
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200"
                    >
                      <Link to={item.url} className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200">
                <Link to="/canvas" className="flex items-center space-x-3">
                  <Settings className="w-5 h-5" />
                  {!isCollapsed && <span className="font-medium">Settings</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Fixed Canvas Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          asChild
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Link to="/canvas">
            <PenTool className="w-6 h-6 text-primary-foreground" />
          </Link>
        </Button>
      </div>
    </>
  );
}
