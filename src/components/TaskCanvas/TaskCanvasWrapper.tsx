
import React, { useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TaskSidebar } from './Sidebar';
import TaskCanvasFlow from './TaskCanvasFlow';

export default function TaskCanvasWrapper() {
  const [quickActionHandler, setQuickActionHandler] = React.useState<((action: string) => void) | null>(null);
  const [templateHandler, setTemplateHandler] = React.useState<((templateName: string) => void) | null>(null);

  const registerQuickActionHandler = useCallback((handler: (action: string) => void) => {
    setQuickActionHandler(() => handler);
  }, []);

  const registerTemplateHandler = useCallback((handler: (templateName: string) => void) => {
    setTemplateHandler(() => handler);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TaskSidebar 
          onQuickAction={quickActionHandler || undefined}
          onTemplateSelect={templateHandler || undefined}
        />
        <SidebarInset className="flex-1">
          <ReactFlowProvider>
            <TaskCanvasFlow 
              registerQuickActionHandler={registerQuickActionHandler}
              registerTemplateHandler={registerTemplateHandler}
            />
          </ReactFlowProvider>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
