/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .substring(0, 100) // Limit length
}

/**
 * Generate meta title for ad
 */
export function generateMetaTitle(title: string, price: number, location?: string): string {
    const parts = [title]

    if (price > 0) {
        parts.push(`LKR ${price.toLocaleString()}`)
    }

    if (location) {
        parts.push(location)
    }

    const metaTitle = parts.join(' - ')
    return metaTitle.substring(0, 60) // Google's recommended length
}

/**
 * Generate meta description for ad
 */
export function generateMetaDescription(
    description: string,
    category?: string,
    condition?: string
): string {
    let meta = description.substring(0, 140) // Leave room for suffix

    const suffix: string[] = []
    if (category) suffix.push(category)
    if (condition) suffix.push(condition)

    if (suffix.length > 0) {
        meta += ` | ${suffix.join(' | ')}`
    }

    return meta.substring(0, 160) // Google's recommended length
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
    // Common words to exclude
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    ])

    const words = text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter((word) => word.length > 3 && !stopWords.has(word))

    // Count word frequency
    const frequency: Record<string, number> = {}
    words.forEach((word) => {
        frequency[word] = (frequency[word] || 0) + 1
    })

    // Sort by frequency and return top keywords
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxKeywords)
        .map(([word]) => word)
}

/**
 * Generate structured data (JSON-LD) for ad
 */
export function generateStructuredData(ad: {
    id: string
    title: string
    description: string
    price: number
    images: string[]
    category: string
    location: string
    createdAt: Date
    user: {
        name: string | null
        averageRating?: number | null
    }
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: ad.title,
        description: ad.description,
        image: ad.images,
        offers: {
            '@type': 'Offer',
            price: ad.price,
            priceCurrency: 'LKR',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Person',
                name: ad.user.name || 'Anonymous',
            },
        },
        category: ad.category,
        location: {
            '@type': 'Place',
            name: ad.location,
        },
        datePublished: ad.createdAt.toISOString(),
        ...(ad.user.averageRating && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: ad.user.averageRating,
                bestRating: 5,
            },
        }),
    }
}

/**
 * Sanitize text for SEO
 */
export function sanitizeForSEO(text: string): string {
    return text
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(baseUrl: string, path: string): string {
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}
