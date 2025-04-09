/**
 * Utility functions for working with localStorage while handling potential quota issues
 */

/**
 * Safely set an item in localStorage with error handling
 * @param key The key to store the data under
 * @param value The data to store (will be JSON stringified)
 * @returns boolean indicating success
 */
export const safeSetItem = (key: string, value: any): boolean => {
  try {
    // Check if the data is too large by estimating size
    const serialized = JSON.stringify(value);
    const estimatedSize = new Blob([serialized]).size;
    
    // If size is too large (over 2MB), truncate data
    if (estimatedSize > 2 * 1024 * 1024) {
      console.warn(`Data for ${key} is too large (${estimatedSize} bytes), truncating`);
      
      // If it's an array, limit the number of items
      if (Array.isArray(value)) {
        // Keep only the most recent 20 items
        const truncatedValue = value.slice(0, 20);
        localStorage.setItem(key, JSON.stringify(truncatedValue));
        return true;
      }
      
      // For other data types, store a warning message
      localStorage.setItem(key, JSON.stringify({
        error: "Data was too large to store completely",
        timestamp: new Date().toISOString()
      }));
      return false;
    }
    
    // Normal case - store the data as is
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    // Handle quota exceeded errors
    if (error instanceof DOMException && 
        (error.name === 'QuotaExceededError' || 
         error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.error('LocalStorage quota exceeded:', error);
      
      // Clear some non-critical data to make space
      try {
        // Try to remove some old data to make space
        // Keep user data, but remove post data if needed
        if (key !== 'talktribe_user') {
          localStorage.removeItem('talktribe_posts');
          
          // Try again with the original data
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        }
      } catch (retryError) {
        console.error('Failed to make space in localStorage:', retryError);
        return false;
      }
    }
    
    console.error('Error storing data in localStorage:', error);
    return false;
  }
};

/**
 * Safely get an item from localStorage with error handling
 * @param key The key to retrieve
 * @param defaultValue Default value to return if key doesn't exist
 * @returns The stored value or defaultValue if not found
 */
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error retrieving data from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key The key to remove
 */
export const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
  }
};
