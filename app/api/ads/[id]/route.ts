export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            emailVerified: true,
            phone: true,
            email: true,
          }
        },
        category: true,
        location: true,
        images: {
          orderBy: { order: 'asc' }
        },
        attributes: true,
        _count: {
          select: {
            favorites: true,
            bids: true,
          }
        }
      }
    })

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.ad.update({
      where: { id: params.id },
      data: { views: { increment: 1 } }
    })

    return NextResponse.json({ ad })
  } catch (error) {
    console.error('Fetch ad error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ad' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the ad
    const existingAd = await prisma.ad.findUnique({
      where: { id: params.id },
      select: { userId: true }
    })

    if (!existingAd) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    if (existingAd.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, description, price, categoryId, locationId, condition, type, images, attributes } = body

    const ad = await prisma.ad.update({
      where: { id: params.id },
      data: {
        title,
        description,
        price: parseFloat(price),
        categoryId,
        locationId,
        condition,
        type,
        images: images ? {
          deleteMany: {},
          create: images.map((url: string, index: number) => ({
            url,
            order: index,
          }))
        } : undefined,
        attributes: attributes ? {
          deleteMany: {},
          create: attributes
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            emailVerified: true,
          }
        },
        category: true,
        location: true,
        images: true,
        attributes: true,
      }
    })

    return NextResponse.json({
      message: 'Ad updated successfully',
      ad
    })
  } catch (error) {
    console.error('Update ad error:', error)
    return NextResponse.json(
      { error: 'Failed to update ad' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user owns the ad
    const existingAd = await prisma.ad.findUnique({
      where: { id: params.id },
      select: { userId: true }
    })

    if (!existingAd) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    if (existingAd.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    await prisma.ad.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Ad deleted successfully'
    })
  } catch (error) {
    console.error('Delete ad error:', error)
    return NextResponse.json(
      { error: 'Failed to delete ad' },
      { status: 500 }
    )
  }
} 