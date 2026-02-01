"use client"

import { useState, useEffect } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    Flag,
    MessageCircle,
    Phone,
    Star,
    Shield,
    MapPin,
    Clock,
    Eye,
    Zap,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useAds } from "@/hooks/use-api"

export default function ListingDetailPage() {
    const params = useParams()
    const id = params?.id as string

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorited, setIsFavorited] = useState(false)
    const [ad, setAd] = useState<any>(null)

    const { getAd, loading, error } = useAds()

    useEffect(() => {
        if (id) {
            getAd(id).then(data => {
                if (data && data.ad) {
                    setAd(data.ad)
                }
            })
        }
    }, [getAd, id])

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-LK", {
            style: "currency",
            currency: "LKR",
            minimumFractionDigits: 0,
        }).format(price)
    }

    const nextImage = () => {
        if (ad?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % ad.images.length)
        }
    }

    const prevImage = () => {
        if (ad?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length)
        }
    }

    if (loading || !ad && !error) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <Footer />
            </div>
        )
    }

    if (error || !ad) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navigation />
                <div className="flex-1 flex items-center justify-center flex-col gap-4">
                    <h2 className="text-xl font-bold text-red-500">Ad not found</h2>
                    <Button asChild><Link href="/">Go Home</Link></Button>
                </div>
                <Footer />
            </div>
        )
    }

    const images = ad.images?.map((img: any) => img.url) || ["/placeholder.svg"]

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card>
                            <CardContent className="p-0">
                                <div className="relative">
                                    <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gray-100">
                                        <img
                                            src={images[currentImageIndex]}
                                            alt={ad.title}
                                            className="w-full h-full object-contain"
                                        />

                                        {/* Navigation Arrows */}
                                        {images.length > 1 && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                                    onClick={prevImage}
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                                                    onClick={nextImage}
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}

                                        {/* Image Counter */}
                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                            {currentImageIndex + 1} / {images.length}
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                                            {ad.isBoosted && (
                                                <Badge className="bg-primary text-primary-foreground animate-pulse">
                                                    <Zap className="w-3 h-3 mr-1" />
                                                    Boosted
                                                </Badge>
                                            )}
                                            {ad.user?.verified && (
                                                <Badge className="bg-green-500 text-white">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Thumbnail Strip */}
                                    {images.length > 1 && (
                                        <div className="p-4 flex gap-2 overflow-x-auto">
                                            {images.map((image: string, index: number) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${index === currentImageIndex ? "border-primary" : "border-gray-200"
                                                        }`}
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Ad Details */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-2">{ad.title}</h1>
                                        <div className="text-3xl font-bold text-primary mb-4">{formatPrice(Number(ad.price))}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsFavorited(!isFavorited)}
                                            className={isFavorited ? "text-red-500" : ""}
                                        >
                                            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Share2 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Flag className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{ad.location?.name || 'Location N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{ad.views || 0} views</span>
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                                    <div className="prose prose-sm max-w-none whitespace-pre-line text-gray-300">
                                        {ad.description}
                                    </div>
                                </div>

                                <Separator className="my-6" />

                                {(ad.attributes && ad.attributes.length > 0) && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {ad.attributes.map((attr: any) => (
                                                <div key={attr.key} className="flex justify-between border-b border-gray-800 pb-2">
                                                    <span className="text-muted-foreground">{attr.key}:</span>
                                                    <span className="font-medium">{attr.value}</span>
                                                </div>
                                            ))}
                                            {/* Add standard fields like Condition */}
                                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                                <span className="text-muted-foreground">Condition:</span>
                                                <span className="font-medium">{ad.condition}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Note: Similar ads would be fetched here if API supported it */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Seller Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Seller Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="w-12 h-12">
                                        {/* User avatar not in ad user object by default yet, user placeholder */}
                                        <AvatarFallback>{ad.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold">{ad.user?.name || "Unknown"}</h3>
                                            {ad.user?.verified && (
                                                <Badge className="bg-green-500 text-white text-xs">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                        </div>
                                        {/* Rating not yet in ad.user, keeping static for now or hiding */}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                    {/* Contact info if available */}
                                    {ad.user?.email && <div>Email: {ad.user.email}</div>}
                                    {ad.user?.phone && <div>Phone: {ad.user.phone}</div>}
                                </div>

                                <div className="space-y-2">
                                    <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                                        <Link href="/chat">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            Start Chat
                                        </Link>
                                    </Button>
                                    <Button variant="outline" className="w-full bg-transparent">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Call Seller
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Safety Tips */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Safety Tips</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span>Meet in a public place for transactions</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span>Inspect the item before making payment</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span>Avoid advance payments or wire transfers</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                        <span>Report suspicious activity</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
