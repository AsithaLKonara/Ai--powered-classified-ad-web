import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Get date range from query params (default: last 30 days)
        const { searchParams } = new URL(request.url)
        const days = parseInt(searchParams.get('days') || '30')
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)

        // Parallel queries for dashboard stats
        const [
            totalUsers,
            totalAds,
            activeAds,
            pendingAds,
            rejectedAds,
            totalReviews,
            averageRating,
            recentUsers,
            recentAds,
            topCategories,
            topLocations,
            userGrowth,
            adGrowth,
        ] = await Promise.all([
            // Total counts
            prisma.user.count(),
            prisma.ad.count(),
            prisma.ad.count({ where: { status: 'ACTIVE' } }),
            prisma.ad.count({ where: { status: 'PENDING' } }),
            prisma.ad.count({ where: { status: 'REJECTED' } }),
            prisma.review.count(),

            // Average rating
            prisma.review.aggregate({
                _avg: { rating: true },
            }),

            // Recent users (last 7 days)
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),

            // Recent ads (last 7 days)
            prisma.ad.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            }),

            // Top categories
            prisma.ad.groupBy({
                by: ['categoryId'],
                _count: true,
                orderBy: {
                    _count: {
                        categoryId: 'desc',
                    },
                },
                take: 5,
            }),

            // Top locations
            prisma.ad.groupBy({
                by: ['locationId'],
                _count: true,
                orderBy: {
                    _count: {
                        locationId: 'desc',
                    },
                },
                take: 5,
            }),

            // User growth (last 30 days, grouped by day)
            prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "User"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,

            // Ad growth (last 30 days, grouped by day)
            prisma.$queryRaw`
        SELECT DATE(created_at) as date, COUNT(*) as count
        FROM "Ad"
        WHERE created_at >= ${startDate}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `,
        ])

        // Fetch category and location names
        const categoryIds = topCategories.map((c) => c.categoryId)
        const locationIds = topLocations.map((l) => l.locationId)

        const [categories, locations] = await Promise.all([
            prisma.category.findMany({
                where: { id: { in: categoryIds } },
                select: { id: true, name: true },
            }),
            prisma.location.findMany({
                where: { id: { in: locationIds } },
                select: { id: true, name: true },
            }),
        ])

        const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))
        const locationMap = Object.fromEntries(locations.map((l) => [l.id, l.name]))

        return NextResponse.json({
            overview: {
                totalUsers,
                totalAds,
                activeAds,
                pendingAds,
                rejectedAds,
                totalReviews,
                averageRating: averageRating._avg.rating || 0,
                recentUsers,
                recentAds,
            },
            topCategories: topCategories.map((c) => ({
                name: categoryMap[c.categoryId] || 'Unknown',
                count: c._count,
            })),
            topLocations: topLocations.map((l) => ({
                name: locationMap[l.locationId] || 'Unknown',
                count: l._count,
            })),
            growth: {
                users: userGrowth,
                ads: adGrowth,
            },
        })
    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
