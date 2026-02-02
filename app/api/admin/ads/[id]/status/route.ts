import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendAdApprovedEmail } from '@/lib/mail'

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check for admin role
        const userRole = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true }
        })

        if (!['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(userRole?.role || '')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { status } = await request.json()

        if (!['ACTIVE', 'REJECTED', 'PENDING', 'SOLD', 'EXPIRED', 'DELETED', 'DRAFT'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
        }

        const ad = await prisma.ad.update({
            where: { id: params.id },
            data: { status },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true
                    }
                }
            }
        })

        // Send email notification to user about ad status change
        if (status === 'ACTIVE' && ad.user.email) {
            const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
            await sendAdApprovedEmail(
                ad.user.email,
                ad.user.name || 'User',
                ad.title,
                `${baseUrl}/listings/${ad.id}`
            )
        }

        return NextResponse.json({
            message: `Ad status updated to ${status}`,
            ad
        })
    } catch (error) {
        console.error('Admin ad status update error:', error)
        return NextResponse.json({ error: 'Failed to update ad status' }, { status: 500 })
    }
}
