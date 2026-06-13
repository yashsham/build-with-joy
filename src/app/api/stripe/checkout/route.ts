import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db/client";
import { bookings, bookingItems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth.server";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(request: Request) {
  try {
    // 1. Authenticate session
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized session. Please sign in." }, { status: 401 });
    }

    const { bookingId, bookingNumber } = await request.json();

    if (!bookingId || !bookingNumber) {
      return NextResponse.json({ error: "Missing required details for payment" }, { status: 400 });
    }

    // 2. Fetch booking and line items from database (never trust client payload amounts)
    const bookingRecord = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.id, bookingId),
          eq(bookings.userId, sessionUser.id)
        )
      )
      .limit(1);

    if (bookingRecord.length === 0) {
      return NextResponse.json({ error: "Booking not found or access denied." }, { status: 404 });
    }

    const booking = bookingRecord[0];

    const dbItems = await db
      .select()
      .from(bookingItems)
      .where(eq(bookingItems.bookingId, booking.id));

    if (dbItems.length === 0) {
      return NextResponse.json({ error: "No services found in booking." }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:8080";

    // Map database items to Stripe line items
    const lineItems = dbItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: "Hermosa Luxe Home Service",
        },
        unit_amount: Math.round(item.price * 100), // convert to paise
      },
      quantity: item.quantity || 1,
    }));

    const sessionConfig: any = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      client_reference_id: bookingId,
      metadata: {
        bookingId: bookingId,
        bookingNumber: bookingNumber,
      },
      success_url: `${origin}/booking/success?bookingNumber=${bookingNumber}&paid=true`,
      cancel_url: `${origin}/booking?cancelled=true`,
    };

    // Apply discount securely using a Stripe Coupon if applicable
    if (booking.discountAmount && booking.discountAmount > 0) {
      try {
        const coupon = await stripe.coupons.create({
          amount_off: Math.round(booking.discountAmount * 100),
          currency: "inr",
          duration: "once",
        });
        sessionConfig.discounts = [{ coupon: coupon.id }];
      } catch (couponError) {
        console.error("[Stripe Checkout] Failed to apply coupon discount:", couponError);
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: "Failed to initiate payment session" }, { status: 500 });
  }
}
