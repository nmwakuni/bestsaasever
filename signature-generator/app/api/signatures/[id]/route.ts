import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { signatures } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// PUT /api/signatures/[id] - Update signature
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signatureId = parseInt(params.id);
    const body = await request.json();

    // Verify ownership
    const [existing] = await db
      .select()
      .from(signatures)
      .where(
        and(
          eq(signatures.id, signatureId),
          eq(signatures.userId, session.user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Signature not found" }, { status: 404 });
    }

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await db
        .update(signatures)
        .set({ isDefault: false })
        .where(eq(signatures.userId, session.user.id));
    }

    const [updated] = await db
      .update(signatures)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(signatures.id, signatureId))
      .returning();

    return NextResponse.json({ signature: updated, success: true });
  } catch (error: any) {
    console.error("Update signature error:", error);
    return NextResponse.json({ error: "Failed to update signature" }, { status: 500 });
  }
}

// DELETE /api/signatures/[id] - Delete signature
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const signatureId = parseInt(params.id);

    // Verify ownership
    const [existing] = await db
      .select()
      .from(signatures)
      .where(
        and(
          eq(signatures.id, signatureId),
          eq(signatures.userId, session.user.id)
        )
      )
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "Signature not found" }, { status: 404 });
    }

    await db.delete(signatures).where(eq(signatures.id, signatureId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete signature error:", error);
    return NextResponse.json({ error: "Failed to delete signature" }, { status: 500 });
  }
}
