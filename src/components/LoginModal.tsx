"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import { X, ShieldCheck, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, setUser } = useApp();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(true);

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        toast.success(`OTP sent successfully! ${data.mockOtp ? `(Mock OTP: ${data.mockOtp})` : ""}`);
      } else {
        toast.error(data.error || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(otpCode)) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpCode, newsletterConsent }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name || "Valued Customer"}!`);
        setIsLoginModalOpen(false);
        setOtpSent(false);
        setPhone("");
        setOtpCode("");
      } else {
        toast.error(data.error || "Incorrect OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(201,168,76,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow lines */}
        <div className="absolute -left-16 -top-16 -z-10 h-36 w-36 rounded-full bg-gold-600/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 -z-10 h-36 w-36 rounded-full bg-gold-600/10 blur-3xl" />

        <button 
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold-600/30 bg-gold-600/5 text-gold-600 shadow-[0_0_15px_rgba(201,168,76,0.1)]">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="font-heading text-2xl text-white">
            {otpSent ? "Verify Mobile" : "Welcome to Hermosa"}
          </h3>
          <p className="mt-1 text-sm text-white/50">
            {otpSent ? `Enter the code sent to +91 ${phone}` : "Log in or sign up to manage bookings"}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle">Mobile Number</label>
              <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden focus-within:border-gold-600/50 transition">
                <div className="flex flex-col items-center justify-center px-4 border-r border-white/10 text-[10px] font-bold leading-tight bg-white/5 text-white/70 min-w-[64px]">
                  <span className="text-white/40 text-[9px] uppercase tracking-wider">IN</span>
                  <span className="text-white mt-0.5">+91</span>
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="\d{10}"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent px-4 py-3.5 text-white placeholder:text-white/20 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <button
                type="button"
                id="newsletter"
                onClick={() => setNewsletterConsent(!newsletterConsent)}
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all ${
                  newsletterConsent 
                    ? "border-gold-600 bg-gold-600 text-dark" 
                    : "border-white/20 bg-transparent text-transparent"
                }`}
              >
                <Check className="h-3 w-3 stroke-[3]" />
              </button>
              <label 
                onClick={() => setNewsletterConsent(!newsletterConsent)}
                className="text-xs text-white/50 leading-relaxed cursor-pointer select-none hover:text-white/70 transition"
              >
                Receive booking updates, luxury beauty insights, and exclusive gold-member offers on WhatsApp & Email.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || phone.length !== 10}
              className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-[var(--shadow-gold-sm)] transition"
            >
              {isSubmitting ? "Sending OTP..." : "CONTINUE"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block text-center">Enter OTP Code</label>
              <div className="relative flex justify-center gap-3 py-2">
                {/* Hidden input to capture code */}
                <input
                  type="tel"
                  maxLength={4}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full z-10"
                  autoFocus
                />
                {/* 4 premium digit boxes */}
                {[0, 1, 2, 3].map((index) => {
                  const digit = otpCode[index] || "";
                  const isActive = otpCode.length === index || (otpCode.length === 4 && index === 3);
                  return (
                    <div
                      key={index}
                      className={`w-12 h-14 rounded-xl border flex items-center justify-center text-xl font-bold font-mono transition-all ${
                        isActive 
                          ? "border-gold-600 bg-gold-600/5 shadow-[0_0_10px_rgba(201,168,76,0.2)] text-white" 
                          : digit 
                            ? "border-white/20 bg-white/5 text-white" 
                            : "border-white/10 bg-white/5 text-white/30"
                      }`}
                    >
                      {digit}
                      {isActive && otpCode.length === index && (
                        <span className="w-0.5 h-6 bg-gold-600 animate-pulse absolute" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-white/40 hover:text-white transition"
              >
                Change Number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-gold-600 hover:text-gold-400 font-medium transition"
              >
                Resend Code
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || otpCode.length < 4}
              className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-[var(--shadow-gold-sm)] transition"
            >
              {isSubmitting ? "Verifying..." : "VERIFY & SIGN IN"}
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-white/30 luxe-subtitle">
          <ShieldCheck className="h-4 w-4 text-gold-600/50" />
          SECURE 256-BIT SSL ENCRYPTED CONNECTION
        </div>
      </div>
    </div>
  );
}
