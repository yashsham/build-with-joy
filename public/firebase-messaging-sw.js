// Firebase Cloud Messaging Service Worker
// This file must be at /public/firebase-messaging-sw.js (served at root)
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAN0-RkZR1dY6rlNeNmga2QQ2QHxBW39ks",
  authDomain: "hermosa-e3979.firebaseapp.com",
  projectId: "hermosa-e3979",
  storageBucket: "hermosa-e3979.firebasestorage.app",
  messagingSenderId: "908886029552",
  appId: "1:908886029552:web:3b4adcfddaacf7f34d7e35",
  measurementId: "G-MZ3G8H82RB",
});

const messaging = firebase.messaging();

// Handle background push messages (when app is closed or not in focus)
messaging.onBackgroundMessage(function (payload) {
  console.log("[FCM SW] Received background message:", payload);

  const notificationTitle = payload.notification?.title || "Hermosa Alert";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification.",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-96x96.png",
    vibrate: [200, 100, 200],
    data: payload.data,
    actions: [
      { action: "open", title: "Open Dashboard" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
        for (const client of clientList) {
          if (client.url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
    );
  }
});
