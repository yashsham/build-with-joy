import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users, professionals } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendSMS, sendTelegram } from "@/lib/notifications.server";

export async function POST(request: Request) {
  try {
    const { name, phone, city, experience, category } = await request.json();

    if (!name || !phone || !city) {
      return NextResponse.json({ error: "Name, phone, and city are required" }, { status: 400 });
    }

    // Check if user exists, if not, create one as professional role
    let userList = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    let userId;

    if (userList.length === 0) {
      const newUser = await db.insert(users).values({
        name,
        phone,
        email: `partner-${phone}@hermosaluxe.com`,
        role: "professional",
      }).returning();
      userId = newUser[0].id;
    } else {
      userId = userList[0].id;
      // Upgrade role to professional
      await db.update(users).set({ role: "professional" }).where(eq(users.id, userId));
    }

    // Create professional record
    await db.insert(professionals).values({
      userId,
      bio: `Professional partner specializing in ${category} in ${city}`,
      experience: parseInt(experience) || 1,
      rating: 4.8,
      totalReviews: 1,
      isVerified: false,
      isActive: true,
      cities: JSON.stringify([city]),
      services: JSON.stringify([]),
    });

    console.log(`[PARTNER ONBOARDING] Application submitted by ${name} (${phone}) for ${city}`);

    // 1. Send SMS alert to Hermosa Admin
    const partnerMessage = `Hermosa Partner Alert: New application from ${name} (${phone}), Specialty: ${category}, Exp: ${experience} years.`;
    try {
      await sendSMS("917248253329", partnerMessage);
    } catch (err) {
      console.error("[Partner SMS Error]:", err);
    }

    try {
      await sendTelegram(partnerMessage);
    } catch (err) {
      console.error("[Partner Telegram Error]:", err);
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
          _subject: `New Partner Application: ${name}`,
          Name: name,
          Phone: phone,
          City: city,
          Experience: `${experience} Years`,
          Category: category,
          SubmittedAt: new Date().toISOString(),
        }),
      });
      const data = await response.json().catch(() => ({}));
      console.log("[FormSubmit Partners Response]:", data);
    } catch (err) {
      console.error("[FormSubmit Error]:", err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error registering professional:", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
