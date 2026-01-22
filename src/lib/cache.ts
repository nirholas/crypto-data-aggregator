/**
 * In-Memory Cache with TTL
 *
 * Simple but effective caching layer for API responses.
 * Reduces redundant RSS fetches and AI API calls.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private maxSize: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    // Cleanup expired entries every minute
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }
  }

  /**
   * Get a cached value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cached value with TTL in seconds
   */
  set<T>(key: string, data: T, ttlSeconds: number): void {
    // Evict oldest entries if at capacity
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      createdAt: Date.now(),
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete a cached value
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; maxSize: number; keys: string[] } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict oldest entries when at capacity
   */
  private evictOldest(): void {
    let oldest: { key: string; createdAt: number } | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (!oldest || entry.createdAt < oldest.createdAt) {
        oldest = { key, createdAt: entry.createdAt };
      }
    }

    if (oldest) {
      this.cache.delete(oldest.key);
    }
  }

  /**
   * Destroy the cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.cache.clear();
  }
}

// Singleton instances for different cache purposes

/**
 * Shared cache instance for RSS news feed data.
 * Max 500 entries, used by crypto-news.ts.
 */
export const newsCache = new MemoryCache(500);

/**
 * Shared cache instance for AI-generated content.
 * Max 200 entries, used for summaries and analysis.
 */
export const aiCache = new MemoryCache(200);

/**
 * Shared cache instance for translated content.
 * Max 300 entries, used by translate.ts.
 */
export const translationCache = new MemoryCache(300);

/**
 * Wraps an async function with caching logic.
 * Returns cached data if available, otherwise executes the fetch function
 * and caches the result.
 *
 * @template T - The type of data being cached
 * @param cache - The MemoryCache instance to use
 * @param key - Unique cache key for this data
 * @param ttlSeconds - Time-to-live in seconds
 * @param fetchFn - Async function to execute on cache miss
 * @returns The cached or freshly fetched data
 *
 * @example
 * ```typescript
 * const data = await withCache(
 *   newsCache,
 *   'latest-news',
 *   300, // 5 minutes
 *   () => fetchLatestNews()
 * );
 * ```
 */
export async function withCache<T>(
  cache: MemoryCache,
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch and cache
  const data = await fetchFn();
  cache.set(key, data, ttlSeconds);
  return data;
}

/**
 * Generates a deterministic cache key from request parameters.
 * Parameters are sorted alphabetically to ensure consistent keys
 * regardless of parameter order.
 *
 * @param prefix - Namespace prefix for the cache key (e.g., 'coins', 'history')
 * @param params - Object containing query parameters
 * @returns Formatted cache key string
 *
 * @example
 * ```typescript
 * generateCacheKey('coins', { limit: 10, page: 1 });
 * // Returns: 'coins:limit=10&page=1'
 *
 * generateCacheKey('coins', {});
 * // Returns: 'coins:default'
 * ```
 */
export function generateCacheKey(prefix: string, params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== null)
    .map((k) => `${k}=${params[k]}`)
    .join('&');

  return `${prefix}:${sortedParams || 'default'}`;
}

export default MemoryCache;
