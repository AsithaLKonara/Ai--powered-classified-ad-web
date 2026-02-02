'use client'

import { useState } from 'react'
import { DollarSign, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface MakeOfferProps {
    adId: string
    currentPrice: number
    onSuccess?: () => void
}

export function MakeOffer({ adId, currentPrice, onSuccess }: MakeOfferProps) {
    const [showForm, setShowForm] = useState(false)
    const [amount, setAmount] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const offerAmount = parseFloat(amount)
        if (isNaN(offerAmount) || offerAmount <= 0) {
            toast.error('Please enter a valid amount')
            return
        }

        if (offerAmount >= currentPrice) {
            toast.error('Offer must be less than the asking price')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/offers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adId,
                    amount: offerAmount,
                    message: message.trim() || undefined,
                }),
            })

            if (res.ok) {
                toast.success('Offer sent successfully!')
                setAmount('')
                setMessage('')
                setShowForm(false)
                onSuccess?.()
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to send offer')
            }
        } catch (error) {
            toast.error('Failed to send offer')
        } finally {
            setLoading(false)
        }
    }

    const suggestedOffers = [
        Math.round(currentPrice * 0.7),
        Math.round(currentPrice * 0.8),
        Math.round(currentPrice * 0.9),
    ]

    if (!showForm) {
        return (
            <Button
                onClick={() => setShowForm(true)}
                className="w-full"
                variant="outline"
            >
                <DollarSign className="w-4 h-4 mr-2" />
                Make an Offer
            </Button>
        )
    }

    return (
        <div className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Make an Offer</h3>
                <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                    <strong>Asking Price:</strong> LKR {currentPrice.toLocaleString()}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Offer Amount (LKR) *
                    </label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter your offer"
                        required
                        min="1"
                        step="1"
                    />
                </div>

                {/* Quick Suggestions */}
                <div>
                    <p className="text-sm text-gray-600 mb-2">Quick suggestions:</p>
                    <div className="flex gap-2">
                        {suggestedOffers.map((suggested) => (
                            <button
                                key={suggested}
                                type="button"
                                onClick={() => setAmount(suggested.toString())}
                                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                LKR {suggested.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message (Optional)
                    </label>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a message to the seller..."
                        rows={3}
                        maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {message.length}/500 characters
                    </p>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        {loading ? 'Sending...' : 'Send Offer'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
