"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, Zap, Shield, ChevronLeft, ChevronRight, Eye, MessageCircle, Loader2 } from "lucide-react"
import { useAds } from "@/hooks/use-api"

export function FeaturedListings() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])
  const { ads, loading, error, getAds } = useAds()

  useEffect(() => {
    // Fetch featured ads (boosted or featured)
    getAds({ limit: 10, page: 1 })
  }, [getAds])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    )
  }

  const nextSlide = () => {
    if (ads?.ads) {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(ads.ads.length / 3))
    }
  }

  const prevSlide = () => {
    if (ads?.ads) {
      setCurrentIndex((prev) => 
        prev === 0 ? Math.ceil(ads.ads.length / 3) - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Featured Listings</h2>
            <p className="text-muted-foreground text-lg">Handpicked ads for you</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-red-500">Failed to load featured listings: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  const featuredAds = ads?.ads || []

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Featured Listings</h2>
          <p className="text-muted-foreground text-lg">Handpicked ads for you</p>
        </div>

        {featuredAds.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No featured listings available</p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAds.slice(currentIndex * 3, (currentIndex + 1) * 3).map((ad: any) => (
                <Card key={ad.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <Image
                          src={ad.images?.[0]?.url || "/placeholder.svg?height=200&width=300&text=Ad+Image"}
                          alt={ad.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex gap-1">
                          {ad.isBoosted && (
                            <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                              <Zap className="w-3 h-3 mr-1" />
                              Boosted
                            </Badge>
                          )}
                          {ad.user?.verified && (
                            <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 p-1 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleFavorite(ad.id)
                          }}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(ad.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                            }`}
                          />
                        </Button>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {ad.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {ad.category?.name}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ad.condition}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {ad.location?.name}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(ad.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {ad.views || 0}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {ad._count?.messages || 0}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              Rs {ad.price?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {featuredAds.length > 3 && (
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="rounded-full w-10 h-10 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
