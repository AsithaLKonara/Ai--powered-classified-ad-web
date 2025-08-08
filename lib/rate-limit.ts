import { RateLimiterRedis } from 'rate-limiter-flexible'
import redis from './redis'

export const rateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'rate_limit',
  points: 10, // Number of requests
  duration: 1, // Per second
})

export const strictRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'strict_rate_limit',
  points: 5, // Number of requests
  duration: 60, // Per minute
})

export async function checkRateLimit(identifier: string, strict = false) {
  const limiter = strict ? strictRateLimiter : rateLimiter
  
  try {
    await limiter.consume(identifier)
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      retryAfter: error.msBeforeNext / 1000 
    }
  }
} 