import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendNewMessageEmail } from '@/lib/mail'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      )
    }

    // Get conversations for the user
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        ad: {
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      distinct: ['senderId', 'receiverId'],
    })

    // Group conversations by the other user
    const conversationMap = new Map()

    conversations.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId
      const otherUser = message.senderId === userId ? message.receiver : message.sender

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          user: otherUser,
          lastMessage: message,
          unreadCount: 0,
        })
      }
    })

    // Get unread counts
    const unreadCounts = await prisma.message.groupBy({
      by: ['senderId'],
      where: {
        receiverId: userId,
        isRead: false,
      },
      _count: {
        id: true
      }
    })

    unreadCounts.forEach(count => {
      const conversation = conversationMap.get(count.senderId)
      if (conversation) {
        conversation.unreadCount = count._count.id
      }
    })

    return NextResponse.json({
      conversations: Array.from(conversationMap.values())
    })
  } catch (error) {
    console.error('Fetch conversations error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    )
  }
}

import { pusherServer } from '@/lib/pusher'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      )
    }

    const { receiverId, content, adId, type = 'TEXT' } = await request.json()

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver ID and content are required' },
        { status: 400 }
      )
    }

    const message = await prisma.message.create({
      data: {
        content,
        type,
        senderId: userId,
        receiverId,
        adId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          }
        },
        ad: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    // Trigger real-time notification via Pusher
    await pusherServer.trigger(`user-${receiverId}`, 'new-message', {
      message: message.content,
      senderName: message.sender.name,
      adId: message.adId,
    })

    // Send email notification for new message
    if (message.receiver.email) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      await sendNewMessageEmail(
        message.receiver.email,
        message.sender.name || 'A buyer',
        message.ad?.title || 'your ad',
        `${baseUrl}/chat`
      )
    }

    return NextResponse.json({
      message: 'Message sent successfully',
      data: message
    }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
} 