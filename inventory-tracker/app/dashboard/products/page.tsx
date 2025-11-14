"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Search, Plus, Edit, Trash2, AlertCircle, Filter } from "lucide-react";

interface Product {
  id: number;
  name: string;
  sku: string | null;
  barcode: string | null;
  costPrice: string | null;
  sellPrice: string | null;
  unit: string;
  reorderLevel: number;
  categoryId: number | null;
  description: string | null;
  totalQuantity: number;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showLowStock, setShowLowStock] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return null;
    const category = categories.find((c) => c.id === categoryId);
    return category;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory
      ? product.categoryId?.toString() === selectedCategory
      : true;

    const matchesLowStock = showLowStock
      ? product.totalQuantity <= product.reorderLevel
      : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const lowStockCount = products.filter((p) => p.totalQuantity <= p.reorderLevel).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/dashboard" className="text-muted-foreground hover:text-primary">
                Dashboard
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold">Products</span>
            </div>
            <h1 className="text-3xl font-bold">All Products</h1>
            <p className="text-muted-foreground mt-1">
              Manage your inventory and track stock levels
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/products/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, SKU, or barcode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLowStock}
                    onChange={(e) => setShowLowStock(e.target.checked)}
                    className="h-4 w-4 rounded"
                  />
                  <span className="text-sm">Low Stock Only</span>
                  {lowStockCount > 0 && (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      {lowStockCount}
                    </span>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || selectedCategory || showLowStock
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedCategory || showLowStock
                  ? "Try adjusting your filters"
                  : "Get started by adding your first product"}
              </p>
              {!searchQuery && !selectedCategory && !showLowStock && (
                <Button onClick={() => router.push("/dashboard/products/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              const category = getCategoryName(product.categoryId);
              const isLowStock = product.totalQuantity <= product.reorderLevel;
              const profit =
                product.sellPrice && product.costPrice
                  ? parseFloat(product.sellPrice) - parseFloat(product.costPrice)
                  : null;

              return (
                <Card key={product.id} className={isLowStock ? "border-yellow-400" : ""}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              {category && (
                                <span
                                  className="px-2 py-0.5 text-xs rounded-full text-white"
                                  style={{ backgroundColor: category.color }}
                                >
                                  {category.name}
                                </span>
                              )}
                              {isLowStock && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                  <AlertCircle className="h-3 w-3" />
                                  Low Stock
                                </span>
                              )}
                            </div>

                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {product.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                              {product.sku && (
                                <div>
                                  <p className="text-xs text-muted-foreground">SKU</p>
                                  <p className="text-sm font-medium">{product.sku}</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-muted-foreground">Stock</p>
                                <p className="text-sm font-medium">
                                  {product.totalQuantity} {product.unit}
                                </p>
                              </div>
                              {product.costPrice && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Cost Price</p>
                                  <p className="text-sm font-medium">
                                    KES {parseFloat(product.costPrice).toFixed(2)}
                                  </p>
                                </div>
                              )}
                              {product.sellPrice && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Sell Price</p>
                                  <p className="text-sm font-medium">
                                    KES {parseFloat(product.sellPrice).toFixed(2)}
                                  </p>
                                </div>
                              )}
                              {profit !== null && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Profit/Unit</p>
                                  <p
                                    className={`text-sm font-medium ${
                                      profit > 0 ? "text-green-600" : "text-red-600"
                                    }`}
                                  >
                                    KES {profit.toFixed(2)}
                                  </p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-muted-foreground">Reorder Level</p>
                                <p className="text-sm font-medium">{product.reorderLevel}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id, product.name)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {filteredProducts.length > 0 && (
          <Card className="mt-6">
            <CardContent className="py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </span>
                <span className="text-muted-foreground">
                  Total inventory value: KES{" "}
                  {filteredProducts
                    .reduce((sum, p) => {
                      const cost = parseFloat(p.costPrice || "0");
                      return sum + cost * p.totalQuantity;
                    }, 0)
                    .toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
