"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  DollarSign,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AdminPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAds: 0,
    activeBoosts: 0,
    totalRevenue: 0,
    pendingAds: 0,
    reportedContent: 0,
    monthlyGrowth: {
      users: 0,
      ads: 0,
      revenue: 0,
    },
  })

  const [pendingAdsList, setPendingAdsList] = useState<any[]>([])
  const [activeBoostsList, setActiveBoostsList] = useState<any[]>([])
  const [recentUsersList, setRecentUsersList] = useState<any[]>([])
  const [reportedContentList, setReportedContentList] = useState<any[]>([]) // Add if api returns it

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            throw new Error("Unauthorized access")
          }
          throw new Error("Failed to fetch dashboard data")
        }
        const data = await res.json()

        if (data.stats) setStats(prev => ({ ...prev, ...data.stats }))
        if (data.pendingAds) setPendingAdsList(data.pendingAds)
        if (data.boostCampaigns) setActiveBoostsList(data.boostCampaigns)
        if (data.recentUsers) setRecentUsersList(data.recentUsers)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleApproveAd = async (adId: number) => {
    // Implement API call
    console.log("Approving ad:", adId)
  }

  const handleRejectAd = async (adId: number) => {
    // Implement API call
    console.log("Rejecting ad:", adId)
  }

  const handleResolveReport = (reportId: number) => {
    console.log("Resolving report:", reportId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied / Error</h1>
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your classified ads platform</p>
          </div>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{stats.monthlyGrowth.users}% this month</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Ads</p>
                  <p className="text-2xl font-bold">{stats.totalAds.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{stats.monthlyGrowth.ads}% this month</p>
                </div>
                <FileText className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Boosts</p>
                  <p className="text-2xl font-bold">{stats.activeBoosts}</p>
                  <p className="text-xs text-gray-400">{stats.pendingAds} pending approval</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Revenue</p>
                  <p className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                  <p className="text-xs text-green-400">+{stats.monthlyGrowth.revenue}% this month</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ads" className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="ads">Ad Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="boosts">Boost Campaigns</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Ad Management */}
          <TabsContent value="ads">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Pending Ad Approvals</CardTitle>
                  <Badge className="bg-yellow-500 text-black">{stats.pendingAds} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Ad Title</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAdsList.length === 0 ? (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={6} className="text-center text-gray-400">No pending ads</TableCell>
                      </TableRow>
                    ) : pendingAdsList.map((ad) => (
                      <TableRow key={ad.id} className="border-gray-700">
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.seller}</TableCell>
                        <TableCell>{ad.category}</TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(ad.price)}</TableCell>
                        <TableCell className="text-gray-400">{new Date(ad.submittedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveAd(ad.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectAd(ad.id)}>
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="w-4 h-4" />
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

          {/* User Management */}
          <TabsContent value="users">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input placeholder="Search users..." className="bg-gray-700 border-gray-600" />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Ads</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsersList.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell className="text-gray-400">{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{user.adsCount}</TableCell>
                        <TableCell>
                          {user.verified ? (
                            <Badge className="bg-green-500 text-white">Verified</Badge>
                          ) : (
                            <Badge variant="outline">Unverified</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Edit
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

          {/* Boost Campaigns */}
          <TabsContent value="boosts">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Active Boost Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Ad Title</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBoostsList.length === 0 ? (
                      <TableRow className="border-gray-700">
                        <TableCell colSpan={8} className="text-center text-gray-400">No active campaigns</TableCell>
                      </TableRow>
                    ) : activeBoostsList.map((campaign) => (
                      <TableRow key={campaign.id} className="border-gray-700">
                        <TableCell className="font-medium">{campaign.adTitle}</TableCell>
                        <TableCell>{campaign.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.package}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(campaign.amount)}</TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(campaign.startDate).toLocaleDateString()} to {new Date(campaign.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{campaign.impressions.toLocaleString()} impressions</div>
                            <div className="text-gray-400">{campaign.clicks.toLocaleString()} clicks</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 text-white">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="bg-transparent">
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="bg-transparent">
                              Edit
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

          {/* reports and analytics - static for now as we don't have endpoints yet */}
          <TabsContent value="reports">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Reported Content</CardTitle>
                  <Badge className="bg-red-500 text-white">{stats.reportedContent} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Placeholder for reports */}
                <div className="text-center text-gray-500 py-4">No new reports</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            {/* Keep static analytics cards for layout purposes, data is from stats state */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-semibold text-green-400">{formatPrice(stats.totalRevenue)}</span>
                    </div>
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
