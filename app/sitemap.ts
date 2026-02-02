import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Fetch all active ads
    const ads = await prisma.ad.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, updatedAt: true }
    })

    const adEntries = ads.map((ad) => ({
        url: `${baseUrl}/listings/${ad.id}`,
        lastModified: ad.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.7,
    }))

    const staticPages = [
        '',
        '/listings',
        '/post-ad',
        '/auth/signin',
        '/auth/signup',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }))

    return [...staticPages, ...adEntries]
}
