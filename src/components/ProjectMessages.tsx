import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Send, 
  MessageSquare, 
  Calendar,
  User,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  message_type: string;
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

  // Mock implementation - project messages feature not yet implemented
  const messages: ProjectMessage[] = [];
  const isLoading = false;

  // Mock send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: {
      message: string;
      message_type?: string;
      attachment_url?: string;
    }) => {
      console.log('Mock message sent:', messageData);
      throw new Error('Project messages feature not yet implemented');
    },
    onSuccess: () => {
      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Message Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Mock mark as read mutation  
  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      console.log('Mock mark as read');
    },
    onSuccess: () => {
      // Mock success
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      message: newMessage.trim(),
      message_type: 'text'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <h3 className="text-lg font-semibold">Project Messages</h3>
          <p className="text-sm text-muted-foreground">
            Communicate with your project partner
          </p>
        </div>
        <Badge variant="outline">
          {messages.length} messages
        </Badge>
      </div>

      {/* Messages List */}
      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Conversation</CardTitle>
          <CardDescription>
            All project-related messages
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-4 max-h-80">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">No Messages Yet</h4>
                  <p className="text-muted-foreground">
                    Feature not yet implemented. Send your first message to start the conversation!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex items-start gap-3 max-w-[80%] ${
                        message.sender_id === user?.id ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={message.sender.avatar_url} />
                        <AvatarFallback>
                          {message.sender.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`space-y-1 ${message.sender_id === user?.id ? 'text-right' : 'text-left'}`}>
                        <div 
                          className={`p-3 rounded-lg ${
                            message.sender_id === user?.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{message.sender.nickname}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(message.created_at)}</span>
                          </div>
                          {!message.is_read && message.sender_id !== user?.id && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sendMessageMutation.isPending}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={sendMessageMutation.isPending || !newMessage.trim()}
            >
              {sendMessageMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}