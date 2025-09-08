import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Bell, MessageSquare, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

interface Notification {
  id: string;
  type: 'message' | 'job_offer' | 'system' | 'verification';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  sender?: string;
  actionUrl?: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Mock notifications - in a real app, these would come from the backend
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'message',
      title: 'New Message',
      message: 'Sarah Johnson sent you a message about your kitchen remodeling project.',
      timestamp: '2 minutes ago',
      isRead: false,
      sender: 'Sarah Johnson',
      actionUrl: '/messages'
    },
    {
      id: '2',
      type: 'job_offer',
      title: 'Job Opportunity',
      message: 'You have a new job offer for bathroom renovation in Lagos.',
      timestamp: '1 hour ago',
      isRead: false,
      actionUrl: '/messages'
    },
    {
      id: '3',
      type: 'system',
      title: 'Profile Update',
      message: 'Your profile verification is complete. You can now accept jobs.',
      timestamp: '3 hours ago',
      isRead: true,
      actionUrl: '/profile'
    },
    {
      id: '4',
      type: 'message',
      title: 'New Message',
      message: 'Michael Chen is interested in your electrical services.',
      timestamp: '1 day ago',
      isRead: true,
      sender: 'Michael Chen',
      actionUrl: '/messages'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'job_offer':
        return <Users className="w-4 h-4 text-green-600" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'system':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return timestamp;
  };

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link 
                  to={notification.actionUrl || '/messages'} 
                  className="flex items-start gap-3 p-3 hover:bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimestamp(notification.timestamp)}</span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/messages" className="text-center justify-center">
                View All Messages
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
