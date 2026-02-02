'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface ReviewFormProps {
    sellerId: string
    adId?: string
    onSuccess?: () => void
}

export function ReviewForm({ sellerId, adId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0)
    const [hoveredRating, setHoveredRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    comment: comment.trim() || undefined,
                    reviewedId: sellerId,
                    adId
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || 'Failed to submit review')
                return
            }

            toast.success('Review submitted successfully!')
            setRating(0)
            setComment('')
            onSuccess?.()
        } catch (error) {
            toast.error('Failed to submit review')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4 p-6 bg-white rounded-lg border">
            <h3 className="text-lg font-semibold">Leave a Review</h3>

            <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                {rating > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                        {rating === 1 && 'Poor'}
                        {rating === 2 && 'Fair'}
                        {rating === 3 && 'Good'}
                        {rating === 4 && 'Very Good'}
                        {rating === 5 && 'Excellent'}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">
                    Comment (Optional)
                </label>
                <Textarea
                    placeholder="Share your experience with this seller..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                    {comment.length}/500 characters
                </p>
            </div>

            <Button
                onClick={handleSubmit}
                disabled={loading || rating === 0}
                className="w-full"
            >
                {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
        </div>
    )
}
