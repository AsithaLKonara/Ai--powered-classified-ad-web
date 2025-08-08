import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"

const categories = [
  { name: "Vehicles", icon: Car, count: "68,537", color: "text-blue-500", bgColor: "bg-blue-500/10", trend: "+12%" },
  {
    name: "Electronics",
    icon: Smartphone,
    count: "67,557",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    trend: "+8%",
  },
  { name: "Property", icon: Home, count: "75,559", color: "text-green-500", bgColor: "bg-green-500/10", trend: "+15%" },
  {
    name: "Jobs",
    icon: Briefcase,
    count: "11,172",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    trend: "+5%",
  },
  { name: "Services", icon: Wrench, count: "21,367", color: "text-red-500", bgColor: "bg-red-500/10", trend: "+18%" },
  {
    name: "Fashion & Beauty",
    icon: Shirt,
    count: "5,303",
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    trend: "+22%",
  },
  {
    name: "Home & Garden",
    icon: Sofa,
    count: "21,716",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    trend: "+7%",
  },
  {
    name: "Health & Beauty",
    icon: Heart,
    count: "3,245",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    trend: "+25%",
  },
  {
    name: "Hobby & Sport",
    icon: Gamepad2,
    count: "7,643",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    trend: "+10%",
  },
  { name: "Education", icon: Book, count: "2,168", color: "text-amber-500", bgColor: "bg-amber-500/10", trend: "+14%" },
  {
    name: "Music & Media",
    icon: Music,
    count: "1,892",
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    trend: "+9%",
  },
  {
    name: "Photography",
    icon: Camera,
    count: "1,456",
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    trend: "+16%",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">Find exactly what you're looking for</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link key={category.name} href={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card className="card-hover group cursor-pointer glass-effect border-0 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    {/* Background Glow Effect */}
                    <div
                      className={`absolute inset-0 ${category.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    {/* Trend Badge */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                        {category.trend}
                      </Badge>
                    </div>

                    <div className="relative z-10">
                      <div className="mb-4 flex justify-center">
                        <div
                          className={`p-4 rounded-full ${category.bgColor} group-hover:scale-110 transition-all duration-300 category-icon-hover`}
                        >
                          <IconComponent
                            className={`h-8 w-8 ${category.color} group-hover:text-primary transition-colors duration-300`}
                          />
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">{category.count} ads</p>
                        <div className="w-full bg-muted/30 rounded-full h-1 overflow-hidden">
                          <div
                            className={`h-full ${category.color.replace("text-", "bg-")} transition-all duration-1000 group-hover:w-full`}
                            style={{ width: `${Math.random() * 60 + 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-8">
          <Link href="/categories">
            <button className="px-6 py-3 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 border border-primary/20 rounded-full text-primary font-medium transition-all duration-300 hover:scale-105 glass-effect">
              View All Categories
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
