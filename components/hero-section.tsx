"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Sparkles, TrendingUp, Users, Eye, Clock } from "lucide-react"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentStat, setCurrentStat] = useState(0)

  const trendingTerms = ["iPhone 15", "Toyota Prius", "Apartment Colombo", "Gaming Laptop", "Wedding Dress"]

  const stats = [
    { icon: TrendingUp, value: "500K+", label: "Active Ads", color: "text-green-500" },
    { icon: Users, value: "50K+", label: "Verified Sellers", color: "text-blue-500" },
    { icon: Eye, value: "1M+", label: "Monthly Views", color: "text-purple-500" },
    { icon: Clock, value: "24/7", label: "Support", color: "text-orange-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-background via-background to-primary/5 py-20 px-4 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="hero-particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Hero Title */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
              <span className="gradient-text floating-element">Buy. Sell. Discover.</span>
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/10 rounded-full blur-2xl"></div>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Sri Lanka's most advanced classified ads platform with{" "}
              <span className="text-primary font-semibold">AI-powered search</span>,{" "}
              <span className="text-primary font-semibold">real-time auctions</span>, and{" "}
              <span className="text-primary font-semibold">verified sellers</span>.
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/30 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex rounded-lg border bg-card shadow-2xl glass-effect">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="What are you looking for? (AI-powered search)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg border-0 rounded-l-lg focus-visible:ring-0 search-focus bg-transparent"
                  />
                  {searchQuery && (
                    <div className="absolute top-full left-0 right-0 bg-card/95 backdrop-blur-md border border-t-0 rounded-b-lg shadow-2xl z-50 glass-effect">
                      <div className="p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                          AI Suggestions
                        </div>
                        <div className="space-y-2">
                          <div className="p-3 hover:bg-accent/50 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]">
                            <div className="font-medium">{searchQuery} in Electronics</div>
                            <div className="text-sm text-muted-foreground">1,234 results found</div>
                          </div>
                          <div className="p-3 hover:bg-accent/50 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]">
                            <div className="font-medium">{searchQuery} in Vehicles</div>
                            <div className="text-sm text-muted-foreground">856 results found</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center px-4 border-l border-border/50">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm">All Sri Lanka</span>
                </div>
                <Button
                  size="lg"
                  className="rounded-l-none px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Trending Terms */}
          <div className="mb-12">
            <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending searches:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingTerms.map((term, index) => (
                <Badge
                  key={term}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 glass-effect"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>

          {/* Enhanced Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              const isActive = currentStat === index
              return (
                <div
                  key={stat.label}
                  className={`transition-all duration-500 ${
                    isActive ? "scale-110 opacity-100" : "scale-100 opacity-70"
                  }`}
                >
                  <div className={`p-4 rounded-xl glass-effect ${isActive ? "bg-primary/10" : ""}`}>
                    <IconComponent
                      className={`h-8 w-8 mx-auto mb-2 ${stat.color} ${isActive ? "animate-pulse" : ""}`}
                    />
                    <div className={`text-2xl font-bold ${isActive ? "neon-glow text-primary" : "text-primary"}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Selling Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
