import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';
import { queryKeys } from './use-api';

export function useRealtimeMessages() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('New message received:', payload);
          
          // Invalidate conversations list to update last message and unread count
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
          
          // Invalidate messages for the specific conversation
          const conversationId = payload.new.conversation_id;
          queryClient.invalidateQueries({ 
            queryKey: queryKeys.messages(conversationId) 
          });
        }
      )
      .subscribe();

    // Subscribe to conversation updates (for last_message_at changes)
    const conversationsSubscription = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          console.log('Conversation updated:', payload);
          
          // Invalidate conversations list
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
        }
      )
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
      conversationsSubscription.unsubscribe();
    };
  }, [user, queryClient]);
}
