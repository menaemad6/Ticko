
import { useCallback, useState } from 'react';
import { supabase, Chat, Message } from '@/integrations/supabase/client';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all chats for the current user
  const fetchChats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('User not authenticated');
      setIsLoading(false);
      return;
    }
    const { data, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (chatError) setError(chatError.message);
    setChats(data || []);
    setIsLoading(false);
  }, []);

  // Create a new chat
  const createNewChat = useCallback(async (title?: string) => {
    setIsLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('User not authenticated');
      setIsLoading(false);
      return null;
    }
    const chatTitle = title || `Chat ${new Date().toLocaleDateString()}`;
    const { data, error: insertError } = await supabase
      .from('chats')
      .insert([{ user_id: user.id, title: chatTitle }])
      .select()
      .single();
    if (insertError) setError(insertError.message);
    if (data) {
      setChats((prev) => [data, ...prev]);
      setCurrentChat(data);
    }
    setIsLoading(false);
    return data;
  }, []);

  // Fetch all messages for a chat
  const fetchMessages = useCallback(async (chat_id: string) => {
    setIsLoading(true);
    setError(null);
    const { data, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true });
    if (msgError) setError(msgError.message);
    setMessages(data || []);
    setIsLoading(false);
  }, []);

  // Send a message - simplified to match ChatSidebar usage
  const sendMessage = useCallback(async (content: string) => {
    if (!currentChat) {
      console.error('No current chat selected');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Add user message
    const { data: userMessage, error: userError } = await supabase
      .from('messages')
      .insert([{ chat_id: currentChat.id, role: 'user', content }])
      .select()
      .single();
    
    if (userError) {
      setError(userError.message);
      setIsLoading(false);
      return null;
    }
    
    if (userMessage) {
      setMessages((prev) => [...prev, userMessage]);
    }
    
    // Simulate AI response (you can replace this with actual AI integration)
    setTimeout(async () => {
      const aiResponse = `I received your message: "${content}". This is a placeholder response.`;
      const { data: aiMessage, error: aiError } = await supabase
        .from('messages')
        .insert([{ chat_id: currentChat.id, role: 'assistant', content: aiResponse }])
        .select()
        .single();
      
      if (aiError) {
        setError(aiError.message);
      } else if (aiMessage) {
        setMessages((prev) => [...prev, aiMessage]);
      }
      setIsLoading(false);
    }, 1000);
    
    return userMessage;
  }, [currentChat]);

  return {
    chats,
    currentChat,
    messages,
    isLoading,
    error,
    fetchChats,
    createNewChat,
    fetchMessages,
    sendMessage,
    setChats,
    setMessages,
    setCurrentChat,
  };
}
