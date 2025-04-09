/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currencyCode The ISO currency code (default: IDR)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: string = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: currencyCode,
    minimumFractionDigits: 0
  }).format(amount);
};

/**
 * Get initials from a name
 * @param name The full name
 * @returns Initials (up to 2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.split(' ');
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format a date to a human-readable string
 * @param date Date to format
 * @param format Format type (short, medium, long)
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'medium':
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    case 'long':
      return dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    default:
      return dateObj.toLocaleDateString();
  }
};

/**
 * Format a time
 * @param time Time string or date object
 * @param includeSeconds Whether to include seconds
 * @returns Formatted time string
 */
export const formatTime = (time: Date | string, includeSeconds: boolean = false): string => {
  const dateObj = typeof time === 'string' ? new Date(time) : time;
  
  return dateObj.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: true
  });
};

/**
 * Format a message timestamp
 * @param timestamp The timestamp to format
 * @returns Human-readable representation
 */
export const formatMessageTimestamp = (timestamp: string): string => {
  const messageDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // If the message is from today
  if (messageDate.toDateString() === today.toDateString()) {
    return formatTime(messageDate);
  }
  
  // If the message is from yesterday
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // If the message is from this week
  const differenceInDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 3600 * 24));
  if (differenceInDays < 7) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
  }
  
  // If the message is from this year
  if (messageDate.getFullYear() === today.getFullYear()) {
    return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  // Otherwise show the full date
  return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
