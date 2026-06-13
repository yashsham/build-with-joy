import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

import { db } from "@/lib/db/client";
import { bookings, bookingItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth.server";

export async function GET(request: Request) {
  try {
    // 1. Authenticate user session
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized session. Please sign in." }, { status: 401 });
    }

    let targetUserId = sessionUser.id;
    
    // Allow admin roles to query other users if explicitly requested
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get("userId");
    if (sessionUser.role === "admin" && queryUserId) {
      targetUserId = queryUserId;
    }

    // 2. Fetch bookings associated with this user
    const userBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userId, targetUserId))
      .orderBy(bookings.createdAt);

    // 3. Fetch booking items for each booking
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
