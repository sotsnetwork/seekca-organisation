import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useConversations } from "@/hooks/use-api";
import { Conversation } from "@/services/api";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversationId?: string;
}

export default function ConversationList({ 
  onSelectConversation, 
  selectedConversationId 
}: ConversationListProps) {
  const { user } = useAuth();
  const { data: conversations, isLoading, error } = useConversations();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Failed to load conversations</p>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start a conversation by messaging a professional
        </p>
      </div>
    );
  }

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return null;
    
    if (conversation.participant1_id === user.id) {
      return conversation.participant2;
    } else {
      return conversation.participant1;
    }
  };

  const formatLastMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherParticipant = getOtherParticipant(conversation);
        const isSelected = selectedConversationId === conversation.id;
        
        if (!otherParticipant) return null;

        return (
          <Card 
            key={conversation.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              isSelected ? 'bg-muted' : ''
            }`}
            onClick={() => onSelectConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={otherParticipant.avatar_url} />
                  <AvatarFallback>
                    {otherParticipant.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">
                      {otherParticipant.full_name || otherParticipant.nickname}
                    </h3>
                    <div className="flex items-center gap-2">
                      {conversation.unread_count && conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {conversation.last_message_at && formatLastMessageTime(conversation.last_message_at)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
