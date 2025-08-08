"use client"

import { useState, useEffect } from "react"
import { Gavel, Clock, Heart, Zap } from "lucide-react"
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

const auctionData = {
  id: 1,
  title: "Vintage Rolex Submariner 1970s",
  currentBid: 2500000,
  startingBid: 1500000,
  buyNowPrice: 3500000,
  timeLeft: {
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 45,
  },
  totalBids: 47,
  watchers: 156,
  images: ["/placeholder.jpg"],
  seller: {
    name: "WatchCollector",
    rating: 4.9,
    verified: true,
  },
  bidHistory: [
    { bidder: "User***23", amount: 2500000, time: "2 minutes ago" },
    { bidder: "Collector***89", amount: 2450000, time: "15 minutes ago" },
    { bidder: "Watch***45", amount: 2400000, time: "32 minutes ago" },
    { bidder: "User***67", amount: 2350000, time: "1 hour ago" },
    { bidder: "Vintage***12", amount: 2300000, time: "2 hours ago" },
  ],
}

const liveAuctions = [
  {
    id: 2,
    title: "MacBook Pro M3 Max",
    currentBid: 450000,
    timeLeft: "3h 24m",
    image: "/placeholder.jpg",
    bids: 23,
  },
  {
    id: 3,
    title: "Antique Ceylon Tea Set",
    currentBid: 85000,
    timeLeft: "1d 8h",
    image: "/placeholder.jpg",
    bids: 12,
  },
  {
    id: 4,
    title: "BMW E30 M3 1988",
    currentBid: 15500000,
    timeLeft: "5d 12h",
    image: "/placeholder.jpg",
    bids: 89,
  },
]

export default function AuctionsPage() {
  const [bidAmount, setBidAmount] = useState("")
  const [maxBid, setMaxBid] = useState("")
  const [autoBidEnabled, setAutoBidEnabled] = useState(false)
  const [timeLeft, setTimeLeft] = useState(auctionData.timeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const minimumBid = auctionData.currentBid + 50000

  const handlePlaceBid = () => {
    const bid = Number.parseInt(bidAmount)
    if (bid >= minimumBid) {
      // Place bid logic here
      setBidAmount("")
    }
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

            {/* Featured Auction */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={auctionData.images[0] || "/placeholder.svg"}
                    alt={auctionData.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                    <Clock className="w-3 h-3 mr-1" />
                    Live Auction
                  </Badge>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">{auctionData.title}</h2>

                  {/* Countdown Timer */}
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Time Remaining</h3>
                      <div className="flex justify-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{timeLeft.days}</div>
                          <div className="text-xs text-muted-foreground">Days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{timeLeft.hours}</div>
                          <div className="text-xs text-muted-foreground">Hours</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{timeLeft.minutes}</div>
                          <div className="text-xs text-muted-foreground">Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-500">{timeLeft.seconds}</div>
                          <div className="text-xs text-muted-foreground">Seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Current Bid Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Current Bid</div>
                      <div className="text-2xl font-bold text-primary">{formatPrice(auctionData.currentBid)}</div>
                    </div>
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Bids</div>
                      <div className="text-2xl font-bold">{auctionData.totalBids}</div>
                    </div>
                    <div className="text-center p-4 bg-accent/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Watchers</div>
                      <div className="text-2xl font-bold">{auctionData.watchers}</div>
                    </div>
                  </div>

                  {/* Bidding Section */}
                  <Card className="bg-accent/10">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bid-amount">Your Bid (Minimum: {formatPrice(minimumBid)})</Label>
                          <Input
                            id="bid-amount"
                            type="number"
                            placeholder={minimumBid.toString()}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="auto-bid" checked={autoBidEnabled} onCheckedChange={setAutoBidEnabled} />
                          <Label htmlFor="auto-bid">Enable Auto-bid</Label>
                        </div>

                        {autoBidEnabled && (
                          <div>
                            <Label htmlFor="max-bid">Maximum Auto-bid Amount</Label>
                            <Input
                              id="max-bid"
                              type="number"
                              placeholder="Enter maximum amount"
                              value={maxBid}
                              onChange={(e) => setMaxBid(e.target.value)}
                              className="mt-2"
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            className="flex-1 bg-primary hover:bg-primary/90"
                            onClick={handlePlaceBid}
                            disabled={!bidAmount || Number.parseInt(bidAmount) < minimumBid}
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            Place Bid
                          </Button>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <Zap className="w-4 h-4 mr-2" />
                            Buy Now - {formatPrice(auctionData.buyNowPrice)}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Seller Info */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{auctionData.seller.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{auctionData.seller.name}</div>
                        <div className="text-sm text-muted-foreground">Rating: {auctionData.seller.rating}/5</div>
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

            {/* Other Live Auctions */}
            <Card>
              <CardHeader>
                <CardTitle>Other Live Auctions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {liveAuctions.map((auction) => (
                    <Link key={auction.id} href={`/auctions/${auction.id}`}>
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-3">
                          <img
                            src={auction.image || "/placeholder.svg"}
                            alt={auction.title}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium text-sm line-clamp-2 mb-2">{auction.title}</h4>
                          <div className="text-primary font-bold text-sm mb-1">{formatPrice(auction.currentBid)}</div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{auction.bids} bids</span>
                            <span>{auction.timeLeft} left</span>
                          </div>
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
            {/* Bid History */}
            <Card>
              <CardHeader>
                <CardTitle>Bid History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auctionData.bidHistory.map((bid, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{bid.bidder}</div>
                        <div className="text-xs text-muted-foreground">{bid.time}</div>
                      </div>
                      <div className="font-bold text-primary">{formatPrice(bid.amount)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auction Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Auction Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Starting Bid</span>
                    <span className="font-medium">{formatPrice(auctionData.startingBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Bid</span>
                    <span className="font-medium text-primary">{formatPrice(auctionData.currentBid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Buy Now Price</span>
                    <span className="font-medium">{formatPrice(auctionData.buyNowPrice)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Bids</span>
                    <span className="font-medium">{auctionData.totalBids}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Unique Bidders</span>
                    <span className="font-medium">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Watchers</span>
                    <span className="font-medium">{auctionData.watchers}</span>
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
