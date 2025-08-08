"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { useCategories } from "@/hooks/use-api"
import {
  Car,
  Smartphone,
  Home,
  Briefcase,
  Wrench,
  Shirt,
  Sofa,
  Heart,
  Gamepad2,
  Book,
  Music,
  Camera,
  Loader2,
} from "lucide-react"

// Icon mapping for categories
const iconMap: Record<string, any> = {
  vehicles: Car,
  electronics: Smartphone,
  property: Home,
  jobs: Briefcase,
  services: Wrench,
  "fashion-beauty": Shirt,
  "home-garden": Sofa,
  "health-beauty": Heart,
  "sports-hobbies": Gamepad2,
  education: Book,
  "music-media": Music,
  photography: Camera,
}

// Color mapping for categories
const colorMap: Record<string, { color: string; bgColor: string }> = {
  vehicles: { color: "text-blue-500", bgColor: "bg-blue-500/10" },
  electronics: { color: "text-purple-500", bgColor: "bg-purple-500/10" },
  property: { color: "text-green-500", bgColor: "bg-green-500/10" },
  jobs: { color: "text-orange-500", bgColor: "bg-orange-500/10" },
  services: { color: "text-red-500", bgColor: "bg-red-500/10" },
  "fashion-beauty": { color: "text-pink-500", bgColor: "bg-pink-500/10" },
  "home-garden": { color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  "health-beauty": { color: "text-rose-500", bgColor: "bg-rose-500/10" },
  "sports-hobbies": { color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  education: { color: "text-amber-500", bgColor: "bg-amber-500/10" },
  "music-media": { color: "text-violet-500", bgColor: "bg-violet-500/10" },
  photography: { color: "text-teal-500", bgColor: "bg-teal-500/10" },
}

export function CategoryGrid() {
  const { categories, loading, error, getCategories } = useCategories()

  useEffect(() => {
    getCategories()
  }, [getCategories])

  if (loading) {
    return (
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-red-500">Failed to load categories: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories?.categories?.map((category: any, index: number) => {
            const Icon = iconMap[category.slug] || Car
            const colors = colorMap[category.slug] || { color: "text-gray-500", bgColor: "bg-gray-500/10" }
            
            return (
              <Link key={category.id} href={`/listings?category=${category.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${colors.bgColor}`}>
                      <Icon className={`w-6 h-6 ${colors.color}`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category._count?.ads || 0} ads
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
