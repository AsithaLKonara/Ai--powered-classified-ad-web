"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Grid, List, MapPin, Star, Heart, Clock, Zap, Gavel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"

const categories = [
  "All Categories",
  "Vehicles",
  "Electronics",
  "Property",
  "Jobs",
  "Services",
  "Fashion & Beauty",
  "Home & Garden",
  "Sports & Hobbies",
]

const locations = ["All Locations", "Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara", "Kurunegala"]

const mockAds = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB - Like New",
    price: 450000,
    location: "Colombo",
    category: "Electronics",
    condition: "Used",
    images: ["/placeholder.jpg"],
    timePosted: "2 hours ago",
    verified: true,
    boosted: true,
    auction: false,
    views: 234,
    favorites: 12,
    seller: {
      name: "John Doe",
      rating: 4.8,
      verified: true,
    },
  },
  {
    id: 2,
    title: "Toyota Prius 2020 - Hybrid",
    price: 8500000,
    location: "Kandy",
    category: "Vehicles",
    condition: "Used",
    images: ["/placeholder.jpg"],
    timePosted: "5 hours ago",
    verified: true,
    boosted: false,
    auction: true,
    views: 1456,
    favorites: 67,
    seller: {
      name: "Sarah Wilson",
      rating: 4.9,
      verified: true,
    },
  },
  {
    id: 3,
    title: "MacBook Pro M3 14-inch",
    price: 650000,
    location: "Colombo",
    category: "Electronics",
    condition: "New",
    images: ["/placeholder.jpg"],
    timePosted: "1 day ago",
    verified: false,
    boosted: true,
    auction: false,
    views: 89,
    favorites: 5,
    seller: {
      name: "Mike Chen",
      rating: 4.5,
      verified: false,
    },
  },
  {
    id: 4,
    title: "Apartment for Rent - Colombo 03",
    price: 75000,
    location: "Colombo",
    category: "Property",
    condition: "New",
    images: ["/placeholder.jpg"],
    timePosted: "3 days ago",
    verified: true,
    boosted: false,
    auction: false,
    views: 567,
    favorites: 23,
    seller: {
      name: "Property Plus",
      rating: 4.7,
      verified: true,
    },
  },
]

export default function ListingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [condition, setCondition] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredAds, setFilteredAds] = useState(mockAds)

  useEffect(() => {
    const filtered = mockAds.filter((ad) => {
      const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "All Categories" || ad.category === selectedCategory
      const matchesLocation = selectedLocation === "All Locations" || ad.location === selectedLocation
      const matchesPrice = ad.price >= priceRange[0] && ad.price <= priceRange[1]
      const matchesCondition = condition === "all" || ad.condition.toLowerCase() === condition
      const matchesVerified = !verifiedOnly || ad.verified

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice && matchesCondition && matchesVerified
    })

    // Sort results
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "popular":
        filtered.sort((a, b) => b.views - a.views)
        break
      default:
        // newest first (default)
        break
    }

    setFilteredAds(filtered)
  }, [searchQuery, selectedCategory, selectedLocation, priceRange, condition, verifiedOnly, sortBy])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const AdCard = ({ ad }: { ad: (typeof mockAds)[0] }) => (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${ad.boosted ? "ring-2 ring-primary/20 shadow-lg shadow-primary/10" : ""} ${viewMode === "list" ? "flex-row" : ""}`}
    >
      <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "w-full h-48"}`}>
          <img
            src={ad.images[0] || "/placeholder.svg"}
            alt={ad.title}
            className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {ad.boosted && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                Boosted
              </Badge>
            )}
            {ad.auction && (
              <Badge className="bg-orange-500 text-white">
                <Gavel className="w-3 h-3 mr-1" />
                Auction
              </Badge>
            )}
            {ad.verified && <Badge className="bg-green-500 text-white">Verified</Badge>}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/ad/${ad.id}`}>{ad.title}</Link>
            </h3>
          </div>

          <div className="text-2xl font-bold text-primary mb-2">{formatPrice(ad.price)}</div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{ad.location}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{ad.timePosted}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm">{ad.seller.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{ad.views} views</span>
            </div>

            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link href={`/ad/${ad.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Listings</h1>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Price Range (LKR)</Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000000}
                      step={10000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Condition */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Condition</Label>
                    <Select value={condition} onValueChange={setCondition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Conditions</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="refurbished">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Verified Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                    <Label htmlFor="verified" className="text-sm">
                      Verified sellers only
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-muted-foreground">Showing {filteredAds.length} results</p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Ad Grid/List */}
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
