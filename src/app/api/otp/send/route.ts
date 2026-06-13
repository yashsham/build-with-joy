import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { otps } from "@/lib/db/schema";
import { addMinutes } from "date-fns";
import crypto from "node:crypto";
import { sendSMS } from "@/lib/notifications.server";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || !/^\d{10}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid 10-digit phone number" }, { status: 400 });
    }

    // Generate a secure 4-digit OTP code
    const otpCode = crypto.randomInt(1000, 10000).toString();
    const expiresAt = addMinutes(new Date(), 5);

    // Save to DB
    await db.insert(otps).values({
      phone,
      otp: otpCode,
      expiresAt,
      verified: false,
      attempts: 0,
    });

    // Send OTP via SMS
    const { success, isMock, gatewayError } = await sendSMS(
      `91${phone}`,
      `Your Hermosa verification code is ${otpCode}. Valid for 5 minutes.`
    );

    if (success) {
      // Secure response: do not expose the OTP code in frontend response
      return NextResponse.json({ success: true, isMock: false });
    } else {
      return NextResponse.json({ 
        success: true, 
        mockOtp: otpCode, 
        gatewayError,
        isMock 
      });
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
