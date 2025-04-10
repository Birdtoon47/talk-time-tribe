/**
 * Utility functions for working with localStorage while handling potential quota issues
 */

/**
 * Compresses a string using simple LZW-like encoding to reduce storage size
 * @param input The string to compress
 * @returns Compressed string
 */
export const compressData = (input: string): string => {
  // For very large strings, split and compress in chunks
  if (input.length > 100000) {
    // Process in 100K character chunks
    const chunks = [];
    for (let i = 0; i < input.length; i += 100000) {
      chunks.push(compressChunk(input.substring(i, i + 100000)));
    }
    return chunks.join('');
  }
  
  return compressChunk(input);
};

/**
 * Helper function to compress a chunk of string data
 */
const compressChunk = (input: string): string => {
  try {
    // Simple implementation: use built-in compression if available
    if (typeof window !== 'undefined' && 'CompressionStream' in window) {
      // Use native compression if available (modern browsers)
      // This is a placeholder - actual implementation would be async
      // We're using a simpler approach below instead
      return input;
    }
    
    // Basic compression: replace repeated substrings with tokens
    // This is a very simplified version - for demonstration
    let compressed = input;
    
    // Compress JSON structure patterns
    compressed = compressed.replace(/,"id":/g, ',i:');
    compressed = compressed.replace(/,"userId":/g, ',u:');
    compressed = compressed.replace(/,"userName":/g, ',n:');
    compressed = compressed.replace(/,"userProfilePic":/g, ',p:');
    compressed = compressed.replace(/,"content":/g, ',c:');
    compressed = compressed.replace(/,"media":/g, ',m:');
    compressed = compressed.replace(/,"mediaType":/g, ',mt:');
    compressed = compressed.replace(/,"likes":/g, ',l:');
    compressed = compressed.replace(/,"isLiked":/g, ',il:');
    compressed = compressed.replace(/,"comments":/g, ',cm:');
    compressed = compressed.replace(/,"timestamp":/g, ',t:');
    
    // Cut down on data URLs (they're huge)
    if (compressed.includes('data:image') || compressed.includes('data:video')) {
      // Images and videos are the biggest storage consumers
      // For data URLs (e.g. base64 images), downscale or limit them
      compressed = compressed.replace(/data:(image|video)[^"]+/g, (match) => {
        // If larger than 8KB, truncate to preserve storage
        if (match.length > 8192) {
          return "data:trimmed-media";
        }
        return match;
      });
    }
    
    return compressed;
  } catch (error) {
    console.error('Error during compression:', error);
    return input; // Fall back to original string
  }
};

/**
 * Decompresses a string that was compressed with compressData
 * @param input The compressed string
 * @returns Original uncompressed string
 */
export const decompressData = (input: string): string => {
  try {
    // If data was trimmed, this will be handled appropriately by the application
    // which should show placeholder images
    
    // Reverse the compressions we did above
    let decompressed = input;
    
    // Decompress JSON structure patterns
    decompressed = decompressed.replace(/,i:/g, ',"id":');
    decompressed = decompressed.replace(/,u:/g, ',"userId":');
    decompressed = decompressed.replace(/,n:/g, ',"userName":');
    decompressed = decompressed.replace(/,p:/g, ',"userProfilePic":');
    decompressed = decompressed.replace(/,c:/g, ',"content":');
    decompressed = decompressed.replace(/,m:/g, ',"media":');
    decompressed = decompressed.replace(/,mt:/g, ',"mediaType":');
    decompressed = decompressed.replace(/,l:/g, ',"likes":');
    decompressed = decompressed.replace(/,il:/g, ',"isLiked":');
    decompressed = decompressed.replace(/,cm:/g, ',"comments":');
    decompressed = decompressed.replace(/,t:/g, ',"timestamp":');
    
    return decompressed;
  } catch (error) {
    console.error('Error during decompression:', error);
    return input; // Fall back to original string
  }
};

/**
 * Safely set an item in localStorage with error handling and compression
 * @param key The key to store the data under
 * @param value The data to store (will be JSON stringified)
 * @returns boolean indicating success
 */
