"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Check, ShieldCheck, Clock, Calendar, ArrowRight, Loader2, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Booking {
  id: string;
  bookingNumber: string;
  scheduledAt: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
}

function SuccessCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingNumber = searchParams.get("bookingNumber");

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!bookingNumber) {
      setError(true);
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 30; // 60 seconds max polling

    async function checkStatus() {
      try {
        const res = await fetch(`/api/bookings/status?bookingNumber=${bookingNumber}`);
        if (res.ok) {
          const data = await res.json();
          const bk = data.booking;
          setBooking(bk);
          setLoading(false);

          if (bk.paymentStatus === "paid" || bk.status === "confirmed") {
            setIsVerifying(false);
            clearInterval(pollInterval);
            toast.success("Payment verified successfully!");
          }
        } else {
          attempts++;
          if (attempts >= maxAttempts) {
            clearInterval(pollInterval);
            setLoading(false);
            setIsVerifying(false);
            toast.error("Payment verification timed out. Please check your profile.");
          }
        }
      } catch (err) {
        console.error("Error polling status:", err);
      }
    }

    checkStatus();
    const pollInterval = setInterval(checkStatus, 2000);

    return () => clearInterval(pollInterval);
  }, [bookingNumber]);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h2 className="font-heading text-3xl text-red-500">Invalid Session</h2>
          <p className="text-xs text-white/50">We couldn't find a valid booking reference.</p>
          <Link href="/" className="inline-block px-6 py-2.5 rounded-full bg-gold-gradient text-dark font-bold text-xs">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-6 pt-28">
        <AnimatePresence mode="wait">
          {isVerifying ? (
            /* VERIFYING STATE */
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-600/5 text-gold-600 border border-gold-600/20">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-2xl text-white">Verifying Secure Payment</h2>
                <p className="text-xs text-white/40 leading-relaxed">
                  We are confirming your transaction with Stripe. Please do not close or reload this window.
                </p>
              </div>
              {bookingNumber && (
                <div className="text-[10px] text-white/30 uppercase tracking-widest luxe-subtitle">
                  Ref: {bookingNumber}
                </div>
              )}
            </motion.div>
          ) : (
            /* SUCCESS CONFIRMED STATE */
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(201,168,76,0.15)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20">
                <Check className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-3xl text-white">Booking Confirmed!</h2>
                <p className="text-xs text-white/50 luxe-subtitle tracking-widest">
                  Booking ID: {bookingNumber}
                </p>
              </div>

              {booking && (
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-left text-xs space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/40">Appointment Date</span>
                    <span className="font-semibold text-white">
                      {new Date(booking.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Appointment Time</span>
                    <span className="font-semibold text-white">
                      {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-white/5 pt-3">
                    <span className="text-white/40">Total Amount Paid</span>
                    <span className="font-bold text-gold-600">₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Payment Provider</span>
                    <span className="text-white/70 flex items-center gap-1 font-semibold">
                      <CreditCard className="w-3.5 h-3.5 text-gold-600" /> Stripe Card / UPI
                    </span>
                  </div>
                </div>
              )}

              <div className="rounded-xl bg-gold-600/5 border border-gold-600/10 p-4 text-[10px] text-gold-600 flex items-center gap-2 text-left">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>Our background-verified beauty artist will arrive 10 mins before your scheduled slot.</span>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/profile"
                  className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold text-xs flex items-center justify-center gap-1.5 shadow-[var(--shadow-gold-sm)]"
                >
                  TRACK BOOKINGS <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  className="w-full text-center text-xs text-white/40 hover:text-white transition font-medium"
                >
                  Back to Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-gold-600" />
      </div>
    }>
      <SuccessCatalog />
    </React.Suspense>
  );
}
