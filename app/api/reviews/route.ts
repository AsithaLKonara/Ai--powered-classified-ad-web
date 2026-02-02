import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { z } from 'zod'

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    reviewedId: z.string(),
    adId: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const validated = reviewSchema.parse(body)

        // Prevent self-review
        if (session.user.id === validated.reviewedId) {
            return NextResponse.json(
                { error: 'You cannot review yourself' },
                { status: 400 }
            )
        }

        // Check if user has already reviewed this seller for this ad
        const existingReview = await prisma.review.findUnique({
            where: {
                reviewerId_reviewedId_adId: {
                    reviewerId: session.user.id,
                    reviewedId: validated.reviewedId,
                    adId: validated.adId || null,
                },
            },
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'You have already reviewed this seller for this ad' },
                { status: 400 }
            )
        }

        // Optional: Verify user has purchased from this seller
        // This can be implemented when order/transaction system is ready
        // For now, we'll allow any user to review

        // Create review
        const review = await prisma.review.create({
            data: {
                ...validated,
                reviewerId: session.user.id,
            },
            include: {
                reviewer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        })

        // Update seller's average rating
        const avgRating = await prisma.review.aggregate({
            where: { reviewedId: validated.reviewedId },
            _avg: { rating: true },
            _count: true,
        })

        await prisma.user.update({
            where: { id: validated.reviewedId },
            data: {
                averageRating: avgRating._avg.rating,
            },
        })

        return NextResponse.json(review, { status: 201 })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid request data', details: error.errors },
                { status: 400 }
            )
        }
        console.error('Error creating review:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const adId = searchParams.get('adId')

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            )
        }

        const where: any = { reviewedId: userId }
        if (adId) {
            where.adId = adId
        }

        const reviews = await prisma.review.findMany({
            where,
            include: {
                reviewer: {
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
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        // Get average rating and count
        const stats = await prisma.review.aggregate({
            where: { reviewedId: userId },
            _avg: { rating: true },
            _count: true,
        })

        return NextResponse.json({
            reviews,
            stats: {
                averageRating: stats._avg.rating || 0,
                totalReviews: stats._count,
            },
        })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
