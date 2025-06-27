
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
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const currentPath = location.pathname + location.search;
  const isCollapsed = state === 'collapsed';

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard?view=overview';
    }
    return currentPath === url;
  };

  return (
    <>
      <Sidebar className="border-r border-slate-200/20 bg-gradient-to-b from-slate-50/5 to-purple-50/10 backdrop-blur-2xl">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className={`flex items-center space-x-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-purple-600 bg-clip-text text-transparent">
                  Dashboard
                </span>
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-sm">
                  Pro
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupLabel className={`text-slate-500 text-xs font-semibold uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(item.url)}
                      className="text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-100 data-[active=true]:to-pink-100 data-[active=true]:text-purple-700 data-[active=true]:shadow-sm rounded-xl transition-all duration-200"
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
            <SidebarGroupLabel className={`text-slate-500 text-xs font-semibold uppercase tracking-wider transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
              Quick Actions
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
                    <DialogTrigger asChild>
                      <SidebarMenuButton className="text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-200">
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5" />
                          {!isCollapsed && <span className="font-medium">Create Task</span>}
                        </div>
                      </SidebarMenuButton>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <TaskForm onClose={() => setIsTaskModalOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </SidebarMenuItem>
                
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className="text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all duration-200"
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
              <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
                <DialogTrigger asChild>
                  <SidebarMenuButton className="text-slate-700 hover:text-slate-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 rounded-xl transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5" />
                      {!isCollapsed && <span className="font-medium">Settings</span>}
                    </div>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Profile Settings</h3>
                        <p className="text-slate-600 text-sm">Manage your account and personal information</p>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Notifications</h3>
                        <p className="text-slate-600 text-sm">Configure how you receive updates and alerts</p>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Appearance</h3>
                        <p className="text-slate-600 text-sm">Customize the look and feel of your dashboard</p>
                      </div>
                      <div className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">Privacy & Security</h3>
                        <p className="text-slate-600 text-sm">Control your privacy and security settings</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Fixed Canvas Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          asChild
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-110"
        >
          <Link to="/canvas">
            <PenTool className="w-6 h-6 text-white" />
          </Link>
        </Button>
      </div>
    </>
  );
}
