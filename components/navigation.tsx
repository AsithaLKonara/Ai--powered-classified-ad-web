"use client"

import { useState } from "react"
import { Search, Menu, X, Bell, User, MessageCircle, Plus, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const categories = [
  "All Categories",
  "Vehicles",
  "Electronics",
  "Property",
  "Jobs",
  "Services",
  "Fashion & Beauty",
  "Home & Garden",
]

const locations = ["All Sri Lanka", "Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara"]

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "si", name: "සිංහල", flag: "🇱🇰" },
  { code: "ta", name: "தமிழ்", flag: "🇱🇰" },
]

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
              ClassifiedHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/listings" className="text-foreground hover:text-primary transition-colors">
              Browse
            </Link>
            <Link href="/auctions" className="text-foreground hover:text-primary transition-colors">
              Auctions
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
              My Ads
            </Link>
            <Link
              href="/boost"
              className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Zap className="w-4 h-4" />
              Boost
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Globe className="w-4 h-4 mr-2" />
                  {languages.find((lang) => lang.code === selectedLanguage)?.flag}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} onClick={() => setSelectedLanguage(lang.code)}>
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Chat */}
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/chat">
                <MessageCircle className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  3
                </Badge>
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                2
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">My Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">Favorites</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin">Admin Panel</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Post Ad Button */}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
              <Link href="/post-ad">
                <Plus className="w-4 h-4 mr-2" />
                Post Ad
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="pb-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>

            <Select defaultValue="All Categories">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue="All Sri Lanka">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button className="bg-primary hover:bg-primary/90">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/listings" className="text-foreground hover:text-primary transition-colors">
                Browse
              </Link>
              <Link href="/auctions" className="text-foreground hover:text-primary transition-colors">
                Auctions
              </Link>
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors">
                My Ads
              </Link>
              <Link
                href="/boost"
                className="text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <Zap className="w-4 h-4" />
                Boost
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
