"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    User,
    Mail,
    Phone,
    Camera,
    Shield,
    Bell,
    CreditCard,
    ChevronRight,
    Loader2,
    Save,
    CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
    const { data: session, status, update: updateSession } = useSession()
    const router = useRouter()
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        image: "",
    })

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin")
        }
        if (session?.user) {
            setFormData({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: (session.user as any).phone || "",
                image: session.user.image || "",
            })
        }
    }, [session, status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                await updateSession()
                toast({
                    title: "Profile Updated",
                    description: "Your changes have been saved successfully.",
                })
                router.refresh()
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
            setIsLoading(false)
        }
    }

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0A0C10] text-white">
            <Navigation />

            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 space-y-4">
                        <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md">
                            <CardContent className="pt-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="relative group cursor-pointer">
                                        <Avatar className="w-24 h-24 border-2 border-primary/20 transition-all duration-300 group-hover:border-primary">
                                            <AvatarImage src={formData.image || undefined} />
                                            <AvatarFallback className="bg-gray-800 text-2xl font-bold">
                                                {formData.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{formData.name}</h2>
                                        <p className="text-sm text-gray-400">{formData.email}</p>
                                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            <Shield className="w-3 h-3 mr-1" />
                                            {session?.user?.role?.toLowerCase() || "User"}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <nav className="space-y-1">
                            {[
                                { label: "Account Settings", icon: User, active: true },
                                { label: "Notifications", icon: Bell },
                                { label: "Payments", icon: CreditCard },
                                { label: "Security", icon: Shield },
                            ].map((item, i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    className={`w-full justify-between hover:bg-white/5 h-11 px-4 transition-all duration-300 ${item.active ? "bg-white/5 text-primary" : "text-gray-400"}`}
                                >
                                    <span className="flex items-center">
                                        <item.icon className="w-4 h-4 mr-3" />
                                        {item.label}
                                    </span>
                                    <ChevronRight className={`w-3 h-3 ${item.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                                </Button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        <Card className="bg-gray-900/40 border-gray-800 backdrop-blur-md overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                            <CardHeader>
                                <CardTitle className="text-xl">Public Profile</CardTitle>
                                <CardDescription className="text-gray-400">Manage your account information and preferences</CardDescription>
                            </CardHeader>

                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 font-medium">Display Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                                <Input
                                                    className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 font-medium">Email Address</label>
                                            <div className="relative group opacity-60">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                                                <Input
                                                    className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                                    value={formData.email}
                                                    disabled
                                                />
                                            </div>
                                            <p className="text-[10px] text-gray-500 px-1">Email cannot be changed directly.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400 font-medium">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                                <Input
                                                    className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 border-t border-gray-800">
                                        <div className="flex items-center text-xs text-gray-500 italic">
                                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                                            Verification status: Active
                                        </div>
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-11 transition-all duration-300 shadow-[0_4px_14px_0_rgba(0,255,132,0.2)]"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4 mr-2" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-red-500/5 border-red-500/20 backdrop-blur-md">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-red-500">Deactivate Account</h3>
                                        <p className="text-sm text-gray-400">Permanently remove your account and all listings.</p>
                                    </div>
                                    <Button variant="destructive" className="bg-red-600/20 text-red-500 border border-red-600/30 hover:bg-red-600 hover:text-white transition-all duration-300">
                                        Deactivate
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
