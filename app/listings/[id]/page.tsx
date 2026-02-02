import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import ListingClient from '@/components/listing-client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
    params: Promise<{ id: string }>
}

async function getAd(id: string) {
    const ad = await prisma.ad.findUnique({
        where: { id },
        include: {
            images: true,
            category: true,
            location: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                },
            },
            attributes: true,
        },
    }) as any
    return ad
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const ad = await getAd(params.id)

    if (!ad) return { title: 'Ad Not Found | ClassifiedHub' }

    const description = ad.description.substring(0, 160)
    const images = ad.images as any[]
    const image = images[0]?.url || '/placeholder-ad.jpg'

    return {
        title: `${ad.title} | Rs ${Number(ad.price).toLocaleString()} in ${ad.location?.name} | ClassifiedHub`,
        description: description,
        openGraph: {
            title: ad.title,
            description: description,
            images: [image],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: ad.title,
            description: description,
            images: [image],
        },
    }
}

export default async function ListingDetailPage(props: PageProps) {
    const params = await props.params;
    const ad = await getAd(params.id)

    if (!ad) {
        notFound()
    }

    // Increment view count
    await prisma.ad.update({
        where: { id: params.id },
        data: { views: { increment: 1 } }
    })

    return (
        <div className="min-h-screen bg-[#0A0C10] text-white">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                <ListingClient ad={ad} />
            </main>

            <Footer />
        </div>
    )
}
