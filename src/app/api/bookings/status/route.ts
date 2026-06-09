import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db/client";
import { bookings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingNumber = searchParams.get("bookingNumber");

    if (!bookingNumber) {
      return NextResponse.json({ error: "bookingNumber query parameter is required" }, { status: 400 });
    }

    const matchedBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.bookingNumber, bookingNumber));

    if (matchedBookings.length === 0) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking: matchedBookings[0] });
  } catch (error: any) {
    console.error("Error checking booking status:", error);
    return NextResponse.json({ error: "Failed to query booking status" }, { status: 500 });
  }
}