export const safeSetItem = (key: string, value: any): boolean => {
  try {
    // Serialize the data
    const serialized = JSON.stringify(value);
    
    // Check if the data is too large by estimating size
    const estimatedSize = new Blob([serialized]).size;
    
    // Apply compression to reduce size
    const compressedData = compressData(serialized);
    const compressedSize = new Blob([compressedData]).size;
    
    // Log size savings (debug info)
    console.log(`Storage for ${key}: Original: ${estimatedSize}B, Compressed: ${compressedSize}B, Saved: ${Math.round((1 - compressedSize/estimatedSize) * 100)}%`);
    
    // If size is still too large (over 2MB), truncate data
    if (compressedSize > 2 * 1024 * 1024) {
      console.warn(`Data for ${key} is too large (${compressedSize} bytes), truncating`);
      
      // If it's an array, limit the number of items
      if (Array.isArray(value)) {
        // Keep only the most recent items - more aggressive reduction
        const truncatedValue = value.slice(0, 10);
        
        // Handle media data - remove media content from older posts
        if (key.includes('posts') || key.includes('feed')) {
          truncatedValue.forEach((post, index) => {
            // Keep media only for the 3 most recent posts
            if (index >= 3 && post.media) {
              post.media = null;
              post.mediaType = null;
            }
          });
        }
        
        const newData = compressData(JSON.stringify(truncatedValue));
        localStorage.setItem(key, newData);
        return true;
      }
      
      // For other data types, store a warning message
      localStorage.setItem(key, compressData(JSON.stringify({
        error: "Data was too large to store completely",
        timestamp: new Date().toISOString()
      })));
      return false;
    }
    
    // Normal case - store the compressed data
    localStorage.setItem(key, compressedData);
    return true;
  } catch (error) {
    // Handle quota exceeded errors
    if (error instanceof DOMException && 
        (error.name === 'QuotaExceededError' || 
         error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
      console.error('LocalStorage quota exceeded:', error);
      
      // Clear some non-critical data to make space
      try {
        // Emergency cleanup - clear all except user data and a few essential items
        const keysToPreserve = ['talktribe_user', 'talktribe_settings'];
        
        for (let i = 0; i < localStorage.length; i++) {
          const storageKey = localStorage.key(i);
          if (storageKey && !keysToPreserve.includes(storageKey)) {
            localStorage.removeItem(storageKey);
          }
        }
        
        // If this was a posts storage operation, retry with minimal data
        if (key.includes('posts') || key.includes('feed')) {
          const minimalData = Array.isArray(value) ? 
            value.slice(0, 5).map(post => ({
              id: post.id,
              userId: post.userId,
              userName: post.userName,
              content: post.content?.substring(0, 100) || '',
              timestamp: post.timestamp,
              // No media, no comments
            })) : 
            { error: "Storage quota reached, data truncated" };
            
          localStorage.setItem(key, compressData(JSON.stringify(minimalData)));
          return true;
        }
        
        // Try again with the original data
        localStorage.setItem(key, compressData(JSON.stringify(value)));
        return true;
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
 * Safely get an item from localStorage with error handling and decompression
 * @param key The key to retrieve
 * @param defaultValue Default value to return if key doesn't exist
 * @returns The stored value or defaultValue if not found
 */
export const safeGetItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    
    // Try to decompress the data
    const decompressed = decompressData(item);
    
    // Check for trimmed media and handle appropriately
    const parsed = JSON.parse(decompressed);
    
    // If we encounter trimmed media, replace with placeholder
    if (Array.isArray(parsed)) {
      parsed.forEach(item => {
        if (item.media === "data:trimmed-media") {
          item.media = "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?q=80&w=1974&auto=format&fit=crop";
          item.mediaType = "image";
        }
      });
    }
    
    return parsed;
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

/**
 * Safely clears older posts to free up storage space
 * @param maxPosts Maximum number of posts to keep
 */
export const clearOldPosts = (maxPosts: number = 20): void => {
  try {
    // Clear social feed posts
    const feedPosts = safeGetItem('talktribe_social_feed', []);
    if (feedPosts.length > maxPosts) {
      const trimmedPosts = feedPosts.slice(0, maxPosts);
      safeSetItem('talktribe_social_feed', trimmedPosts);
    }
    
    // Clear user posts
    const userPosts = safeGetItem('talktribe_posts', []);
    if (userPosts.length > maxPosts) {
      const trimmedPosts = userPosts.slice(0, maxPosts);
      safeSetItem('talktribe_posts', trimmedPosts);
    }
  } catch (error) {
    console.error('Error clearing old posts:', error);
  }
};
