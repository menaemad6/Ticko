
import React from 'react';
import { Calendar, CheckSquare, BarChart3, Clock, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  selectedView: 'calendar' | 'tasks' | 'analytics';
  onViewChange: (view: 'calendar' | 'tasks' | 'analytics') => void;
  taskCount: number;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  selectedView,
  onViewChange,
  taskCount,
}) => {
  const menuItems = [
    {
      id: 'calendar' as const,
      label: 'Calendar',
      icon: Calendar,
      description: 'View tasks by date',
    },
    {
      id: 'tasks' as const,
      label: 'Tasks',
      icon: CheckSquare,
      description: 'Manage all tasks',
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      description: 'Track progress',
    },
  ];

  const stats = [
    {
      label: 'Total Tasks',
      value: taskCount,
      icon: Target,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'In Progress',
      value: Math.floor(taskCount * 0.4),
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Completed',
      value: Math.floor(taskCount * 0.6),
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
  ];

  return (
    <div className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Ticko Dashboard</h2>
            <p className="text-sm text-sidebar-foreground/70">Task Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 space-y-2">
        <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-3 pb-2">
          Navigation
        </h3>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
              )} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-sidebar-foreground/60 group-hover:text-sidebar-accent-foreground/80">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="p-4 space-y-4 flex-1">
        <h3 className="text-xs font-medium text-sidebar-foreground/70 uppercase tracking-wider px-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center space-x-3 p-3 rounded-lg bg-sidebar-accent/30 border border-sidebar-border/50"
              >
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-sidebar-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-sidebar-foreground/70">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          Powered by Ticko AI
        </div>
      </div>
    </div>
  );
};
