import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Search, MessageSquare, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useMessages, useSendMessage } from "@/hooks/use-api";
import ProfileNavigation from "@/components/ProfileNavigation";
import AppHeader from "@/components/AppHeader";

export default function Messages() {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch messages
  const { data: messages = [], isLoading } = useMessages({
    conversation_id: selectedConversation || undefined,
  });

  const sendMessage = useSendMessage();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to view your messages.</p>
          <Button asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    sendMessage.mutate({
      sender_id: user.id,
      recipient_id: selectedConversation,
      subject: "New Message",
      content: newMessage,
    }, {
      onSuccess: () => {
        setNewMessage("");
      },
    });
  };

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    const conversationId = message.job_id || message.recipient_id;
    if (!acc[conversationId]) {
      acc[conversationId] = [];
    }
    acc[conversationId].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <ProfileNavigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with clients and professionals</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {Object.keys(conversations).length > 0 ? (
                  <div className="space-y-1">
                    {Object.entries(conversations).map(([conversationId, conversationMessages]) => {
                      const latestMessage = conversationMessages[conversationMessages.length - 1];
                      const otherParticipant = latestMessage.sender_id === user?.id 
                        ? latestMessage.recipient_id 
                        : latestMessage.sender_id;
                      
                      return (
                        <div 
                          key={conversationId}
                          className={`p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50 ${
                            selectedConversation === conversationId ? 'bg-muted/30' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversationId)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                                {otherParticipant?.charAt(0)?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">User {otherParticipant?.slice(-4) || 'Unknown'}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {latestMessage.content || 'No message content'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No conversations yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start a conversation by reaching out to professionals or hirers
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {selectedConversation ? (
                <>
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg">Conversation</CardTitle>
                    <CardDescription>User {selectedConversation.slice(-4)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 p-0 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                      {conversations[selectedConversation]?.length > 0 ? (
                        conversations[selectedConversation].map((message, index) => (
                          <div key={index} className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`rounded-lg px-4 py-2 max-w-xs ${
                              message.sender_id === user?.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.created_at).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <p className="text-muted-foreground">No messages in this conversation</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Message Input */}
                    <div className="border-t border-border p-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Type your message..." 
                          className="flex-1" 
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button size="sm" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}