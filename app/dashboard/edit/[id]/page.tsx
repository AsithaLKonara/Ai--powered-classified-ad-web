"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
    Loader2,
    Upload,
    X,
    Save,
    ArrowLeft,
    Sparkles,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Navigation } from "@/components/navigation"
import { useCategories, useLocations } from "@/hooks/use-api"
import Image from "next/image"

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const { categories } = useCategories()
    const { locations } = useLocations()

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        locationId: "",
        condition: "",
        type: "",
    })
    const [images, setImages] = useState<any[]>([])

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
    }, [status, router])

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await fetch(`/api/ads/${id}`)
                const data = await res.json()
                if (res.ok) {
                    const ad = data.ad
                    setFormData({
                        title: ad.title,
                        description: ad.description,
                        price: ad.price.toString(),
                        categoryId: ad.categoryId,
                        locationId: ad.locationId,
                        condition: ad.condition,
                        type: ad.type,
                    })
                    setImages(ad.images || [])
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load ad details.",
                    })
                    router.push("/dashboard")
                }
            } catch (err) {
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        if (id) fetchAd()
    }, [id, router, toast])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const res = await fetch(`/api/ads/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images: images.map(img => img.url),
                }),
            })

            if (res.ok) {
                toast({
                    title: "Ad Updated",
                    description: "Your advertisement has been updated successfully.",
                })
                router.push("/dashboard")
            } else {
                const data = await res.json()
                toast({
                    variant: "destructive",
                    title: "Update Failed",
                    description: data.error || "Something went wrong.",
                })
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0C10] text-white">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" className="hover:bg-white/5" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold">Edit Advertisement</h1>
                            <p className="text-gray-400 text-sm">Update your listing details for better reach</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                                <CardHeader>
                                    <CardTitle className="text-lg">Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Ad Title</Label>
                                        <Input
                                            className="bg-gray-800/50 border-gray-700 text-white h-11 focus:ring-primary"
                                            value={formData.title}
                                            onChange={(e) => handleInputChange("title", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Category</Label>
                                            <Select
                                                value={formData.categoryId}
                                                onValueChange={(val) => handleInputChange("categoryId", val)}
                                            >
                                                <SelectTrigger className="bg-gray-800/50 border-gray-700 h-11 text-white">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories?.categories?.map((cat: any) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Location</Label>
                                            <Select
                                                value={formData.locationId}
                                                onValueChange={(val) => handleInputChange("locationId", val)}
                                            >
                                                <SelectTrigger className="bg-gray-800/50 border-gray-700 h-11 text-white">
                                                    <SelectValue placeholder="Select Location" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {locations?.locations?.map((loc: any) => (
                                                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Price (LKR)</Label>
                                            <Input
                                                type="number"
                                                className="bg-gray-800/50 border-gray-700 text-white h-11"
                                                value={formData.price}
                                                onChange={(e) => handleInputChange("price", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Condition</Label>
                                            <Select
                                                value={formData.condition}
                                                onValueChange={(val) => handleInputChange("condition", val)}
                                            >
                                                <SelectTrigger className="bg-gray-800/50 border-gray-700 h-11 text-white">
                                                    <SelectValue placeholder="Select Condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="NEW">New</SelectItem>
                                                    <SelectItem value="USED">Used</SelectItem>
                                                    <SelectItem value="REFURBISHED">Refurbished</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Description</Label>
                                        <Textarea
                                            className="bg-gray-800/50 border-gray-700 text-white min-h-[150px]"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            required
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg">Images</CardTitle>
                                    <CardDescription>First image is your main display photo</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-800 group">
                                                <Image src={img.url} alt="Ad" fill className="object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        {images.length < 8 && (
                                            <label className="aspect-square border-2 border-dashed border-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all">
                                                <Upload className="w-6 h-6 text-gray-500 mb-2" />
                                                <span className="text-xs text-gray-500 font-medium text-center px-2">Click to Upload</span>
                                                <input type="file" className="hidden" accept="image/*" disabled />
                                            </label>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-primary/5 border-primary/20 backdrop-blur-md">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        Optimization Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-gray-400">
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <p>High quality images increase views by up to 50%.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <p>Detailed descriptions build trust with potential buyers.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <p>Fair pricing helps sell items 3x faster.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="sticky top-24 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-[0_8px_16px_rgba(0,255,132,0.2)] mb-4"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full bg-transparent border-gray-800 text-gray-400 hover:bg-white/5 h-12"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    Discard Changes
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
