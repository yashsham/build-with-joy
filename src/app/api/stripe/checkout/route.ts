import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key", {
  apiVersion: "2024-04-10" as any, // standard api version
});

export async function POST(request: Request) {
  try {
    const { bookingId, bookingNumber, items, totalAmount } = await request.json();

    if (!bookingId || !bookingNumber || !items || !totalAmount) {
      return NextResponse.json({ error: "Missing required details for payment" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || "http://localhost:8080";

    // Map cart items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          description: "Hermosa Luxe Home Service",
        },
        unit_amount: Math.round((item.discountPrice || item.price) * 100), // convert to paise
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
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
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating Stripe session:", error);
    return NextResponse.json({ error: "Failed to initiate payment session" }, { status: 500 });
  }
}
