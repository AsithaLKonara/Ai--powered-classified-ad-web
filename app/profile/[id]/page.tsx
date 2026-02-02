'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { User, MapPin, Calendar, Star, Package } from 'lucide-react'
import { ReviewList } from '@/components/review-list'
import { ReviewForm } from '@/components/review-form'
import { RatingBadge } from '@/components/rating-badge'
import { formatDistanceToNow } from 'date-fns'

interface UserProfileData {
    id: string
    name: string | null
    email: string | null
    avatar: string | null
    bio: string | null
    averageRating: number | null
    totalSales: number
    createdAt: string
    _count: {
        ads: number
        receivedReviews: number
    }
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
    const { data: session } = useSession()
    const [user, setUser] = useState<UserProfileData | null>(null)
    const [loading, setLoading] = useState(true)
    const [showReviewForm, setShowReviewForm] = useState(false)

    useEffect(() => {
        fetchUserProfile()
    }, [params.id])

    const fetchUserProfile = async () => {
        try {
            const res = await fetch(`/api/users/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-gray-600">User not found</p>
                </div>
            </div>
        )
    }

    const isOwnProfile = session?.user?.id === user.id
    const canReview = session?.user?.id && !isOwnProfile

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Profile Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name || 'User'}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-200">
                                    <User className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {user.name || 'Anonymous User'}
                            </h1>

                            {user.averageRating !== null && (
                                <div className="mb-3">
                                    <RatingBadge
                                        rating={user.averageRating}
                                        reviewCount={user._count.receivedReviews}
                                        size="lg"
                                    />
                                </div>
                            )}

                            {user.bio && (
                                <p className="text-gray-700 mb-4">{user.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                        Joined{' '}
                                        {formatDistanceToNow(new Date(user.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    <span>{user._count.ads} active listings</span>
                                </div>
                                {user.totalSales > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4" />
                                        <span>{user.totalSales} sales</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Reviews ({user._count.receivedReviews})
                        </h2>
                        {canReview && !showReviewForm && (
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {showReviewForm && canReview && (
                        <div className="mb-6">
                            <ReviewForm
                                sellerId={user.id}
                                onSuccess={() => {
                                    setShowReviewForm(false)
                                    fetchUserProfile()
                                }}
                            />
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <ReviewList userId={user.id} />
                </div>
            </div>
        </div>
    )
}
