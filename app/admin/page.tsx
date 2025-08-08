"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const dashboardStats = {
  totalUsers: 15420,
  totalAds: 8934,
  activeBoosts: 234,
  totalRevenue: 2450000,
  pendingAds: 45,
  reportedContent: 12,
  monthlyGrowth: {
    users: 12.5,
    ads: 8.3,
    revenue: 15.7,
  },
}

const pendingAds = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    seller: "John Doe",
    category: "Electronics",
    price: 450000,
    submittedAt: "2024-01-20 10:30",
    status: "pending",
  },
  {
    id: 2,
    title: "Toyota Prius 2020",
    seller: "Sarah Wilson",
    category: "Vehicles",
    price: 8500000,
    submittedAt: "2024-01-20 09:15",
    status: "pending",
  },
  {
    id: 3,
    title: "Apartment for Rent",
    seller: "Property Plus",
    category: "Property",
    price: 75000,
    submittedAt: "2024-01-20 08:45",
    status: "pending",
  },
]

const reportedContent = [
  {
    id: 1,
    type: "ad",
    title: "Suspicious Electronics Sale",
    reporter: "User123",
    reason: "Fake product",
    reportedAt: "2024-01-20 11:00",
    status: "pending",
  },
  {
    id: 2,
    type: "chat",
    title: "Inappropriate Messages",
    reporter: "User456",
    reason: "Harassment",
    reportedAt: "2024-01-20 10:30",
    status: "pending",
  },
]

const boostCampaigns = [
  {
    id: 1,
    adTitle: "iPhone 15 Pro Max",
    user: "John Doe",
    package: "Pro",
    amount: 2500,
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    status: "active",
    impressions: 15420,
    clicks: 1247,
  },
  {
    id: 2,
    adTitle: "MacBook Pro M3",
    user: "Mike Chen",
    package: "Starter",
    amount: 1000,
    startDate: "2024-01-18",
    endDate: "2024-01-21",
    status: "active",
    impressions: 5680,
    clicks: 456,
  },
]

const recentUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    joinedAt: "2024-01-20",
    adsCount: 3,
    verified: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    joinedAt: "2024-01-19",
    adsCount: 1,
    verified: false,
  },
]

export default function AdminPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleApproveAd = (adId: number) => {
    // Approve ad logic
    console.log("Approving ad:", adId)
  }

  const handleRejectAd = (adId: number) => {
    // Reject ad logic
    console.log("Rejecting ad:", adId)
  }

  const handleResolveReport = (reportId: number) => {
    // Resolve report logic
    console.log("Resolving report:", reportId)
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
                  <p className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{dashboardStats.monthlyGrowth.users}% this month</p>
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
                  <p className="text-2xl font-bold">{dashboardStats.totalAds.toLocaleString()}</p>
                  <p className="text-xs text-green-400">+{dashboardStats.monthlyGrowth.ads}% this month</p>
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
                  <p className="text-2xl font-bold">{dashboardStats.activeBoosts}</p>
                  <p className="text-xs text-gray-400">{dashboardStats.pendingAds} pending approval</p>
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
                  <p className="text-2xl font-bold">{formatPrice(dashboardStats.totalRevenue)}</p>
                  <p className="text-xs text-green-400">+{dashboardStats.monthlyGrowth.revenue}% this month</p>
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
                  <Badge className="bg-yellow-500 text-black">{dashboardStats.pendingAds} Pending</Badge>
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
                    {pendingAds.map((ad) => (
                      <TableRow key={ad.id} className="border-gray-700">
                        <TableCell className="font-medium">{ad.title}</TableCell>
                        <TableCell>{ad.seller}</TableCell>
                        <TableCell>{ad.category}</TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(ad.price)}</TableCell>
                        <TableCell className="text-gray-400">{ad.submittedAt}</TableCell>
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
                    {recentUsers.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-400">{user.email}</TableCell>
                        <TableCell className="text-gray-400">{user.joinedAt}</TableCell>
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
                    {boostCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="border-gray-700">
                        <TableCell className="font-medium">{campaign.adTitle}</TableCell>
                        <TableCell>{campaign.user}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.package}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-400">{formatPrice(campaign.amount)}</TableCell>
                        <TableCell className="text-gray-400">
                          {campaign.startDate} to {campaign.endDate}
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

          {/* Reports */}
          <TabsContent value="reports">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Reported Content</CardTitle>
                  <Badge className="bg-red-500 text-white">{dashboardStats.reportedContent} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead>Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Reported At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportedContent.map((report) => (
                      <TableRow key={report.id} className="border-gray-700">
                        <TableCell>
                          <Badge variant="outline">
                            {report.type === "ad" ? (
                              <FileText className="w-3 h-3 mr-1" />
                            ) : (
                              <MessageSquare className="w-3 h-3 mr-1" />
                            )}
                            {report.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{report.title}</TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell className="text-gray-400">{report.reportedAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleResolveReport(report.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Resolve
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

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Revenue</span>
                      <span className="font-semibold text-green-400">{formatPrice(dashboardStats.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Boost Revenue</span>
                      <span className="font-semibold">{formatPrice(1850000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Verification Revenue</span>
                      <span className="font-semibold">{formatPrice(350000)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Featured Ads Revenue</span>
                      <span className="font-semibold">{formatPrice(250000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Active Users (24h)</span>
                      <span className="font-semibold">2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New Ads Today</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Messages Sent</span>
                      <span className="font-semibold">1,234</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Search Queries</span>
                      <span className="font-semibold">8,945</span>
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
