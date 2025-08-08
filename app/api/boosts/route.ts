import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const createBoostSchema = z.object({
  adId: z.string().min(1, 'Ad ID is required'),
  packageId: z.string().min(1, 'Package ID is required'),
  amount: z.number().positive('Amount must be positive'),
  duration: z.number().positive('Duration must be positive'),
  paymentId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createBoostSchema.parse(body)

    // Check if user owns the ad
    const ad = await prisma.ad.findUnique({
      where: { id: validatedData.adId },
      select: { userId: true }
    })

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    if (ad.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Calculate boost end date
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + validatedData.duration * 24 * 60 * 60 * 1000)

    // Create boost
    const boost = await prisma.boost.create({
      data: {
        type: 'FEATURED',
        amount: validatedData.amount,
        duration: validatedData.duration,
        startDate,
        endDate,
        status: 'ACTIVE',
        userId,
        adId: validatedData.adId,
        paymentId: validatedData.paymentId,
      },
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
          }
        }
      }
    })

    // Update ad to show it's boosted
    await prisma.ad.update({
      where: { id: validatedData.adId },
      data: {
        isBoosted: true,
        boostExpires: endDate,
      }
    })

    return NextResponse.json({
      message: 'Boost created successfully',
      boost
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create boost error:', error)
    return NextResponse.json(
      { error: 'Failed to create boost' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const adId = searchParams.get('adId')

    const where: any = { userId }
    if (adId) {
      where.adId = adId
    }

    const boosts = await prisma.boost.findMany({
      where,
      include: {
        ad: {
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ boosts })
  } catch (error) {
    console.error('Fetch boosts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch boosts' },
      { status: 500 }
    )
  }
} 