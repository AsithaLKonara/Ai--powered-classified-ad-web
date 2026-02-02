'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import {
    Menu,
    X,
    Home,
    Search,
    PlusCircle,
    MessageSquare,
    User,
    LogOut,
    Settings,
    Heart,
    Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MobileNav() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => setIsOpen(!isOpen)

    const menuItems = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/search', icon: Search, label: 'Search' },
        { href: '/post-ad', icon: PlusCircle, label: 'Post Ad', auth: true },
        { href: '/messages', icon: MessageSquare, label: 'Messages', auth: true },
        { href: '/favorites', icon: Heart, label: 'Favorites', auth: true },
        { href: '/notifications', icon: Bell, label: 'Notifications', auth: true },
    ]

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <Link href="/" className="text-xl font-bold text-blue-600">
                        ClassifiedAds
                    </Link>

                    <button
                        onClick={toggleMenu}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Menu Drawer */}
            <nav
                className={`lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                        <h2 className="text-lg font-semibold">Menu</h2>
                        <button
                            onClick={toggleMenu}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* User Section */}
                    {session?.user && (
                        <div className="px-4 py-4 border-b bg-gray-50">
                            <div className="flex items-center gap-3">
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || 'User'}
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{session.user.name}</p>
                                    <p className="text-sm text-gray-600">{session.user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto py-2">
                        {menuItems.map((item) => {
                            if (item.auth && !session) return null

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={toggleMenu}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                                >
                                    <item.icon className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            )
                        })}

                        {session && (
                            <>
                                <Link
                                    href={`/profile/${session.user.id}`}
                                    onClick={toggleMenu}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                                >
                                    <User className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">My Profile</span>
                                </Link>

                                <Link
                                    href="/settings"
                                    onClick={toggleMenu}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors"
                                >
                                    <Settings className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium">Settings</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t p-4">
                        {session ? (
                            <Button
                                onClick={() => {
                                    signOut()
                                    toggleMenu()
                                }}
                                variant="outline"
                                className="w-full"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        ) : (
                            <div className="space-y-2">
                                <Link href="/auth/signin" onClick={toggleMenu}>
                                    <Button className="w-full">Sign In</Button>
                                </Link>
                                <Link href="/auth/signup" onClick={toggleMenu}>
                                    <Button variant="outline" className="w-full">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation Bar */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
                <div className="grid grid-cols-5 gap-1">
                    <Link
                        href="/"
                        className="flex flex-col items-center justify-center py-2 hover:bg-gray-50 transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        <span className="text-xs mt-1">Home</span>
                    </Link>

                    <Link
                        href="/search"
                        className="flex flex-col items-center justify-center py-2 hover:bg-gray-50 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                        <span className="text-xs mt-1">Search</span>
                    </Link>

                    <Link
                        href="/post-ad"
                        className="flex flex-col items-center justify-center py-2 hover:bg-gray-50 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-xs mt-1 text-blue-600 font-medium">Post</span>
                    </Link>

                    <Link
                        href="/messages"
                        className="flex flex-col items-center justify-center py-2 hover:bg-gray-50 transition-colors"
                    >
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-xs mt-1">Messages</span>
                    </Link>

                    <button
                        onClick={toggleMenu}
                        className="flex flex-col items-center justify-center py-2 hover:bg-gray-50 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                        <span className="text-xs mt-1">Menu</span>
                    </button>
                </div>
            </nav>

            {/* Spacer for fixed bottom nav */}
            <div className="lg:hidden h-16" />
        </>
    )
}
