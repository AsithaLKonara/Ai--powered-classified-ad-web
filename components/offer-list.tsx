'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { CheckCircle, XCircle, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'

interface Offer {
    id: string
    amount: number
    message?: string
    status: string
    createdAt: string
    buyer: {
        id: string
        name: string | null
        avatar: string | null
        averageRating: number | null
    }
    seller?: {
        id: string
        name: string | null
        avatar: string | null
    }
    ad: {
        id: string
        title: string
        price: number
        status: string
        images: Array<{ url: string }>
    }
}

interface OfferListProps {
    type?: 'received' | 'sent'
    adId?: string
}

export function OfferList({ type = 'received', adId }: OfferListProps) {
    const { data: session } = useSession()
    const [offers, setOffers] = useState<Offer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOffers()
    }, [type, adId])

    const fetchOffers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ type })
            if (adId) params.append('adId', adId)

            const res = await fetch(`/api/offers?${params}`)
            if (res.ok) {
                const data = await res.json()
                setOffers(data)
            }
        } catch (error) {
            console.error('Failed to fetch offers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (offerId: string, action: string) => {
        try {
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            })

            if (res.ok) {
                toast.success(`Offer ${action.toLowerCase()}ed successfully!`)
                fetchOffers()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to update offer')
            }
        } catch (error) {
            toast.error('Failed to update offer')
        }
    }

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            ACCEPTED: 'bg-green-100 text-green-800',
            REJECTED: 'bg-red-100 text-red-800',
            WITHDRAWN: 'bg-gray-100 text-gray-800',
            EXPIRED: 'bg-gray-100 text-gray-600',
        }
        return badges[status as keyof typeof badges] || badges.PENDING
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading offers...</p>
            </div>
        )
    }

    if (offers.length === 0) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                    {type === 'received' ? 'No offers received yet' : 'No offers sent yet'}
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => {
                const isSeller = session?.user?.id === offer.ad.userId
                const otherUser = isSeller ? offer.buyer : offer.seller
                const discount = ((offer.ad.price - offer.amount) / offer.ad.price * 100).toFixed(0)

                return (
                    <div
                        key={offer.id}
                        className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex gap-4">
                            {/* Ad Image */}
                            <div className="flex-shrink-0">
                                {offer.ad.images[0] ? (
                                    <img
                                        src={offer.ad.images[0].url}
                                        alt={offer.ad.title}
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-400 text-xs">No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {offer.ad.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {type === 'received' ? 'From' : 'To'}: {otherUser?.name || 'Anonymous'}
                                            {otherUser?.averageRating && (
                                                <span className="ml-2">
                                                    ⭐ {otherUser.averageRating.toFixed(1)}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                                            offer.status
                                        )}`}
                                    >
                                        {offer.status}
                                    </span>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-3 gap-4 mb-3 p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600">Asking Price</p>
                                        <p className="font-semibold text-gray-900">
                                            LKR {offer.ad.price.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Offer Amount</p>
                                        <p className="font-semibold text-blue-600">
                                            LKR {offer.amount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600">Discount</p>
                                        <p className="font-semibold text-green-600">
                                            {discount}% off
                                        </p>
                                    </div>
                                </div>

                                {/* Message */}
                                {offer.message && (
                                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-sm text-gray-700">{offer.message}</p>
                                    </div>
                                )}

                                {/* Timestamp */}
                                <p className="text-xs text-gray-500 mb-3">
                                    <Clock className="w-3 h-3 inline mr-1" />
                                    {formatDistanceToNow(new Date(offer.createdAt), {
                                        addSuffix: true,
                                    })}
                                </p>

                                {/* Actions */}
                                {offer.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        {type === 'received' ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAction(offer.id, 'ACCEPT')}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleAction(offer.id, 'REJECT')}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </>
                                        ) : (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAction(offer.id, 'WITHDRAW')}
                                            >
                                                Withdraw Offer
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
