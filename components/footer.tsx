import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Smartphone, Download } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl gradient-text">ClassifiedHub</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Sri Lanka's most advanced classified ads platform with AI-powered search and real-time features.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/how-it-works" className="block text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="/safety-tips" className="block text-muted-foreground hover:text-primary transition-colors">
                Safety Tips
              </Link>
              <Link href="/pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/blog" className="block text-muted-foreground hover:text-primary transition-colors">
                Blog
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="/help" className="block text-muted-foreground hover:text-primary transition-colors">
                Help Center
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/report" className="block text-muted-foreground hover:text-primary transition-colors">
                Report Ad
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact & App */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@classifiedhub.lk</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Download Our App</h4>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Smartphone className="h-4 w-4 mr-2" />
                <Download className="h-4 w-4 mr-2" />
                Install PWA
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Newsletter */}
        <div className="text-center mb-8">
          <h3 className="font-semibold mb-2">Stay Updated</h3>
          <p className="text-muted-foreground mb-4">Get the latest deals and updates delivered to your inbox</p>
          <div className="flex max-w-md mx-auto">
            <Input placeholder="Enter your email" className="rounded-r-none" />
            <Button className="rounded-l-none">Subscribe</Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>© 2024 ClassifiedHub. All rights reserved.</div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span>Made with ❤️ in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
