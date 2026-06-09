import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { otps, users } from "@/lib/db/schema";
import { eq, and, desc, gt } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { phone, otp, newsletterConsent } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // Check for matching valid OTP
    const existingOtp = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.phone, phone),
          eq(otps.otp, otp),
          eq(otps.verified, false)
        )
      )
      .orderBy(desc(otps.expiresAt))
      .limit(1);

    if (existingOtp.length === 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const matchedOtp = existingOtp[0];

    // Check expiry
    if (new Date() > matchedOtp.expiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Mark as verified
    await db.update(otps).set({ verified: true }).where(eq(otps.id, matchedOtp.id));

    // Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.phone, phone))
      .limit(1);

    let user;
    if (existingUser.length > 0) {
      user = existingUser[0];
    } else {
      // Create new user
      const guestName = `Hermosa Guest ${phone.slice(-4)}`;
      const guestEmail = `guest-${phone}@hermosaluxe.com`;
      const newUser = await db.insert(users).values({
        name: guestName,
        phone,
        email: guestEmail,
        role: "customer",
      }).returning();

      user = newUser[0];
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
