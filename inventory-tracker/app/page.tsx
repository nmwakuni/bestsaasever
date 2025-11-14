import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Package,
  BarChart3,
  Smartphone,
  AlertCircle,
  TrendingUp,
  Users,
  Sparkles,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">InventoryEase</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm hover:text-primary">
              Features
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Simple inventory management for small businesses
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Track Your Inventory, Grow Your Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stop losing money on stockouts and overstocking. Manage your inventory in real-time
            with InventoryEase - designed for African small businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial - 50 Products
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <p className="opacity-90">Businesses trust us</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="opacity-90">Accuracy in stock tracking</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30%</div>
              <p className="opacity-90">Average cost savings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Manage Stock
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features built for small business owners
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Package className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Product Management</h3>
                <p className="text-muted-foreground">
                  Add products with SKU, barcode, pricing, and images. Organize with categories.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <BarChart3 className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  See stock levels update instantly. Track across multiple locations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <AlertCircle className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Low Stock Alerts</h3>
                <p className="text-muted-foreground">
                  Get notified before you run out. Set custom reorder levels per product.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Smartphone className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Barcode Scanning</h3>
                <p className="text-muted-foreground">
                  Use your phone camera to scan barcodes. Fast stock in/out operations.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Sales Reports</h3>
                <p className="text-muted-foreground">
                  Track sales, profit margins, and popular products. Export to Excel.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Team Management</h3>
                <p className="text-muted-foreground">
                  Add team members with different access levels. Track who made changes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Built for African Small Businesses
            </h2>
            <div className="space-y-6">
              {[
                "Works offline - sync when internet is back",
                "M-Pesa payments - No credit card needed",
                "Multi-currency support (KES, UGX, TZS)",
                "Barcode scanning with phone camera",
                "SMS alerts for low stock",
                "Export to Excel for your accountant",
                "Available in English & Swahili",
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade as you grow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">KES 0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>50 products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>1 location</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Basic reporting</span>
                  </li>
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Start Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg scale-105">
              <CardContent className="p-8">
                <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold mb-2">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">KES 1,999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>500 products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>3 locations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Barcode scanning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Low stock alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Export to Excel</span>
                  </li>
                </ul>
                <Button className="w-full">Start 14-Day Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Business</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">KES 4,999</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Unlimited products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Unlimited locations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>10 team members</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Inventory?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of African businesses using InventoryEase
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span className="font-semibold">InventoryEase</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 InventoryEase. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="hover:text-primary">Privacy</Link>
              <Link href="/terms" className="hover:text-primary">Terms</Link>
              <Link href="/contact" className="hover:text-primary">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
