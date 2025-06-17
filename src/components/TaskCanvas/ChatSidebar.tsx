import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Send, ChevronLeft, MessageSquare, Plus, Loader2, Search, PanelLeft, X, History, Trash2, Zap } from 'lucide-react';
import { sendMessageToGemini } from '@/lib/utils';
import { useChats } from '@/hooks/useChats';
import { useTaskActions } from '@/hooks/useTaskActions';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useState as useReactState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatSidebarProps {
  forceOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  registerMethods?: (methods: {
    openChat: () => void;
    sendMessage: (message: string) => void;
  }) => void;
}

function isArabic(text: string) {
  // Simple check for Arabic Unicode range
  return /[\u0600-\u06FF]/.test(text);
}

function CodeWithCopy({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const isBlock = className && className.includes('language-');
  const handleCopy = async () => {
    if (codeRef.current) {
      try {
        await navigator.clipboard.writeText(codeRef.current.innerText);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        return;
      }
    }
  };
  if (!isBlock) {
    // Inline code
    return <code className={cn('bg-gray-100 dark:bg-primary-300 px-1 py-0.5 rounded text-sm', className)} {...props}>{children}</code>;
  }
  // Block code
  return (
    <pre className="relative bg-gray-100 dark:bg-primary-300 p-2 md:p-4 rounded-lg overflow-x-auto my-2 md:my-4 w-full max-w-full min-w-0">
      <button
        className="absolute top-1 right-1 md:top-2 md:right-2 z-10 px-1.5 py-0.5 md:px-2 md:py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 opacity-80 hover:opacity-100 transition"
        onClick={handleCopy}
        type="button"
        tabIndex={-1}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <code ref={codeRef} className={cn('block whitespace-pre min-w-max', className)} {...props}>
        {children}
      </code>
    </pre>
  );
}

export default function ChatSidebar({ forceOpen, onOpenChange, registerMethods }: ChatSidebarProps) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [actionMode, setActionMode] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(25); // Track sidebar width for mobile
  const scrollRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const {
    chats,
    messages,
    loading,
    error,
    fetchChats,
    createChat,
    fetchMessages,
    sendMessage,
    setChats,
    setMessages,
  } = useChats();

  const { processTaskActions } = useTaskActions();

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // Prevent concurrent or repeated chat creation
  const creatingChatRef = useRef(false);

  // Track if chats have been fetched from Supabase
  const [chatsFetched, setChatsFetched] = useState(false);

  // Handle forced opening from parent
  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
    }
  }, [forceOpen]);

  // Notify parent of open state changes
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Register methods with parent component
  useEffect(() => {
    if (registerMethods) {
      registerMethods({
        openChat: () => setOpen(true),
        sendMessage: (message: string) => {
          // Store the message to be sent automatically
          setPendingMessage(message);
          setOpen(true);
        }
      });
    }
  }, [registerMethods]);

  // On sidebar open, fetch chats and track when fetch completes
  useEffect(() => {
    if (open) {
      setChatsFetched(false);
      fetchChats().then(() => setChatsFetched(true));
    } else {
      setChatsFetched(false);
    }
    // eslint-disable-next-line
  }, [open]);

  // Only create a new chat if there are truly no chats in the database AND no chat is currently being created
  useEffect(() => {
    if (!open) {
      creatingChatRef.current = false;
      return;
    }
    if (!chatsFetched || loading) return;
    if (chats && chats.length === 0 && !creatingChatRef.current) {
      creatingChatRef.current = true;
      (async () => {
        const chat = await createChat('New Chat');
        if (chat) {
          setSelectedChatId(chat.id);
          setModalOpen(false);
          insertWelcomeMessage(chat.id);
        }
        creatingChatRef.current = false;
      })();
    } else if (chats && chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [open, loading, chatsFetched, chats, selectedChatId]);

  // When selected chat changes, fetch its messages
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
    // eslint-disable-next-line
  }, [selectedChatId]);

  // Auto-send pending message when chat is ready
  useEffect(() => {
    if (pendingMessage && selectedChatId && !sending && !loading) {
      setInput(pendingMessage);
      setPendingMessage(null);
      // Send the message automatically
      setTimeout(() => {
        handleSendMessage(pendingMessage);
      }, 100);
    }
  }, [pendingMessage, selectedChatId, sending, loading]);

  // Scroll to bottom when messages change or chat is opened
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending, selectedChatId]);

  // Handle sending a message
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || sending || !selectedChatId) return;
    
    setSending(true);
    
    // Save user message to Supabase and update UI only with the result
    const userMsg = await sendMessage(selectedChatId, 'user', textToSend);
    setInput('');
    
    try {
      if (actionMode) {
        // Process as task action
        const result = await processTaskActions(textToSend);
        
        if (result.success) {
          await sendMessage(selectedChatId, 'ai', `✅ ${result.message}`);
        } else {
          await sendMessage(selectedChatId, 'ai', `❌ ${result.message}`);
        }
      } else {
        // Regular chat mode
        // If this is the user's first message in the chat, update the chat name using Gemini
        const currentChat = chats.find(chat => chat.id === selectedChatId);
        if (currentChat && currentChat.title === 'New Chat' && userMsg) {
          // Prompt Gemini for a chat title
          const titlePrompt = `Suggest a short, descriptive chat title for this conversation. The first message is: "${textToSend}". Return ONLY the name, no other words or explanation.`;
          const aiTitle = await sendMessageToGemini(titlePrompt);
          // Update chat title in Supabase
          await supabase.from('chats').update({ title: aiTitle }).eq('id', selectedChatId);
          // Update chat title in UI
          setChats(prev => prev.map(chat => chat.id === selectedChatId ? { ...chat, title: aiTitle } : chat));
        }
        
        // Get AI response
        const aiText = await sendMessageToGemini(textToSend);
        // Save AI message to Supabase and update UI only with the result
        await sendMessage(selectedChatId, 'ai', aiText);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      await sendMessage(selectedChatId, 'ai', '❌ Sorry, I encountered an error processing your request.');
    }
    
    setSending(false);
  };

  const handleSend = () => handleSendMessage();

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Create a new chat and select it
  const handleStartNewChat = async () => {
    const chat = await createChat('New Chat');
    if (chat) {
      setSelectedChatId(chat.id);
      setModalOpen(false);
    }
  };

  // Delete chat handler
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    await supabase.from('chats').delete().eq('id', chatId);
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (selectedChatId === chatId) setSelectedChatId(null);
  };

  // Helper to insert a first AI message when a new chat is created
  const insertWelcomeMessage = async (chatId: string) => {
    await supabase.from('messages').insert({
      chat_id: chatId,
      role: 'ai',
      content: 'How can I help you today?'
    });
    fetchMessages(chatId);
  };

  // Floating action button to open sidebar
  if (!open) {
    return (
      <button
        className="fixed bottom-[180px] right-4 z-40 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90 text-white shadow-2xl rounded-full p-3 flex items-center justify-center hover:scale-105 transition-transform border-2 border-white/20 backdrop-blur-sm"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }

  // Mobile version - use a simple fixed width overlay instead of resizable panels
  if (isMobile) {
    return (
      <div className="fixed top-0 right-0 h-full z-40 w-full pointer-events-none">
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={() => setOpen(false)}
        />
        
        {/* Sidebar content - takes most of the screen on mobile */}
        <div className="absolute top-0 right-0 h-full w-[90vw] max-w-md pointer-events-auto">
          <div className="h-full w-full flex flex-col shadow-2xl relative">
            {/* Updated Glassmorphism background with theme colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-500/20 backdrop-blur-2xl rounded-l-3xl border-l border-white/30" />
            
            {/* Sidebar Content - reuse the same content structure */}
            <div className="relative flex flex-col h-full w-full">
              {/* Header */}
              <div className="p-3 sm:p-4 border-b border-white/30 flex items-center gap-2 sm:gap-3 relative z-10 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 shadow-lg ring-2 ring-blue-500/30">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs sm:text-sm">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">
                    {actionMode ? 'Task management mode' : 'Ask anything about your tasks'}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                        title="Open chat history"
                        aria-label="Open chat history"
                        onClick={() => setModalOpen(true)}
                      >
                        <History className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open chat history</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                        title="Close chat sidebar"
                        aria-label="Close chat sidebar"
                        onClick={() => setOpen(false)}
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close chat sidebar</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Action Mode Toggle */}
              <div className="px-3 py-2 sm:px-4 sm:py-2.5 border-b border-white/30 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5 backdrop-blur-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Zap className={cn("w-4 h-4 sm:w-5 sm:h-5", actionMode ? "text-yellow-500" : "text-gray-400")} />
                  <Label htmlFor="action-mode" className="text-xs sm:text-sm font-medium cursor-pointer flex-1">
                    Action Mode
                  </Label>
                  <Switch
                    id="action-mode"
                    checked={actionMode}
                    onCheckedChange={setActionMode}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6 sm:ml-8">
                  {actionMode 
                    ? "AI will perform task actions directly" 
                    : "Regular conversation mode"
                  }
                </p>
              </div>

              <Separator className="opacity-30" />
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 z-10">
                <div ref={scrollRef} className="space-y-3 sm:space-y-4">
                  {messages.map((msg) => {
                    const isMsgArabic = isArabic(msg.content);
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shadow-md flex-shrink-0">
                            <AvatarImage src="/ai-avatar.png" alt="AI" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <Card
                          className={cn(
                            'px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] shadow-xl border-0 text-sm sm:text-base font-medium',
                            'overflow-x-auto min-w-0',
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white rounded-br-3xl rounded-tl-3xl rounded-bl-3xl shadow-lg'
                              : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl border border-white/40 backdrop-blur-sm'
                          )}
                        >
                          <div
                            className={cn(
                              'markdown-content w-full max-w-full overflow-x-auto',
                              isMsgArabic && 'font-arabic'
                            )}
                            dir={isMsgArabic ? 'rtl' : 'ltr'}
                            style={{ maxWidth: '100%' }}
                          >
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => (
                                  <p
                                    className={cn(
                                      'whitespace-pre-wrap break-words mb-2 sm:mb-3 last:mb-0',
                                      isMsgArabic && 'text-right'
                                    )}
                                    dir={isMsgArabic ? 'rtl' : 'ltr'}
                                    {...props}
                                  />
                                ),
                                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                table: ({ node, ...props }) => <div className="overflow-x-auto w-full my-2 sm:my-3"><table className="w-full border-collapse" {...props} /></div>,
                                thead: ({ node, ...props }) => <thead className="bg-primary/5" {...props} />,
                                tbody: ({ node, ...props }) => <tbody {...props} />,
                                tr: ({ node, ...props }) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
                                th: ({ node, ...props }) => <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-medium text-xs sm:text-sm" {...props} />,
                                td: ({ node, ...props }) => <td className="py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm" {...props} />,
                                ul: ({ node, ...props }) => (
                                  <ul
                                    className={cn(
                                      'mb-2 sm:mb-3',
                                      isMsgArabic ? 'pr-4 sm:pr-6' : 'pl-4 sm:pl-6',
                                      isMsgArabic ? 'list-disc-rtl' : 'list-disc'
                                    )}
                                    {...props}
                                  />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol
                                    className={cn(
                                      'mb-2 sm:mb-3',
                                      isMsgArabic ? 'pr-4 sm:pr-6' : 'pl-4 sm:pl-6',
                                      isMsgArabic ? 'list-decimal-rtl' : 'list-decimal'
                                    )}
                                    {...props}
                                  />
                                ),
                                li: ({ node, ...props }) => <li className="mb-0.5 sm:mb-1" {...props} />,
                                a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote
                                    className={cn(
                                      'py-1 my-2 sm:my-3 italic text-sm sm:text-base',
                                      isMsgArabic
                                        ? 'border-r-4 border-gray-300 dark:border-gray-600 pr-2 sm:pr-4'
                                        : 'border-l-4 border-gray-300 dark:border-gray-600 pl-2 sm:pl-4'
                                    )}
                                    {...props}
                                  />
                                ),
                                code: CodeWithCopy,
                                h1: ({ node, ...props }) => <h1 className={cn('text-lg sm:text-xl font-bold my-2 sm:my-3', isMsgArabic && 'text-right')} {...props} />,
                                h2: ({ node, ...props }) => <h2 className={cn('text-base sm:text-lg font-bold my-2 sm:my-3', isMsgArabic && 'text-right')} {...props} />,
                                h3: ({ node, ...props }) => <h3 className={cn('text-sm sm:text-base font-bold my-1 sm:my-2', isMsgArabic && 'text-right')} {...props} />,
                                h4: ({ node, ...props }) => <h4 className={cn('text-sm sm:text-base font-bold my-1 sm:my-2', isMsgArabic && 'text-right')} {...props} />,
                                img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-2 sm:my-3" {...props} />
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </Card>
                        {msg.role === 'user' && (
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shadow-md flex-shrink-0">
                            <AvatarImage src="/user-avatar.png" alt="You" />
                            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  {(loading || sending) && (
                    <div className="flex items-end gap-2 sm:gap-3 justify-start">
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 shadow-md flex-shrink-0">
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs">AI</AvatarFallback>
                      </Avatar>
                      <Card className="px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[80%] shadow-xl border-0 text-sm sm:text-base font-medium bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl flex items-center gap-2 border border-white/40 backdrop-blur-sm">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">
                          {actionMode ? 'Processing task action...' : 'Gemini is typing...'}
                        </span>
                      </Card>
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-xs sm:text-sm mt-2 bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-3 sm:p-4 border-t border-white/30 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5 flex items-center gap-2 sm:gap-3 backdrop-blur-xl z-10">
                <Input
                  placeholder={actionMode ? "Tell me what to do with your tasks..." : "Type your message..."}
                  className="flex-1 rounded-2xl bg-white/90 dark:bg-gray-900/90 border-white/40 shadow-inner px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base min-w-0 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={sending || loading || !selectedChatId}
                  autoFocus
                />
                <Button
                  variant="default"
                  size="icon"
                  className={cn(
                    "w-10 h-10 sm:w-11 sm:h-11 rounded-full shadow-lg flex-shrink-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white border-0 transition-all hover:scale-105",
                    actionMode && "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  )}
                  onClick={handleSend}
                  disabled={sending || loading || !input.trim() || !selectedChatId}
                >
                  {(sending || loading) ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version - use the resizable panels
  return (
    <div className="fixed top-0 right-0 h-full z-40 w-full pointer-events-none">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Invisible spacer panel that grows/shrinks */}
        <ResizablePanel 
          defaultSize={75} 
          minSize={0} 
          maxSize={95} 
          className="pointer-events-none" 
          onResize={(size) => setSidebarWidth(100 - size)}
        />
        
        <ResizableHandle 
          withHandle 
          className="w-2 bg-gradient-to-b from-blue-600/20 via-purple-600/20 to-pink-500/20 hover:bg-gradient-to-b hover:from-blue-600/40 hover:via-purple-600/40 hover:to-pink-500/40 transition-colors border-l border-white/40 flex items-center justify-center cursor-col-resize pointer-events-auto backdrop-blur-sm"
        />
        
        <ResizablePanel 
          defaultSize={25} 
          minSize={5} 
          maxSize={100}
          className="min-w-[280px] sm:min-w-[320px] pointer-events-auto"
        >
          <div className="h-full w-full flex flex-col shadow-2xl relative">
            {/* Updated Glassmorphism background with theme colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-500/10 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-pink-500/20 backdrop-blur-2xl rounded-l-3xl border-l border-white/30" />
            
            {/* Sidebar Content */}
            <div className="relative flex flex-col h-full w-full">
              {/* Header with updated gradient colors */}
              <div className="p-3 sm:p-4 md:p-6 border-b border-white/30 flex items-center gap-2 sm:gap-3 md:gap-4 relative z-10 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 shadow-lg ring-2 ring-blue-500/30">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs sm:text-sm">AI</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-lg md:text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">
                    {actionMode ? 'Task management mode' : 'Ask anything about your tasks'}
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                        title="Open chat history"
                        aria-label="Open chat history"
                        onClick={() => setModalOpen(true)}
                      >
                        <History className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open chat history</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-500/90 text-white shadow-md hover:shadow-lg transition-all hover:scale-105 border-0"
                        title="Close chat sidebar"
                        aria-label="Close chat sidebar"
                        onClick={() => setOpen(false)}
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close chat sidebar</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Action Mode Toggle with updated colors */}
              <div className="px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 border-b border-white/30 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5 backdrop-blur-sm">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Zap className={cn("w-4 h-4 sm:w-5 sm:h-5", actionMode ? "text-yellow-500" : "text-gray-400")} />
                  <Label htmlFor="action-mode" className="text-xs sm:text-sm font-medium cursor-pointer flex-1">
                    Action Mode
                  </Label>
                  <Switch
                    id="action-mode"
                    checked={actionMode}
                    onCheckedChange={setActionMode}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-6 sm:ml-8">
                  {actionMode 
                    ? "AI will perform task actions directly" 
                    : "Regular conversation mode"
                  }
                </p>
              </div>

              <Separator className="opacity-30" />
              
              {/* Messages with updated styling */}
              <ScrollArea className="flex-1 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 z-10">
                <div ref={scrollRef} className="space-y-3 sm:space-y-4 md:space-y-6">
                  {messages.map((msg) => {
                    const isMsgArabic = isArabic(msg.content);
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 shadow-md flex-shrink-0">
                            <AvatarImage src="/ai-avatar.png" alt="AI" />
                            <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs">AI</AvatarFallback>
                          </Avatar>
                        )}
                        <Card
                          className={cn(
                            'px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] shadow-xl border-0 text-sm sm:text-base font-medium',
                            'overflow-x-auto min-w-0',
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white rounded-br-3xl rounded-tl-3xl rounded-bl-3xl shadow-lg'
                              : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl border border-white/40 backdrop-blur-sm'
                          )}
                        >
                          <div
                            className={cn(
                              'markdown-content w-full max-w-full overflow-x-auto',
                              isMsgArabic && 'font-arabic'
                            )}
                            dir={isMsgArabic ? 'rtl' : 'ltr'}
                            style={{ maxWidth: '100%' }}
                          >
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => (
                                  <p
                                    className={cn(
                                      'whitespace-pre-wrap break-words mb-2 sm:mb-3 md:mb-4 last:mb-0',
                                      isMsgArabic && 'text-right'
                                    )}
                                    dir={isMsgArabic ? 'rtl' : 'ltr'}
                                    {...props}
                                  />
                                ),
                                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                table: ({ node, ...props }) => <div className="overflow-x-auto w-full my-2 sm:my-3 md:my-4"><table className="w-full border-collapse" {...props} /></div>,
                                thead: ({ node, ...props }) => <thead className="bg-primary/5" {...props} />,
                                tbody: ({ node, ...props }) => <tbody {...props} />,
                                tr: ({ node, ...props }) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
                                th: ({ node, ...props }) => <th className="py-1 px-2 sm:py-2 sm:px-4 text-left font-medium text-xs sm:text-sm" {...props} />,
                                td: ({ node, ...props }) => <td className="py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm" {...props} />,
                                ul: ({ node, ...props }) => (
                                  <ul
                                    className={cn(
                                      'mb-2 sm:mb-3 md:mb-4',
                                      isMsgArabic ? 'pr-4 sm:pr-6' : 'pl-4 sm:pl-6',
                                      isMsgArabic ? 'list-disc-rtl' : 'list-disc'
                                    )}
                                    {...props}
                                  />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol
                                    className={cn(
                                      'mb-2 sm:mb-3 md:mb-4',
                                      isMsgArabic ? 'pr-4 sm:pr-6' : 'pl-4 sm:pl-6',
                                      isMsgArabic ? 'list-decimal-rtl' : 'list-decimal'
                                    )}
                                    {...props}
                                  />
                                ),
                                li: ({ node, ...props }) => <li className="mb-0.5 sm:mb-1" {...props} />,
                                a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote
                                    className={cn(
                                      'py-1 my-2 sm:my-3 md:my-4 italic text-sm sm:text-base',
                                      isMsgArabic
                                        ? 'border-r-4 border-gray-300 dark:border-gray-600 pr-2 sm:pr-4'
                                        : 'border-l-4 border-gray-300 dark:border-gray-600 pl-2 sm:pl-4'
                                    )}
                                    {...props}
                                  />
                                ),
                                code: CodeWithCopy,
                                h1: ({ node, ...props }) => <h1 className={cn('text-lg sm:text-xl md:text-2xl font-bold my-2 sm:my-3 md:my-4', isMsgArabic && 'text-right')} {...props} />,
                                h2: ({ node, ...props }) => <h2 className={cn('text-base sm:text-lg md:text-xl font-bold my-2 sm:my-3', isMsgArabic && 'text-right')} {...props} />,
                                h3: ({ node, ...props }) => <h3 className={cn('text-sm sm:text-base md:text-lg font-bold my-1 sm:my-2', isMsgArabic && 'text-right')} {...props} />,
                                h4: ({ node, ...props }) => <h4 className={cn('text-sm sm:text-base font-bold my-1 sm:my-2', isMsgArabic && 'text-right')} {...props} />,
                                img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-2 sm:my-3 md:my-4" {...props} />
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </Card>
                        {msg.role === 'user' && (
                          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 shadow-md flex-shrink-0">
                            <AvatarImage src="/user-avatar.png" alt="You" />
                            <AvatarFallback className="bg-gradient-to-br from-gray-600 to-gray-800 text-white text-xs">U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  {(loading || sending) && (
                    <div className="flex items-end gap-2 sm:gap-3 justify-start">
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 shadow-md flex-shrink-0">
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white text-xs">AI</AvatarFallback>
                      </Avatar>
                      <Card className="px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 max-w-[85%] sm:max-w-[80%] md:max-w-[70%] shadow-xl border-0 text-sm sm:text-base font-medium bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl flex items-center gap-2 border border-white/40 backdrop-blur-sm">
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mr-2 text-blue-600 flex-shrink-0" />
                        <span className="text-xs sm:text-sm md:text-base">
                          {actionMode ? 'Processing task action...' : 'Gemini is typing...'}
                        </span>
                      </Card>
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-xs sm:text-sm mt-2 bg-red-50 dark:bg-red-900/20 p-2 sm:p-3 rounded-lg border border-red-200 dark:border-red-800">{error}</div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </ScrollArea>
              
              {/* Input with updated styling */}
              <div className="p-3 sm:p-4 md:p-6 border-t border-white/30 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5 flex items-center gap-2 sm:gap-3 backdrop-blur-xl z-10">
                <Input
                  placeholder={actionMode ? "Tell me what to do with your tasks..." : "Type your message..."}
                  className="flex-1 rounded-2xl bg-white/90 dark:bg-gray-900/90 border-white/40 shadow-inner px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base min-w-0 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  disabled={sending || loading || !selectedChatId}
                  autoFocus
                />
                <Button
                  variant="default"
                  size="icon"
                  className={cn(
                    "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full shadow-lg flex-shrink-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 text-white border-0 transition-all hover:scale-105",
                    actionMode && "from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  )}
                  onClick={handleSend}
                  disabled={sending || loading || !input.trim() || !selectedChatId}
                >
                  {(sending || loading) ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className="w-5 h-5 sm:w-6 sm:h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Chat History Modal with proper z-index and improved UI */}
      {modalOpen && (
        <>
          {/* Fixed Backdrop with proper z-index */}
          <div
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-black/60 via-blue-900/30 to-purple-900/30 backdrop-blur-md"
            onClick={() => setModalOpen(false)}
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Modal Content with higher z-index */}
          <div
            className="fixed left-1/2 top-1/2 z-[10000] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 animate-modal-in pointer-events-auto px-4"
            tabIndex={-1}
            style={{ outline: 'none' }}
            onKeyDown={e => { if (e.key === 'Escape') setModalOpen(false); }}
          >
            <div className="bg-gradient-to-br from-white/95 via-blue-50/95 to-purple-50/95 dark:from-gray-900/95 dark:via-blue-950/95 dark:to-purple-950/95 rounded-3xl shadow-2xl border border-white/40 dark:border-gray-700/40 backdrop-blur-xl overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Enhanced Header */}
              <div className="relative px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-500/10 border-b border-white/30 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-500/5" />
                <div className="relative flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 shadow-lg">
                    <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Chat History
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Manage your conversations
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon"
                          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transition-all hover:scale-105 border-0"
                          onClick={handleStartNewChat}
                        >
                          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>New chat</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 dark:hover:bg-red-900/30 transition-all hover:scale-110"
                          onClick={() => setModalOpen(false)}
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Close</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {/* Enhanced Search Section */}
              <div className="px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 flex-shrink-0">
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
                  <Input
                    placeholder="Search through your conversations..."
                    className="pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-2xl shadow-sm border-white/60 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition text-sm sm:text-base"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              {/* Enhanced Chat List */}
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8 flex-1 overflow-y-auto">
                <div className="space-y-2 sm:space-y-3">
                  {chats
                    .filter(chat => chat.title.toLowerCase().includes(search.toLowerCase()))
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className={cn(
                          "group relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer",
                          "bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/40 dark:border-gray-700/40",
                          "hover:bg-gradient-to-r hover:from-blue-50/80 hover:via-purple-50/80 hover:to-pink-50/80 dark:hover:from-blue-950/50 dark:hover:via-purple-950/50 dark:hover:to-pink-950/50",
                          "hover:border-blue-300/50 hover:shadow-lg hover:scale-[1.02]",
                          selectedChatId === chat.id && "ring-2 ring-blue-500/50 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-950/60 dark:via-purple-950/60 dark:to-pink-950/60 shadow-lg"
                        )}
                        onClick={() => {
                          setSelectedChatId(chat.id);
                          setModalOpen(false);
                        }}
                      >
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shadow-lg ring-2 ring-white/50 flex-shrink-0">
                          <AvatarImage src="/ai-avatar.png" alt={chat.title} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white font-semibold text-xs sm:text-sm">
                            {chat.title[0]?.toUpperCase() || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg text-foreground leading-tight mb-1 truncate">
                            {chat.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {new Date(chat.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {selectedChatId === chat.id && (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />  
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 transition-all hover:scale-110"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete chat</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  
                  {chats.filter(chat => chat.title.toLowerCase().includes(search.toLowerCase())).length === 0 && (
                    <div className="text-center py-8 sm:py-12">
                      <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50 mx-auto mb-3 sm:mb-4" />
                      <p className="text-muted-foreground text-base sm:text-lg font-medium">
                        {search ? 'No chats found' : 'No conversations yet'}
                      </p>
                      <p className="text-muted-foreground/70 text-xs sm:text-sm mt-2">
                        {search ? 'Try adjusting your search terms' : 'Start a new chat to begin'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Modal Animation Styles */}
          <style>{`
            @keyframes modal-in {
              0% { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.9);
                backdrop-filter: blur(0px);
              }
              100% { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1);
                backdrop-filter: blur(12px);
              }
            }
            .animate-modal-in {
              animation: modal-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
