
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearAllNotifications, getUnreadCount, Notification } from '@/utils/notifications';

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const loadNotifications = () => {
    const allNotifications = getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(getUnreadCount());
  };

  useEffect(() => {
    loadNotifications();
    
    // Set up listener to update notifications when they change
    const handleNotificationsChange = () => {
      loadNotifications();
    };
    
    window.addEventListener('notifications-changed', handleNotificationsChange);
    
    return () => {
      window.removeEventListener('notifications-changed', handleNotificationsChange);
    };
  }, []);

  const handleReadNotification = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    loadNotifications();
  };

  const handleClearAll = () => {
    clearAllNotifications();
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    loadNotifications();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id);
    }
    
    setOpen(false);
    
    if (notification.link) {
      navigate(notification.link);
    }
    
    loadNotifications();
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-500 text-green-700';
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'error': return 'bg-red-100 border-red-500 text-red-700';
      default: return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              <Check className="h-4 w-4 mr-1" /> Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearAll} disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-1" /> Clear all
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <ScrollArea className="max-h-[300px]">
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div key={notification.id} className="group">
                  <div 
                    className={`p-3 cursor-pointer hover:bg-muted flex items-start gap-2 ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={`w-2 h-2 mt-2 rounded-full ${!notification.isRead ? 'bg-app-purple' : 'bg-gray-300'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`font-medium ${!notification.isRead ? 'text-app-purple' : ''}`}>
                          {notification.title}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsDropdown;
