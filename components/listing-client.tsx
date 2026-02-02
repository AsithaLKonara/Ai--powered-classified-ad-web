"use client"

import { useState } from "react"
import {
    ChevronLeft,
    ChevronRight,
    Heart,
    Share2,
    Flag,
    MessageCircle,
    Phone,
    Shield,
    MapPin,
    Clock,
    Eye,
    Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface ListingClientProps {
    ad: any;
}

export default function ListingClient({ ad }: ListingClientProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorited, setIsFavorited] = useState(false)
    const { toast } = useToast()

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

    const handleFavorite = async () => {
        try {
            const res = await fetch("/api/favorites", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ adId: ad.id }),
            })
            if (res.ok) {
                const data = await res.json()
                setIsFavorited(data.isFavorite)
                toast({
                    title: data.isFavorite ? "Added to Favorites" : "Removed from Favorites",
                    description: data.isFavorite ? "This ad has been saved." : "Removed from your list.",
                })
            }
        } catch (err) {
            toast({ variant: "destructive", title: "Error", description: "Failed to update favorites." })
        }
    }

    const images = ad.images?.map((img: any) => img.url) || ["/placeholder.svg"]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                {/* Image Gallery */}
                <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
                    <CardContent className="p-0">
                        <div className="relative group">
                            <div className="aspect-video relative overflow-hidden bg-gray-950">
                                <img
                                    src={images[currentImageIndex]}
                                    alt={ad.title}
                                    className="w-full h-full object-contain transition-all duration-700"
                                />

                                {images.length > 1 && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={prevImage}
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={nextImage}
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </>
                                )}

                                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                                    {currentImageIndex + 1} / {images.length}
                                </div>

                                <div className="absolute top-4 left-4 flex flex-col gap-2">
                                    {ad.isBoosted && (
                                        <Badge className="bg-primary hover:bg-primary text-black font-bold border-none px-3 py-1 shadow-[0_0_15px_rgba(0,255,132,0.4)]">
                                            <Zap className="w-3 h-3 mr-1 fill-current" />
                                            FEATURED
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {images.length > 1 && (
                                <div className="p-4 flex gap-3 overflow-x-auto no-scrollbar border-t border-gray-800 bg-gray-900/40">
                                    {images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-14 rounded-lg border-2 overflow-hidden transition-all ${index === currentImageIndex ? "border-primary ring-2 ring-primary/20 scale-105" : "border-gray-800 hover:border-gray-600"
                                                }`}
                                        >
                                            <img src={image} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Ad Details */}
                <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
                    <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{ad.title}</h1>
                                <div className="text-4xl font-black text-primary bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
                                    {formatPrice(Number(ad.price))}
                                </div>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <Button
                                    variant="outline"
                                    className={`flex-1 md:flex-none border-gray-800 hover:bg-white/5 transition-all ${isFavorited ? "text-red-500 border-red-500/50 bg-red-500/5" : ""}`}
                                    onClick={handleFavorite}
                                >
                                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? "fill-current" : ""}`} />
                                    {isFavorited ? "Saved" : "Save"}
                                </Button>
                                <Button variant="outline" className="border-gray-800 hover:bg-white/5">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-primary" />
                                </div>
                                <span>{ad.location?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-primary" />
                                </div>
                                <span>{new Date(ad.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                    <Eye className="w-4 h-4 text-primary" />
                                </div>
                                <span>{ad.views || 0} views</span>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <div className="w-1 h-5 bg-primary rounded-full" />
                                    Description
                                </h3>
                                <p className="text-gray-400 leading-relaxed whitespace-pre-line text-base">
                                    {ad.description}
                                </p>
                            </div>

                            {ad.attributes && ad.attributes.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <div className="w-1 h-5 bg-primary rounded-full" />
                                        Specifications
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 bg-gray-800/20 p-6 rounded-2xl border border-gray-800">
                                        {ad.attributes.map((attr: any) => (
                                            <div key={attr.key} className="flex justify-between items-center py-2 border-b border-gray-800/50">
                                                <span className="text-gray-500 text-sm">{attr.key}</span>
                                                <span className="text-white font-medium">{attr.value}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center py-2 border-b border-gray-800/50">
                                            <span className="text-gray-500 text-sm">Condition</span>
                                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase text-[10px] tracking-wider">
                                                {ad.condition}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-green-400" />
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">Seller Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-16 h-16 border-2 border-gray-800">
                                <AvatarFallback className="bg-gray-800 text-xl font-bold">
                                    {ad.user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-bold text-white text-lg">{ad.user?.name}</h3>
                                {ad.user?.verified && (
                                    <div className="flex items-center gap-1 text-xs text-primary font-bold uppercase tracking-wider mt-1">
                                        <Shield className="w-3 h-3 fill-current" />
                                        Verified Seller
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold h-12 shadow-[0_4px_15px_rgba(0,255,132,0.2)] transition-all" asChild>
                                <Link href="/chat">
                                    <MessageCircle className="w-5 h-5 mr-3" />
                                    Send Message
                                </Link>
                            </Button>
                            <Button variant="outline" className="w-full border-gray-800 h-12 hover:bg-white/5 font-bold transition-all group">
                                <Phone className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                {ad.user?.phone || "Show Phone Number"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
                    <CardHeader className="bg-gray-800/30">
                        <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-500">Safety Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <ul className="space-y-4 text-sm text-gray-400">
                            {[
                                "Always meet in a secure, public location.",
                                "Inspect the item thoroughly before paying.",
                                "Never send money in advance via bank transfer.",
                                "Beware of deals that seem too good to be true."
                            ].map((tip, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
