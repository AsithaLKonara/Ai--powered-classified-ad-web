import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        // Check if user is admin
        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status') || 'PENDING'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')

        const where: any = {}
        if (status !== 'ALL') {
            where.status = status
        }

        const [ads, total] = await Promise.all([
            prisma.ad.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            averageRating: true,
                        },
                    },
                    category: true,
                    location: true,
                    images: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.ad.count({ where }),
        ])

        return NextResponse.json({
            ads,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error('Error fetching moderation queue:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const body = await request.json()
        const { adIds, action, reason } = body

        if (!adIds || !Array.isArray(adIds) || adIds.length === 0) {
            return NextResponse.json(
                { error: 'adIds array is required' },
                { status: 400 }
            )
        }

        if (!['APPROVE', 'REJECT'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action. Must be APPROVE or REJECT' },
                { status: 400 }
            )
        }

        const updateData: any = {
            status: action === 'APPROVE' ? 'ACTIVE' : 'REJECTED',
            updatedAt: new Date(),
        }

        if (action === 'REJECT' && reason) {
            updateData.moderationReason = reason
        }

        const result = await prisma.ad.updateMany({
            where: {
                id: { in: adIds },
                status: 'PENDING',
            },
            data: updateData,
        })

        // TODO: Send notifications to users about moderation decision

        return NextResponse.json({
            success: true,
            updated: result.count,
            action,
        })
    } catch (error) {
        console.error('Error moderating ads:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
