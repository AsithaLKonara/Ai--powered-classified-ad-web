import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')

    const where: any = {}
    if (parentId) {
      where.parentId = parentId
    } else {
      where.parentId = null // Only root categories
    }

    const categories = await prisma.category.findMany({
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

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Fetch categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
} 