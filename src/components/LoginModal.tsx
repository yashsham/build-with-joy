"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import { X, ShieldCheck, Mail, Lock, User, KeyRound, Phone } from "lucide-react";
import { toast } from "sonner";

type EmailMode = "signin" | "signup" | "forgot";

export default function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, setUser } = useApp();
  
  // Email Auth State
  const [emailMode, setEmailMode] = useState<EmailMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Auto-open if ?login=true in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("login") === "true") {
        setIsLoginModalOpen(true);
        const rd = params.get("redirect");
        if (rd) setRedirectPath(rd);
        params.delete("login");
        params.delete("redirect");
        const newSearch = params.toString();
        window.history.replaceState({}, "", window.location.pathname + (newSearch ? `?${newSearch}` : ""));
      }
    }
  }, [setIsLoginModalOpen]);

  if (!isLoginModalOpen) return null;

  // ── Email & Password Authentication ────────────────────────────────
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { registerWithEmail, loginWithEmail, resetPassword: fbResetPassword } = await import("@/lib/firebase");

      if (emailMode === "forgot") {
        await fbResetPassword(email);
        toast.success("Password reset link sent to your email!");
        setEmailMode("signin");
        setIsSubmitting(false);
        return;
      }

      let idToken = "";
      let displayName = "";
      let userPhone = "";

      if (emailMode === "signup") {
        if (!fullName.trim()) {
          toast.error("Please enter your full name.");
          setIsSubmitting(false);
          return;
        }
        if (!/^\d{10}$/.test(phone)) {
          toast.error("Please enter a valid 10-digit mobile number.");
          setIsSubmitting(false);
          return;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          toast.error("Passwords do not match.");
          setIsSubmitting(false);
          return;
        }
        
        displayName = fullName.trim();
        userPhone = phone;
        const registerResult = await registerWithEmail(email, password, displayName);
        idToken = registerResult.idToken;
      } else {
        // Sign in mode
        if (!password) {
          toast.error("Please enter your password.");
          setIsSubmitting(false);
          return;
        }
        const loginResult = await loginWithEmail(email, password);
        idToken = loginResult.idToken;
        displayName = loginResult.displayName;
      }

      // Exchange Firebase ID Token for local session JWT
      const res = await fetch("/api/auth/firebase-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, displayName, phone: userPhone }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast.success(`Welcome, ${data.user.name || "User"}! You're signed in.`);
        handleClose();
        if (redirectPath) window.location.href = redirectPath;
      } else {
        toast.error(data.error || "Authentication failed. Please try again.");
      }
    } catch (err: any) {
      console.error("[Firebase Email Auth Error]:", err);
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered. Please sign in instead.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email address format.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        toast.error("Incorrect email or password. Please try again.");
      } else {
        toast.error("Failed to authenticate. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsLoginModalOpen(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setEmailMode("signin");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(201,168,76,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glows */}
        <div className="absolute -left-16 -top-16 -z-10 h-36 w-36 rounded-full bg-gold-600/10 blur-3xl" />
        <div className="absolute -right-16 -bottom-16 -z-10 h-36 w-36 rounded-full bg-gold-600/10 blur-3xl" />

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="/hermosa-logo.png"
            alt="Hermosa Logo"
            className="h-16 w-16 mx-auto object-contain mb-4 filter drop-shadow-[0_2px_10px_rgba(201,168,76,0.25)] animate-pulse"
          />
          <h3 className="font-heading text-2xl text-white">
            {emailMode === "forgot" 
              ? "Reset Password" 
              : emailMode === "signup"
              ? "Create Account"
              : "Welcome to Hermosa"}
          </h3>
          <p className="mt-1 text-sm text-white/50">
            {emailMode === "forgot"
              ? "Enter your email to receive a password reset link"
              : "Log in or sign up to manage bookings"}
          </p>
        </div>

        {/* ── EMAIL & PASSWORD FORM ── */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Full Name (Sign Up only) */}
          {emailMode === "signup" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">
                Full Name
              </label>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-gold-600/50 transition">
                <User className="h-4 w-4 text-white/30 mr-3" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent py-3.5 text-white placeholder:text-white/20 outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Mobile Number (Sign Up only) */}
          {emailMode === "signup" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden focus-within:border-gold-600/50 transition">
                <div className="flex items-center justify-center px-4 border-r border-white/10 text-xs font-bold bg-white/5 text-white/50 min-w-[50px]">
                  +91
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
          )}

          {/* Email Address */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">
              Email Address
            </label>
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-gold-600/50 transition">
              <Mail className="h-4 w-4 text-white/30 mr-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3.5 text-white placeholder:text-white/20 outline-none text-sm"
              />
            </div>
          </div>

          {/* Password (Sign In & Sign Up only) */}
          {emailMode !== "forgot" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">
                Password
              </label>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-gold-600/50 transition">
                <Lock className="h-4 w-4 text-white/30 mr-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent py-3.5 text-white placeholder:text-white/20 outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {emailMode === "signup" && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">
                Confirm Password
              </label>
              <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 focus-within:border-gold-600/50 transition">
                <Lock className="h-4 w-4 text-white/30 mr-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent py-3.5 text-white placeholder:text-white/20 outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Helper links (Forgot password, etc.) */}
          <div className="flex items-center justify-between text-xs pt-1">
            {emailMode === "signin" ? (
              <>
                <button
                  type="button"
                  onClick={() => setEmailMode("forgot")}
                  className="text-white/40 hover:text-white transition flex items-center gap-1"
                >
                  <KeyRound className="h-3 w-3" />
                  Forgot Password?
                </button>
                <button
                  type="button"
                  onClick={() => setEmailMode("signup")}
                  className="text-gold-600 hover:text-gold-400 font-medium transition"
                >
                  Create an Account
                </button>
              </>
            ) : emailMode === "signup" ? (
              <>
                <span className="text-white/40">Already have an account?</span>
                <button
                  type="button"
                  onClick={() => setEmailMode("signin")}
                  className="text-gold-600 hover:text-gold-400 font-medium transition"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setEmailMode("signin")}
                  className="text-white/40 hover:text-white transition"
                >
                  Back to Sign In
                </button>
              </>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-2 rounded-xl bg-gold-gradient text-dark font-bold hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-[var(--shadow-gold-sm)] transition"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-dark border-t-transparent" />
                Processing...
              </span>
            ) : emailMode === "signin" ? (
              "SIGN IN"
            ) : emailMode === "signup" ? (
              "CREATE ACCOUNT"
            ) : (
              "SEND RESET LINK"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-white/30 luxe-subtitle">
          <ShieldCheck className="h-4 w-4 text-gold-600/50" />
          POWERED BY GOOGLE FIREBASE · 256-BIT SSL
        </div>
      </div>
    </div>
  );
}
