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
  Star,
  Shield,
  MapPin,
  Clock,
  Eye,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

const adData = {
  id: 1,
  title: "iPhone 15 Pro Max 256GB - Like New Condition",
  price: 450000,
  location: "Colombo 03",
  category: "Electronics > Mobile Phones",
  condition: "Used",
  description: `Selling my iPhone 15 Pro Max 256GB in excellent condition. Used for only 3 months with case and screen protector from day one.

Features:
• 256GB Storage
• Natural Titanium Color
• Battery Health: 98%
• No scratches or dents
• Original box and accessories included
• Still under warranty until March 2025

Reason for selling: Upgrading to iPhone 16 Pro Max

Serious buyers only. No lowballers please.`,
  images: ["/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg", "/placeholder.jpg"],
  timePosted: "2 hours ago",
  views: 234,
  favorites: 12,
  verified: true,
  boosted: true,
  auction: false,
  seller: {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder-user.jpg",
    rating: 4.8,
    totalReviews: 127,
    verified: true,
    memberSince: "2020",
    responseTime: "Usually responds within 2 hours",
    activeAds: 5,
  },
  specifications: {
    Brand: "Apple",
    Model: "iPhone 15 Pro Max",
    Storage: "256GB",
    Color: "Natural Titanium",
    Condition: "Used - Like New",
    Warranty: "Yes - Until March 2025",
  },
}

const similarAds = [
  {
    id: 2,
    title: "iPhone 15 Pro 128GB",
    price: 380000,
    image: "/placeholder.jpg",
    location: "Kandy",
  },
  {
    id: 3,
    title: "iPhone 14 Pro Max 256GB",
    price: 320000,
    image: "/placeholder.jpg",
    location: "Galle",
  },
  {
    id: 4,
    title: "Samsung Galaxy S24 Ultra",
    price: 420000,
    image: "/placeholder.jpg",
    location: "Colombo",
  },
]

export default function AdDetailPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % adData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + adData.images.length) % adData.images.length)
  }

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
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={adData.images[currentImageIndex] || "/placeholder.svg"}
                      alt={adData.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {adData.images.length > 1 && (
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
                      {currentImageIndex + 1} / {adData.images.length}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {adData.boosted && (
                        <Badge className="bg-primary text-primary-foreground animate-pulse">
                          <Zap className="w-3 h-3 mr-1" />
                          Boosted
                        </Badge>
                      )}
                      {adData.verified && (
                        <Badge className="bg-green-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  {adData.images.length > 1 && (
                    <div className="p-4 flex gap-2 overflow-x-auto">
                      {adData.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            index === currentImageIndex ? "border-primary" : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
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
                    <h1 className="text-2xl font-bold mb-2">{adData.title}</h1>
                    <div className="text-3xl font-bold text-primary mb-4">{formatPrice(adData.price)}</div>
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
                    <span>{adData.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{adData.timePosted}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{adData.views} views</span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="prose prose-sm max-w-none">
                    {adData.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(adData.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Ads */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Ads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarAds.map((ad) => (
                    <Link key={ad.id} href={`/ad/${ad.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <img
                            src={ad.image || "/placeholder.svg"}
                            alt={ad.title}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">{ad.title}</h4>
                          <div className="text-primary font-bold text-sm">{formatPrice(ad.price)}</div>
                          <div className="text-xs text-muted-foreground">{ad.location}</div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                    <AvatarImage src={adData.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{adData.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{adData.seller.name}</h3>
                      {adData.seller.verified && (
                        <Badge className="bg-green-500 text-white text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{adData.seller.rating}</span>
                      <span>({adData.seller.totalReviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div>Member since {adData.seller.memberSince}</div>
                  <div>{adData.seller.responseTime}</div>
                  <div>{adData.seller.activeAds} active ads</div>
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

            {/* Boost Ad */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Boost Your Ad</h3>
                <p className="text-sm text-muted-foreground mb-4">Get 5x more visibility and reach more buyers</p>
                <Button className="w-full" asChild>
                  <Link href="/boost">Boost Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
