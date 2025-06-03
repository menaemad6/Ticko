
import React, { useState, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TaskSidebar } from './Sidebar';
import TaskCanvasFlow from './TaskCanvasFlow';
import ChatSidebar from './ChatSidebar';
import { useCanvasDemo } from '@/hooks/useCanvasDemo';

export default function TaskCanvas() {
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [quickActionHandler, setQuickActionHandler] = useState<((action: string) => void) | null>(null);
  const [templateHandler, setTemplateHandler] = useState<((templateName: string) => void) | null>(null);
  
  // Initialize demo functionality
  useCanvasDemo();

  const registerQuickActionHandler = useCallback((handler: (action: string) => void) => {
    setQuickActionHandler(() => handler);
  }, []);

  const registerTemplateHandler = useCallback((handler: (templateName: string) => void) => {
    setTemplateHandler(() => handler);
  }, []);

  const handleQuickAction = (action: string) => {
    if (quickActionHandler && !isActionInProgress) {
      quickActionHandler(action);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    if (templateHandler && !isActionInProgress) {
      templateHandler(templateName);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div data-demo="sidebar">
          <TaskSidebar 
            onQuickAction={handleQuickAction}
            onTemplateSelect={handleTemplateSelect}
            isActionInProgress={isActionInProgress}
          />
        </div>
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
        <ChatSidebar />
      </div>
    </SidebarProvider>
  );
}
