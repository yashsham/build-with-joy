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

    // Generate a 4-digit OTP code
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

    const textbeeApiKey = process.env.TEXTBEE_API_KEY;
    const textbeeDeviceId = process.env.TEXTBEE_DEVICE_ID;

    let smsSent = false;
    let smsError = "";

    // Send real SMS if TextBee keys are present
    if (textbeeApiKey && textbeeDeviceId) {
      try {
        const response = await fetch(`https://api.textbee.dev/api/v1/gateway/devices/${textbeeDeviceId}/send-sms`, {
          method: "POST",
          headers: {
            "x-api-key": textbeeApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipients: [`+91${phone}`],
            message: `Your Hermosa verification code is ${otpCode}. Valid for 5 minutes.`,
          }),
        });

        if (response.ok) {
          smsSent = true;
          console.log(`[TextBee SMS] Sent OTP ${otpCode} to +91${phone}`);
        } else {
          const errData = await response.json();
          smsError = errData.message || "TextBee API failure";
          console.error("[TextBee SMS Error]:", errData);
        }
      } catch (err: any) {
        smsError = err.message || "Failed to call TextBee API";
        console.error("[TextBee SMS Exception]:", err);
      }
    }

    if (smsSent) {
      // Secure response: do not expose the OTP code in frontend response
      return NextResponse.json({ success: true });
    } else {
      // Mock mode fallback if keys are missing or gateway fails
      if (textbeeApiKey || textbeeDeviceId) {
        console.warn(`[SMS Gateway Failed] Falling back to Mock Mode. Error: ${smsError}`);
      } else {
        console.log(`[SMS Mock Mode] Sent OTP ${otpCode} to +91 ${phone}`);
      }
      return NextResponse.json({ success: true, mockOtp: otpCode, gatewayError: smsError });
    }
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
