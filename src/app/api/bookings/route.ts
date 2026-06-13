import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { bookings, bookingItems, addresses, services, promoCodes, users } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth.server";
import { sendSMS, sendEmail, sendTelegram } from "@/lib/notifications.server";

export async function POST(request: Request) {
  try {
    // 1. Authenticate user from secure JWT cookie
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: "Unauthorized session. Please sign in." }, { status: 401 });
    }
    const userId = sessionUser.id;

    const { items, address, scheduledAt, paymentMethod, promoCode, notes } = await request.json();

    if (!items || items.length === 0 || !address || !scheduledAt || !paymentMethod) {
      return NextResponse.json({ error: "Missing required booking details" }, { status: 400 });
    }

    // Parse date safely
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
        console.error("Failed to parse scheduledAt date:", e);
        parsedDate = new Date();
      }
    }

    // 2. Perform checkout calculations inside a secure database transaction
    const result = await db.transaction(async (tx) => {
      // Fetch authentic service records from DB to prevent pricing manipulation
      const serviceIds = items.map((item: any) => item.id);
      const dbServices = await tx
        .select()
        .from(services)
        .where(inArray(services.id, serviceIds));

      if (dbServices.length !== serviceIds.length) {
        throw new Error("One or more selected services are invalid.");
      }

      // Calculate true server-side subtotal
      let calculatedSubtotal = 0;
      for (const item of items) {
        const dbSvc = dbServices.find((s) => s.id === item.id);
        if (!dbSvc || !dbSvc.isActive) {
          throw new Error(`Service ${item.name} is no longer active.`);
        }
        const activePrice = dbSvc.discountPrice || dbSvc.price;
        calculatedSubtotal += activePrice * item.quantity;
      }

      // Validate promo code
      let discountAmount = 0;
      let appliedPromo = null;

      if (promoCode) {
        const codeRecord = await tx
          .select()
          .from(promoCodes)
          .where(eq(promoCodes.code, promoCode.toUpperCase()))
          .limit(1);

        if (codeRecord.length > 0) {
          const promo = codeRecord[0];
          const now = new Date();
          const isExpired = promo.expiresAt && now > promo.expiresAt;
          const underMinValue = promo.minOrderValue && calculatedSubtotal < promo.minOrderValue;
          const reachedMaxUses = promo.maxUses && promo.usedCount && promo.usedCount >= promo.maxUses;

          if (promo.isActive && !isExpired && !underMinValue && !reachedMaxUses) {
            appliedPromo = promo.code;
            if (promo.discountType === "percentage") {
              discountAmount = Math.round((calculatedSubtotal * promo.discountValue) / 100);
            } else {
              discountAmount = promo.discountValue;
            }
            discountAmount = Math.min(discountAmount, calculatedSubtotal);

            // Increment used count
            await tx
              .update(promoCodes)
              .set({ usedCount: (promo.usedCount || 0) + 1 })
              .where(eq(promoCodes.id, promo.id));
          }
        }
      }

      const totalAmount = Math.max(0, calculatedSubtotal - discountAmount);

      // If user's phone in DB is empty, default, or starts with no-phone, update it with the contact phone
      const dbUsers = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
      if (dbUsers.length > 0) {
        const existingPhone = dbUsers[0].phone;
        if (!existingPhone || existingPhone === "" || existingPhone.startsWith("no-phone")) {
          // Verify if the number is already taken to avoid crash due to UNIQUE constraint
          const phoneConflict = await tx.select().from(users).where(eq(users.phone, address.phone)).limit(1);
          if (phoneConflict.length === 0) {
            await tx.update(users).set({ phone: address.phone }).where(eq(users.id, userId));
          }
        }
      }

      // Create address record
      const newAddress = await tx.insert(addresses).values({
        userId,
        line1: address.line1,
        line2: address.line2 || "",
        city: address.city || "Bareilly",
        pincode: address.pincode,
        isDefault: true,
      }).returning();

      const addressId = newAddress[0].id;

      // Generate custom booking number
      const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString();
      const bookingNumber = `HRM-2026-${randomSuffix}`;

      // Create booking record
      const newBooking = await tx.insert(bookings).values({
        bookingNumber,
        userId,
        addressId,
        scheduledAt: parsedDate,
        status: paymentMethod === "cash" ? "confirmed" : "pending",
        totalAmount,
        discountAmount,
        paymentStatus: paymentMethod === "cash" ? "cash_on_service" : "pending",
        promoCode: appliedPromo,
        notes: notes || "",
      }).returning();

      const booking = newBooking[0];

      // Batch insert booking items
      const itemsToInsert = items.map((item: any) => {
        const dbSvc = dbServices.find((s) => s.id === item.id)!;
        const snapPrice = dbSvc.discountPrice || dbSvc.price;
        return {
          bookingId: booking.id,
          serviceId: item.id,
          quantity: item.quantity,
          price: snapPrice,
          name: dbSvc.name,
        };
      });

      await tx.insert(bookingItems).values(itemsToInsert);

      return booking;
    });

    console.log(`[BOOKING SUCCESS] Created transaction booking ${result.bookingNumber} for user ${userId}`);

    // Notify Hermosa Admin via Email & SMS in background (non-blocking)
    const adminSmsText = `Hermosa Booking Alert: New booking ${result.bookingNumber} created by ${sessionUser.name} (${address.phone || sessionUser.phone}) for ₹${result.totalAmount} scheduled at ${result.scheduledAt.toLocaleString()}.`;
    const emailSubject = `New Hermosa Booking Alert: ${result.bookingNumber}`;
    const emailText = `Dear Hermosa Admin,

A new booking has been created successfully!

Booking Details:
- Booking Number: ${result.bookingNumber}
- Total Amount: ₹${result.totalAmount}
- Scheduled Time: ${result.scheduledAt.toString()}
- Notes: ${result.notes || "None"}

Customer Info:
- Name: ${sessionUser.name}
- Phone: ${address.phone || sessionUser.phone}
- Email: ${sessionUser.email}

Please check your admin dashboard for full details.

Best regards,
Hermosa Luxe Automation`;

    sendSMS("917248253329", adminSmsText).catch((err) => console.error("Admin SMS failed:", err));
    sendEmail("hermosasalon325@gmail.com", emailSubject, emailText).catch((err) => console.error("Admin Email failed:", err));
    sendTelegram(adminSmsText).catch((err) => console.error("Telegram Alert failed:", err));

    return NextResponse.json({ success: true, booking: result });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ error: error.message || "Failed to create booking" }, { status: 500 });
  }
}
