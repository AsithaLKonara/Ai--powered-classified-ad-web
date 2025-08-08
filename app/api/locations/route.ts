import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (parentId) {
      where.parentId = parentId
    } else {
      where.parentId = null // Only root locations
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const locations = await prisma.location.findMany({
      where,
      include: {
        children: {
          include: {
            _count: {
              select: {
                ads: true
              }
            }
          }
        },
        _count: {
          select: {
            ads: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Fetch locations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
} 