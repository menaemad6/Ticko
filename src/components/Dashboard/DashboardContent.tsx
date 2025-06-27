
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { CalendarView } from './CalendarView';
import { WeeklyCalendarView } from './WeeklyCalendarView';
import { OverviewView } from './OverviewView';
import { TasksView } from './TasksView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { ThemeToggle } from './ThemeToggle';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export function DashboardContent() {
  const [searchParams] = useSearchParams();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const view = searchParams.get('view') || 'overview';

  const renderView = () => {
    switch (view) {
      case 'calendar':
        return <WeeklyCalendarView />;
      case 'tasks':
        return <TasksView />;
      case 'analytics':
        return <AnalyticsView />;
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
      default:
        return 'Dashboard';
    }
  };

  return (
    <>
      <SidebarInset className="flex-1 bg-background">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg" />
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-foreground">
              {getViewTitle()}
            </h1>
            <div className="h-6 w-px bg-border"></div>
            <div className="text-sm text-muted-foreground font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="h-9 w-9"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </header>
        
        <main className="flex-1 p-6">
          {renderView()}
        </main>
      </SidebarInset>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <SettingsView />
        </DialogContent>
      </Dialog>
    </>
  );
}
