import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { action } = body // 'ACCEPT', 'REJECT', 'WITHDRAW'

        if (!['ACCEPT', 'REJECT', 'WITHDRAW'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            )
        }

        // Get offer
        const offer = await prisma.offer.findUnique({
            where: { id: params.id },
            include: { ad: true },
        })

        if (!offer) {
            return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
        }

        // Verify authorization
        if (action === 'WITHDRAW' && offer.buyerId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        if (['ACCEPT', 'REJECT'].includes(action) && offer.sellerId !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Check if offer is still pending
        if (offer.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Offer is no longer pending' },
                { status: 400 }
            )
        }

        const newStatus = action === 'ACCEPT' ? 'ACCEPTED' :
            action === 'REJECT' ? 'REJECTED' : 'WITHDRAWN'

        // Update offer
        const updatedOffer = await prisma.offer.update({
            where: { id: params.id },
            data: {
                status: newStatus,
                updatedAt: new Date(),
            },
            include: {
                buyer: {
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
                    },
                },
            },
        })

        // TODO: Send notification to buyer/seller
        // TODO: If accepted, optionally mark ad as SOLD

        return NextResponse.json(updatedOffer)
    } catch (error) {
        console.error('Error updating offer:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
