import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Clock, TrendingUp, Shield } from "lucide-react"

const trendingAds = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra",
    price: "Rs 280,000",
    location: "Colombo",
    timePosted: "3 hours",
    image: "/placeholder.svg?height=150&width=200&text=Samsung+S24",
    category: "Mobile Phones",
    isVerified: true,
    condition: "New",
  },
  {
    id: 2,
    title: "Honda Civic 2020",
    price: "Rs 6,200,000",
    location: "Kandy",
    timePosted: "1 day",
    image: "/placeholder.svg?height=150&width=200&text=Honda+Civic",
    category: "Cars",
    isVerified: true,
    condition: "Used",
  },
  {
    id: 3,
    title: "MacBook Pro M3",
    price: "Rs 450,000",
    location: "Galle",
    timePosted: "6 hours",
    image: "/placeholder.svg?height=150&width=200&text=MacBook+Pro",
    category: "Laptops",
    isVerified: false,
    condition: "New",
  },
  {
    id: 4,
    title: "Villa for Sale - Negombo",
    price: "Rs 25,000,000",
    location: "Negombo",
    timePosted: "2 days",
    image: "/placeholder.svg?height=150&width=200&text=Villa",
    category: "Houses for Sale",
    isVerified: true,
    condition: "New",
  },
  {
    id: 5,
    title: "Gaming Setup Complete",
    price: "Rs 180,000",
    location: "Colombo",
    timePosted: "4 hours",
    image: "/placeholder.svg?height=150&width=200&text=Gaming+Setup",
    category: "Computers",
    isVerified: false,
    condition: "Used",
  },
  {
    id: 6,
    title: "Wedding Dress Designer",
    price: "Rs 35,000",
    location: "Kandy",
    timePosted: "8 hours",
    image: "/placeholder.svg?height=150&width=200&text=Wedding+Dress",
    category: "Fashion",
    isVerified: true,
    condition: "New",
  },
]

export function TrendingAds() {
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
          <Button variant="outline">View All</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingAds.map((ad) => (
            <Card
              key={ad.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <Image
                  src={ad.image || "/placeholder.svg"}
                  alt={ad.title}
                  width={200}
                  height={150}
                  className="w-full h-40 object-cover rounded-t-lg"
                />

                <div className="absolute top-2 left-2">
                  <Badge variant="secondary">{ad.condition}</Badge>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/80 hover:bg-background"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{ad.title}</h3>
                  {ad.isVerified && <Shield className="h-4 w-4 text-primary flex-shrink-0 ml-2" />}
                </div>

                <div className="text-xl font-bold text-primary mb-2">{ad.price}</div>

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
