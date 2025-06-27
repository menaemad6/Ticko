
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

  return (
    <SidebarInset className="flex-1 bg-gradient-to-br from-slate-900/50 to-purple-900/20 backdrop-blur-xl">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-purple-800/30 px-6 backdrop-blur-xl bg-slate-900/20">
        <SidebarTrigger className="text-purple-300 hover:text-white hover:bg-purple-800/30" />
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent capitalize">
            {view === 'overview' ? 'Dashboard' : view}
          </h1>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        {renderView()}
      </main>
    </SidebarInset>
  );
}
