"use client"

import { useState, useEffect, Suspense } from "react"
import { Plus, Edit, Trash2, Eye, Zap, Heart, MessageCircle, TrendingUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useAds } from "@/hooks/use-api"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const { data: session, status } = useSession()
  const { ads, loading: adsLoading, error, getAds } = useAds()
  const [selectedFilter, setSelectedFilter] = useState("all")
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const analytics = {
    totalViews: ads?.ads?.reduce((acc: number, ad: any) => acc + (ad.views || 0), 0) || 0,
    totalFavorites: ads?.ads?.reduce((acc: number, ad: any) => acc + (ad._count?.favorites || 0), 0) || 0,
    totalMessages: 0,
  }

  useEffect(() => {
    if (session?.user?.id) {
      getAds({ userId: session.user.id })
    }
  }, [session, getAds])

  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const adId = searchParams.get('adId')
    const isDemo = searchParams.get('demo')

    if (paymentStatus === 'success' && adId) {
      if (isDemo) {
        fetch(`/api/admin/ads/${adId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'ACTIVE' })
        }).then(() => {
          toast({
            title: "Demo Boost Active! 🚀",
            description: "We've simulated your payment. Your ad is now featured!",
          })
          getAds({ userId: session?.user?.id })
        })
      } else {
        toast({
          title: "Payment Successful",
          description: "Your ad boost has been activated.",
        })
      }
    }
  }, [searchParams, session, getAds, toast])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-100 text-green-700">Active</Badge>
      case "PENDING": return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "REJECTED": return <Badge className="bg-red-100 text-red-700">Rejected</Badge>
      case "SOLD": return <Badge className="bg-blue-100 text-blue-700">Sold</Badge>
      case "EXPIRED": return <Badge className="bg-gray-100 text-gray-700">Expired</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

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

  const userAds = ads?.ads || []
  const filteredAds = selectedFilter === "all" ? userAds : userAds.filter((ad: any) => ad.status === selectedFilter)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Views</p>
                <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-400" />
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Favorites</p>
                <p className="text-2xl font-bold">{analytics.totalFavorites}</p>
              </div>
              <Heart className="w-8 h-8 text-red-400" />
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Messages</p>
                <p className="text-2xl font-bold">{analytics.totalMessages}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-400" />
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Ads</p>
                <p className="text-2xl font-bold">{userAds.filter((ad: any) => ad.status === "ACTIVE").length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="ads">My Ads</TabsTrigger>
            <TabsTrigger value="boosts">Boost History</TabsTrigger>
          </TabsList>
          <TabsContent value="ads">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Advertisements</CardTitle>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="All Ads" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ads</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                    <SelectItem value="SOLD">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Title</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views/Favs</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAds.length === 0 ? (
                      <TableRow className="border-gray-700"><TableCell colSpan={6} className="text-center py-8">No ads found</TableCell></TableRow>
                    ) : filteredAds.map((ad: any) => (
                      <TableRow key={ad.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{ad.title}</span>
                            {ad.isBoosted && <Badge className="bg-green-400 text-black">Boosted</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-400 font-bold">{formatPrice(Number(ad.price))}</TableCell>
                        <TableCell>{getStatusBadge(ad.status)}</TableCell>
                        <TableCell>{ad.views || 0} / {ad._count?.favorites || 0}</TableCell>
                        <TableCell>{new Date(ad.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" asChild><Link href={`/listings/${ad.id}`}><Eye className="w-4 h-4" /></Link></Button>
                            <Button variant="ghost" size="sm" asChild><Link href={`/dashboard/edit/${ad.id}`}><Edit className="w-4 h-4" /></Link></Button>
                            <Button variant="ghost" size="sm text-red-400"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="boosts">
            <Card className="bg-gray-800 border-gray-700"><CardContent className="p-8 text-center text-gray-400">No history found.</CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
