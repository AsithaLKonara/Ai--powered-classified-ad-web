'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
    CheckCircle,
    XCircle,
    Eye,
    AlertTriangle,
    Filter,
    ChevronLeft,
    ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

interface Ad {
    id: string
    title: string
    description: string
    price: number
    status: string
    moderationScore?: number
    moderationReason?: string
    createdAt: string
    user: {
        id: string
        name: string | null
        email: string | null
        averageRating: number | null
    }
    category: {
        name: string
    }
    location: {
        name: string
    }
    images: Array<{ url: string }>
}

export default function ModerationDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [ads, setAds] = useState<Ad[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [filterStatus, setFilterStatus] = useState('PENDING')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectReason, setRejectReason] = useState('')

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (session?.user?.role !== 'ADMIN') {
            router.push('/')
        } else {
            fetchAds()
        }
    }, [session, status, filterStatus, page])

    const fetchAds = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `/api/admin/moderation?status=${filterStatus}&page=${page}`
            )
            if (res.ok) {
                const data = await res.json()
                setAds(data.ads)
                setTotalPages(data.totalPages)
            }
        } catch (error) {
            toast.error('Failed to fetch ads')
        } finally {
            setLoading(false)
        }
    }

    const handleSelectAll = () => {
        if (selectedIds.size === ads.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(ads.map((ad) => ad.id)))
        }
    }

    const handleSelectAd = (adId: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(adId)) {
            newSelected.delete(adId)
        } else {
            newSelected.add(adId)
        }
        setSelectedIds(newSelected)
    }

    const handleBulkAction = async (action: 'APPROVE' | 'REJECT') => {
        if (selectedIds.size === 0) {
            toast.error('Please select at least one ad')
            return
        }

        if (action === 'REJECT' && !rejectReason.trim()) {
            setShowRejectModal(true)
            return
        }

        try {
            const res = await fetch('/api/admin/moderation', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adIds: Array.from(selectedIds),
                    action,
                    reason: action === 'REJECT' ? rejectReason : undefined,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                toast.success(`${data.updated} ad(s) ${action.toLowerCase()}d`)
                setSelectedIds(new Set())
                setRejectReason('')
                setShowRejectModal(false)
                fetchAds()
            } else {
                toast.error('Failed to process action')
            }
        } catch (error) {
            toast.error('Failed to process action')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading moderation queue...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Content Moderation
                    </h1>
                    <p className="text-gray-600">
                        Review and moderate pending advertisements
                    </p>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value)
                                    setPage(1)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="PENDING">Pending</option>
                                <option value="ACTIVE">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="ALL">All</option>
                            </select>
                        </div>

                        {/* Bulk Actions */}
                        {selectedIds.size > 0 && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {selectedIds.size} selected
                                </span>
                                <Button
                                    onClick={() => handleBulkAction('APPROVE')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve
                                </Button>
                                <Button
                                    onClick={() => handleBulkAction('REJECT')}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ads List */}
                <div className="space-y-4">
                    {ads.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500">No ads found</p>
                        </div>
                    ) : (
                        <>
                            {/* Select All */}
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox
                                        checked={selectedIds.size === ads.length && ads.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                    <span className="text-sm font-medium">Select All</span>
                                </label>
                            </div>

                            {/* Ad Cards */}
                            {ads.map((ad) => (
                                <div
                                    key={ad.id}
                                    className={`bg-white rounded-lg shadow-md p-6 transition-all ${selectedIds.has(ad.id) ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <div className="flex gap-6">
                                        {/* Checkbox */}
                                        <div className="flex-shrink-0 pt-1">
                                            <Checkbox
                                                checked={selectedIds.has(ad.id)}
                                                onCheckedChange={() => handleSelectAd(ad.id)}
                                            />
                                        </div>

                                        {/* Image */}
                                        <div className="flex-shrink-0">
                                            {ad.images[0] ? (
                                                <img
                                                    src={ad.images[0].url}
                                                    alt={ad.title}
                                                    className="w-32 h-32 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-400">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {ad.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {ad.category.name} • {ad.location.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-900">
                                                        LKR {ad.price.toLocaleString()}
                                                    </p>
                                                    <span
                                                        className={`inline-block px-2 py-1 text-xs rounded-full ${ad.status === 'PENDING'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : ad.status === 'ACTIVE'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {ad.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mb-3 line-clamp-2">
                                                {ad.description}
                                            </p>

                                            {/* User Info */}
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span>
                                                    Posted by: <strong>{ad.user.name || 'Anonymous'}</strong>
                                                </span>
                                                {ad.user.averageRating && (
                                                    <span>
                                                        Rating: <strong>{ad.user.averageRating.toFixed(1)}⭐</strong>
                                                    </span>
                                                )}
                                                <span>
                                                    {formatDistanceToNow(new Date(ad.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </span>
                                            </div>

                                            {/* Moderation Info */}
                                            {ad.moderationScore && (
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                                                    <span className="text-sm text-orange-600">
                                                        Moderation Score: {ad.moderationScore.toFixed(2)}
                                                    </span>
                                                </div>
                                            )}

                                            {ad.moderationReason && (
                                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                                                    <p className="text-sm text-red-800">
                                                        <strong>Rejection Reason:</strong> {ad.moderationReason}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => window.open(`/listings/${ad.id}`, '_blank')}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View
                                                </Button>
                                                {ad.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
                                                            onClick={() => {
                                                                setSelectedIds(new Set([ad.id]))
                                                                handleBulkAction('APPROVE')
                                                            }}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700"
                                                            onClick={() => {
                                                                setSelectedIds(new Set([ad.id]))
                                                                setShowRejectModal(true)
                                                            }}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Reject Ad(s)</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Please provide a reason for rejection:
                            </p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                placeholder="e.g., Inappropriate content, spam, violates terms..."
                            />
                            <div className="flex gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowRejectModal(false)
                                        setRejectReason('')
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => handleBulkAction('REJECT')}
                                    disabled={!rejectReason.trim()}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
