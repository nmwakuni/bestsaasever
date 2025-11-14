"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Package, Save } from "lucide-react";

interface Location {
  id: number;
  name: string;
  address: string | null;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  color: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    costPrice: "",
    sellPrice: "",
    unit: "piece",
    reorderLevel: "10",
    categoryId: "",
    description: "",
    locationId: "",
    initialQuantity: "0",
  });

  useEffect(() => {
    fetchLocationsAndCategories();
  }, []);

  const fetchLocationsAndCategories = async () => {
    try {
      const [locationsRes, categoriesRes] = await Promise.all([
        fetch("/api/locations"),
        fetch("/api/categories"),
      ]);

      if (locationsRes.ok) {
        const locData = await locationsRes.json();
        setLocations(locData.locations || []);
      }

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Product name is required");
      setLoading(false);
      return;
    }

    if (!formData.locationId) {
      setError("Please select a location");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        sellPrice: formData.sellPrice ? parseFloat(formData.sellPrice) : undefined,
        unit: formData.unit,
        reorderLevel: parseInt(formData.reorderLevel),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
        description: formData.description || undefined,
        locationId: parseInt(formData.locationId),
        initialQuantity: parseInt(formData.initialQuantity),
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-3xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product in your inventory</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Product Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g., Wireless Mouse"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      type="text"
                      placeholder="e.g., WM-001"
                      value={formData.sku}
                      onChange={(e) => handleChange("sku", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      type="text"
                      placeholder="e.g., 123456789012"
                      value={formData.barcode}
                      onChange={(e) => handleChange("barcode", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <select
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleChange("unit", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="piece">Piece</option>
                      <option value="box">Box</option>
                      <option value="kg">Kilogram</option>
                      <option value="liter">Liter</option>
                      <option value="meter">Meter</option>
                      <option value="pack">Pack</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {categories.length > 0 ? (
                    <select
                      id="category"
                      value={formData.categoryId}
                      onChange={(e) => handleChange("categoryId", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Select a category (optional)</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No categories yet.{" "}
                      <Link href="/dashboard/categories/new" className="text-primary hover:underline">
                        Create one
                      </Link>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Product description..."
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPrice">Cost Price (KES)</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.costPrice}
                      onChange={(e) => handleChange("costPrice", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">How much you pay for it</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellPrice">Selling Price (KES)</Label>
                    <Input
                      id="sellPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.sellPrice}
                      onChange={(e) => handleChange("sellPrice", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">How much you sell it for</p>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Initial Inventory</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-destructive">*</span>
                    </Label>
                    {locations.length > 0 ? (
                      <select
                        id="location"
                        value={formData.locationId}
                        onChange={(e) => handleChange("locationId", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        <option value="">Select a location</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-destructive">
                        You need to create a location first.{" "}
                        <Link href="/dashboard/locations/new" className="underline">
                          Create one
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialQuantity">Initial Quantity</Label>
                    <Input
                      id="initialQuantity"
                      type="number"
                      min="0"
                      value={formData.initialQuantity}
                      onChange={(e) => handleChange("initialQuantity", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Starting stock at this location</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    min="0"
                    value={formData.reorderLevel}
                    onChange={(e) => handleChange("reorderLevel", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Alert when stock falls below this level
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading || locations.length === 0}>
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
