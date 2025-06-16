
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Bot, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useChats } from '@/hooks/useChats';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatSidebarModalProps {
  isOpen: boolean;
  onClose: () => void;
  registerMethods?: (methods: {
    openChat: () => void;
    sendMessage: (message: string) => void;
  }) => void;
}

export default function ChatSidebarModal({ isOpen, onClose, registerMethods }: ChatSidebarModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { chats, loading: chatsLoading, createChat, sendMessage: sendChatMessage } = useChats();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (registerMethods) {
      registerMethods({
        openChat: () => {
          // Chat is already open since this is a modal
        },
        sendMessage: (message: string) => {
          handleSendMessage(message);
        }
      });
    }
  }, [registerMethods]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual AI integration)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about: "${content}". I'm here to help you with your task management needs. Would you like me to help you organize your tasks, create new ones, or provide suggestions for better productivity?`,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="fixed right-4 top-4 bottom-4 w-96 max-w-96 h-[calc(100vh-2rem)] m-0 p-0 bg-gradient-to-br from-blue-500/95 via-purple-500/95 to-pink-500/95 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden z-[100]"
        style={{ transform: 'none', left: 'auto', top: '1rem', right: '1rem', bottom: '1rem' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 p-4 border-b border-white/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-white font-semibold">
                <Bot className="w-5 h-5" />
                AI Assistant
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-white hover:bg-white/10 h-8 px-2"
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="text-white hover:bg-white/10 h-8 px-2"
                  disabled={messages.length === 0}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 h-8 px-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-2 mt-2">
                <User className="w-4 h-4 text-white/70" />
                <span className="text-sm text-white/70">{user.email}</span>
                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                  Online
                </Badge>
              </div>
            )}
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-sm">
                      Welcome! I'm your AI assistant. Ask me anything about managing your tasks.
                    </p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.isUser
                          ? 'bg-white/20 backdrop-blur-sm text-white ml-auto border border-white/30'
                          : 'bg-white/10 backdrop-blur-sm text-white border border-white/20'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.isUser && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
          </div>

          {/* Input */}
          <div className="flex-shrink-0 p-4 border-t border-white/20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your tasks..."
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-white/50 focus:border-white/40"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
