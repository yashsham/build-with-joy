"use client";

import { useFirebaseNotifications } from "@/hooks/useFirebaseNotifications";

export default function FirebaseProvider() {
  // Activates FCM + Analytics silently in the background
  useFirebaseNotifications();
  return null; // No UI — purely side-effect component
}
