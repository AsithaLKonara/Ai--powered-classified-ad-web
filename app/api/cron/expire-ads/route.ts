import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
    // Simple auth check for cron (using a secret header)
    const authHeader = request.headers.get('authorization')
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const now = new Date()

        // 1. Expire standard ads (e.g., after 30 days if not otherwise specified)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const expiredAds = await prisma.ad.updateMany({
            where: {
                status: 'ACTIVE',
                OR: [
                    { expiresAt: { lte: now } },
                    { createdAt: { lte: thirtyDaysAgo }, expiresAt: null }
                ]
            },
            data: {
                status: 'EXPIRED'
            }
        })

        // 2. Expire boosts
        const expiredBoosts = await prisma.boost.updateMany({
            where: {
                status: 'ACTIVE',
                endDate: { lte: now }
            },
            data: {
                status: 'EXPIRED'
            }
        })

        // 3. Deactivate 'isBoosted' flag on ads with expired boosts
        // This is a bit complex for updateMany, we might need a raw query or loop
        // But for a large scale app, we'd use a more refined query.
        await prisma.ad.updateMany({
            where: {
                isBoosted: true,
                boostExpires: { lte: now }
            },
            data: {
                isBoosted: false,
                boostExpires: null
            }
        })

        return NextResponse.json({
            message: 'Maintenance task completed',
            expiredAdsCount: expiredAds.count,
            expiredBoostsCount: expiredBoosts.count
        })
    } catch (error: any) {
        console.error('Cron error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
