"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { initFCM, onForegroundMessage, initAnalytics } from "@/lib/firebase";

export function useFirebaseNotifications() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Analytics
    initAnalytics().catch(() => {});

    // Register FCM & listen for foreground messages
    const setup = async () => {
      try {
        const token = await initFCM();
        if (token) {
          // Optionally: save this token to DB so server can send targeted pushes
          console.log("[FCM] Registered with token:", token.substring(0, 20) + "...");
        }

        // Show toast for messages received while app is open (foreground)
        await onForegroundMessage((payload) => {
          const title = payload.notification?.title || "Hermosa Alert";
          const body = payload.notification?.body || "You have a new notification.";
          toast(title, {
            description: body,
            duration: 8000,
            icon: "🔔",
          });
        });
      } catch (err) {
        // Silently fail — FCM is non-critical
        console.warn("[FCM] Setup failed (non-critical):", err);
      }
    };

    setup();
  }, []);
}
