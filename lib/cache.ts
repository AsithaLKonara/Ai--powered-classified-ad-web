import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = process.env.REDIS_URL
    ? new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN || '',
    })
    : null

// Cache TTL (Time To Live) in seconds
const CACHE_TTL = {
    ADS_LIST: 300, // 5 minutes
    AD_DETAIL: 600, // 10 minutes
    CATEGORIES: 3600, // 1 hour
    LOCATIONS: 3600, // 1 hour
    USER_PROFILE: 600, // 10 minutes
    ANALYTICS: 1800, // 30 minutes
}

/**
 * Get data from cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
    if (!redis) return null

    try {
        const data = await redis.get(key)
        return data as T | null
    } catch (error) {
        console.error('Redis get error:', error)
        return null
    }
}

/**
 * Set data in cache with TTL
 */
export async function setCache(
    key: string,
    data: any,
    ttl: number = 300
): Promise<void> {
    if (!redis) return

    try {
        await redis.setex(key, ttl, JSON.stringify(data))
    } catch (error) {
        console.error('Redis set error:', error)
    }
}

/**
 * Delete data from cache
 */
export async function deleteCache(key: string): Promise<void> {
    if (!redis) return

    try {
        await redis.del(key)
    } catch (error) {
        console.error('Redis delete error:', error)
    }
}

/**
 * Delete multiple keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
    if (!redis) return

    try {
        const keys = await redis.keys(pattern)
        if (keys.length > 0) {
            await redis.del(...keys)
        }
    } catch (error) {
        console.error('Redis delete pattern error:', error)
    }
}

/**
 * Generate cache key for ads list
 */
export function getAdsListCacheKey(params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
        .sort()
        .map((key) => `${key}:${params[key]}`)
        .join('|')
    return `ads:list:${sortedParams}`
}

/**
 * Generate cache key for ad detail
 */
export function getAdDetailCacheKey(adId: string): string {
    return `ad:${adId}`
}

/**
 * Generate cache key for user profile
 */
export function getUserProfileCacheKey(userId: string): string {
    return `user:${userId}`
}

/**
 * Invalidate ad-related caches
 */
export async function invalidateAdCaches(adId?: string): Promise<void> {
    await deleteCachePattern('ads:list:*')
    if (adId) {
        await deleteCache(getAdDetailCacheKey(adId))
    }
}

/**
 * Invalidate user-related caches
 */
export async function invalidateUserCaches(userId: string): Promise<void> {
    await deleteCache(getUserProfileCacheKey(userId))
    await deleteCachePattern(`ads:list:*userId:${userId}*`)
}

export { CACHE_TTL }
