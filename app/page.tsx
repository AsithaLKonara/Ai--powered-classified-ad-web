import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedListings } from "@/components/featured-listings"
import { TrendingAds } from "@/components/trending-ads"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CategoryGrid />
      <FeaturedListings />
      <TrendingAds />
      <Footer />
    </div>
  )
}
