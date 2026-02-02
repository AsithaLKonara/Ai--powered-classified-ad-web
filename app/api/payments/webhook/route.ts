import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
    const body = await request.text()
    const sig = (await headers()).get('stripe-signature') as string

    let event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any
        const { adId, userId, packageType, days } = session.metadata

        const boostDays = parseInt(days)
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + boostDays)

        // Update Ad and Create Boost record
        await prisma.$transaction([
            prisma.ad.update({
                where: { id: adId },
                data: {
                    isBoosted: true,
                    boostExpires: expiresAt,
                }
            }),
            prisma.boost.create({
                data: {
                    type: packageType as any,
                    amount: session.amount_total / 100,
                    duration: boostDays,
                    endDate: expiresAt,
                    userId,
                    adId,
                    status: 'ACTIVE',
                }
            })
        ])

        console.log(`Boost applied to ad ${adId} for user ${userId}`)
    }

    return NextResponse.json({ received: true })
}
