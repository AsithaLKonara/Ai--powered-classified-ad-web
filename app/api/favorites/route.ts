import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')

        const [favorites, total] = await Promise.all([
            prisma.favorite.findMany({
                where: { userId: session.user.id },
                include: {
                    ad: {
                        include: {
                            images: { take: 1, orderBy: { order: 'asc' } },
                            category: true,
                            location: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.favorite.count({ where: { userId: session.user.id } })
        ])

        return NextResponse.json({
            favorites: favorites.map(f => f.ad),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            }
        })
    } catch (error) {
        console.error('Fetch favorites error:', error)
        return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { adId } = await request.json()

        if (!adId) {
            return NextResponse.json({ error: 'Ad ID is required' }, { status: 400 })
        }

        // Toggle favorite
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_adId: {
                    userId: session.user.id,
                    adId
                }
            }
        })

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            })

            // Update ad favorite count
            await prisma.ad.update({
                where: { id: adId },
                data: { favoritesCount: { decrement: 1 } }
            })

            return NextResponse.json({ message: 'Removed from favorites', isFavorite: false })
        } else {
            await prisma.favorite.create({
                data: {
                    userId: session.user.id,
                    adId
                }
            })

            // Update ad favorite count
            await prisma.ad.update({
                where: { id: adId },
                data: { favoritesCount: { increment: 1 } }
            })

            return NextResponse.json({ message: 'Added to favorites', isFavorite: true })
        }
    } catch (error) {
        console.error('Toggle favorite error:', error)
        return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 })
    }
}
