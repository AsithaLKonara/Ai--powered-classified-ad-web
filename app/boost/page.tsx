"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Zap, Eye, Clock, Target, CreditCard, CheckCircle, ArrowRight, Star, BarChart3 } from "lucide-react"

const userAds = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    price: "Rs 350,000",
    category: "Mobile Phones",
    views: 234,
    status: "active",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Toyota Prius 2020",
    price: "Rs 4,500,000",
    category: "Cars",
    views: 1456,
    status: "active",
    posted: "5 days ago",
  },
  {
    id: 3,
    title: "MacBook Pro M3",
    price: "Rs 450,000",
    category: "Laptops",
    views: 89,
    status: "boosted",
    posted: "1 day ago",
  },
]

const boostPackages = [
  {
    name: "Starter",
    price: 500,
    duration: "3 days",
    reach: "1,000+",
    features: ["Category top placement", "Basic highlighting", "2x visibility"],
    popular: false,
  },
  {
    name: "Pro",
    price: 1500,
    duration: "7 days",
    reach: "5,000+",
    features: [
      "Homepage featured",
      "Category top placement",
      "Enhanced highlighting",
      "Social media boost",
      "5x visibility",
    ],
    popular: true,
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
      "10x visibility",
    ],
    popular: false,
  },
]

export default function BoostPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAd, setSelectedAd] = useState("")
  const [selectedPackage, setSelectedPackage] = useState("")
  const [customBudget, setCustomBudget] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const steps = ["Select Ad", "Choose Package", "AI Optimization", "Payment", "Confirmation"]

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Boost Your Ads
            </h1>
            <p className="text-muted-foreground">
              Increase visibility and reach more potential buyers with AI-powered boosting
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index + 1 <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1 <= currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${index + 1 < currentStep ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <span key={step} className={index + 1 === currentStep ? "text-primary font-medium" : ""}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Select Ad */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Ad to Boost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userAds.map((ad) => (
                        <Card
                          key={ad.id}
                          className={`cursor-pointer transition-all ${
                            selectedAd === ad.id.toString() ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                          }`}
                          onClick={() => setSelectedAd(ad.id.toString())}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{ad.title}</h3>
                                <div className="text-lg font-bold text-primary mb-2">{ad.price}</div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span>{ad.category}</span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    {ad.views} views
                                  </span>
                                  <span>{ad.posted}</span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <Badge variant={ad.status === "boosted" ? "default" : "secondary"}>
                                  {ad.status === "boosted" ? "Currently Boosted" : "Active"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Choose Package */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Choose Boost Package</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {boostPackages.map((pkg) => (
                          <Card
                            key={pkg.name}
                            className={`cursor-pointer transition-all relative ${
                              selectedPackage === pkg.name ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                            }`}
                            onClick={() => setSelectedPackage(pkg.name)}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-primary">Most Popular</Badge>
                              </div>
                            )}
                            <CardContent className="p-4 text-center">
                              <h3 className="font-semibold mb-2">{pkg.name}</h3>
                              <div className="text-2xl font-bold text-primary mb-1">
                                Rs {pkg.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-muted-foreground mb-3">{pkg.duration}</div>
                              <div className="flex items-center justify-center gap-1 mb-4">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">{pkg.reach} reach</span>
                              </div>
                              <div className="space-y-2">
                                {pkg.features.map((feature, index) => (
                                  <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3 text-primary" />
                                    {feature}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <Separator className="my-6" />

                      <div>
                        <Label htmlFor="custom-budget">Or enter custom budget (LKR)</Label>
                        <Input
                          id="custom-budget"
                          placeholder="e.g., 2000"
                          value={customBudget}
                          onChange={(e) => setCustomBudget(e.target.value)}
                          className="mt-2"
                        />
                        {customBudget && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Estimated reach:{" "}
                            {Number.parseInt(customBudget) >= 3000
                              ? "10,000+"
                              : Number.parseInt(customBudget) >= 1500
                                ? "5,000+"
                                : "1,000+"}{" "}
                            views
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: AI Optimization */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      AI Boost Optimization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-accent/20 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">AI Analysis Results</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Content Quality Score</span>
                            <div className="flex items-center gap-2">
                              <Progress value={85} className="w-20" />
                              <span className="text-sm font-medium">85%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Market Demand</span>
                            <div className="flex items-center gap-2">
                              <Progress value={92} className="w-20" />
                              <span className="text-sm font-medium">92%</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Competitive Pricing</span>
                            <div className="flex items-center gap-2">
                              <Progress value={78} className="w-20" />
                              <span className="text-sm font-medium">78%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">AI Recommendations</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-green-700">Optimal Timing</div>
                              <div className="text-sm text-green-600">Best boost time: 6 PM - 9 PM weekdays</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                            <Star className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-blue-700">Category Placement</div>
                              <div className="text-sm text-blue-600">High demand in Electronics category</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />
                            <div>
                              <div className="font-medium text-purple-700">Expected Performance</div>
                              <div className="text-sm text-purple-600">Predicted 5x increase in views</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-primary/10 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2 text-primary">Boost Preview</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="ml-2 font-medium">
                              {selectedPackage
                                ? boostPackages.find((p) => p.name === selectedPackage)?.duration
                                : "7 days"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Placement:</span>
                            <span className="ml-2 font-medium">Homepage + Category</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Reach:</span>
                            <span className="ml-2 font-medium">
                              {selectedPackage
                                ? boostPackages.find((p) => p.name === selectedPackage)?.reach
                                : "5,000+"}{" "}
                              views
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Start Time:</span>
                            <span className="ml-2 font-medium">Immediately</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-accent/20 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Boost Package ({selectedPackage || "Pro"})</span>
                            <span>
                              Rs{" "}
                              {selectedPackage
                                ? boostPackages.find((p) => p.name === selectedPackage)?.price.toLocaleString()
                                : "1,500"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Processing Fee</span>
                            <span>Rs 50</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span>
                              Rs{" "}
                              {selectedPackage
                                ? (boostPackages.find((p) => p.name === selectedPackage)?.price + 50).toLocaleString()
                                : "1,550"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="payment-method">Payment Method</Label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="mobile">Mobile Payment</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="payhere">PayHere Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-2" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" className="mt-2" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" className="mt-2" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-green-500/10 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-5 w-5" />
                          <span className="font-medium">Secure Payment</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Your payment is secured by PayHere with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 5: Confirmation */}
              {currentStep === 5 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-6 w-6" />
                      Boost Activated Successfully!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6">
                      <div className="bg-green-500/10 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Your ad is now boosted!</h3>
                        <p className="text-muted-foreground">
                          Your ad will appear in premium positions and reach thousands more potential buyers.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-accent/20 p-4 rounded-lg">
                          <div className="font-semibold">Boost Duration</div>
                          <div className="text-muted-foreground">
                            {selectedPackage
                              ? boostPackages.find((p) => p.name === selectedPackage)?.duration
                              : "7 days"}
                          </div>
                        </div>
                        <div className="bg-accent/20 p-4 rounded-lg">
                          <div className="font-semibold">Expected Reach</div>
                          <div className="text-muted-foreground">
                            {selectedPackage ? boostPackages.find((p) => p.name === selectedPackage)?.reach : "5,000+"}{" "}
                            views
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Button className="w-full">View Boosted Ad</Button>
                        <Button variant="outline" className="w-full bg-transparent">
                          Track Performance
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Boost Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Selected Ad:</span>
                      <div className="font-medium mt-1">
                        {selectedAd ? userAds.find((ad) => ad.id.toString() === selectedAd)?.title : "None selected"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Package:</span>
                      <div className="font-medium mt-1">
                        {selectedPackage || customBudget ? selectedPackage || "Custom" : "None selected"}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Total Cost:</span>
                      <div className="font-medium mt-1 text-primary">
                        Rs{" "}
                        {selectedPackage
                          ? (boostPackages.find((p) => p.name === selectedPackage)?.price + 50).toLocaleString()
                          : customBudget
                            ? (Number.parseInt(customBudget) + 50).toLocaleString()
                            : "0"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Boost Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      <span>5x more visibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      <span>Premium placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Faster responses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span>AI-optimized targeting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      Our boost experts are here to help you maximize your ad performance.
                    </p>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Contact Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !selectedAd) ||
                (currentStep === 2 && !selectedPackage && !customBudget) ||
                (currentStep === 4 && !paymentMethod) ||
                currentStep === 5
              }
            >
              {currentStep === 4 ? "Pay Now" : currentStep === 5 ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
