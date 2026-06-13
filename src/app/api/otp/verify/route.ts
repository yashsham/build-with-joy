import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { otps, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { signJWT } from "@/lib/auth.server";

export async function POST(request: Request) {
  try {
    const { phone, otp, newsletterConsent } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    // Get the latest unverified OTP for this phone
    const existingOtp = await db
      .select()
      .from(otps)
      .where(
        and(
          eq(otps.phone, phone),
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

    // Check if OTP matches
    if (matchedOtp.otp !== otp) {
      const currentAttempts = (matchedOtp.attempts || 0) + 1;

      if (currentAttempts >= 3) {
        // Burn OTP after too many attempts
        await db.update(otps)
          .set({ verified: true, attempts: currentAttempts })
          .where(eq(otps.id, matchedOtp.id));
        return NextResponse.json({ error: "Too many failed attempts. This OTP is now invalid." }, { status: 400 });
      }

      // Increment attempts
      await db.update(otps)
        .set({ attempts: currentAttempts })
        .where(eq(otps.id, matchedOtp.id));

      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 });
    }

    // Mark as verified on success
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

    // Create session token
    const sessionToken = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "hermosa_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
