"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Star,
  Copy,
  Crown,
  LogOut,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface Signature {
  id: number;
  name: string;
  fullName: string;
  jobTitle: string | null;
  company: string | null;
  template: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Subscription {
  tier: string;
  status: string;
  endDate?: Date;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session) {
      fetchData();
    }
  }, [session, isPending, router]);

  const fetchData = async () => {
    try {
      const [signaturesRes, subscriptionRes] = await Promise.all([
        fetch("/api/signatures"),
        fetch("/api/subscription"),
      ]);

      if (signaturesRes.ok) {
        const data = await signaturesRes.json();
        setSignatures(data.signatures || []);
      }

      if (subscriptionRes.ok) {
        const data = await subscriptionRes.json();
        setSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this signature?")) return;

    try {
      const res = await fetch(`/api/signatures/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setSignatures(signatures.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete signature:", error);
      alert("Failed to delete signature");
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const res = await fetch(`/api/signatures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });

      if (res.ok) {
        fetchData(); // Refresh to update UI
      }
    } catch (error) {
      console.error("Failed to set default:", error);
      alert("Failed to set as default");
    }
  };

  const handleUpgrade = async (tier: "pro" | "business") => {
    setPaymentLoading(true);

    try {
      const res = await fetch("/api/pesapal/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          email: session?.user?.email,
          firstName: session?.user?.name?.split(" ")[0] || "",
          lastName: session?.user?.name?.split(" ")[1] || "",
        }),
      });

      const data = await res.json();

      if (data.success && data.redirectUrl) {
        // Redirect to Pesapal payment page
        window.location.href = data.redirectUrl;
      } else {
        alert("Failed to initiate payment");
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert("Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const canCreateSignature = () => {
    if (subscription?.tier === "free") {
      return signatures.length < 1;
    }
    return true; // Pro and Business have unlimited
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const tier = subscription?.tier || "free";
  const isFree = tier === "free";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="font-bold text-xl">SignaturePro</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden md:block">
              <p className="font-medium">{session.user.name || session.user.email}</p>
              <p className="text-muted-foreground capitalize">
                {tier === "free" ? "Free Plan" : `${tier} Plan`}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                signOut();
                router.push("/");
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Manage your email signatures and subscription
            </p>
          </div>

          {/* Subscription Status Card */}
          {isFree && (
            <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-xl font-bold">Upgrade to Pro</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Unlock unlimited signatures, premium templates, and more!
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Unlimited signatures
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Premium templates
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Custom branding
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        Analytics
                      </span>
                    </div>
                    <Button onClick={() => setShowUpgrade(!showUpgrade)}>
                      <Crown className="mr-2 h-4 w-4" />
                      View Upgrade Options
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upgrade Options */}
          {showUpgrade && (
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>Pro</CardTitle>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                      POPULAR
                    </span>
                  </div>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">KES 999</span>
                    <span className="text-muted-foreground"> one-time</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Unlimited signatures
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      All premium templates
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Custom colors & branding
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Logo upload
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Basic analytics
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("pro")}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? "Processing..." : "Upgrade to Pro"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Business</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-foreground">KES 4,999</span>
                    <span className="text-muted-foreground"> /month</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Everything in Pro
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Team management (10 users)
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      Custom templates
                    </li>
                  </ul>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleUpgrade("business")}
                    disabled={paymentLoading}
                  >
                    {paymentLoading ? "Processing..." : "Upgrade to Business"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Signatures Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Signatures</h2>
            {canCreateSignature() ? (
              <Link href="/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New
                </Button>
              </Link>
            ) : (
              <Button disabled>
                <Plus className="mr-2 h-4 w-4" />
                Create New (Upgrade for more)
              </Button>
            )}
          </div>

          {signatures.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No signatures yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first professional email signature
                </p>
                <Link href="/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Signature
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signatures.map((sig) => (
                <Card key={sig.id} className={sig.isDefault ? "border-2 border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {sig.name}
                          {sig.isDefault && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {sig.fullName}
                          {sig.jobTitle && ` • ${sig.jobTitle}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Template: <span className="capitalize font-medium">{sig.template}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/create?edit=${sig.id}`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        {!sig.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSetDefault(sig.id)}
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(sig.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Limit Warning for Free Users */}
          {isFree && signatures.length >= 1 && (
            <Card className="mt-6 border-yellow-200 bg-yellow-50">
              <CardContent className="p-4 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Free plan limit reached</p>
                  <p className="text-sm text-yellow-700">
                    You've used your 1 free signature. Upgrade to Pro for unlimited signatures!
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
