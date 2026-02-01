export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check for admin role
        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: { role: true }
        })

        if (user?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Parallel fetch for dashboard stats
        const [
            totalUsers,
            totalAds,
            activeBoosts,
            pendingAds,
            revenueData
        ] = await Promise.all([
            prisma.user.count(),
            prisma.ad.count(),
            prisma.boost.count({ where: { status: 'ACTIVE' } }),
            prisma.ad.count({ where: { status: 'DRAFT' } }), // Using DRAFT for pending
            prisma.boost.aggregate({
                _sum: {
                    amount: true
                }
            })
        ])

        // Get Pending Ads List
        const detailedPendingAds = await prisma.ad.findMany({
            where: { status: 'DRAFT' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true }
                },
                category: {
                    select: { name: true }
                }
            }
        })

        // Get Active Boosts List
        const activeBoostCampaigns = await prisma.boost.findMany({
            where: { status: 'ACTIVE' },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
                ad: { select: { title: true } }
            }
        })

        // Get Recent Users
        const recentUsers = await prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                _count: {
                    select: { ads: true }
                },
                emailVerified: true
            }
        })

        const stats = {
            totalUsers,
            totalAds,
            activeBoosts,
            totalRevenue: Number(revenueData._sum.amount) || 0,
            pendingAds,
            reportedContent: 0,
            monthlyGrowth: {
                users: 12.5,
                ads: 8.3,
                revenue: 15.7,
            },
        }

        return NextResponse.json({
            stats,
            pendingAds: detailedPendingAds.map(ad => ({
                id: ad.id,
                title: ad.title,
                seller: ad.user.name,
                category: ad.category.name,
                price: ad.price,
                submittedAt: ad.createdAt,
                status: 'pending'
            })),
            boostCampaigns: activeBoostCampaigns.map(boost => ({
                id: boost.id,
                adTitle: boost.ad.title,
                user: boost.user.name,
                package: boost.type,
                amount: boost.amount,
                startDate: boost.startDate,
                endDate: boost.endDate,
                status: boost.status,
                impressions: 100,
                clicks: 10
            })),
            recentUsers: recentUsers.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                joinedAt: u.createdAt,
                adsCount: u._count.ads,
                verified: !!u.emailVerified
            }))
        })

    } catch (error) {
        console.error('Admin dashboard error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch admin stats' },
            { status: 500 }
        )
    }
}
