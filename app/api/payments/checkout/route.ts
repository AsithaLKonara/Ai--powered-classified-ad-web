import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const BOOST_PACKAGES = {
    STARTER: { name: 'Starter Boost', price: 500, days: 3 },
    PRO: { name: 'Pro Boost', price: 1500, days: 7 },
    PREMIUM: { name: 'Premium Boost', price: 3000, days: 14 },
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { adId, packageType } = await request.json()
        const boost = BOOST_PACKAGES[packageType as keyof typeof BOOST_PACKAGES]

        if (!boost) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 })
        }

        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'lkr',
                        product_data: {
                            name: boost.name,
                            description: `Increase visibility for ${boost.days} days`,
                        },
                        unit_amount: boost.price * 100, // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/dashboard?payment=success&adId=${adId}`,
            cancel_url: `${baseUrl}/dashboard?payment=cancel`,
            metadata: {
                adId,
                userId: session.user.id,
                packageType,
                days: boost.days.toString(),
            },
        })

        return NextResponse.json({ url: checkoutSession.url })
    } catch (error: any) {
        console.error('Stripe error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
