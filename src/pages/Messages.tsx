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
                <div className="space-y-1">
                  {/* Sample conversations */}
                  <div className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                        SJ
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Hi! I'm interested in your React development services...
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground font-medium">
                        MC
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">Michael Chen</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Thanks for the design work! It looks great...
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-muted/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-medium">
                        DO
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">David Okafor</p>
                        <p className="text-xs text-muted-foreground truncate">
                          When can we schedule the next meeting?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                <CardDescription>Full-Stack Developer • Online</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">Hi Sarah! I'm interested in your React development services for a new project.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">Hi! Thanks for reaching out. I'd love to hear more about your project. What are you looking to build?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">It's an e-commerce platform with real-time inventory management. I need someone with experience in React and Node.js.</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2 max-w-xs">
                      <p className="text-sm">That sounds like an exciting project! I have extensive experience with both React and Node.js. I've built similar platforms before.</p>
                    </div>
                  </div>
                </div>
                
                {/* Message Input */}
                <div className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <Input placeholder="Type your message..." className="flex-1" />
                    <Button size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}