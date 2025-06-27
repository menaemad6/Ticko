import { useCallback, useState } from 'react';
import { supabase, Chat, Message } from '@/integrations/supabase/client';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all chats for the current user
  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    const { data, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (chatError) setError(chatError.message);
    setChats(data || []);
    setLoading(false);
  }, []);

  // Create a new chat
  const createChat = useCallback(async (title: string) => {
    setLoading(true);
    setError(null);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError('User not authenticated');
      setLoading(false);
      return null;
    }
    const { data, error: insertError } = await supabase
      .from('chats')
      .insert([{ user_id: user.id, title }])
      .select()
      .single();
    if (insertError) setError(insertError.message);
    if (data) setChats((prev) => [data, ...prev]);
    setLoading(false);
    return data;
  }, []);

  // Fetch all messages for a chat
  const fetchMessages = useCallback(async (chat_id: string) => {
    setLoading(true);
    setError(null);
    const { data, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chat_id)
      .order('created_at', { ascending: true });
    if (msgError) setError(msgError.message);
    setMessages(data || []);
    setLoading(false);
  }, []);

  // Send a message (user or ai)
  const sendMessage = useCallback(async (chat_id: string, role: 'user' | 'ai', content: string) => {
    setLoading(true);
    setError(null);
    const { data, error: insertError } = await supabase
      .from('messages')
      .insert([{ chat_id, role, content }])
      .select()
      .single();
    if (insertError) setError(insertError.message);
    if (data) setMessages((prev) => [...prev, data]);
    setLoading(false);
    return data;
  }, []);

  return {
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
  };
} 