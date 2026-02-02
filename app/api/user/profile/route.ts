import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    bio: z.string().max(500).optional(),
    avatar: z.string().url().optional().nullable(),
    coverImage: z.string().url().optional().nullable(),
})

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validated = updateProfileSchema.parse(body)

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...validated,
                updatedAt: new Date(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                bio: true,
                avatar: true,
                coverImage: true,
                role: true,
                averageRating: true,
                totalSales: true,
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid data', details: error.errors },
                { status: 400 }
            )
        }
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                bio: true,
                avatar: true,
                coverImage: true,
                role: true,
                averageRating: true,
                totalSales: true,
                createdAt: true,
                _count: {
                    select: {
                        ads: { where: { status: 'ACTIVE' } },
                        receivedReviews: true,
                    },
                },
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }
}
