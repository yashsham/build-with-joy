import { db } from "@/lib/db/client";
import { reviews, users, bookings, addresses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        userName: users.name,
        userAvatar: users.avatar,
        area: addresses.line1,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(bookings, eq(reviews.bookingId, bookings.id))
      .innerJoin(addresses, eq(bookings.addressId, addresses.id))
      .where(eq(reviews.isApproved, true));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
