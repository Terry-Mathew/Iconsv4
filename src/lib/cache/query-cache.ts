/**
 * Simple in-memory cache for database queries
 * Helps reduce redundant database calls and improve performance
 */

import React from 'react'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class QueryCache {
  private cache = new Map<string, CacheEntry<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Set data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

// Global cache instance
export const queryCache = new QueryCache()

// Cleanup expired entries every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    queryCache.cleanup()
  }, 10 * 60 * 1000)
}

/**
 * Higher-order function to add caching to any async function
 */
export function withCache<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  getCacheKey: (...args: T) => string,
  ttl?: number
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = getCacheKey(...args)
    
    // Try to get from cache first
    const cached = queryCache.get<R>(cacheKey)
    if (cached !== null) {
      console.log(`🎯 Cache hit for: ${cacheKey}`)
      return cached
    }

    // Execute function and cache result
    console.log(`🔄 Cache miss for: ${cacheKey}`)
    const result = await fn(...args)
    queryCache.set(cacheKey, result, ttl)
    
    return result
  }
}

/**
 * Cache keys for common queries
 */
export const CacheKeys = {
  USER_PROFILE: (userId: string) => `user_profile:${userId}`,
  USER_ROLE: (userId: string) => `user_role:${userId}`,
  PROFILE_DATA: (profileId: string) => `profile_data:${profileId}`,
  NOMINATIONS: (status?: string) => `nominations:${status || 'all'}`,
  PAYMENTS: (userId: string) => `payments:${userId}`,
  ANALYTICS: (type: string, period: string) => `analytics:${type}:${period}`,
} as const

/**
 * Cache invalidation helpers
 */
export const CacheInvalidation = {
  /**
   * Invalidate user-related cache entries
   */
  invalidateUser(userId: string) {
    queryCache.delete(CacheKeys.USER_PROFILE(userId))
    queryCache.delete(CacheKeys.USER_ROLE(userId))
    queryCache.delete(CacheKeys.PAYMENTS(userId))
  },

  /**
   * Invalidate profile-related cache entries
   */
  invalidateProfile(profileId: string) {
    queryCache.delete(CacheKeys.PROFILE_DATA(profileId))
  },

  /**
   * Invalidate nominations cache
   */
  invalidateNominations() {
    const stats = queryCache.getStats()
    stats.keys
      .filter(key => key.startsWith('nominations:'))
      .forEach(key => queryCache.delete(key))
  },

  /**
   * Invalidate analytics cache
   */
  invalidateAnalytics() {
    const stats = queryCache.getStats()
    stats.keys
      .filter(key => key.startsWith('analytics:'))
      .forEach(key => queryCache.delete(key))
  }
}

/**
 * React hook for cache management
 */
export function useCacheStats() {
  const [stats, setStats] = React.useState(queryCache.getStats())

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(queryCache.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    ...stats,
    clear: () => {
      queryCache.clear()
      setStats(queryCache.getStats())
    },
    cleanup: () => {
      queryCache.cleanup()
      setStats(queryCache.getStats())
    }
  }
}

// Performance monitoring for cache
if (process.env.NODE_ENV === 'development') {
  // Log cache performance every minute
  setInterval(() => {
    const stats = queryCache.getStats()
    if (stats.size > 0) {
      console.log(`📊 Query Cache Stats: ${stats.size} entries`)
    }
  }, 60 * 1000)
}
