import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, ChevronLeft, MessageSquare, Plus, Loader2, Search } from 'lucide-react';
import { sendMessageToGemini } from '@/lib/utils';
import { useChats } from '@/hooks/useChats';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { useState as useReactState } from 'react';

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

export default function ChatSidebar() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
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

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  // On sidebar open, fetch chats and select the most recent
  useEffect(() => {
    if (open) {
      fetchChats().then(() => {
        if (chats.length > 0) {
          setSelectedChatId(chats[0].id);
        }
      });
    }
    // eslint-disable-next-line
  }, [open]);

  // When selected chat changes, fetch its messages
  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
    // eslint-disable-next-line
  }, [selectedChatId]);

  // Scroll to bottom when messages change or chat is opened
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, sending, selectedChatId]);

  // Handle sending a message
  const handleSend = async () => {
    if (!input.trim() || sending || !selectedChatId) return;
    setSending(true);
    // Save user message to Supabase and update UI only with the result
    const userMsg = await sendMessage(selectedChatId, 'user', input);
    setInput('');
    // If this is the first message in the chat, update the chat name using Gemini
    const chatMessages = messages.filter(m => m.chat_id === selectedChatId);
    if (chatMessages.length === 0 && userMsg) {
      // Prompt Gemini for a chat title
      const titlePrompt = `Suggest a short, descriptive chat title for this conversation. The first message is: "${input}". Return ONLY the name, no other words or explanation.`;
      const aiTitle = await sendMessageToGemini(titlePrompt);
      // Update chat title in Supabase
      await supabase.from('chats').update({ title: aiTitle }).eq('id', selectedChatId);
      // Update chat title in UI
      setChats(prev => prev.map(chat => chat.id === selectedChatId ? { ...chat, title: aiTitle } : chat));
    }
    // Get AI response
    const aiText = await sendMessageToGemini(input);
    // Save AI message to Supabase and update UI only with the result
    await sendMessage(selectedChatId, 'ai', aiText);
    setSending(false);
  };

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

  // Floating action button to open sidebar
  if (!open) {
    return (
      <button
        className="fixed right-6 bottom-6 z-50 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white shadow-2xl rounded-full p-4 flex items-center justify-center hover:scale-105 transition-transform backdrop-blur-lg border border-white/20"
        onClick={() => setOpen(true)}
        aria-label="Open AI Chat"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
      >
        <MessageSquare className="w-7 h-7" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 h-full w-full max-w-md z-40 flex flex-col shadow-2xl" style={{ pointerEvents: 'auto' }}>
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-purple-100/60 dark:from-gray-900/80 dark:via-gray-950/80 dark:to-purple-950/60 backdrop-blur-2xl rounded-l-3xl border-l border-white/20" />
      {/* Sidebar Content */}
      <div className="relative flex flex-col h-full w-full">
        {/* Collapse Button */}
        <button
          className="absolute -left-5 top-6 z-50 bg-white/80 dark:bg-gray-900/80 border border-border shadow-lg rounded-full p-1 hover:scale-110 transition-all"
          onClick={() => setOpen(false)}
          aria-label="Collapse chat sidebar"
        >
          <ChevronLeft className="w-5 h-5 text-primary" />
        </button>
        {/* Header */}
        <div className="p-6 border-b border-white/20 flex items-center gap-4 relative z-10">
          <Avatar className="w-12 h-12 shadow-lg ring-2 ring-primary/30">
            <AvatarImage src="/ai-avatar.png" alt="AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-bold text-xl text-primary drop-shadow-sm">AI Assistant</div>
            <div className="text-xs text-muted-foreground">Ask anything about your tasks</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => setModalOpen(true)}
            title="Open chats"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
          </Button>
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
                        ? 'bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground rounded-br-3xl rounded-tl-3xl rounded-bl-3xl'
                        : 'bg-white/80 dark:bg-gray-900/80 text-foreground rounded-bl-3xl rounded-tr-3xl rounded-br-3xl'
                    )}
                    style={{ backdropFilter: 'blur(2px)', maxWidth: '70vw' }}
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
                <Card className="px-5 py-3 max-w-[70%] shadow-xl border-0 text-base font-medium bg-white/80 dark:bg-gray-900/80 text-foreground rounded-bl-3xl rounded-tr-3xl rounded-br-3xl flex items-center gap-2" style={{ backdropFilter: 'blur(2px)' }}>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Gemini is typing...
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
            placeholder="Type your message..."
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
            className="rounded-full shadow-lg"
            onClick={handleSend}
            disabled={sending || loading || !input.trim() || !selectedChatId}
          >
            {(sending || loading) ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </Button>
        </div>
      </div>
      {/* Modal for Chats */}
      {modalOpen && (
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
                <Button variant="ghost" size="icon" className="ml-auto rounded-full" title="New chat" onClick={handleStartNewChat}>
                  <Plus className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => setModalOpen(false)} aria-label="Close chats modal">
                  <ChevronLeft className="w-7 h-7 rotate-180" />
                </Button>
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
                        className={`flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-primary/30 hover:shadow-md transition cursor-pointer bg-white/70 dark:bg-gray-800/70 ${selectedChatId === chat.id ? 'border-primary/60 shadow-lg bg-primary/10 dark:bg-primary/20' : ''}`}
                        onClick={() => {
                          setSelectedChatId(chat.id);
                          setModalOpen(false);
                        }}
                      >
                        <Avatar className="w-9 h-9 shadow-sm">
                          <AvatarImage src="/ai-avatar.png" alt={chat.title} />
                          <AvatarFallback>{chat.title[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold truncate text-base leading-tight">{chat.title}</div>
                        </div>
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