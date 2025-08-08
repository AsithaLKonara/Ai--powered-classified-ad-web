"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, Zap, BarChart3, Heart, MessageCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const userAds = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    price: 450000,
    status: "active",
    views: 1247,
    favorites: 23,
    messages: 8,
    boosted: true,
    boostExpiry: "2024-01-20",
    datePosted: "2024-01-15",
    category: "Electronics",
  },
  {
    id: 2,
    title: "MacBook Pro M3 14-inch",
    price: 650000,
    status: "pending",
    views: 89,
    favorites: 5,
    messages: 2,
    boosted: false,
    boostExpiry: null,
    datePosted: "2024-01-18",
    category: "Electronics",
  },
  {
    id: 3,
    title: "Toyota Prius 2020",
    price: 8500000,
    status: "sold",
    views: 2156,
    favorites: 67,
    messages: 34,
    boosted: true,
    boostExpiry: "2024-01-10",
    datePosted: "2024-01-05",
    category: "Vehicles",
  },
]

const boostHistory = [
  {
    id: 1,
    adTitle: "iPhone 15 Pro Max 256GB",
    package: "Pro",
    amount: 2500,
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    status: "active",
    impressions: 15420,
    clicks: 1247,
  },
  {
    id: 2,
    adTitle: "Toyota Prius 2020",
    package: "Premium",
    amount: 5000,
    startDate: "2024-01-05",
    endDate: "2024-01-10",
    status: "completed",
    impressions: 28750,
    clicks: 2156,
  },
]

const analytics = {
  totalViews: 3492,
  totalFavorites: 95,
  totalMessages: 44,
  totalEarnings: 0,
  thisMonth: {
    views: 1247,
    favorites: 23,
    messages: 8,
  },
}

export default function DashboardPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "sold":
        return <Badge className="bg-blue-100 text-blue-700">Sold</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-700">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredAds = selectedFilter === "all" ? userAds : userAds.filter((ad) => ad.status === selectedFilter)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
            <p className="text-gray-400">Manage your ads and track performance</p>
          </div>
          <Button className="bg-green-400 hover:bg-green-500 text-black font-semibold" asChild>
            <Link href="/post-ad">
              <Plus className="w-4 h-4 mr-2" />
              Post New Ad
            </Link>
          </Button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{analytics.thisMonth.views} this month</p>
                </div>
                <Eye className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Favorites</p>
                  <p className="text-2xl font-bold">{analytics.totalFavorites}</p>
                  <p className="text-xs text-green-400">+{analytics.thisMonth.favorites} this month</p>
                </div>
                <Heart className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Messages</p>
                  <p className="text-2xl font-bold">{analytics.totalMessages}</p>
                  <p className="text-xs text-green-400">+{analytics.thisMonth.messages} this month</p>
                </div>
                <MessageCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Ads</p>
                  <p className="text-2xl font-bold">{userAds.filter((ad) => ad.status === "active").length}</p>
                  <p className="text-xs text-gray-400">out of {userAds.length} total</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="ads">My Ads</TabsTrigger>
            <TabsTrigger value="boosts">Boost History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* My Ads Tab */}
          <TabsContent value="ads">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>My Advertisements</CardTitle>
                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ads</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Ad Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Favorites</TableHead>
                      <TableHead>Messages</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAds.map((ad) => (
                      <TableRow key={ad.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{ad.title}</span>
                            {ad.boosted && (
                              <Badge className="bg-green-400 text-black text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Boosted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(ad.price)}</TableCell>
                        <TableCell>{getStatusBadge(ad.status)}</TableCell>
                        <TableCell>{ad.views.toLocaleString()}</TableCell>
                        <TableCell>{ad.favorites}</TableCell>
                        <TableCell>{ad.messages}</TableCell>
                        <TableCell className="text-gray-400">{ad.datePosted}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/ad/${ad.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {!ad.boosted && ad.status === "active" && (
                              <Button variant="ghost" size="sm" asChild>
                                <Link href="/boost">
                                  <Zap className="w-4 h-4" />
                                </Link>
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boost History Tab */}
          <TabsContent value="boosts">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Boost History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Ad Title</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boostHistory.map((boost) => (
                      <TableRow key={boost.id} className="border-gray-700">
                        <TableCell className="font-medium">{boost.adTitle}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{boost.package}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(boost.amount)}</TableCell>
                        <TableCell className="text-gray-400">
                          {boost.startDate} to {boost.endDate}
                        </TableCell>
                        <TableCell>{getStatusBadge(boost.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{boost.impressions.toLocaleString()} impressions</div>
                            <div className="text-gray-400">{boost.clicks.toLocaleString()} clicks</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Ad Views</span>
                      <span className="font-semibold">{analytics.totalViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Views per Ad</span>
                      <span className="font-semibold">
                        {Math.round(analytics.totalViews / userAds.length).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Response Rate</span>
                      <span className="font-semibold">18.5%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Top Performing Ads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userAds
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 3)
                      .map((ad, index) => (
                        <div key={ad.id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{ad.title}</p>
                            <p className="text-sm text-gray-400">{ad.views.toLocaleString()} views</p>
                          </div>
                          <Badge variant="outline">#{index + 1}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
