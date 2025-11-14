"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Package,
  Plus,
  AlertTriangle,
  TrendingUp,
  LogOut,
  MapPin,
  Tag,
  BarChart3,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string | null;
  totalQuantity: number;
  reorderLevel: number;
  costPrice: string | null;
  sellPrice: string | null;
  unit: string | null;
}

interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  totalValue: number;
  locationsCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockCount: 0,
    totalValue: 0,
    locationsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session) {
      fetchData();
    }
  }, [session, isPending, router]);

  const fetchData = async () => {
    try {
      const [productsRes, locationsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/locations"),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        const prods = data.products || [];
        setProducts(prods);

        // Calculate stats
        const lowStock = prods.filter(
          (p: Product) => p.totalQuantity <= p.reorderLevel
        ).length;

        const totalValue = prods.reduce((sum: number, p: Product) => {
          const cost = parseFloat(p.costPrice || "0");
          return sum + cost * p.totalQuantity;
        }, 0);

        setStats((prev) => ({
          ...prev,
          totalProducts: prods.length,
          lowStockCount: lowStock,
          totalValue,
        }));
      }

      if (locationsRes.ok) {
        const data = await locationsRes.json();
        setStats((prev) => ({
          ...prev,
          locationsCount: data.locations?.length || 0,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter((p) => p.totalQuantity <= p.reorderLevel);

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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">InventoryEase</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/dashboard/products">
                <Button variant="ghost">Products</Button>
              </Link>
              <Link href="/dashboard/locations">
                <Button variant="ghost">Locations</Button>
              </Link>
            </nav>
            <div className="text-sm text-right hidden md:block">
              <p className="font-medium">{session.user.name || session.user.email}</p>
              <p className="text-muted-foreground text-xs">Free Plan</p>
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
        <div className="max-w-7xl mx-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session.user.name?.split(" ")[0] || "there"}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your inventory today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">Active in inventory</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</div>
                <p className="text-xs text-muted-foreground">Need reordering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {stats.totalValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total stock value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Locations</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.locationsCount}</div>
                <p className="text-xs text-muted-foreground">Warehouses</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/products/new">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Add Product</h3>
                    <p className="text-sm text-muted-foreground">Create new inventory item</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/locations/new">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Add Location</h3>
                    <p className="text-sm text-muted-foreground">Create warehouse/store</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/categories/new">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Tag className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Add Category</h3>
                    <p className="text-sm text-muted-foreground">Organize products</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <Card className="mb-8 border-yellow-200 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <CardTitle>Low Stock Alerts</CardTitle>
                </div>
                <CardDescription>
                  {lowStockProducts.length} product{lowStockProducts.length !== 1 ? "s" : ""} need reordering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          SKU: {product.sku || "N/A"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-700">
                          {product.totalQuantity} {product.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reorder at: {product.reorderLevel}
                        </p>
                      </div>
                    </div>
                  ))}
                  {lowStockProducts.length > 5 && (
                    <Link href="/dashboard/products?filter=lowstock">
                      <Button variant="outline" className="w-full mt-2">
                        View All {lowStockProducts.length} Items
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Products</CardTitle>
                <CardDescription>Your latest inventory items</CardDescription>
              </div>
              <Link href="/dashboard/products">
                <Button>View All Products</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start by adding your first product to the inventory
                  </p>
                  <Link href="/dashboard/products/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {products.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {product.totalQuantity} {product.unit}
                        </p>
                        {product.sellPrice && (
                          <p className="text-sm text-muted-foreground">
                            KES {parseFloat(product.sellPrice).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
