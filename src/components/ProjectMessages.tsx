import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Image, 
  FileText,
  Clock,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  message_type: 'text' | 'milestone_update' | 'payment_request' | 'file_upload';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    nickname: string;
    avatar_url?: string;
  };
}

interface ProjectMessagesProps {
  projectId: string;
}

export default function ProjectMessages({ projectId }: ProjectMessagesProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch project messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['project-messages', projectId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('project_messages')
          .select(`
            *,
            sender:profiles!project_messages_sender_id_fkey(full_name, nickname, avatar_url)
          `)
          .eq('project_id', projectId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          return [];
        }

        return data || [];
      } catch (err) {
        console.error('Exception fetching messages:', err);
        return [];
      }
    },
    enabled: !!projectId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      message: string;
      message_type?: string;
      attachment_url?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('project_messages')
        .insert([{
          project_id: projectId,
          sender_id: user.id,
          ...messageData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
      setNewMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      const { error } = await supabase
        .from('project_messages')
        .update({ is_read: true })
        .in('id', messageIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-messages', projectId] });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark unread messages as read when component mounts
  useEffect(() => {
    const unreadMessages = messages
      .filter(m => !m.is_read && m.sender_id !== user?.id)
      .map(m => m.id);

    if (unreadMessages.length > 0) {
      markAsReadMutation.mutate(unreadMessages);
    }
  }, [messages, user?.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      message: newMessage.trim(),
      message_type: 'text'
    });
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone_update': return <CheckCircle className="w-4 h-4" />;
      case 'payment_request': return <FileText className="w-4 h-4" />;
      case 'file_upload': return <Paperclip className="w-4 h-4" />;
      default: return null;
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'milestone_update': return 'bg-green-100 text-green-800';
      case 'payment_request': return 'bg-blue-100 text-blue-800';
      case 'file_upload': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Messages Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Discussion</h3>
          <p className="text-sm text-muted-foreground">
            Communicate with your project partner
          </p>
        </div>
        <Badge variant="outline">
          {messages.length} messages
        </Badge>
      </div>

      {/* Messages List */}
      <Card className="h-96 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold mb-2">No Messages Yet</h4>
                <p className="text-muted-foreground">
                  Start the conversation by sending a message below.
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                const isUnread = !message.is_read && !isOwnMessage;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.sender.avatar_url} />
                      <AvatarFallback>
                        {message.sender.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'text-right' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender.nickname}
                        </span>
                        {message.message_type !== 'text' && (
                          <Badge 
                            className={`text-xs ${getMessageTypeColor(message.message_type)}`}
                          >
                            <div className="flex items-center gap-1">
                              {getMessageTypeIcon(message.message_type)}
                              {message.message_type.replace('_', ' ')}
                            </div>
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatMessageTime(message.created_at)}
                        </span>
                        {isUnread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>

                      <div
                        className={`rounded-lg px-3 py-2 ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        
                        {message.attachment_url && (
                          <div className="mt-2">
                            <a
                              href={message.attachment_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs underline hover:no-underline"
                            >
                              <Paperclip className="w-3 h-3" />
                              View Attachment
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="pr-10"
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={!newMessage.trim() || sendMessageMutation.isPending}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
