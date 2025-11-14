import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="font-bold text-xl">SignaturePro</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-sm hover:text-primary">Features</Link>
            <Link href="#pricing" className="text-sm hover:text-primary">Pricing</Link>
          </nav>
          <Link href="/create">
            <Button>Create Signature</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Professional email signatures in minutes
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Create Beautiful Email Signatures That Convert
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stand out in every inbox. Build professional email signatures with social links,
            custom branding, and click tracking — no design skills required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Examples
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • Free forever
          </p>
        </div>
      </section>

      {/* Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="bg-slate-50 rounded-lg p-6 border">
                <div className="bg-white rounded p-4">
                  <p className="text-sm text-muted-foreground mb-4">Example signature:</p>
                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-bold text-lg">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Senior Product Designer</p>
                    <p className="text-sm text-muted-foreground">Acme Corporation</p>
                    <div className="mt-3 flex gap-3">
                      <span className="text-sm">📧 sarah@acme.com</span>
                      <span className="text-sm">📱 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features for professionals and businesses
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Zap className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Create your signature in under 2 minutes with our intuitive builder
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Mail className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Works Everywhere</h3>
                <p className="text-muted-foreground">
                  Compatible with Gmail, Outlook, Apple Mail, and more
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-bold text-xl mb-2">Beautiful Templates</h3>
                <p className="text-muted-foreground">
                  Choose from professionally designed templates or customize your own
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
              Why Choose SignaturePro?
            </h2>
            <div className="space-y-6">
              {[
                "Stand out in crowded inboxes with professional design",
                "Increase click-through rates on your social profiles",
                "Save time with pre-built templates",
                "Track signature performance with analytics",
                "Maintain brand consistency across your team",
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>1 signature</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Basic templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Social media links</span>
                  </li>
                </ul>
                <Link href="/create">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary shadow-lg">
              <CardContent className="p-8">
                <div className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold mb-2">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Unlimited signatures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>All premium templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Custom branding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Click tracking analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full">Upgrade to Pro</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to elevate your email game?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals using SignaturePro
          </p>
          <Link href="/create">
            <Button size="lg" variant="secondary">
              Create Your Signature Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span className="font-semibold">SignaturePro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SignaturePro. All rights reserved.
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
