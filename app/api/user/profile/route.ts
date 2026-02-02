import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { name, phone, image } = body

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name,
                phone,
                image,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                image: true,
                role: true,
            }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user
        })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
