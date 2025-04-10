/**
 * Formats a timestamp into a relative time string (e.g., "5m ago")
 */
export const formatRelativeTime = (timestamp: number): string => {
  if (!timestamp) return 'Just now';
  
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (isNaN(diffInDays) || diffInDays < 0) {
    return 'Just now'; // Handle invalid dates
  }
  return `${diffInDays}d ago`;
};

/**
 * Formats a timestamp into a friendly detailed date/time format
 */
export const formatDetailedTime = (timestamp: number): string => {
  if (!timestamp) return 'Unknown date';
  
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isThisYear = date.getFullYear() === now.getFullYear();
  
  // Format: Today at 3:45 PM, May 12 at 3:45 PM, or May 12, 2022 at 3:45 PM
  const time = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) {
    return `Today at ${time}`;
  } else if (isThisYear) {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${time}`;
  } else {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${time}`;
  }
};

/**
 * Formats a timestamp into different formats based on how recent it is
 */
export const formatSmartTime = (timestamp: number): string => {
  if (!timestamp) return 'Just now';
  
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  // Within the last hour, use the relative format
  if (diffInSeconds < 3600) {
    return formatRelativeTime(timestamp);
  }
  
  // Otherwise use the detailed format
  return formatDetailedTime(timestamp);
};
