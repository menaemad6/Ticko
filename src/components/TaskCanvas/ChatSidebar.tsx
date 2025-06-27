
import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, LayoutDashboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useChats } from '@/hooks/useChats';
import { DashboardModal } from './DashboardModal';

interface ChatSidebarProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  registerMethods?: (methods: {
    openChat: () => void;
    sendMessage: (message: string) => void;
  }) => void;
}

export default function ChatSidebar({ 
  forceOpen = false, 
  onOpenChange,
  registerMethods 
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [message, setMessage] = useState('');
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    currentChat, 
    messages, 
    sendMessage: sendChatMessage, 
    isLoading,
    createNewChat 
  } = useChats();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle forced open state
  useEffect(() => {
    if (forceOpen !== isOpen) {
      setIsOpen(forceOpen);
    }
  }, [forceOpen]);

  // Register methods for external control
  useEffect(() => {
    if (registerMethods) {
      registerMethods({
        openChat: () => setIsOpen(true),
        sendMessage: (msg: string) => {
          setMessage(msg);
          handleSendMessage(msg);
        }
      });
    }
  }, [registerMethods]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    try {
      if (!currentChat) {
        await createNewChat();
      }
      
      await sendChatMessage(textToSend);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg border-2 hover:scale-110 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-96 p-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">AI Assistant</h2>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDashboardOpen(true)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Open Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenChange(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Start a conversation with your AI assistant</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                        msg.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground border"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground border rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-card">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !message.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Dashboard Modal */}
      <DashboardModal 
        open={isDashboardOpen}
        onOpenChange={setIsDashboardOpen}
      />
    </>
  );
}
