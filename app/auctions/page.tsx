"use client"

import { useState, useEffect } from "react"
import { Gavel, Clock, Heart, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useAds } from "@/hooks/use-api"

export default function AuctionsPage() {
  const [bidAmount, setBidAmount] = useState("")
  const [maxBid, setMaxBid] = useState("")
  const [autoBidEnabled, setAutoBidEnabled] = useState(false)

  const { ads, loading, error, getAds } = useAds()

  useEffect(() => {
    // Fetch ads that are potentially auctions. 
    // Since we don't have explicit AUCTION type yet, we fetch active SALE ads.
    getAds({ limit: 4, type: 'SALE' })
  }, [getAds])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 text-center text-red-500">
          Error loading auctions: {error}
        </main>
        <Footer />
      </div>
    )
  }

  const allAds = ads?.ads || []
  const featuredAuction = allAds[0]
  const otherAuctions = allAds.slice(1)

  // Helper to handle countdown (mocked for now based on createdAt + 7 days if expiresAt missing)
  const getTimeLeft = (ad: any) => {
    // Logic to diff dates
    return { days: 2, hours: 14, minutes: 32, seconds: 45 }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Auction */}
          <div className="lg:col-span-2 space-y-6">
            {/* Auction Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Gavel className="w-8 h-8 text-primary" />
                Live Auctions
              </h1>
              <p className="text-muted-foreground">Bid on exclusive items and win amazing deals</p>
            </div>

            {featuredAuction ? (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={featuredAuction.images?.[0]?.url || "/placeholder.svg"}
                      alt={featuredAuction.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      Live Auction
                    </Badge>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{featuredAuction.title}</h2>

                    {/* Countdown Timer (Static representation for now) */}
                    <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4 mb-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-2">Time Remaining</h3>
                        <p className="text-sm text-muted-foreground">Ends on {new Date(new Date(featuredAuction.createdAt).setDate(new Date(featuredAuction.createdAt).getDate() + 7)).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Current Bid Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Current Price</div>
                        <div className="text-2xl font-bold text-primary">{formatPrice(featuredAuction.price)}</div>
                      </div>
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Bids</div>
                        <div className="text-2xl font-bold">{featuredAuction._count?.bids || 0}</div>
                      </div>
                      <div className="text-center p-4 bg-accent/20 rounded-lg">
                        <div className="text-sm text-muted-foreground">Views</div>
                        <div className="text-2xl font-bold">{featuredAuction.views || 0}</div>
                      </div>
                    </div>

                    {/* Bidding Section */}
                    <Card className="bg-accent/10">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="bid-amount">Your Bid (Min: {formatPrice(Number(featuredAuction.price) + 100)})</Label>
                            <Input
                              id="bid-amount"
                              type="number"
                              placeholder="Enter bid amount"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="mt-2"
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch id="auto-bid" checked={autoBidEnabled} onCheckedChange={setAutoBidEnabled} />
                            <Label htmlFor="auto-bid">Enable Auto-bid</Label>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="flex-1 bg-primary hover:bg-primary/90"
                              disabled={!bidAmount}
                            >
                              <Gavel className="w-4 h-4 mr-2" />
                              Place Bid
                            </Button>
                            <Button variant="outline" className="flex-1 bg-transparent">
                              <Zap className="w-4 h-4 mr-2" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Seller Info */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{featuredAuction.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{featuredAuction.user?.name || "Unknown Seller"}</div>
                          <div className="text-sm text-muted-foreground">Verified: {featuredAuction.user?.verified ? "Yes" : "No"}</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-2" />
                        Watch
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-lg">
                <p>No active auctions at the moment.</p>
              </div>
            )}

            {/* Other Live Auctions */}
            {otherAuctions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Other Live Auctions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {otherAuctions.map((auction: any) => (
                      <Link key={auction.id} href={`/listings/${auction.id}`}>
                        <Card className="hover:shadow-md transition-shadow h-full">
                          <CardContent className="p-3">
                            <img
                              src={auction.images?.[0]?.url || "/placeholder.svg"}
                              alt={auction.title}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">{auction.title}</h4>
                            <div className="text-primary font-bold text-sm mb-1">{formatPrice(auction.price)}</div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{auction._count?.bids || 0} bids</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Auction Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Auction Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Volume</span>
                    <span className="font-medium">200+ Items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Active Bidders</span>
                    <span className="font-medium">1.2k</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How Auctions Work */}
            <Card>
              <CardHeader>
                <CardTitle>How Auctions Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Place bids higher than the current bid</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Auto-bid feature bids for you automatically</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Highest bidder wins when time expires</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span>Use "Buy Now" to purchase immediately</span>
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
