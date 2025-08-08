"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Loader2, Zap } from "lucide-react"

interface BoostPackage {
  id: string
  name: string
  duration: number
  price: number
  features: string[]
  popular?: boolean
}

const boostPackages: BoostPackage[] = [
  {
    id: "basic",
    name: "Basic Boost",
    duration: 7,
    price: 500,
    features: [
      "Featured placement for 7 days",
      "Increased visibility",
      "Priority in search results",
    ],
  },
  {
    id: "premium",
    name: "Premium Boost",
    duration: 14,
    price: 900,
    features: [
      "Featured placement for 14 days",
      "Increased visibility",
      "Priority in search results",
      "Highlighted in category pages",
      "Social media promotion",
    ],
    popular: true,
  },
  {
    id: "ultimate",
    name: "Ultimate Boost",
    duration: 30,
    price: 1500,
    features: [
      "Featured placement for 30 days",
      "Maximum visibility",
      "Top priority in search results",
      "Highlighted in category pages",
      "Social media promotion",
      "Homepage featured section",
      "Email newsletter inclusion",
    ],
  },
]

interface PaymentFormProps {
  adId: string
  adTitle: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentForm({ adId, adTitle, onSuccess, onCancel }: PaymentFormProps) {
  const [selectedPackage, setSelectedPackage] = useState<string>("premium")
  const [paymentMethod, setPaymentMethod] = useState<string>("payhere")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const selectedBoost = boostPackages.find(pkg => pkg.id === selectedPackage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Here you would integrate with PayHere or Stripe
      // For now, we'll simulate a payment
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create boost record
      const boostData = {
        adId,
        packageId: selectedPackage,
        amount: selectedBoost?.price || 0,
        duration: selectedBoost?.duration || 0,
      }

      // Call API to create boost
      const response = await fetch("/api/boosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boostData),
      })

      if (response.ok) {
        onSuccess?.()
      } else {
        throw new Error("Failed to create boost")
      }
    } catch (error) {
      console.error("Payment failed:", error)
      alert("Payment failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Boost Your Ad
          </CardTitle>
          <p className="text-muted-foreground">
            Boost "{adTitle}" to get more visibility and reach more potential buyers.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Boost Packages */}
          <div>
            <Label className="text-base font-medium mb-4 block">Select Boost Package</Label>
            <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
              <div className="grid gap-4">
                {boostPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPackage === pkg.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 -right-2 bg-yellow-500">
                        Popular
                      </Badge>
                    )}
                    <div className="flex items-start gap-3">
                      <RadioGroupItem value={pkg.id} id={pkg.id} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor={pkg.id} className="text-base font-medium cursor-pointer">
                            {pkg.name}
                          </Label>
                          <div className="text-right">
                            <div className="text-2xl font-bold">Rs {pkg.price.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{pkg.duration} days</div>
                          </div>
                        </div>
                        <ul className="space-y-1">
                          {pkg.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-base font-medium mb-4 block">Payment Method</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="grid gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="payhere" id="payhere" />
                  <Label htmlFor="payhere" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    PayHere (Credit/Debit Card)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="w-4 h-4" />
                    Stripe (International Cards)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Form */}
          {paymentMethod === "payhere" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.cardName}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({ ...prev, cvv: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </form>
          )}

          {/* Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Boost Package:</span>
              <span>{selectedBoost?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Duration:</span>
              <span>{selectedBoost?.duration} days</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>Rs {selectedBoost?.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Pay Rs {selectedBoost?.price.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 