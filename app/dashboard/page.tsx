"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Zap, BarChart3, Heart, MessageCircle, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useAds } from "@/hooks/use-api"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const { ads, loading: adsLoading, error, getAds } = useAds()
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock analytics for now as we don't have a specific endpoint for aggregated dashboard stats yet
  const analytics = {
    totalViews: ads?.ads?.reduce((acc: number, ad: any) => acc + (ad.views || 0), 0) || 0,
    totalFavorites: ads?.ads?.reduce((acc: number, ad: any) => acc + (ad._count?.favorites || 0), 0) || 0,
    totalMessages: 0, // Need message API
    thisMonth: {
      views: 0,
      favorites: 0,
      messages: 0,
    },
  }

  useEffect(() => {
    if (session?.user?.id) {
      getAds({ userId: session.user.id })
    }
  }, [session, getAds])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "SOLD":
        return <Badge className="bg-blue-100 text-blue-700">Sold</Badge>
      case "EXPIRED":
        return <Badge className="bg-gray-100 text-gray-700">Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const userAds = ads?.ads || []
  const filteredAds = selectedFilter === "all" ? userAds : userAds.filter((ad: any) => ad.status === selectedFilter)

  if (status === "loading" || adsLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white gap-4">
        <p className="text-xl">Please sign in to view your dashboard</p>
        <Button asChild><Link href="/api/auth/signin">Sign In</Link></Button>
      </div>
    )
  }

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
                  <p className="text-xs text-green-400">All time</p>
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
                  <p className="text-xs text-green-400">All time</p>
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
                  <p className="text-xs text-green-400">Check Inbox</p>
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
                  <p className="text-2xl font-bold">{userAds.filter((ad: any) => ad.status === "ACTIVE").length}</p>
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
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="SOLD">Sold</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
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
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAds.length === 0 ? (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={7} className="text-center text-gray-400 py-8">No ads found</TableCell>
                      </TableRow>
                    ) : filteredAds.map((ad: any) => (
                      <TableRow key={ad.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{ad.title}</span>
                            {ad.isBoosted && (
                              <Badge className="bg-green-400 text-black text-xs">
                                <Zap className="w-3 h-3 mr-1" />
                                Boosted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(Number(ad.price))}</TableCell>
                        <TableCell>{getStatusBadge(ad.status)}</TableCell>
                        <TableCell>{(ad.views || 0).toLocaleString()}</TableCell>
                        <TableCell>{ad._count?.favorites || 0}</TableCell>
                        <TableCell className="text-gray-400">{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/listings/${ad.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/dashboard/edit/${ad.id}`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            {!ad.isBoosted && ad.status === "ACTIVE" && (
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

          {/* Boost History Tab placeholder */}
          <TabsContent value="boosts">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center text-gray-400">
                No boost history found.
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab placeholder */}
          <TabsContent value="analytics">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center text-gray-400">
                Detailed analytics coming soon.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
