
import React from 'react';
import { 
  Calendar, 
  LayoutDashboard, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  PenTool,
  Home
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
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

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
    title: 'Canvas',
    url: '/canvas',
    icon: PenTool,
    external: true,
  },
  {
    title: 'Home',
    url: '/',
    icon: Home,
    external: true,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const currentPath = location.pathname + location.search;

  const isActive = (url: string) => {
    if (url === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/dashboard?view=overview';
    }
    return currentPath === url;
  };

  return (
    <Sidebar className="border-r border-purple-800/30 bg-gradient-to-b from-slate-900/50 to-purple-900/20 backdrop-blur-xl">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Dashboard
            </span>
            <Badge variant="outline" className="text-xs bg-purple-800/30 border-purple-600/30 text-purple-200">
              Pro
            </Badge>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-300/70 text-xs font-medium uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className="text-gray-300 hover:text-white hover:bg-purple-800/30 data-[active=true]:bg-gradient-to-r data-[active=true]:from-purple-600/20 data-[active=true]:to-blue-600/20 data-[active=true]:text-white data-[active=true]:border-l-2 data-[active=true]:border-purple-500"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-purple-300/70 text-xs font-medium uppercase tracking-wider">
            Quick Actions
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-purple-800/30"
                  >
                    <Link to={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-gray-300 hover:text-white hover:bg-purple-800/30">
              <Link to="/dashboard?view=settings" className="flex items-center space-x-3">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
