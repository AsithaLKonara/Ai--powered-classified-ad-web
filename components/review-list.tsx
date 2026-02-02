'use client'

import { useEffect, useState } from 'react'
import { Star, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Review {
    id: string
    rating: number
    comment?: string
    createdAt: string
    reviewer: {
        id: string
        name: string | null
        avatar: string | null
    }
    ad?: {
        id: string
        title: string
    }
}

interface ReviewStats {
    averageRating: number
    totalReviews: number
}

interface ReviewListProps {
    userId: string
    adId?: string
}

export function ReviewList({ userId, adId }: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>([])
    const [stats, setStats] = useState<ReviewStats>({ averageRating: 0, totalReviews: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [userId, adId])

    const fetchReviews = async () => {
        try {
            const params = new URLSearchParams({ userId })
            if (adId) params.append('adId', adId)

            const res = await fetch(`/api/reviews?${params}`)
            const data = await res.json()

            if (res.ok) {
                setReviews(data.reviews)
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Failed to fetch reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading reviews...</div>
    }

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">
                            {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(stats.averageRating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="border-l border-yellow-300 pl-4">
                        <p className="text-2xl font-semibold text-gray-900">
                            {stats.totalReviews}
                        </p>
                        <p className="text-sm text-gray-600">
                            {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No reviews yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-4">
                                {/* Reviewer Avatar */}
                                <div className="flex-shrink-0">
                                    {review.reviewer.avatar ? (
                                        <img
                                            src={review.reviewer.avatar}
                                            alt={review.reviewer.name || 'User'}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {review.reviewer.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDistanceToNow(new Date(review.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {review.comment && (
                                        <p className="text-gray-700 mt-2">{review.comment}</p>
                                    )}

                                    {review.ad && (
                                        <div className="mt-3 text-sm text-gray-500">
                                            Review for:{' '}
                                            <span className="font-medium text-gray-700">
                                                {review.ad.title}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
