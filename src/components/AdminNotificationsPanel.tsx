"use client";

import { useEffect, useState } from "react";
import { Bell, BellDot, Phone, Calendar, MapPin, CreditCard, X, CheckCheck } from "lucide-react";
import { subscribeToBookingAlerts, markAlertRead, type BookingAlert } from "@/lib/firebase";

type Alert = BookingAlert & { id: string };

export default function AdminNotificationsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [prevIds, setPrevIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = subscribeToBookingAlerts((incoming) => {
      setAlerts(incoming);

      // Count unread
      const unread = incoming.filter((a) => !a.read).length;
      setNewCount(unread);

      // Flash for truly new ones (not seen before this session)
      const incomingIds = new Set(incoming.map((a) => a.id));
      const brandNew = incoming.filter((a) => !prevIds.has(a.id) && !a.read);
      if (brandNew.length > 0 && prevIds.size > 0) {
        // Browser notification for new bookings
        if (Notification.permission === "granted") {
          brandNew.forEach((a) => {
            new Notification(`🔔 New Booking: ${a.bookingNumber}`, {
              body: `${a.customerName} • ₹${a.totalAmount} • ${a.scheduledDate}`,
              icon: "/hermosa-logo.png",
            });
          });
        }
      }
      setPrevIds(incomingIds);
    });

    return unsubscribe;
  }, []);

  const handleMarkRead = async (id: string) => {
    await markAlertRead(id);
  };

  const handleMarkAllRead = async () => {
    const unread = alerts.filter((a) => !a.read);
    await Promise.all(unread.map((a) => markAlertRead(a.id)));
  };

  const formatTime = (ts: any) => {
    if (!ts) return "";
    const d = typeof ts === "number" ? new Date(ts) : new Date();
    return d.toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" });
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 md:bottom-8 md:right-6">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-yellow-500 shadow-[0_4px_20px_rgba(201,168,76,0.5)] hover:scale-105 active:scale-95 transition-transform"
        aria-label="Admin Booking Notifications"
      >
        {newCount > 0 ? (
          <BellDot className="h-6 w-6 text-black animate-[wiggle_0.5s_ease-in-out_infinite]" />
        ) : (
          <Bell className="h-6 w-6 text-black" />
        )}
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
            {newCount > 9 ? "9+" : newCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 max-h-[70vh] flex flex-col rounded-2xl border border-amber-600/30 bg-[#0d0d0d] shadow-[0_0_40px_rgba(201,168,76,0.15)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-amber-950/40 to-black">
            <div>
              <h3 className="text-sm font-bold text-white">Live Booking Alerts</h3>
              <p className="text-[10px] text-white/40">{alerts.length} total · {newCount} unread</p>
            </div>
            <div className="flex items-center gap-2">
              {newCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Alerts List */}
          <div className="overflow-y-auto flex-1 divide-y divide-white/5">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/30">
                <Bell className="h-8 w-8 mb-2" />
                <p className="text-xs">No bookings yet</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 transition hover:bg-white/5 ${!alert.read ? "bg-amber-600/5 border-l-2 border-amber-500" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 luxe-subtitle tracking-widest">
                        #{alert.bookingNumber}
                      </span>
                      <p className="text-sm font-semibold text-white leading-tight">{alert.customerName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-amber-400">₹{alert.totalAmount}</p>
                      <p className="text-[9px] text-white/30">{formatTime(alert.timestamp)}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-amber-600/60 shrink-0" />
                      <span>{alert.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-amber-600/60 shrink-0" />
                      <span>{alert.scheduledDate} · {alert.scheduledTime}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 text-amber-600/60 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{alert.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="h-3 w-3 text-amber-600/60 shrink-0" />
                      <span>{alert.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-[10px] text-white/30 line-clamp-2 border-t border-white/5 pt-2">
                    {alert.services}
                  </div>

                  {!alert.read && (
                    <button
                      onClick={() => handleMarkRead(alert.id)}
                      className="mt-2 text-[10px] text-amber-500 hover:text-amber-300 transition flex items-center gap-1"
                    >
                      <CheckCheck className="h-3 w-3" /> Mark as read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Wiggle keyframe */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
