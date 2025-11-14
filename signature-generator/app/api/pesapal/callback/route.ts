import { NextRequest, NextResponse } from "next/server";
import { pesapal } from "@/lib/pesapal";
import { db } from "@/lib/db";
import { transactions, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { OrderTrackingId, OrderMerchantReference } = body;

    if (!OrderTrackingId) {
      return NextResponse.json({ error: "Missing OrderTrackingId" }, { status: 400 });
    }

    // Get transaction status from Pesapal
    const status = await pesapal.getTransactionStatus(OrderTrackingId);

    // Find transaction in database
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.pesapalTransactionId, OrderTrackingId))
      .limit(1);

    if (!transaction) {
      console.error("Transaction not found:", OrderTrackingId);
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update transaction status
    const paymentStatus =
      status.status === 1
        ? "completed"
        : status.status === 2
        ? "failed"
        : status.status === 3
        ? "cancelled"
        : "pending";

    await db
      .update(transactions)
      .set({
        status: paymentStatus,
        paymentMethod: status.paymentMethod,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, transaction.id));

    // If payment completed, create or update subscription
    if (status.status === 1) {
      const tier = (transaction.metadata as any)?.tier || "pro";
      const endDate = tier === "business" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null; // 30 days for business

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          userId: transaction.userId,
          tier,
          status: "active",
          pesapalTransactionId: OrderTrackingId,
          pesapalOrderId: OrderMerchantReference,
          amount: transaction.amount,
          currency: transaction.currency,
          startDate: new Date(),
          endDate,
        })
        .returning();

      // Update transaction with subscription ID
      await db
        .update(transactions)
        .set({ subscriptionId: subscription.id })
        .where(eq(transactions.id, transaction.id));
    }

    return NextResponse.json({ success: true, status: paymentStatus });
  } catch (error: any) {
    console.error("Pesapal callback error:", error);
    return NextResponse.json(
      { error: error.message || "Callback processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests for browser redirects
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderTrackingId = searchParams.get("OrderTrackingId");

  if (!orderTrackingId) {
    return NextResponse.redirect(
      new URL("/dashboard?payment=error", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }

  try {
    const status = await pesapal.getTransactionStatus(orderTrackingId);

    if (status.status === 1) {
      return NextResponse.redirect(
        new URL("/dashboard?payment=success", process.env.NEXT_PUBLIC_APP_URL!)
      );
    } else if (status.status === 2) {
      return NextResponse.redirect(
        new URL("/dashboard?payment=failed", process.env.NEXT_PUBLIC_APP_URL!)
      );
    } else {
      return NextResponse.redirect(
        new URL("/dashboard?payment=pending", process.env.NEXT_PUBLIC_APP_URL!)
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?payment=error", process.env.NEXT_PUBLIC_APP_URL!)
    );
  }
}
