"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, Zap, Shield, ChevronLeft, ChevronRight, Eye, MessageCircle } from "lucide-react"

const featuredAds = [
  {
    id: 1,
    title: "HP EliteBook 840 G7",
    price: "Rs 106,000",
    originalPrice: "Rs 120,000",
    location: "Colombo",
    timePosted: "19 hours",
    image: "/placeholder.svg?height=200&width=300&text=HP+Laptop",
    category: "Computers & Tablets",
    isBoosted: true,
    isVerified: false,
    hasAuction: false,
    condition: "Used",
    views: 1234,
    messages: 23,
    discount: 12,
  },
  {
    id: 2,
    title: "TOP 4 TRENDING PROJECTORS 2025",
    price: "Rs 100,000",
    originalPrice: "Rs 115,000",
    location: "Colombo",
    timePosted: "16 hours",
    image: "/placeholder.svg?height=200&width=300&text=Projector",
    category: "TV & Video Accessories",
    isBoosted: true,
    isVerified: true,
    hasAuction: true,
    condition: "New",
    views: 2156,
    messages: 45,
    discount: 13,
  },
  {
    id: 3,
    title: "Toyota Prius 2018",
    price: "Rs 4,500,000",
    originalPrice: "Rs 4,800,000",
    location: "Kandy",
    timePosted: "2 days",
    image: "/placeholder.svg?height=200&width=300&text=Toyota+Prius",
    category: "Cars",
    isBoosted: true,
    isVerified: true,
    hasAuction: false,
    condition: "Used",
    views: 5678,
    messages: 89,
    discount: 6,
  },
  {
    id: 4,
    title: "iPhone 15 Pro Max",
    price: "Rs 350,000",
    originalPrice: "Rs 380,000",
    location: "Galle",
    timePosted: "5 hours",
    image: "/placeholder.svg?height=200&width=300&text=iPhone+15",
    category: "Mobile Phones",
    isBoosted: false,
    isVerified: true,
    hasAuction: true,
    condition: "New",
    views: 3421,
    messages: 67,
    discount: 8,
  },
  {
    id: 5,
    title: "Apartment for Rent - Colombo 03",
    price: "Rs 75,000/month",
    originalPrice: "Rs 85,000/month",
    location: "Colombo",
    timePosted: "1 day",
    image: "/placeholder.svg?height=200&width=300&text=Apartment",
    category: "Houses & Apartments for Rent",
    isBoosted: true,
    isVerified: true,
    hasAuction: false,
    condition: "New",
    views: 2890,
    messages: 34,
    discount: 12,
  },
]

export function FeaturedListings() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredAds.length - 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredAds.length - 2)) % Math.max(1, featuredAds.length - 2))
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-accent/20 via-background to-primary/5 relative">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 gradient-text flex items-center gap-2">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
              Featured Listings
            </h2>
            <p className="text-muted-foreground">Premium ads with enhanced visibility</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={prevSlide} className="glass-effect bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={nextSlide} className="glass-effect bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {featuredAds.map((ad) => (
              <div key={ad.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-2">
                <Card
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 card-hover relative overflow-hidden ${
                    ad.isBoosted ? "boost-glow" : ""
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={ad.image || "/placeholder.svg"}
                      alt={ad.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {ad.isBoosted && (
                        <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg">
                          <Zap className="h-3 w-3 mr-1 animate-pulse" />
                          Boosted
                        </Badge>
                      )}
                      {ad.hasAuction && (
                        <Badge variant="destructive" className="auction-pulse shadow-lg">
                          🔥 Auction
                        </Badge>
                      )}
                      <Badge variant="secondary" className="glass-effect">
                        {ad.condition}
                      </Badge>
                      {ad.discount > 0 && <Badge className="bg-red-500 text-white">-{ad.discount}%</Badge>}
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        <Eye className="h-3 w-3" />
                        {ad.views.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        <MessageCircle className="h-3 w-3" />
                        {ad.messages}
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-lg"
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(ad.id)
                      }}
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors duration-200 ${
                          favorites.includes(ad.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>

                  <CardContent className="p-4 relative">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {ad.title}
                      </h3>
                      {ad.isVerified && (
                        <div className="verified-badge rounded-full p-1 ml-2">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="price-highlight mb-3">
                      <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-primary">{ad.price}</div>
                        {ad.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">{ad.originalPrice}</div>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground mb-3">{ad.category}</div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ad.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {ad.timePosted} ago
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="glass-effect bg-transparent">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.max(1, featuredAds.length - 2) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
