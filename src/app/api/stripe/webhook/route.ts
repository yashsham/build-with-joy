import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key", {
  apiVersion: "2024-04-10" as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: any;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // Dev mode: parse body directly without verification if webhook secret is not set
      event = JSON.parse(body);
      console.log("[Stripe Webhook] Received unverified event in dev mode:", event.type);
    }
  } catch (err: any) {
    console.error(`[Stripe Webhook Error] Invalid signature/event: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the completed checkout session event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const bookingId = session.client_reference_id || session.metadata?.bookingId;
    const paymentId = typeof session.payment_intent === "string" ? session.payment_intent : session.id;

    if (bookingId) {
      try {
        console.log(`[Stripe Webhook] Successful payment for booking ${bookingId}. Updating status to confirmed/paid.`);
        
        await db.update(bookings)
          .set({
            status: "confirmed",
            paymentStatus: "paid",
            paymentId: paymentId,
          })
          .where(eq(bookings.id, bookingId));
          
      } catch (dbError) {
        console.error("[Stripe Webhook] Database update error:", dbError);
        return NextResponse.json({ error: "Failed to update booking status" }, { status: 500 });
      }
    } else {
      console.warn("[Stripe Webhook] No bookingId found in session reference/metadata.");
    }
  }

  return NextResponse.json({ received: true });
}
