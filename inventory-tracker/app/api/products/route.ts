import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, inventory, locations } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";

// GET /api/products - Get all products with inventory levels
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProducts = await db
      .select({
        id: products.id,
        sku: products.sku,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        barcode: products.barcode,
        costPrice: products.costPrice,
        sellPrice: products.sellPrice,
        unit: products.unit,
        reorderLevel: products.reorderLevel,
        imageUrl: products.imageUrl,
        notes: products.notes,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        totalQuantity: sql<number>`COALESCE(SUM(${inventory.quantity}), 0)`,
      })
      .from(products)
      .leftJoin(inventory, eq(products.id, inventory.productId))
      .where(eq(products.userId, session.user.id))
      .groupBy(products.id)
      .orderBy(desc(products.updatedAt));

    return NextResponse.json({ products: userProducts });
  } catch (error: any) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      sku,
      name,
      description,
      categoryId,
      barcode,
      costPrice,
      sellPrice,
      unit,
      reorderLevel,
      imageUrl,
      notes,
      initialQuantity,
      locationId,
    } = body;

    // Create product
    const [product] = await db
      .insert(products)
      .values({
        userId: session.user.id,
        sku,
        name,
        description,
        categoryId: categoryId || null,
        barcode,
        costPrice,
        sellPrice,
        unit: unit || "pcs",
        reorderLevel: reorderLevel || 10,
        imageUrl,
        notes,
      })
      .returning();

    // If initial quantity and location provided, create inventory record
    if (initialQuantity && locationId) {
      await db.insert(inventory).values({
        productId: product.id,
        locationId: parseInt(locationId),
        quantity: parseInt(initialQuantity),
      });
    }

    return NextResponse.json({ product, success: true });
  } catch (error: any) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
