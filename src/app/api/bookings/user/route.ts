import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db/client";
import { bookings, bookingItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    // 1. Fetch bookings
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(bookings.createdAt);

    // 2. Fetch booking items for each booking
    const bookingsWithItems = [];
    for (const bk of userBookings) {
      const items = await db
        .select()
        .from(bookingItems)
        .where(eq(bookingItems.bookingId, bk.id));

      bookingsWithItems.push({
        ...bk,
        items,
      });
    }

    return NextResponse.json({ success: true, bookings: bookingsWithItems });
  } catch (error: any) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
