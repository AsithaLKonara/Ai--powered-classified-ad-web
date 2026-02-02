'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Camera, Save, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'

interface UserProfile {
    id: string
    name: string | null
    email: string | null
    phone: string | null
    bio: string | null
    avatar: string | null
    coverImage: string | null
    averageRating: number | null
    totalSales: number
}

export default function EditProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [profile, setProfile] = useState<UserProfile | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bio: '',
        avatar: '',
        coverImage: '',
    })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        } else if (status === 'authenticated') {
            fetchProfile()
        }
    }, [status])

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile')
            if (res.ok) {
                const data = await res.json()
                setProfile(data)
                setFormData({
                    name: data.name || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    avatar: data.avatar || '',
                    coverImage: data.coverImage || '',
                })
            }
        } catch (error) {
            toast.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                toast.success('Profile updated successfully!')
                router.push(`/profile/${session?.user?.id}`)
            } else {
                const data = await res.json()
                toast.error(data.error || 'Failed to update profile')
            }
        } catch (error) {
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md">
                    {/* Cover Image Section */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
                        {formData.coverImage && (
                            <img
                                src={formData.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover rounded-t-lg"
                            />
                        )}
                        <div className="absolute bottom-4 right-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white"
                                onClick={() => {
                                    const url = prompt('Enter cover image URL:')
                                    if (url) setFormData({ ...formData, coverImage: url })
                                }}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Change Cover
                            </Button>
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="relative px-8 -mt-16 mb-4">
                        <div className="relative inline-block">
                            {formData.avatar ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                    <UserIcon className="w-16 h-16 text-white" />
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    const url = prompt('Enter avatar image URL:')
                                    if (url) setFormData({ ...formData, avatar: url })
                                }}
                                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Edit Profile
                            </h1>
                            <p className="text-gray-600">
                                Update your personal information and profile settings
                            </p>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <Input
                                type="email"
                                value={profile?.email || ''}
                                disabled
                                className="bg-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Email cannot be changed
                            </p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+94 77 123 4567"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bio
                            </label>
                            <Textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                maxLength={500}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.bio.length}/500 characters
                            </p>
                        </div>

                        {/* Stats (Read-only) */}
                        {profile && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">Average Rating</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {profile.averageRating?.toFixed(1) || 'N/A'} ⭐
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Sales</p>
                                    <p className="text-xl font-semibold text-gray-900">
                                        {profile.totalSales}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={saving}
                                className="flex-1"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
