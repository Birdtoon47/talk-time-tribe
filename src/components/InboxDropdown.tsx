import React, { useState, useEffect } from 'react';
import { MessageSquare, Check, Trash2, X, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { safeGetItem, safeSetItem } from '@/utils/storage';
import { getInitials } from '@/utils/formatters';
import { useNavigate } from 'react-router-dom';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderProfilePic: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  bookingId?: string;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantProfilePic: string;
  lastMessage: Message;
  unreadCount: number;
}

const InboxDropdown = ({ userData }: { userData: any }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const navigate = useNavigate();

  const loadConversations = () => {
    const userMessages = safeGetItem<Message[]>('talktribe_messages', [])
      .filter(msg => msg.senderId === userData.id || msg.receiverId === userData.id);
    
    // Group messages by conversation partner
    const conversationMap = new Map<string, Message[]>();
    
    userMessages.forEach(message => {
      const partnerId = message.senderId === userData.id ? message.receiverId : message.senderId;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, []);
      }
      
      conversationMap.get(partnerId)?.push(message);
    });
    
    // Build conversations list
    const conversationsList: Conversation[] = [];
    
    conversationMap.forEach((messages, partnerId) => {
      // Sort messages by timestamp (newest first)
      messages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      const lastMessage = messages[0];
      const partnerInfo = lastMessage.senderId === userData.id
        ? { id: lastMessage.receiverId, name: lastMessage.senderName, profilePic: lastMessage.senderProfilePic }
        : { id: lastMessage.senderId, name: lastMessage.senderName, profilePic: lastMessage.senderProfilePic };
      
      const unreadCount = messages.filter(msg => msg.receiverId === userData.id && !msg.isRead).length;
      
      conversationsList.push({
        id: partnerId,
        participantId: partnerInfo.id,
        participantName: partnerInfo.name,
        participantProfilePic: partnerInfo.profilePic,
        lastMessage,
        unreadCount
      });
    });
    
    // Sort conversations by last message timestamp
    conversationsList.sort((a, b) => 
      new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime()
    );
    
    setConversations(conversationsList);
    
    // Calculate total unread count
    const totalUnread = conversationsList.reduce((total, conv) => total + conv.unreadCount, 0);
    setUnreadCount(totalUnread);
  };

  useEffect(() => {
    loadConversations();
    
    // Set up a listener for message updates
    const handleMessagesChange = () => {
      loadConversations();
      
      if (activeConversation) {
        loadConversationMessages(activeConversation);
      }
    };
    
    window.addEventListener('messages-changed', handleMessagesChange);
    
    return () => {
      window.removeEventListener('messages-changed', handleMessagesChange);
    };
  }, [userData.id]);

  useEffect(() => {
    if (activeConversation) {
      loadConversationMessages(activeConversation);
      markConversationAsRead(activeConversation);
    }
  }, [activeConversation]);

  const loadConversationMessages = (partnerId: string) => {
    const allMessages = safeGetItem<Message[]>('talktribe_messages', []);
    
    // Filter messages for this conversation and sort by timestamp
    const conversationMessages = allMessages
      .filter(msg => 
        (msg.senderId === userData.id && msg.receiverId === partnerId) ||
        (msg.senderId === partnerId && msg.receiverId === userData.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setMessages(conversationMessages);
  };

  const markConversationAsRead = (partnerId: string) => {
    const allMessages = safeGetItem<Message[]>('talktribe_messages', []);
    
    // Mark all received messages in this conversation as read
    const updatedMessages = allMessages.map(message => {
      if (message.senderId === partnerId && message.receiverId === userData.id && !message.isRead) {
        return { ...message, isRead: true };
      }
      return message;
    });
    
    safeSetItem('talktribe_messages', updatedMessages);
    
    // Refresh conversations to update unread count
    loadConversations();
    
    // Notify any listeners
    window.dispatchEvent(new CustomEvent('messages-changed'));
  };

  const sendMessage = () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    const allMessages = safeGetItem<Message[]>('talktribe_messages', []);
    const conversation = conversations.find(c => c.id === activeConversation);
    
    if (!conversation) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: userData.id,
      senderName: userData.name,
      senderProfilePic: userData.profilePic,
      receiverId: conversation.participantId,
      content: newMessage.trim(),
      isRead: false,
      timestamp: new Date().toISOString()
    };
    
    // Add the new message
    const updatedMessages = [...allMessages, newMsg];
    safeSetItem('talktribe_messages', updatedMessages);
    
    // Clear the input
    setNewMessage('');
    
    // Refresh messages
    loadConversationMessages(activeConversation);
    loadConversations();
    
    // Notify any listeners
    window.dispatchEvent(new CustomEvent('messages-changed'));
  };

  const handleOpenConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    setActiveTab('messages');
    markConversationAsRead(conversationId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageDate = (dateString: string) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    
    // If the message is from today, just show the time
    if (messageDate.toDateString() === today.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    // If the message is from this year, show the month and day
    if (messageDate.getFullYear() === today.getFullYear()) {
      return format(messageDate, 'MMM d, h:mm a');
    }
    
    // Otherwise show the full date
    return format(messageDate, 'MMM d, yyyy, h:mm a');
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Tabs defaultValue="inbox" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between p-2 border-b">
            <TabsList>
              <TabsTrigger value="inbox" onClick={() => setActiveConversation(null)}>Inbox</TabsTrigger>
              <TabsTrigger value="messages" disabled={!activeConversation}>Messages</TabsTrigger>
            </TabsList>
            
            {activeTab === 'messages' && (
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('inbox')}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <TabsContent value="inbox" className="m-0">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No messages yet
              </div>
            ) : (
              <ScrollArea className="max-h-[300px]">
                <div className="flex flex-col">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id} 
                      className={`p-3 cursor-pointer hover:bg-muted flex items-center gap-2 ${conversation.unreadCount > 0 ? 'bg-muted/50' : ''}`}
                      onClick={() => handleOpenConversation(conversation.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.participantProfilePic} alt={conversation.participantName} />
                        <AvatarFallback>{getInitials(conversation.participantName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {conversation.participantName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {formatMessageDate(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {truncateText(conversation.lastMessage.content, 30)}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="messages" className="m-0">
            {activeConversation && (
              <>
                <ScrollArea className="max-h-[250px] p-3">
                  <div className="flex flex-col gap-2">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId === userData.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-2 ${
                            message.senderId === userData.id 
                              ? 'bg-app-purple text-white rounded-tr-none' 
                              : 'bg-gray-100 rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs text-right mt-1 opacity-70">
                            {formatMessageDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t mt-auto">
                  <div className="flex items-end gap-2">
                    <Textarea 
                      placeholder="Type a message..." 
                      className="min-h-[60px]"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                    />
                    <Button 
                      size="icon" 
                      className="h-10 w-10 shrink-0 bg-app-purple"
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default InboxDropdown;
