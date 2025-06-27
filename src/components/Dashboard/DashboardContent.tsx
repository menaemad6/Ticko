
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CalendarView } from './CalendarView';
import { OverviewView } from './OverviewView';
import { TasksView } from './TasksView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';

export function DashboardContent() {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'overview';

  const renderView = () => {
    switch (view) {
      case 'calendar':
        return <CalendarView />;
      case 'tasks':
        return <TasksView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  const getViewTitle = () => {
    switch (view) {
      case 'calendar':
        return 'Calendar';
      case 'tasks':
        return 'Tasks';
      case 'analytics':
        return 'Analytics';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  return (
    <SidebarInset className="flex-1 bg-gradient-to-br from-white/80 to-purple-50/40 backdrop-blur-xl">
      <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/50 px-6 bg-white/50 backdrop-blur-xl">
        <SidebarTrigger className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-lg" />
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getViewTitle()}
          </h1>
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
          <div className="text-sm text-slate-500 font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        {renderView()}
      </main>
    </SidebarInset>
  );
}
