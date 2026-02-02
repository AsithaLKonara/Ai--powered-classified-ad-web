"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, User, Phone, Loader2, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function SignUpPage() {
    const router = useRouter()
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (response.ok) {
                toast({
                    title: "Registration Successful!",
                    description: "You can now sign in with your account.",
                })
                router.push("/auth/signin")
            } else {
                toast({
                    variant: "destructive",
                    title: "Registration Failed",
                    description: data.error || "Something went wrong.",
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0C10] py-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-lg p-4 relative z-10 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-10">
                <Link href="/" className="flex items-center justify-center space-x-2 mb-8 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <span className="text-primary-foreground font-bold text-xl">C</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
                        ClassifiedHub
                    </span>
                </Link>

                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <CardHeader className="space-y-1 pb-6">
                        <CardTitle className="text-2xl text-center font-bold tracking-tight text-white">Create Account</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Join the modern classifieds revolution today
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 px-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                        <Input
                                            placeholder="John Doe"
                                            className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 px-1">Phone Number (Optional)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                        <Input
                                            placeholder="+94 77 XXX XXXX"
                                            className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 px-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <Input
                                        type="email"
                                        placeholder="john@example.com"
                                        className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 px-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-gray-800/50 border-gray-700 text-white pl-10 h-11"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-start gap-2 px-1 pt-2">
                                <div className="mt-1">
                                    <CheckCircle2 className="w-3 h-3 text-primary" />
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    By creating an account, you agree to our{" "}
                                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and{" "}
                                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,132,0.2)] mt-4"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t border-gray-800/50 pt-6">
                        <p className="text-center text-sm text-gray-400">
                            Already have an account?{" "}
                            <Link href="/auth/signin" className="text-primary hover:underline font-semibold">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
