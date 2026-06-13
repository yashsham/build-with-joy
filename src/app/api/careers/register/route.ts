import { NextResponse } from "next/server";
import { sendSMS, sendTelegram } from "@/lib/notifications.server";

export async function POST(request: Request) {
  try {
    const { referType, yourName, yourPhone, friendName, friendPhone, friendRole } = await request.json();

    if (!friendName || !friendPhone || !friendRole) {
      return NextResponse.json({ error: "Candidate name, phone, and specialty are required." }, { status: 400 });
    }

    const isReferral = referType === "partner";

    // 1. Send SMS alert to Hermosa Admin
    const smsMessage = isReferral
      ? `Hermosa Careers Alert: New Referral for ${friendRole}. Candidate: ${friendName} (${friendPhone}). Referred by: ${yourName} (${yourPhone}).`
      : `Hermosa Careers Alert: Direct Application for ${friendRole}. Candidate: ${friendName} (${friendPhone}).`;

    try {
      await sendSMS("917248253329", smsMessage);
    } catch (err) {
      console.error("[Careers SMS Error]:", err);
    }

    try {
      await sendTelegram(smsMessage);
    } catch (err) {
      console.error("[Careers Telegram Error]:", err);
    }

    // 2. Forward details to FormSubmit.co free email service
    try {
      const response = await fetch("https://formsubmit.co/ajax/hermosasalon325@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          _subject: `New Careers Submission: ${isReferral ? "Referral" : "Direct Apply"}`,
          SubmissionType: isReferral ? "Referral" : "Direct Application",
          ReferrerName: yourName || "N/A",
          ReferrerPhone: yourPhone || "N/A",
          CandidateName: friendName,
          CandidatePhone: friendPhone,
          RoleSpecialty: friendRole,
          SubmittedAt: new Date().toISOString(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      console.log("[FormSubmit Careers Response]:", data);
    } catch (err) {
      console.error("[FormSubmit Error]:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing career submission:", error);
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 });
  }
}
