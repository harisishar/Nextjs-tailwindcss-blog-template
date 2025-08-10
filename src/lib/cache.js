// Cache utilities for WordPress content with SvelteKit support

const CACHE_DURATIONS = {
  posts: 30 * 60, // 30 minutes
  featured: 60 * 60, // 1 hour
  categories: 2 * 60 * 60, // 2 hours
};

// In-memory cache for development and fallback
const memoryCache = new Map();

/**
 * Get cached data or fetch fresh data
 * @param {string} key - Cache key
 * @param {Function} fetchFunction - Function to fetch fresh data
 * @param {number} duration - Cache duration in seconds
 */
export async function getCachedData(key, fetchFunction, duration = CACHE_DURATIONS.posts) {
  // In development, use shorter cache durations
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
    duration = Math.min(duration, 5 * 60); // Max 5 minutes in dev
  }

  const cached = memoryCache.get(key);
  const now = Date.now();

  // Return cached data if still valid
  if (cached && (now - cached.timestamp) < (duration * 1000)) {
    return cached.data;
  }

  try {
    // Fetch fresh data
    const freshData = await fetchFunction();
    
    // Update cache
    memoryCache.set(key, {
      data: freshData,
      timestamp: now
    });

    return freshData;
  } catch (error) {
    console.error(`Cache fetch error for key ${key}:`, error);
    
    // Return stale data if available and not too old (max 24 hours)
    if (cached && (now - cached.timestamp) < (24 * 60 * 60 * 1000)) {
      console.warn(`Returning stale data for key ${key}`);
      return cached.data;
    }

    // No cached data available, return empty result
    return null;
  }
}

/**
 * Invalidate cache entry
 * @param {string} key - Cache key to invalidate
 */
export function invalidateCache(key) {
  memoryCache.delete(key);
}

/**
 * Clear all cache
 */
export function clearCache() {
  memoryCache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  const stats = {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
    entries: []
  };

  for (const [key, value] of memoryCache.entries()) {
    stats.entries.push({
      key,
      age: Date.now() - value.timestamp,
      size: JSON.stringify(value.data).length
    });
  }

  return stats;
}

// Cache key generators
export const cacheKeys = {
  allPosts: () => 'wordpress:all-posts',
  featuredPosts: (count) => `wordpress:featured-posts:${count}`,
  postBySlug: (slug) => `wordpress:post:${slug}`,
  postsByCategory: (category, count) => `wordpress:category:${category}:${count}`,
  categories: () => 'wordpress:categories',
};