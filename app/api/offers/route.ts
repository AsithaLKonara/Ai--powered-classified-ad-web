import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { z } from 'zod'

const createOfferSchema = z.object({
    adId: z.string(),
    amount: z.number().positive(),
    message: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validated = createOfferSchema.parse(body)

        // Get ad details
        const ad = await prisma.ad.findUnique({
            where: { id: validated.adId },
            select: { userId: true, price: true, status: true },
        })

        if (!ad) {
            return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
        }

        if (ad.status !== 'ACTIVE') {
            return NextResponse.json({ error: 'Ad is not active' }, { status: 400 })
        }

        // Prevent self-offers
        if (ad.userId === session.user.id) {
            return NextResponse.json(
                { error: 'You cannot make an offer on your own ad' },
                { status: 400 }
            )
        }

        // Create offer
        const offer = await prisma.offer.create({
            data: {
                amount: validated.amount,
                message: validated.message,
                buyerId: session.user.id,
                sellerId: ad.userId,
                adId: validated.adId,
            },
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        averageRating: true,
                    },
                },
                ad: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: {
                            take: 1,
                            select: { url: true },
                        },
                    },
                },
            },
        })

        // TODO: Send notification to seller

        return NextResponse.json(offer, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            )
        }
        console.error('Error creating offer:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') || 'received' // 'received' or 'sent'
        const adId = searchParams.get('adId')

        const where: any = {}

        if (adId) {
            where.adId = adId
            where.OR = [
                { buyerId: session.user.id },
                { sellerId: session.user.id },
            ]
        } else if (type === 'received') {
            where.sellerId = session.user.id
        } else {
            where.buyerId = session.user.id
        }

        const offers = await prisma.offer.findMany({
            where,
            include: {
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        averageRating: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
                ad: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        status: true,
                        images: {
                            take: 1,
                            select: { url: true },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return NextResponse.json(offers)
    } catch (error) {
        console.error('Error fetching offers:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
