"use client"

import { useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, TrendingUp, Shield, Loader2 } from "lucide-react"
import { useAds } from "@/hooks/use-api"
import Link from "next/link"

export function TrendingAds() {
  const { ads, loading, error, getAds } = useAds()

  useEffect(() => {
    // Fetch latest ads as "trending" for now. 
    // Ideally, the backend would support ?sort=trending or similar.
    getAds({ limit: 6, page: 1 })
  }, [getAds])


  if (error) {
    return null
  }

  const trendingAds = ads?.ads || []

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </section>
    )
  }

  if (trendingAds.length === 0) {
    return null
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Trending Ads
            </h2>
            <p className="text-muted-foreground">Most popular listings right now</p>
          </div>
          <Link href="/listings">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingAds.map((ad: any) => (
            <Link href={`/listings/${ad.id}`} key={ad.id}>
              <Card
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] h-full"
              >
                <div className="relative aspect-video">
                  <Image
                    src={ad.images?.[0]?.url || "/placeholder.svg?height=200&width=300&text=No+Image"}
                    alt={ad.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />

                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">{ad.condition}</Badge>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white rounded-full"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // handle favorite logic here
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">{ad.title}</h3>
                    {ad.user?.verified && <Shield className="h-4 w-4 text-primary flex-shrink-0 ml-2" />}
                  </div>

                  <div className="text-xl font-bold text-primary mb-2">
                    Rs {ad.price?.toLocaleString()}
                  </div>

                  <div className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <Badge variant="outline" className="text-xs font-normal">
                      {ad.category?.name || "Category"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {ad.location?.name || "Location"}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
