
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
      <Sidebar className="border-r-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="relative z-10 h-full">
          <SidebarHeader className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                <div className="relative">
                  <img src="/Ticko-Logo.png" alt="Ticko Logo" className="w-12 h-12 rounded-xl shadow-2xl" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400/20 to-purple-400/20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Dashboard
                  </span>
                  <Badge variant="outline" className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg">
                    Pro
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-4 py-6">
            <SidebarGroup>
              <SidebarGroupLabel className={`text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url)}
                        className={`
                          text-white/80 hover:text-white rounded-xl transition-all duration-200 group
                          ${isActive(item.url) 
                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg border border-white/10' 
                            : 'hover:bg-white/10'
                          }
                        `}
                      >
                        <Link to={item.url} className="flex items-center space-x-3 py-3 px-4">
                          <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive(item.url) ? 'scale-110' : 'group-hover:scale-105'}`} />
                          {!isCollapsed && <span className="font-medium">{item.title}</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className={`text-white/60 text-xs font-semibold uppercase tracking-wider mb-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  <SidebarMenuItem>
                    <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                      <DialogTrigger asChild>
                        <SidebarMenuButton className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 py-3 px-4">
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
                        className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 py-3 px-4"
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

          <SidebarFooter className="p-4 border-t border-white/10">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 py-3 px-4">
                  <Link to="/canvas" className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    {!isCollapsed && <span className="font-medium">Settings</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </div>
      </Sidebar>

      {/* Fixed Canvas Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          asChild
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 border border-white/20"
        >
          <Link to="/canvas">
            <PenTool className="w-6 h-6 text-white" />
          </Link>
        </Button>
      </div>
    </>
  );
}
