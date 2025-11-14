import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { signatures } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/signatures - Fetch user's signatures
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userSignatures = await db
      .select()
      .from(signatures)
      .where(eq(signatures.userId, session.user.id))
      .orderBy(desc(signatures.updatedAt));

    return NextResponse.json({ signatures: userSignatures });
  } catch (error: any) {
    console.error("Get signatures error:", error);
    return NextResponse.json({ error: "Failed to fetch signatures" }, { status: 500 });
  }
}

// POST /api/signatures - Create new signature
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
      name,
      fullName,
      jobTitle,
      company,
      email,
      phone,
      website,
      address,
      linkedin,
      twitter,
      instagram,
      facebook,
      github,
      template,
      customColors,
      logoUrl,
      profilePhotoUrl,
      qrCodeData,
      includeQrCode,
      isDefault,
    } = body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await db
        .update(signatures)
        .set({ isDefault: false })
        .where(eq(signatures.userId, session.user.id));
    }

    const [signature] = await db
      .insert(signatures)
      .values({
        userId: session.user.id,
        name: name || "My Signature",
        fullName,
        jobTitle,
        company,
        email,
        phone,
        website,
        address,
        linkedin,
        twitter,
        instagram,
        facebook,
        github,
        template: template || "modern",
        customColors,
        logoUrl,
        profilePhotoUrl,
        qrCodeData,
        includeQrCode: includeQrCode || false,
        isDefault: isDefault || false,
      })
      .returning();

    return NextResponse.json({ signature, success: true });
  } catch (error: any) {
    console.error("Create signature error:", error);
    return NextResponse.json({ error: "Failed to create signature" }, { status: 500 });
  }
}
