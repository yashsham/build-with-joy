import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  ConfirmationResult,
} from "firebase/auth";
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from "firebase/messaging";

import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  off,
  serverTimestamp,
  query,
  orderByChild,
  limitToLast,
  DataSnapshot,
} from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyAN0-RkZR1dY6rlNeNmga2QQ2QHxBW39ks",
  authDomain: "hermosa-e3979.firebaseapp.com",
  databaseURL: "https://hermosa-e3979-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hermosa-e3979",
  storageBucket: "hermosa-e3979.firebasestorage.app",
  messagingSenderId: "908886029552",
  appId: "1:908886029552:web:3b4adcfddaacf7f34d7e35",
  measurementId: "G-MZ3G8H82RB",
};

// Initialize Firebase app (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export { app };

// Firebase Auth (singleton)
export function getFirebaseAuth() {
  return getAuth(app);
}

// Firebase Realtime Database (singleton)
export function getFirebaseDb() {
  return getDatabase(app);
}

// ─── Phone Auth ─────────────────────────────────────────────────────────────

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Creates (or reuses) an invisible reCAPTCHA verifier anchored to `buttonId`.
 * Clears the old one first to avoid duplicate reCAPTCHA iframes.
 */
export function createRecaptchaVerifier(buttonId: string): RecaptchaVerifier {
  const auth = getFirebaseAuth();

  // Destroy previous verifier if it exists
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (_) {}
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
    callback: () => {
      console.log("[reCAPTCHA] Solved invisibly");
    },
    "expired-callback": () => {
      console.warn("[reCAPTCHA] Challenge expired");
    },
  });

  return recaptchaVerifier;
}

/**
 * Sends a Firebase OTP to the given E.164-formatted phone number.
 * Returns the ConfirmationResult needed to verify the code.
 */
export async function sendFirebaseOtp(
  phoneE164: string,
  buttonId: string
): Promise<ConfirmationResult> {
  const auth = getFirebaseAuth();
  auth.languageCode = "en";

  const verifier = createRecaptchaVerifier(buttonId);
  const confirmationResult = await signInWithPhoneNumber(auth, phoneE164, verifier);
  return confirmationResult;
}

/**
 * Confirms the OTP entered by the user.
 * Returns the Firebase ID token on success.
 */
export async function confirmFirebaseOtp(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<{ idToken: string; phone: string }> {
  const result = await confirmationResult.confirm(code);
  const idToken = await result.user.getIdToken();
  const phone = result.user.phoneNumber || "";
  return { idToken, phone };
}

// ─── Email / Password Auth ────────────────────────────────────────────────

/**
 * Creates a new Firebase user with email + password, sets their display name,
 * and returns the ID token for our backend to verify.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ idToken: string; email: string }> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // Set the display name so our backend can store it
  await updateProfile(credential.user, { displayName: name });
  const idToken = await credential.user.getIdToken();
  return { idToken, email: credential.user.email || email };
}

/**
 * Signs in an existing Firebase user with email + password.
 * Returns the ID token for our backend to verify.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ idToken: string; email: string; displayName: string }> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await credential.user.getIdToken();
  return {
    idToken,
    email: credential.user.email || email,
    displayName: credential.user.displayName || "",
  };
}

/**
 * Sends a password reset email to the given address.
 */
export async function resetPassword(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email);
}

// ─── Analytics ────────────────────────────────────────────────────────────


export async function initAnalytics() {
  if (typeof window !== "undefined" && (await isSupported())) {
    return getAnalytics(app);
  }
  return null;
}

// ─── FCM Messaging ────────────────────────────────────────────────────────

export async function initFCM(): Promise<string | null> {
  try {
    const supported = typeof window !== "undefined" && (await isMessagingSupported());
    if (!supported) return null;

    const messaging = getMessaging(app);
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, { vapidKey });
    if (token) {
      console.log("[FCM] Token registered:", token.substring(0, 20) + "...");
      return token;
    }
    return null;
  } catch (err) {
    console.error("[FCM] Error initializing:", err);
    return null;
  }
}

export async function onForegroundMessage(callback: (payload: any) => void) {
  try {
    const supported = typeof window !== "undefined" && (await isMessagingSupported());
    if (!supported) return;
    const messaging = getMessaging(app);
    onMessage(messaging, callback);
  } catch (err) {
    console.error("[FCM] onMessage error:", err);
  }
}

// ─── Realtime Database ────────────────────────────────────────────────────

export interface BookingAlert {
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  services: string;
  totalAmount: number;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  paymentMethod: string;
  timestamp: object | number;
  read: boolean;
}

/**
 * Writes a new booking alert to Firebase RTDB under /bookingAlerts.
 * Admin dashboard listens to this path for instant notifications.
 */
export async function pushBookingAlert(alert: Omit<BookingAlert, "timestamp" | "read">) {
  try {
    const db = getFirebaseDb();
    const alertsRef = ref(db, "bookingAlerts");
    await push(alertsRef, {
      ...alert,
      timestamp: serverTimestamp(),
      read: false,
    });
    console.log("[RTDB] Booking alert pushed:", alert.bookingNumber);
  } catch (err) {
    console.error("[RTDB] Failed to push booking alert:", err);
  }
}

/**
 * Subscribes to the latest booking alerts in real time.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function subscribeToBookingAlerts(
  callback: (alerts: (BookingAlert & { id: string })[]) => void,
  limit = 20
): () => void {
  const db = getFirebaseDb();
  const alertsQuery = query(
    ref(db, "bookingAlerts"),
    orderByChild("timestamp"),
    limitToLast(limit)
  );

  const handler = (snapshot: DataSnapshot) => {
    const alerts: (BookingAlert & { id: string })[] = [];
    snapshot.forEach((child) => {
      alerts.push({ id: child.key!, ...(child.val() as BookingAlert) });
    });
    callback(alerts.reverse()); // Newest first
  };

  onValue(alertsQuery, handler);
  return () => off(alertsQuery, "value", handler);
}

/**
 * Marks a specific booking alert as read in RTDB.
 */
export async function markAlertRead(alertId: string) {
  try {
    const db = getFirebaseDb();
    await set(ref(db, `bookingAlerts/${alertId}/read`), true);
  } catch (err) {
    console.error("[RTDB] Failed to mark alert read:", err);
  }
}

