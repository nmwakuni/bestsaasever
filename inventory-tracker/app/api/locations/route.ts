import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { locations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLocations = await db
      .select()
      .from(locations)
      .where(eq(locations.userId, session.user.id));

    return NextResponse.json({ locations: userLocations });
  } catch (error: any) {
    console.error("Get locations error:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, isDefault } = body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await db
        .update(locations)
        .set({ isDefault: false })
        .where(eq(locations.userId, session.user.id));
    }

    const [location] = await db
      .insert(locations)
      .values({
        userId: session.user.id,
        name,
        address,
        isDefault: isDefault || false,
      })
      .returning();

    return NextResponse.json({ location, success: true });
  } catch (error: any) {
    console.error("Create location error:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
