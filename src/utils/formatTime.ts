
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
