import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { bookings, bookingItems, addresses } from "@/lib/db/schema";

export async function POST(request: Request) {
  try {
    const { userId, items, address, scheduledAt, paymentMethod, totalAmount } = await request.json();

    if (!userId || !items || !address || !scheduledAt) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // 1. Create or retrieve address record
    const newAddress = await db.insert(addresses).values({
      userId,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      pincode: address.pincode,
      isDefault: true,
    }).returning();

    const addressId = newAddress[0].id;

    // 2. Generate custom booking number HRM-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
    const bookingNumber = `HRM-2026-${randomSuffix}`;

    // 3. Create booking record
    let parsedDate = new Date(scheduledAt);
    if (isNaN(parsedDate.getTime())) {
      try {
        const [datePart, timePart] = scheduledAt.split('T');
        const [hourStr, minStrWithPeriod] = timePart.split(':');
        const minutes = parseInt(minStrWithPeriod.substring(0, 2));
        const period = minStrWithPeriod.substring(2).toUpperCase();
        let hours = parseInt(hourStr);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        parsedDate = new Date(datePart);
        parsedDate.setHours(hours, minutes, 0, 0);
      } catch (e) {
        console.error("Failed to manually parse scheduledAt:", e);
        parsedDate = new Date();
      }
    }

    const newBooking = await db.insert(bookings).values({
      bookingNumber,
      userId,
      addressId,
      scheduledAt: parsedDate,
      status: paymentMethod === "cash" ? "confirmed" : "pending",
      totalAmount,
      discountAmount: 0,
      paymentStatus: paymentMethod === "cash" ? "cash_on_service" : "pending",
    }).returning();

    const booking = newBooking[0];

    // 4. Create booking items
    for (const item of items) {
      await db.insert(bookingItems).values({
        bookingId: booking.id,
        serviceId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      });
    }

    console.log(`[BOOKING CREATED] Successful booking ${bookingNumber} for user ${userId}`);

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
