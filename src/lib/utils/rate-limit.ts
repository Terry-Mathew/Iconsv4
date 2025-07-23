import { LRUCache } from 'lru-cache'

interface RateLimitOptions {
  requests: number
  window: string // e.g., '1h', '15m', '1d'
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

class RateLimiter {
  private cache: LRUCache<string, { count: number; resetTime: number }>

  constructor() {
    this.cache = new LRUCache({
      max: 10000, // Maximum number of entries
      ttl: 24 * 60 * 60 * 1000, // 24 hours TTL
    })
  }

  async limit(
    identifier: string,
    options: RateLimitOptions = { requests: 10, window: '15m' }
  ): Promise<RateLimitResult> {
    const windowMs = this.parseWindow(options.window)
    const now = Date.now()
    const resetTime = now + windowMs

    const key = `${identifier}:${options.requests}:${options.window}`
    const current = this.cache.get(key)

    if (!current) {
      // First request in this window
      this.cache.set(key, { count: 1, resetTime }, windowMs)
      return {
        success: true,
        remaining: options.requests - 1,
        resetTime
      }
    }

    if (now > current.resetTime) {
      // Window has expired, reset
      this.cache.set(key, { count: 1, resetTime }, windowMs)
      return {
        success: true,
        remaining: options.requests - 1,
        resetTime
      }
    }

    if (current.count >= options.requests) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    // Increment count
    current.count++
    this.cache.set(key, current, current.resetTime - now)

    return {
      success: true,
      remaining: options.requests - current.count,
      resetTime: current.resetTime
    }
  }

  private parseWindow(window: string): number {
    const match = window.match(/^(\d+)([smhd])$/)
    if (!match) {
      throw new Error(`Invalid window format: ${window}`)
    }

    const value = parseInt(match[1])
    const unit = match[2]

    switch (unit) {
      case 's':
        return value * 1000
      case 'm':
        return value * 60 * 1000
      case 'h':
        return value * 60 * 60 * 1000
      case 'd':
        return value * 24 * 60 * 60 * 1000
      default:
        throw new Error(`Invalid time unit: ${unit}`)
    }
  }

  // Clear rate limit for a specific identifier
  clear(identifier: string): void {
    const keys = Array.from(this.cache.keys()).filter(key => 
      key.startsWith(identifier + ':')
    )
    keys.forEach(key => this.cache.delete(key))
  }

  // Get current status for an identifier
  getStatus(
    identifier: string,
    options: RateLimitOptions = { requests: 10, window: '15m' }
  ): { count: number; remaining: number; resetTime: number } {
    const key = `${identifier}:${options.requests}:${options.window}`
    const current = this.cache.get(key)
    const now = Date.now()

    if (!current || now > current.resetTime) {
      return {
        count: 0,
        remaining: options.requests,
        resetTime: now + this.parseWindow(options.window)
      }
    }

    return {
      count: current.count,
      remaining: Math.max(0, options.requests - current.count),
      resetTime: current.resetTime
    }
  }
}

// Export singleton instance
export const rateLimit = new RateLimiter()

// Predefined rate limit configurations
export const rateLimitConfigs = {
  // API endpoints
  nominations: { requests: 5, window: '1h' },
  auth: { requests: 10, window: '15m' },
  
  // AI features
  aiPolish: { requests: 5, window: '1h' },
  aiSuggestions: { requests: 10, window: '1h' },
  
  // Admin actions
  adminActions: { requests: 100, window: '1h' },
  
  // General API
  general: { requests: 100, window: '15m' },
  
  // File uploads
  uploads: { requests: 20, window: '1h' },
} as const

// Middleware helper for Next.js API routes
export function withRateLimit(
  handler: (req: any, res: any) => Promise<any>,
  config: RateLimitOptions = rateLimitConfigs.general
) {
  return async (req: any, res: any) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'anonymous'
    const result = await rateLimit.limit(identifier, config)

    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', config.requests)
    res.setHeader('X-RateLimit-Remaining', result.remaining)
    res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000))

    if (!result.success) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
      })
    }

    return handler(req, res)
  }
}

// React hook for client-side rate limit status
export function useRateLimitStatus(endpoint: string) {
  // This would be implemented as a React hook to check rate limit status
  // from the client side for better UX
  return {
    canMakeRequest: true,
    remaining: 10,
    resetTime: Date.now() + 15 * 60 * 1000
  }
}
