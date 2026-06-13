import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { signJWT } from "@/lib/auth.server";

/**
 * POST /api/auth/firebase-verify
 *
 * Accepts a Firebase ID token after phone OTP OR email/password auth.
 * Verifies it via Google Identity Toolkit REST API, then finds or creates
 * the user in our DB and sets a secure JWT session cookie.
 *
 * Body: { idToken: string, displayName?: string }
 */
export async function POST(request: Request) {
  try {
    const { idToken, displayName, phone } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "Firebase ID token is required" }, { status: 400 });
    }

    // ── Step 1: Verify token via Google Identity Toolkit ──────────────────
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const verifyRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!verifyRes.ok) {
      const errData = await verifyRes.json().catch(() => ({}));
      console.error("[Firebase Verify] Token verification failed:", errData);
      return NextResponse.json({ error: "Invalid or expired Firebase token" }, { status: 401 });
    }

    const verifyData = await verifyRes.json();
    const firebaseUser = verifyData.users?.[0];

    if (!firebaseUser) {
      return NextResponse.json({ error: "Firebase user not found" }, { status: 401 });
    }

    // ── Step 2: Determine auth method and extract identifiers ─────────────
    const rawPhone: string = firebaseUser.phoneNumber || "";
    const firebaseEmail: string = firebaseUser.email || "";
    const firebaseDisplayName: string = displayName || firebaseUser.displayName || "";

    let localPhone = "";
    let userEmail = "";
    let userName = "";

    if (rawPhone) {
      // Phone OTP user
      localPhone = rawPhone.startsWith("+91") ? rawPhone.slice(3) : rawPhone.replace(/^\+/, "");
      userEmail = `guest-${localPhone}@hermosaluxe.com`;
      userName = firebaseDisplayName || `Hermosa Guest ${localPhone.slice(-4)}`;
    } else if (firebaseEmail) {
      // Email/password user
      userEmail = firebaseEmail;
      userName = firebaseDisplayName || firebaseEmail.split("@")[0];
      localPhone = phone ? (phone.startsWith("+91") ? phone.slice(3) : phone.replace(/^\+/, "")) : "";
    } else {
      return NextResponse.json({ error: "No phone or email on this account" }, { status: 400 });
    }

    // ── Step 3: Find or create user in our database ───────────────────────
    const conditions = [];
    if (localPhone) conditions.push(eq(users.phone, localPhone));
    if (userEmail) conditions.push(eq(users.email, userEmail));

    const existingUsers = conditions.length > 0
      ? await db.select().from(users).where(or(...conditions)).limit(1)
      : [];

    let user;
    if (existingUsers.length > 0) {
      user = existingUsers[0];
      // Update name if we now have a real display name
      if (displayName && user.name !== displayName) {
        await db.update(users).set({ name: displayName }).where(eq(users.id, user.id));
        user = { ...user, name: displayName };
      }
      console.log(`[Firebase Auth] Existing user signed in: ${user.name}`);
    } else {
      const uniqueSuffix = Date.now().toString() + Math.floor(Math.random() * 1000).toString();
      const newUser = await db.insert(users).values({
        name: userName,
        phone: localPhone || `no-phone-${uniqueSuffix}`,
        email: userEmail,
        role: "customer",
      }).returning();
      user = newUser[0];
      console.log(`[Firebase Auth] New user created: ${user.name}`);
    }

    // ── Step 4: Issue JWT session cookie ──────────────────────────────────
    const sessionToken = await signJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user });
    response.cookies.set({
      name: "hermosa_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    console.error("[Firebase Verify] Error:", error);
    return NextResponse.json({ error: "Authentication failed. Please try again." }, { status: 500 });
  }
}
