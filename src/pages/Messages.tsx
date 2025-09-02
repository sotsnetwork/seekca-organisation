import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Architect",
      lastMessage: "Thanks for the project update!",
      time: "2 min ago",
      unread: 2,
      avatar: "/placeholder.svg",
      online: true
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Electrician",
      lastMessage: "I can start the wiring work tomorrow",
      time: "1 hour ago",
      unread: 0,
      avatar: "/placeholder.svg",
      online: false
    },
    {
      id: 3,
      name: "BuildPro Team",
      role: "Construction Agency",
      lastMessage: "Project milestone completed",
      time: "3 hours ago",
      unread: 1,
      avatar: "/placeholder.svg",
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hi! I've reviewed the architectural plans you sent.",
      time: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "Me",
      content: "Great! What do you think about the proposed changes?",
      time: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      content: "The changes look good. I'll need to adjust the structural calculations for the new layout.",
      time: "10:35 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      content: "Thanks for the project update!",
      time: "10:38 AM",
      isMe: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with your team and clients</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
          {/* Conversations List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {conversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedConversation === index ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedConversation(index)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatar} alt={conversation.name} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm truncate">{conversation.name}</h3>
                          <span className="text-xs text-muted-foreground">{conversation.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{conversation.role}</p>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 text-xs rounded-full p-0 flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-3 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversations[selectedConversation]?.avatar} alt="Avatar" />
                  <AvatarFallback>{conversations[selectedConversation]?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{conversations[selectedConversation]?.name}</h3>
                  <p className="text-sm text-muted-foreground">{conversations[selectedConversation]?.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}