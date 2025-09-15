import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Users,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface TeamChatProps {
  teamId: string;
}

export default function TeamChat({ teamId }: TeamChatProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch team info
  const { data: teamInfo } = useQuery({
    queryKey: ["team-info", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("name, description, team_avatar_url")
        .eq("id", teamId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  // Fetch team members
  const { data: teamMembers = [] } = useQuery({
    queryKey: ["team-members", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_team_members", { team_uuid: teamId });

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  // Fetch team messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["team-messages", teamId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_messages")
        .select(`
          id,
          message,
          message_type,
          file_url,
          file_name,
          file_size,
          created_at,
          edited_at,
          is_edited,
          sender_id,
          profiles!team_messages_sender_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq("team_id", teamId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!teamId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const { error } = await supabase
        .from("team_messages")
        .insert({
          team_id: teamId,
          sender_id: user!.id,
          message: messageText,
          message_type: "text",
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  // Edit message mutation
  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, newText }: { messageId: string; newText: string }) => {
      const { error } = await supabase
        .from("team_messages")
        .update({
          message: newText,
          edited_at: new Date().toISOString(),
          is_edited: true,
        })
        .eq("id", messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      setEditingMessage(null);
      setEditText("");
      queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
    },
    onError: (error) => {
      toast.error("Failed to edit message: " + error.message);
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from("team_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
    },
    onError: (error) => {
      toast.error("Failed to delete message: " + error.message);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!teamId) return;

    const channel = supabase
      .channel(`team-messages-${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "team_messages",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "team_messages",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "team_messages",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["team-messages", teamId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(message.trim());
  };

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessage(messageId);
    setEditText(currentText);
  };

  const handleSaveEdit = () => {
    if (!editingMessage || !editText.trim()) return;
    editMessageMutation.mutate({
      messageId: editingMessage,
      newText: editText.trim(),
    });
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditText("");
  };

  const handleDeleteMessage = (messageId: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const canEditMessage = (message: any) => {
    return message.sender_id === user?.id && message.message_type === "text";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Chat Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={teamInfo?.team_avatar_url} />
                <AvatarFallback>
                  {teamInfo?.name?.charAt(0) || "T"}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{teamInfo?.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {teamMembers.length} members
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={messagesContainerRef}>
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground">
                  Start the conversation with your team members!
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender_id === user?.id ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src={message.profiles?.avatar_url} />
                    <AvatarFallback>
                      {message.profiles?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[70%] ${
                      message.sender_id === user?.id ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`rounded-lg px-3 py-2 ${
                        message.sender_id === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {editingMessage === message.id ? (
                        <div className="space-y-2">
                          <Input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="text-sm"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={handleSaveEdit}
                              disabled={editMessageMutation.isPending}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-sm">{message.message}</p>
                          {message.is_edited && (
                            <p className="text-xs opacity-70">(edited)</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {message.profiles?.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(message.created_at)}
                      </span>
                      {canEditMessage(message) && editingMessage !== message.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleEditMessage(message.id, message.message)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sendMessageMutation.isPending}
                className="pr-20"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Paperclip className="w-3 h-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Smile className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={!message.trim() || sendMessageMutation.isPending}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
