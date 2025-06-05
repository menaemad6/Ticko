
import React, { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TaskSidebar } from './Sidebar';
import TaskCanvasFlow from './TaskCanvasFlow';
import ChatSidebar from './ChatSidebar';
import { Task } from '@/types/task';
import { useAIHelp } from '@/hooks/useAIHelp';

export default function TaskCanvas() {
  const [isActionInProgress, setIsActionInProgress] = useState(false);
  const [quickActionHandler, setQuickActionHandler] = useState<((action: string) => void) | null>(null);
  const [templateHandler, setTemplateHandler] = useState<((templateName: string) => void) | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  // Ref to trigger chat functions
  const chatRef = useRef<{
    openChat: () => void;
    sendMessage: (message: string) => void;
  } | null>(null);

  const { requestAIHelp } = useAIHelp();

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

  const handleGetAIHelp = useCallback((task: Task) => {
    requestAIHelp(
      task,
      () => {
        setIsChatOpen(true);
        chatRef.current?.openChat();
      },
      (message: string) => {
        chatRef.current?.sendMessage(message);
      }
    );
  }, [requestAIHelp]);

  const registerChatMethods = useCallback((methods: {
    openChat: () => void;
    sendMessage: (message: string) => void;
  }) => {
    chatRef.current = methods;
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TaskSidebar 
          onQuickAction={handleQuickAction}
          onTemplateSelect={handleTemplateSelect}
          isActionInProgress={isActionInProgress}
        />
        <SidebarInset className="flex-1">
          <ReactFlowProvider>
            <TaskCanvasFlow 
              registerQuickActionHandler={registerQuickActionHandler}
              registerTemplateHandler={registerTemplateHandler}
              isActionInProgress={isActionInProgress}
              onActionStateChange={setIsActionInProgress}
              onGetAIHelp={handleGetAIHelp}
            />
          </ReactFlowProvider>
        </SidebarInset>
        <ChatSidebar 
          forceOpen={isChatOpen}
          onOpenChange={setIsChatOpen}
          registerMethods={registerChatMethods}
        />
      </div>
    </SidebarProvider>
  );
}
