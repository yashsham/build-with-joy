"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChevronLeft, Phone, Mail, Sparkles, Briefcase, HelpCircle, Users, MapPin, Check, MessageCircle, Gift, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "support" | "careers" | null;
  const [activeTab, setActiveTab] = useState<"support" | "careers">("support");
  const router = useRouter();

  // Careers / Referral States
  const [referType, setReferType] = useState<"partner" | "self">("partner");
  const [formStep, setFormStep] = useState<"form" | "success">("form");
  const [yourName, setYourName] = useState("");
  const [yourPhone, setYourPhone] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendPhone, setFriendPhone] = useState("");
  const [friendRole, setFriendRole] = useState("beautician");

  const FORMSUBMIT_EMAIL = "hermosasalon325@gmail.com";

  const handleCareersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const subName = referType === "partner" ? friendName : yourName;
    const subPhone = referType === "partner" ? friendPhone : yourPhone;

    try {
      // 1. Internal API (SMS + DB logging)
      fetch("/api/careers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referType, yourName, yourPhone, friendName: subName, friendPhone: subPhone, friendRole })
      }).catch(() => {});

      // 2. Direct FormSubmit.co POST from the browser (bypasses SMTP, free email delivery)
      const formData = new FormData();
      formData.append("_subject", `Hermosa Careers: ${referType === "partner" ? "New Referral" : "Direct Application"}`);
      formData.append("_captcha", "false");
      formData.append("_template", "table");
      formData.append("Submission Type", referType === "partner" ? "Referral" : "Direct Application");
      formData.append("Candidate Name", subName);
      formData.append("Candidate Phone", subPhone);
      formData.append("Specialty / Role", friendRole);
      if (referType === "partner") {
        formData.append("Referred By", yourName || "N/A");
        formData.append("Referrer Phone", yourPhone || "N/A");
      }
      formData.append("Submitted At", new Date().toLocaleString("en-IN"));
      await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: "POST",
        body: formData,
      });

      toast.success("Application submitted! We'll reach out within 24 hours.");
    } catch (err) {
      console.error(err);
      toast.success("Application received! We'll reach out within 24 hours.");
    }

    const newSubmission = {
      type: referType, yourName, yourPhone,
      friendName: subName, friendPhone: subPhone, friendRole,
      date: new Date().toLocaleDateString(), status: "Pending Review"
    };
    const existing = JSON.parse(localStorage.getItem("hermosa_careers") || "[]");
    localStorage.setItem("hermosa_careers", JSON.stringify([newSubmission, ...existing]));
    setFormStep("success");
  };

  const PHONE = "+91 72482 53329";
  const EMAIL = "hermosasalon325@gmail.com";

  useEffect(() => {
    if (tabParam === "careers" || tabParam === "support") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32">
        {/* Page Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-6 mb-8">
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 hover:border-gold-600/50 hover:bg-gold-600/10 text-white hover:text-gold-600 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-heading text-2xl md:text-3xl text-white">Contact Us</h1>
        </div>

        {/* Visual Banner Card */}
        <div className="relative rounded-3xl overflow-hidden border border-gold-600/20 bg-gradient-to-r from-amber-950/20 via-black to-black p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_50px_rgba(201,168,76,0.05)]">
          <div className="space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[10px] text-gold-600 luxe-subtitle font-bold">
              <Sparkles className="w-3 h-3" /> LUXURY HOME SERVICE SUPPORT
            </span>
            <h2 className="font-heading text-2xl md:text-3xl text-white leading-tight">
              We're Here <br />
              <span className="text-gradient-gold italic">To Serve You</span>
            </h2>
            <p className="text-xs text-white/50 max-w-sm leading-relaxed">
              Have questions, feedback, or looking to join our professional beauty squad? Let's connect.
            </p>
          </div>
          <div className="relative h-36 w-36 md:h-40 md:w-40 flex items-center justify-center rounded-full bg-gold-600/5 border border-gold-600/15">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.1),transparent_70%)] animate-pulse" />
            <img src="/hermosa-logo.png" alt="Hermosa Logo" className="w-20 h-20 object-contain filter drop-shadow-[0_2px_10px_rgba(201,168,76,0.2)]" />
          </div>
        </div>

        {/* Tabs Control */}
        <div className="flex bg-[#0a0a0a] border border-white/5 rounded-2xl p-1.5 mb-8">
          <button
            onClick={() => setActiveTab("support")}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider luxe-subtitle transition-all flex items-center justify-center gap-2 ${
              activeTab === "support"
                ? "bg-gold-gradient text-dark shadow-[var(--shadow-gold-sm)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Help Support
          </button>
          <button
            onClick={() => setActiveTab("careers")}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider luxe-subtitle transition-all flex items-center justify-center gap-2 ${
              activeTab === "careers"
                ? "bg-gold-gradient text-dark shadow-[var(--shadow-gold-sm)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Briefcase className="w-4 h-4" /> Careers
          </button>
        </div>

        {/* Tab Contents */}
        <div className="rounded-3xl border border-white/5 bg-[#070707] p-8 shadow-lg">
          {activeTab === "support" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading text-xl text-white">Need Help?</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Have queries or concerns about your home salon booking? Connect with us here!
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <a
                  href="https://wa.me/917248253329?text=Hi%20Hermosa,%20I%20have%20a%20question%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:border-gold-600/30 transition duration-300 group"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">WHATSAPP US</span>
                  <span className="text-sm text-gold-600 font-semibold mt-1">{PHONE}</span>
                </a>

                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hermosasalon325@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:border-gold-600/30 transition duration-300 group"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">MAIL US</span>
                  <span className="text-xs text-gold-600 font-semibold mt-2 break-all">{EMAIL}</span>
                </a>

                <a
                  href="https://www.google.com/maps/place/28%C2%B023'01.0%22N+79%C2%B025'26.1%22E/@28.3836079,79.4213448,17z/data=!3m1!4b1!4m4!3m3!8m2!3d28.3836079!4d79.4239197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:border-gold-600/30 transition duration-300 group"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">VISIT SALON</span>
                  <span className="text-[11px] text-gold-600 font-semibold mt-2 leading-snug">Bareilly, UP, India</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading text-xl text-white">Join Our Team / Refer a Partner</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  We are always looking for passionate beauty professionals to join our premium squad, or you can refer an expert and earn up to ₹10,000!
                </p>
              </div>

              {formStep === "form" ? (
                <div className="space-y-5 pt-2">
                  {/* Option Switcher */}
                  <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setReferType("partner")}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider luxe-subtitle transition-all ${
                        referType === "partner"
                          ? "bg-gold-gradient text-dark font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Refer a Professional
                    </button>
                    <button
                      type="button"
                      onClick={() => setReferType("self")}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider luxe-subtitle transition-all ${
                        referType === "self"
                          ? "bg-gold-gradient text-dark font-black"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Apply for Myself
                    </button>
                  </div>

                  <form onSubmit={handleCareersSubmit} className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {referType === "partner" ? (
                        <>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Your Name</label>
                            <input
                              required
                              type="text"
                              value={yourName}
                              onChange={(e) => setYourName(e.target.value)}
                              placeholder="Your name"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Your Phone</label>
                            <input
                              required
                              type="tel"
                              value={yourPhone}
                              onChange={(e) => setYourPhone(e.target.value)}
                              placeholder="Your WhatsApp number"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Friend's Name</label>
                            <input
                              required
                              type="text"
                              value={friendName}
                              onChange={(e) => setFriendName(e.target.value)}
                              placeholder="Professional's name"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Friend's Phone</label>
                            <input
                              required
                              type="tel"
                              value={friendPhone}
                              onChange={(e) => setFriendPhone(e.target.value)}
                              placeholder="Friend's WhatsApp number"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Full Name</label>
                            <input
                              required
                              type="text"
                              value={yourName}
                              onChange={(e) => setYourName(e.target.value)}
                              placeholder="Your full name"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Phone Number</label>
                            <input
                              required
                              type="tel"
                              value={yourPhone}
                              onChange={(e) => setYourPhone(e.target.value)}
                              placeholder="Your WhatsApp number"
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                            />
                          </div>
                        </>
                      )}

                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Specialty / Role</label>
                        <select
                          value={friendRole}
                          onChange={(e) => setFriendRole(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-gold-600/50 focus:outline-none"
                        >
                          <option value="beautician" className="bg-[#0a0a0a]">Beautician / Salon Expert</option>
                          <option value="hair" className="bg-[#0a0a0a]">Hair Stylist</option>
                          <option value="makeup" className="bg-[#0a0a0a]">Makeup Artist</option>
                          <option value="massage" className="bg-[#0a0a0a]">Massage Therapist</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gold-gradient text-dark font-black text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-300 mt-4"
                    >
                      {referType === "partner" ? "Register Referral & Invite" : "Submit Application"}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6 text-center py-6 border border-gold-600/20 bg-gold-600/5 rounded-3xl p-6">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-heading text-xl font-bold text-white">
                      {referType === "partner" ? "Referral Submitted!" : "Application Submitted!"}
                    </h3>
                    <p className="text-[11px] text-white/60 leading-relaxed max-w-sm mx-auto">
                      {referType === "partner"
                        ? `Thank you for referring ${friendName}! Invite them via WhatsApp to complete their profile registration.`
                        : "Thank you for applying to Hermosa Luxe! Our team will review your application and reach out to you within 24-48 hours."
                      }
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 max-w-xs mx-auto">
                    {referType === "partner" ? (
                      <>
                        <a
                          href={`https://wa.me/${friendPhone.replace(/\+/g, "").trim()}?text=Hey%20${encodeURIComponent(friendName)}!%20Join%20Hermosa%20as%20a%20beautician%20and%20earn%20up%20to%20%E2%82%B950,000/month%20with%20flexible%20hours.%20Apply%20here%20or%20reply%20to%20this%20chat:%20https://hermosa.luxe/join`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                        >
                          <MessageCircle className="w-4 h-4 fill-white text-emerald-600" /> Invite via WhatsApp
                        </a>
                        <a
                          href={`https://wa.me/917248253329?text=Hi%20Hermosa,%20I'd%20like%20to%20register%20a%20careers%20referral.%20My%20Name:%20${encodeURIComponent(yourName)}%20(${encodeURIComponent(yourPhone)}).%20Referred%20Friend:%20${encodeURIComponent(friendName)}%20(${encodeURIComponent(friendPhone)})%20as%20a%20Partner%20(${encodeURIComponent(friendRole)}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-wider transition"
                        >
                          Confirm with Hermosa Desk
                        </a>
                      </>
                    ) : (
                      <a
                        href={`https://wa.me/917248253329?text=Hi%20Hermosa,%20I%20just%20submitted%20my%20careers%2520application.%20Name:%20${encodeURIComponent(yourName)}%2520(${encodeURIComponent(yourPhone)})%2520for%2520the%2520${encodeURIComponent(friendRole)}%2520role.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                      >
                        <MessageCircle className="w-4 h-4 fill-white text-emerald-600" /> WhatsApp Hermosa Desk
                      </a>
                    )}

                    <button
                      onClick={() => {
                        setFormStep("form");
                        setYourName("");
                        setYourPhone("");
                        setFriendName("");
                        setFriendPhone("");
                      }}
                      className="text-[10px] text-gold-500 hover:underline pt-2 block mx-auto font-bold uppercase tracking-wider luxe-subtitle"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-600" />
      </div>
    }>
      <ContactPageContent />
    </React.Suspense>
  );
}
