import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { otps } from "@/lib/db/schema";
import { addMinutes } from "date-fns";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid 10-digit phone number" }, { status: 400 });
    }

    // Generate a 4-digit mock OTP code
    const otpCode = (Math.floor(Math.random() * 9000) + 1000).toString();
    const expiresAt = addMinutes(new Date(), 5);

    // Save to DB
    await db.insert(otps).values({
      phone,
      otp: otpCode,
      expiresAt,
      verified: false,
      attempts: 0,
    });

    console.log(`[SMS MOCK] Sent OTP ${otpCode} to +91 ${phone}`);

    // Return the OTP in response to make testing and review completely effortless for the user!
    return NextResponse.json({ success: true, mockOtp: otpCode });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
