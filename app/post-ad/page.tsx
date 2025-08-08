"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Sparkles, TrendingUp, Zap, Eye, Target } from "lucide-react"

const categories = [
  "Vehicles",
  "Electronics",
  "Property",
  "Jobs",
  "Services",
  "Fashion & Beauty",
  "Home & Garden",
  "Sports & Hobbies",
]

const locations = ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Matara", "Kurunegala"]

const boostPackages = [
  {
    name: "Starter",
    price: 500,
    duration: "3 days",
    reach: "1,000+",
    features: ["Category top placement", "Basic highlighting"],
  },
  {
    name: "Pro",
    price: 1500,
    duration: "7 days",
    reach: "5,000+",
    features: ["Homepage featured", "Category top placement", "Enhanced highlighting", "Social media boost"],
  },
  {
    name: "Premium",
    price: 3000,
    duration: "14 days",
    reach: "15,000+",
    features: [
      "Homepage hero slot",
      "All category placements",
      "Maximum highlighting",
      "Social media boost",
      "Email newsletter",
    ],
  },
]

export default function PostAdPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    enableAuction: false,
    enableBoost: false,
    boostBudget: "",
    selectedPackage: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [predictedReach, setPredictedReach] = useState("")

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // AI categorization simulation
    if (field === "title" && typeof value === "string" && value.length > 10) {
      setTimeout(() => {
        if (value.toLowerCase().includes("phone") || value.toLowerCase().includes("mobile")) {
          setAiSuggestion("Electronics > Mobile Phones")
        } else if (value.toLowerCase().includes("car") || value.toLowerCase().includes("vehicle")) {
          setAiSuggestion("Vehicles > Cars")
        } else if (value.toLowerCase().includes("house") || value.toLowerCase().includes("apartment")) {
          setAiSuggestion("Property > Houses")
        } else {
          setAiSuggestion("General > Other")
        }
      }, 1000)
    }

    // Boost reach prediction
    if (field === "boostBudget" && typeof value === "string") {
      const budget = Number.parseInt(value)
      if (budget >= 500 && budget < 1500) {
        setPredictedReach("1,000 - 3,000 views")
      } else if (budget >= 1500 && budget < 3000) {
        setPredictedReach("3,000 - 8,000 views")
      } else if (budget >= 3000) {
        setPredictedReach("8,000+ views")
      } else {
        setPredictedReach("")
      }
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages].slice(0, 8))
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Post Your Ad</h1>
            <p className="text-muted-foreground">Reach thousands of potential buyers with our AI-powered platform</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Ad Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., iPhone 15 Pro Max 256GB"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  {aiSuggestion && (
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        AI auto-categorized your ad as: <Badge variant="secondary">{aiSuggestion}</Badge>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="condition">Condition *</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => handleInputChange("condition", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used">Used</SelectItem>
                          <SelectItem value="refurbished">Refurbished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price (LKR) *</Label>
                      <Input
                        id="price"
                        placeholder="e.g., 50000"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {images.length < 8 && (
                      <label className="border-2 border-dashed border-muted-foreground/25 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                        <div className="text-center">
                          <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Add Photo</span>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload up to 8 photos. First photo will be the main image.
                  </p>
                </CardContent>
              </Card>

              {/* Additional Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auction">Enable Auction</Label>
                      <p className="text-sm text-muted-foreground">Let buyers bid on your item</p>
                    </div>
                    <Switch
                      id="auction"
                      checked={formData.enableAuction}
                      onCheckedChange={(checked) => handleInputChange("enableAuction", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="boost">Enable Ad Boost</Label>
                      <p className="text-sm text-muted-foreground">Increase visibility with premium placement</p>
                    </div>
                    <Switch
                      id="boost"
                      checked={formData.enableBoost}
                      onCheckedChange={(checked) => handleInputChange("enableBoost", checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Boost Options */}
              {formData.enableBoost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Boost Your Ad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {boostPackages.map((pkg) => (
                        <Card
                          key={pkg.name}
                          className={`cursor-pointer transition-all ${
                            formData.selectedPackage === pkg.name
                              ? "ring-2 ring-primary bg-primary/5"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => handleInputChange("selectedPackage", pkg.name)}
                        >
                          <CardContent className="p-4">
                            <div className="text-center">
                              <h3 className="font-semibold mb-2">{pkg.name}</h3>
                              <div className="text-2xl font-bold text-primary mb-1">
                                Rs {pkg.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground mb-3">{pkg.duration}</div>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">{pkg.reach} reach</span>
                              </div>
                              <div className="space-y-1">
                                {pkg.features.map((feature, index) => (
                                  <div key={index} className="text-xs text-muted-foreground">
                                    • {feature}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div>
                      <Label htmlFor="custom-budget">Or enter custom budget (LKR)</Label>
                      <Input
                        id="custom-budget"
                        placeholder="e.g., 2000"
                        value={formData.boostBudget}
                        onChange={(e) => handleInputChange("boostBudget", e.target.value)}
                      />
                      {predictedReach && (
                        <p className="text-sm text-muted-foreground mt-1">Predicted reach: {predictedReach}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Preview & Tips */}
            <div className="space-y-6">
              {/* Ad Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Ad Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-accent/20">
                    <div className="w-full h-32 bg-muted rounded mb-3 flex items-center justify-center">
                      {images.length > 0 ? (
                        <img
                          src={images[0] || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover rounded"
                        />
                      ) : (
                        <span className="text-muted-foreground">No image</span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{formData.title || "Your ad title will appear here"}</h3>
                    <div className="text-lg font-bold text-primary mb-2">
                      {formData.price ? `Rs ${formData.price}` : "Rs 0"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formData.location || "Location"} • {formData.condition || "Condition"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Boost Health Score */}
              {formData.enableBoost && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Boost Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Content Quality</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                          Strong
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Image Quality</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700">
                          {images.length > 0 ? "Good" : "Needs Images"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Category Match</span>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                          {aiSuggestion ? "Excellent" : "Pending"}
                        </Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Overall: Strong</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Tips for Better Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Use clear, high-quality photos from multiple angles</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Write detailed descriptions with key specifications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Set competitive pricing based on market research</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span>Boost your ad for 5x more visibility</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estimated Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expected Views</span>
                      <span className="font-medium">
                        {formData.enableBoost ? predictedReach || "500-1,000" : "100-300"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Response Time</span>
                      <span className="font-medium">2-4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Category Ranking</span>
                      <span className="font-medium">{formData.enableBoost ? "Top 10" : "Standard"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button size="lg" className="px-12">
              <Zap className="h-5 w-5 mr-2" />
              Publish Ad
              {formData.enableBoost && formData.selectedPackage && (
                <span className="ml-2">
                  + Boost (Rs {boostPackages.find((p) => p.name === formData.selectedPackage)?.price.toLocaleString()})
                </span>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Your ad will be reviewed and published within 30 minutes
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
