import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pesapal } from "@/lib/pesapal";
import { db } from "@/lib/db";
import { transactions, subscriptions } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated session
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tier, email, phone, firstName, lastName } = body;

    // Define pricing
    const pricing: Record<string, { amount: number; description: string }> = {
      pro: {
        amount: 999, // KES 999 (adjust as needed)
        description: "SignaturePro - Pro Plan (One-time payment)",
      },
      business: {
        amount: 4999, // KES 4999/month
        description: "SignaturePro - Business Plan (Monthly subscription)",
      },
    };

    if (!pricing[tier]) {
      return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
    }

    const { amount, description } = pricing[tier];

    // Register IPN (Instant Payment Notification) URL if not already registered
    // In production, store this IPN ID in environment variables
    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/pesapal/callback`;
    const notificationId = process.env.PESAPAL_IPN_ID || (await pesapal.registerIPN(ipnUrl));

    // Submit order to Pesapal
    const order = await pesapal.submitOrder({
      userId: session.user.id,
      amount,
      currency: "KES",
      description,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancellationUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=cancelled`,
      notificationId,
      billingAddress: {
        email_address: email || session.user.email,
        phone_number: phone,
        first_name: firstName,
        last_name: lastName,
        country_code: "KE",
      },
    });

    // Create transaction record
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId: session.user.id,
        pesapalTransactionId: order.orderTrackingId,
        pesapalOrderId: order.merchantReference,
        amount,
        currency: "KES",
        status: "pending",
        description,
        metadata: { tier },
      })
      .returning();

    return NextResponse.json({
      success: true,
      redirectUrl: order.redirectUrl,
      orderTrackingId: order.orderTrackingId,
    });
  } catch (error: any) {
    console.error("Pesapal initiate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
