import { LRUCache } from "lru-cache";

/**
 * Type for cached values
 */
// biome-ignore lint/suspicious/noExplicitAny: Cache can hold any type of data
type CacheValue = any;

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  // Maximum number of items in cache
  max: 500,
  // Maximum size in bytes (100MB)
  maxSize: 100 * 1024 * 1024,
  // TTL in milliseconds (10 minutes)
  ttl: 10 * 60 * 1000,
  // Size calculation function
  sizeCalculation: (value: unknown): number => JSON.stringify(value).length,
  // Allow stale entries while fetching fresh data
  allowStale: false,
  // Update age on get
  updateAgeOnGet: true,
};

/**
 * Cache key generators
 */
export const CacheKeys = {
  repository: (owner: string, repo: string) => `repo:${owner}/${repo}`,
  fileTree: (owner: string, repo: string, ref?: string) =>
    `tree:${owner}/${repo}:${ref || "default"}`,
  fileContent: (owner: string, repo: string, path: string, ref?: string) =>
    `content:${owner}/${repo}:${ref || "default"}:${path}`,
  rateLimit: () => "ratelimit",
};

/**
 * Application-wide LRU cache
 */
class AppCache {
  private readonly cache: LRUCache<string, CacheValue>;

  constructor() {
    this.cache = new LRUCache<string, CacheValue>(CACHE_CONFIG);
  }

  /**
   * Get value from cache
   */
  get<T>(key: string): T | undefined {
    return this.cache.get(key) as T | undefined;
  }

  /**
   * Set value in cache
   */
  set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      calculatedSize: this.cache.calculatedSize,
      max: this.cache.max,
      maxSize: this.cache.maxSize,
    };
  }

  /**
   * Invalidate cache for a specific repository
   */
  invalidateRepository(owner: string, repo: string): void {
    const prefix = `${owner}/${repo}`;
    const keysToDelete: string[] = [];

    // Find all keys related to this repository
    for (const key of this.cache.keys()) {
      if (key.includes(prefix)) {
        keysToDelete.push(key);
      }
    }

    // Delete all matching keys
    for (const key of keysToDelete) {
      this.cache.delete(key);
    }
  }

  /**
   * Get all cache keys (for debugging)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

/**
 * Singleton cache instance
 */
export const appCache = new AppCache();
