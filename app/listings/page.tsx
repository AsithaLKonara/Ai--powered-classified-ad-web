"use client"

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from "react"
import { Search, Filter, Grid, List, MapPin, Star, Heart, Clock, Zap, Gavel, Loader2 } from "lucide-react"
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
import { useAds, useCategories, useLocations } from "@/hooks/use-api"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

function ListingsContent() {
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "all")
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [condition, setCondition] = useState("all")
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)

  const { ads, loading: adsLoading, error: adsError, getAds } = useAds()
  const { categories, getCategories } = useCategories()
  const { locations, getLocations } = useLocations()

  // Fetch initial data (categories and locations)
  useEffect(() => {
    getCategories()
    getLocations()
  }, [getCategories, getLocations])

  // Fetch ads when filters change
  useEffect(() => {
    const fetchAds = async () => {
      const params: any = {
        page,
        limit: 12,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sort: sortBy
      }

      if (searchQuery) params.search = searchQuery
      if (selectedCategory && selectedCategory !== "all") params.category = selectedCategory
      if (selectedLocation && selectedLocation !== "all") params.location = selectedLocation
      if (condition && condition !== "all") params.condition = condition

      // Note: backend might need to support verifiedOnly filter

      await getAds(params)
    }

    const timer = setTimeout(() => {
      fetchAds()
    }, 500) // Debounce search

    return () => clearTimeout(timer)
  }, [
    searchQuery,
    selectedCategory,
    selectedLocation,
    priceRange,
    condition,
    verifiedOnly,
    sortBy,
    page,
    getAds
  ])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const AdCard = ({ ad }: { ad: any }) => (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 ${ad.isBoosted ? "ring-2 ring-primary/20 shadow-lg shadow-primary/10" : ""} ${viewMode === "list" ? "flex-row" : ""}`}
    >
      <CardContent className={`p-0 ${viewMode === "list" ? "flex" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "w-full h-48"}`}>
          <div className="relative w-full h-full overflow-hidden rounded-t-lg">
            <Image
              src={ad.images?.[0]?.url || "/placeholder.svg?height=200&width=300"}
              alt={ad.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {ad.isBoosted && (
              <Badge className="bg-primary text-primary-foreground animate-pulse">
                <Zap className="w-3 h-3 mr-1" />
                Boosted
              </Badge>
            )}
            {/* Auction badge if supported by API */}
            {ad.user?.verified && <Badge className="bg-green-500 text-white">Verified</Badge>}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 z-10"
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              <Link href={`/listings/${ad.id}`}>{ad.title}</Link>
            </h3>
          </div>

          <div className="text-2xl font-bold text-primary mb-2">{formatPrice(ad.price)}</div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4" />
            <span>{ad.location?.name || 'Unknown Location'}</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Rating if available */}
              <span className="text-sm text-muted-foreground">{ad.views || 0} views</span>
            </div>

            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link href={`/listings/${ad.id}`}>View Details</Link>
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
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.categories?.map((category: any) => (
                  <SelectItem key={category.id} value={category.slug || category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations?.locations?.map((location: any) => (
                  <SelectItem key={location.id} value={location.slug || location.id}>
                    {location.name}
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
                        <SelectItem value="NEW">New</SelectItem>
                        <SelectItem value="USED">Used</SelectItem>
                        <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Verified Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)} />
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
                <p className="text-muted-foreground">
                  {adsLoading ? "Loading..." : `Showing ${ads?.ads?.length || 0} results`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    {/* <SelectItem value="popular">Most Popular</SelectItem> */}
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
            {adsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : adsError ? (
              <div className="text-center py-20 text-red-500">
                Error loading ads: {adsError}
              </div>
            ) : !ads?.ads?.length ? (
              <div className="text-center py-20 text-muted-foreground">
                No ads found matching your criteria.
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {ads.ads.map((ad: any) => (
                  <AdCard key={ad.id} ad={ad} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {ads?.paging && ads.paging.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-2 text-sm text-muted-foreground">
                    Page {page} of {ads.paging.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(ads.paging.pages, p + 1))}
                    disabled={page === ads.paging.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            {/* Fallback pagination if api response structure is different - previously it was pagination object */}
            {ads?.pagination && ads.pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-2 text-sm text-muted-foreground">
                    Page {page} of {ads.pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(ads.pagination.pages, p + 1))}
                    disabled={page === ads.pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    }>
      <ListingsContent />
    </Suspense>
  )
}
