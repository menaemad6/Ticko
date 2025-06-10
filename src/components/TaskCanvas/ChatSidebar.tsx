
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
    <pre className="relative bg-gray-100 dark:bg-primary-300 p-4 rounded-lg overflow-x-auto my-4 w-full max-w-full min-w-0">
      <button
        className="absolute top-2 right-2 z-10 px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 opacity-80 hover:opacity-100 transition"
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

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
        className="fixed bottom-[180px] right-4 z-40 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground shadow-lg rounded-full p-3 flex items-center justify-center hover:scale-105 transition-transform border-none"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
        style={{ boxShadow: '0 4px 24px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full z-40 w-[600px]" style={{ pointerEvents: 'auto' }}>
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Empty panel to allow resizing from the left */}
        <ResizablePanel defaultSize={0} minSize={0} maxSize={0} className="w-0" />
        
        <ResizableHandle 
          withHandle 
          className="w-2 bg-white/20 hover:bg-primary/30 transition-colors border-r border-white/30 flex items-center justify-center group relative"
        />
        
        <ResizablePanel 
          defaultSize={100} 
          minSize={50} 
          maxSize={100}
          className="min-w-[300px]"
        >
          <div className="h-full w-full flex flex-col shadow-2xl">
            {/* Glassmorphism background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-purple-100/60 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-purple-950/60 backdrop-blur-2xl rounded-l-3xl border-l border-white/20" />
            
            {/* Sidebar Content */}
            <div className="relative flex flex-col h-full w-full">
              {/* Header */}
              <div className="p-6 border-b border-white/20 flex items-center gap-4 relative z-10">
                <Avatar className="w-12 h-12 shadow-lg ring-2 ring-primary/30">
                  <AvatarImage src="/ai-avatar.png" alt="AI" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-bold text-xl text-primary drop-shadow-sm">AI Assistant</div>
                  <div className="text-xs text-muted-foreground">
                    {actionMode ? 'Task management mode' : 'Ask anything about your tasks'}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground shadow-md transition-colors"
                        title="Open chat history"
                        aria-label="Open chat history"
                        onClick={() => setModalOpen(true)}
                      >
                        <History className="w-6 h-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Open chat history</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        className="rounded-full bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground shadow-md transition-colors"
                        title="Close chat sidebar"
                        aria-label="Close chat sidebar"
                        onClick={() => setOpen(false)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Close chat sidebar</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Action Mode Toggle */}
              <div className="px-6 py-3 border-b border-white/20 bg-white/20 dark:bg-gray-900/20 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Zap className={cn("w-5 h-5", actionMode ? "text-yellow-500" : "text-gray-400")} />
                  <Label htmlFor="action-mode" className="text-sm font-medium cursor-pointer flex-1">
                    Action Mode
                  </Label>
                  <Switch
                    id="action-mode"
                    checked={actionMode}
                    onCheckedChange={setActionMode}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 ml-8">
                  {actionMode 
                    ? "AI will perform task actions directly" 
                    : "Regular conversation mode"
                  }
                </p>
              </div>

              <Separator className="opacity-30" />
              
              {/* Messages */}
              <ScrollArea className="flex-1 p-6 space-y-6 z-10">
                <div ref={scrollRef} className="space-y-6">
                  {messages.map((msg) => {
                    const isMsgArabic = isArabic(msg.content);
                    return (
                      <div key={msg.id} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                          <Avatar className="w-9 h-9 shadow-md">
                            <AvatarImage src="/ai-avatar.png" alt="AI" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <Card
                          className={cn(
                            'px-5 py-3 max-w-[70%] shadow-xl border-0 text-base font-medium',
                            'overflow-x-auto',
                            msg.role === 'user'
                              ? 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-3xl rounded-tl-3xl rounded-bl-3xl'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl border border-gray-200 dark:border-gray-700'
                          )}
                          style={{ maxWidth: '70vw' }}
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
                                      'whitespace-pre-wrap break-words mb-4 last:mb-0',
                                      isMsgArabic && 'text-right'
                                    )}
                                    dir={isMsgArabic ? 'rtl' : 'ltr'}
                                    {...props}
                                  />
                                ),
                                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                table: ({ node, ...props }) => <div className="overflow-x-auto w-full my-4"><table className="w-full border-collapse" {...props} /></div>,
                                thead: ({ node, ...props }) => <thead className="bg-primary/5" {...props} />,
                                tbody: ({ node, ...props }) => <tbody {...props} />,
                                tr: ({ node, ...props }) => <tr className="border-b border-gray-200 dark:border-gray-700" {...props} />,
                                th: ({ node, ...props }) => <th className="py-2 px-4 text-left font-medium" {...props} />,
                                td: ({ node, ...props }) => <td className="py-2 px-4" {...props} />,
                                ul: ({ node, ...props }) => (
                                  <ul
                                    className={cn(
                                      'mb-4',
                                      isMsgArabic ? 'pr-6' : 'pl-6',
                                      isMsgArabic ? 'list-disc-rtl' : 'list-disc'
                                    )}
                                    {...props}
                                  />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol
                                    className={cn(
                                      'mb-4',
                                      isMsgArabic ? 'pr-6' : 'pl-6',
                                      isMsgArabic ? 'list-decimal-rtl' : 'list-decimal'
                                    )}
                                    {...props}
                                  />
                                ),
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                a: ({ node, href, ...props }) => <a href={href} className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote
                                    className={cn(
                                      'py-1 my-4 italic',
                                      isMsgArabic
                                        ? 'border-r-4 border-gray-300 dark:border-gray-600 pr-4'
                                        : 'border-l-4 border-gray-300 dark:border-gray-600 pl-4'
                                    )}
                                    {...props}
                                  />
                                ),
                                code: CodeWithCopy,
                                h1: ({ node, ...props }) => <h1 className={cn('text-2xl font-bold my-4', isMsgArabic && 'text-right')} {...props} />,
                                h2: ({ node, ...props }) => <h2 className={cn('text-xl font-bold my-3', isMsgArabic && 'text-right')} {...props} />,
                                h3: ({ node, ...props }) => <h3 className={cn('text-lg font-bold my-2', isMsgArabic && 'text-right')} {...props} />,
                                h4: ({ node, ...props }) => <h4 className={cn('text-base font-bold my-2', isMsgArabic && 'text-right')} {...props} />,
                                img: ({ node, ...props }) => <img className="max-w-full h-auto rounded-lg my-4" {...props} />
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </Card>
                        {msg.role === 'user' && (
                          <Avatar className="w-9 h-9 shadow-md">
                            <AvatarImage src="/user-avatar.png" alt="You" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })}
                  {(loading || sending) && (
                    <div className="flex items-end gap-3 justify-start">
                      <Avatar className="w-9 h-9 shadow-md">
                        <AvatarImage src="/ai-avatar.png" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <Card className="px-5 py-3 max-w-[70%] shadow-xl border-0 text-base font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-3xl rounded-tr-3xl rounded-br-3xl flex items-center gap-2 border border-gray-200 dark:border-gray-700">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {actionMode ? 'Processing task action...' : 'Gemini is typing...'}
                      </Card>
                    </div>
                  )}
                  {error && (
                    <div className="text-red-500 text-sm mt-2">{error}</div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>
              </ScrollArea>
              
              {/* Input */}
              <div className="p-6 border-t border-white/20 bg-white/60 dark:bg-gray-900/60 flex items-center gap-3 backdrop-blur-xl z-10">
                <Input
                  placeholder={actionMode ? "Tell me what to do with your tasks..." : "Type your message..."}
                  className="flex-1 rounded-2xl bg-white/80 dark:bg-gray-900/80 border-none shadow-inner px-4 py-3 text-base"
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
                    "rounded-full shadow-lg",
                    actionMode && "bg-yellow-500 hover:bg-yellow-600"
                  )}
                  onClick={handleSend}
                  disabled={sending || loading || !input.trim() || !selectedChatId}
                >
                  {(sending || loading) ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      {/* Modal for Chats */}
      {modalOpen && (
        // ... keep existing code (modal content remains the same)
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          {/* Dropdown Modal */}
          <div
            className="fixed left-1/2 top-0 z-50 w-full max-w-xl -translate-x-1/2 mt-3 animate-drop-in"
            tabIndex={-1}
            style={{ outline: 'none' }}
            onKeyDown={e => { if (e.key === 'Escape') setModalOpen(false); }}
          >
            <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center px-6 py-4 gap-3 border-b border-white/20">
                <MessageSquare className="w-7 h-7 text-primary" />
                <span className="font-bold text-xl">Chats</span>
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="icon" className="rounded-full" title="New chat" onClick={handleStartNewChat}>
                    <Plus className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" title="Close chats modal" onClick={() => setModalOpen(false)} aria-label="Close chats modal">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>
              <div className="px-6 pt-2 pb-2">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search chats"
                    className="pl-10 pr-3 py-2 rounded-xl shadow-sm border border-border bg-white/70 dark:bg-gray-800/70 focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition text-base"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button
                  className="w-full mb-4 font-semibold justify-start bg-primary/10 hover:bg-primary/20 text-primary rounded-xl py-2"
                  onClick={handleStartNewChat}
                >
                  Start New Chat
                </Button>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {chats
                    .filter(chat => chat.title.toLowerCase().includes(search.toLowerCase()))
                    .map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-primary/30 hover:shadow-md transition bg-white/70 dark:bg-gray-800/70 ${selectedChatId === chat.id ? 'border-l-4 border-l-primary/90 shadow-lg bg-primary/10 dark:bg-primary/20' : ''}`}
                      >
                        <Avatar className="w-9 h-9 shadow-sm">
                          <AvatarImage src="/ai-avatar.png" alt={chat.title} />
                          <AvatarFallback>{chat.title[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => {
                          setSelectedChatId(chat.id);
                          setModalOpen(false);
                        }}>
                          <div className="font-semibold truncate text-base leading-tight">{chat.title}</div>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full text-red-500 hover:bg-red-100 hover:text-red-700"
                              aria-label="Delete chat"
                              title="Delete chat"
                              onClick={() => handleDeleteChat(chat.id)}
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete chat</TooltipContent>
                        </Tooltip>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes drop-in {
              0% { opacity: 0; transform: translate(-50%, -40px); }
              100% { opacity: 1; transform: translate(-50%, 0); }
            }
            .animate-drop-in {
              animation: drop-in 0.35s cubic-bezier(.4,1.7,.6,1) both;
            }
          `}</style>
        </>
      )}
    </div>
  );
}
