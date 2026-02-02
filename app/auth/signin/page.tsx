"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, Lock, Loader2, Chrome, Facebook, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

export default function SignInPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl,
            })

            if (result?.error) {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: "Invalid email or password. Please try again.",
                })
            } else {
                toast({
                    title: "Welcome Back!",
                    description: "Successfully signed in.",
                })
                router.push(callbackUrl)
                router.refresh()
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
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0C10]">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />

            <div className="w-full max-w-md p-4 relative z-10 transition-all duration-500 animate-in fade-in zoom-in slide-in-from-bottom-10">
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
                        <CardTitle className="text-2xl text-center font-bold tracking-tight text-white">Sign In</CardTitle>
                        <CardDescription className="text-center text-gray-400">
                            Enter your email to access your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="outline"
                                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 text-white transition-all duration-300"
                                onClick={() => signIn("google", { callbackUrl })}
                            >
                                <Chrome className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                            <Button
                                variant="outline"
                                className="bg-gray-800/50 border-gray-700 hover:bg-gray-800 text-white transition-all duration-300"
                                onClick={() => signIn("facebook", { callbackUrl })}
                            >
                                <Facebook className="mr-2 h-4 w-4" />
                                Facebook
                            </Button>
                        </div>

                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-transparent px-2 text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        className="bg-gray-800/50 border-gray-700 text-white pl-10 focus:ring-primary focus:border-primary transition-all duration-300 h-11"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-medium text-gray-400">Password</label>
                                    <Link href="/auth/forgot-password" size="sm" className="text-xs text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors h-4 w-4" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="bg-gray-800/50 border-gray-700 text-white pl-10 focus:ring-primary focus:border-primary transition-all duration-300 h-11"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,132,0.2)]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 border-t border-gray-800/50 pt-6">
                        <p className="text-center text-sm text-gray-400">
                            Don't have an account?{" "}
                            <Link href="/auth/signup" className="text-primary hover:underline font-semibold">
                                Sign up
                            </Link>
                        </p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <ShieldCheck className="w-3 h-3 text-green-500" />
                            Secure encrypted login
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
