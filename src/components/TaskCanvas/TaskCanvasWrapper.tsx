
import React, { useCallback, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TaskSidebar } from './Sidebar';
import TaskCanvasFlow from './TaskCanvasFlow';

export default function TaskCanvasWrapper() {
  const [quickActionHandler, setQuickActionHandler] = React.useState<((action: string) => void) | null>(null);
  const [templateHandler, setTemplateHandler] = React.useState<((templateName: string) => void) | null>(null);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

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
          isActionInProgress={isActionInProgress}
        />
        <SidebarInset className="flex-1">
          <ReactFlowProvider>
            <TaskCanvasFlow 
              registerQuickActionHandler={registerQuickActionHandler}
              registerTemplateHandler={registerTemplateHandler}
              isActionInProgress={isActionInProgress}
              onActionStateChange={setIsActionInProgress}
            />
          </ReactFlowProvider>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
