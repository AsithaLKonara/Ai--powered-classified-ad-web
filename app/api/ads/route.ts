import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const createAdSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  locationId: z.string().min(1, 'Location is required'),
  condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
  type: z.enum(['SALE', 'RENT', 'WANTED', 'SERVICE']),
  images: z.array(z.string()).optional(),
  attributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')
    const type = searchParams.get('type')

    const where: any = {
      status: 'ACTIVE',
    }

    if (category) {
      where.category = { slug: category }
    }

    if (location) {
      where.location = { slug: location }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    if (condition) {
      where.condition = condition
    }

    if (type) {
      where.type = type
    }

    const [ads, total] = await Promise.all([
      prisma.ad.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              verified: true,
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
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ad.count({ where })
    ])

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('Fetch ads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createAdSchema.parse(body)

    const ad = await prisma.ad.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        categoryId: validatedData.categoryId,
        locationId: validatedData.locationId,
        condition: validatedData.condition,
        type: validatedData.type,
        userId: session.user.id,
        images: validatedData.images ? {
          create: validatedData.images.map((url, index) => ({
            url,
            order: index,
          }))
        } : undefined,
        attributes: validatedData.attributes ? {
          create: validatedData.attributes
        } : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            verified: true,
          }
        },
        category: true,
        location: true,
        images: true,
        attributes: true,
      }
    })

    return NextResponse.json({
      message: 'Ad created successfully',
      ad
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create ad error:', error)
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    )
  }
} 