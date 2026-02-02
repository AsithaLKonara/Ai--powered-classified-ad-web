'use client'

import { Star } from 'lucide-react'

interface RatingBadgeProps {
    rating: number
    reviewCount?: number
    size?: 'sm' | 'md' | 'lg'
    showCount?: boolean
}

export function RatingBadge({
    rating,
    reviewCount = 0,
    size = 'md',
    showCount = true
}: RatingBadgeProps) {
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    }

    const starSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
    }

    if (rating === 0 && reviewCount === 0) {
        return (
            <span className={`text-gray-500 ${sizeClasses[size]}`}>
                No reviews yet
            </span>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
                <Star className={`${starSizes[size]} fill-yellow-400 text-yellow-400`} />
                <span className={`font-semibold ${sizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            </div>
            {showCount && reviewCount > 0 && (
                <span className={`text-gray-600 ${sizeClasses[size]}`}>
                    ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                </span>
            )}
        </div>
    )
}
