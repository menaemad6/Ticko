
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DashboardSidebar } from './DashboardSidebar';
import { CalendarView } from './CalendarView';
import { useTasks } from '@/hooks/useTasks';

interface DashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [selectedView, setSelectedView] = useState<'calendar' | 'tasks' | 'analytics'>('calendar');
  const { tasks } = useTasks();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-0 overflow-hidden bg-background border-border">
        <div className="flex h-full w-full">
          {/* Left Sidebar */}
          <DashboardSidebar 
            selectedView={selectedView}
            onViewChange={setSelectedView}
            taskCount={tasks.length}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="border-b border-border px-6 py-4 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage your tasks and track your progress
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Live</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {selectedView === 'calendar' && <CalendarView tasks={tasks} />}
              {selectedView === 'tasks' && (
                <div className="p-6 h-full overflow-auto">
                  <div className="text-center text-muted-foreground mt-20">
                    <h3 className="text-lg font-medium mb-2">Tasks View</h3>
                    <p>Task management view coming soon...</p>
                  </div>
                </div>
              )}
              {selectedView === 'analytics' && (
                <div className="p-6 h-full overflow-auto">
                  <div className="text-center text-muted-foreground mt-20">
                    <h3 className="text-lg font-medium mb-2">Analytics View</h3>
                    <p>Analytics dashboard coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
