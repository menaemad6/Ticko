
import React, { useState, useCallback, useRef } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TaskSidebar } from './Sidebar';
import TaskCanvasFlow from './TaskCanvasFlow';
import ChatSidebarModal from './ChatSidebarModal';
import CelebrationEffects from '@/components/CelebrationEffects';
import { Task } from '@/types/task';
import { useAIHelp } from '@/hooks/useAIHelp';
import { useCelebration } from '@/hooks/useCelebration';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

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
  const { celebration, hideCelebration } = useCelebration();

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
        <SidebarInset className="flex-1 relative">
          <ReactFlowProvider>
            <TaskCanvasFlow 
              registerQuickActionHandler={registerQuickActionHandler}
              registerTemplateHandler={registerTemplateHandler}
              isActionInProgress={isActionInProgress}
              onActionStateChange={setIsActionInProgress}
              onGetAIHelp={handleGetAIHelp}
            />
          </ReactFlowProvider>
          
          {/* Floating Chat Button */}
          <Button
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 shadow-lg border-0 z-40"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </Button>
        </SidebarInset>
        
        <ChatSidebarModal 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          registerMethods={registerChatMethods}
        />
        
        {/* Celebration Effects */}
        <CelebrationEffects
          show={celebration.show}
          type={celebration.type as 'task-complete' | 'milestone' | 'achievement'}
          onComplete={hideCelebration}
        />
      </div>
    </SidebarProvider>
  );
}
