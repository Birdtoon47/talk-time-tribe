
/**
 * Utility functions for managing notifications
 */
import { toast } from "sonner";
import { safeGetItem, safeSetItem } from "./storage";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  timestamp: string;
  link?: string;
}

/**
 * Get all notifications from storage
 */
export const getNotifications = (): Notification[] => {
  return safeGetItem<Notification[]>("talktribe_notifications", []);
};

/**
 * Add a new notification
 */
export const addNotification = (notification: Omit<Notification, "id" | "isRead" | "timestamp">): Notification => {
  const notifications = getNotifications();
  
  const newNotification: Notification = {
    id: Date.now().toString(),
    isRead: false,
    timestamp: new Date().toISOString(),
    ...notification
  };
  
  const updatedNotifications = [newNotification, ...notifications];
  safeSetItem("talktribe_notifications", updatedNotifications);
  
  // Show toast for real-time feedback
  toast[notification.type || "info"](notification.title, {
    description: notification.message
  });
  
  return newNotification;
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === id ? { ...notification, isRead: true } : notification
  );
  
  safeSetItem("talktribe_notifications", updatedNotifications);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({ 
    ...notification, 
    isRead: true 
  }));
  
  safeSetItem("talktribe_notifications", updatedNotifications);
};

/**
 * Delete a notification
 */
export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.filter(
    notification => notification.id !== id
  );
  
  safeSetItem("talktribe_notifications", updatedNotifications);
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  safeSetItem("talktribe_notifications", []);
};

/**
 * Get unread notification count
 */
export const getUnreadCount = (): number => {
  const notifications = getNotifications();
  return notifications.filter(notification => !notification.isRead).length;
};

/**
 * Create a system notification about a new message
 */
export const createMessageNotification = (senderName: string, messagePreview: string): void => {
  addNotification({
    title: `New message from ${senderName}`,
    message: messagePreview.length > 50 ? `${messagePreview.substring(0, 50)}...` : messagePreview,
    type: "info",
  });
};

/**
 * Create a system notification about a booking
 */
export const createBookingNotification = (creatorName: string, bookingAction: string, date: string): void => {
  addNotification({
    title: `Booking ${bookingAction}`,
    message: `Your consultation with ${creatorName} on ${new Date(date).toLocaleDateString()} has been ${bookingAction}.`,
    type: "success",
  });
};

/**
 * Create a system notification about a cancellation
 */
export const createCancellationNotification = (creatorName: string, date: string): void => {
  addNotification({
    title: "Booking Cancelled",
    message: `Your consultation with ${creatorName} on ${new Date(date).toLocaleDateString()} has been cancelled.`,
    type: "error",
  });
};
