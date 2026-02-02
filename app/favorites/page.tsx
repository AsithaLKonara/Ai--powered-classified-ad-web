"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Heart, Trash2, Eye, Loader2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

export default function FavoritesPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()

    const [favorites, setFavorites] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchFavorites = async () => {
        try {
            const res = await fetch("/api/favorites")
            const data = await res.json()
            if (res.ok) {
                setFavorites(data.favorites || [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
        if (session) {
            fetchFavorites()
        }
    }, [session, status, router])

    const removeFavorite = async (adId: string) => {
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId }),
            })

            if (res.ok) {
                setFavorites(favorites.filter(f => f.id !== adId))
                toast({
                    title: "Removed",
                    description: "Ad removed from your favorites.",
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not remove favorite.",
            })
        }
    }

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0C10] text-white">
            <Navigation />

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <h1 className="text-3xl font-bold">My Favorites</h1>
                        </div>
                        <p className="text-gray-400">Ads you've saved for later</p>
                    </div>
                    <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1">
                        {favorites.length} Saved Ads
                    </Badge>
                </div>

                {favorites.length === 0 ? (
                    <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md border-dashed border-2 py-20 text-center">
                        <CardContent className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                                <Heart className="w-8 h-8 text-gray-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-300">No favorites yet</h2>
                            <p className="text-gray-500 max-w-sm">Start browsing and click the heart icon to save ads that interest you.</p>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Link href="/listings">
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Browse Listings
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((ad) => (
                            <Card key={ad.id} className="bg-gray-900/40 border-gray-800 backdrop-blur-sm group hover:border-primary/50 transition-all duration-500 overflow-hidden">
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={ad.images?.[0]?.url || "/placeholder-ad.jpg"}
                                        alt={ad.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                        <div className="flex gap-2 w-full">
                                            <Button variant="secondary" size="sm" className="flex-1" asChild>
                                                <Link href={`/listings/${ad.id}`}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border-none"
                                                onClick={() => removeFavorite(ad.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-gray-400 border-gray-800">
                                            {ad.category?.name}
                                        </Badge>
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {ad.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-bold text-green-400">
                                            Rs {Number(ad.price).toLocaleString()}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {ad.location?.name}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
