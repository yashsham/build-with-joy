"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { ChevronLeft, Phone, Mail, Sparkles, Briefcase, HelpCircle, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function ContactPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as "support" | "careers" | null;
  const [activeTab, setActiveTab] = useState<"support" | "careers">("support");
  const router = useRouter();

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
            <Users className="w-16 h-16 text-gold-600/60" />
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

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <a
                  href={`tel:${PHONE.replace(/\s+/g, "")}`}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:border-gold-600/30 transition duration-300 group"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">CALL US</span>
                  <span className="text-sm text-gold-600 font-semibold mt-1">{PHONE}</span>
                </a>

                <a
                  href={`mailto:${EMAIL}`}
                  className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/5 bg-[#0a0a0a] hover:border-gold-600/30 transition duration-300 group"
                >
                  <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">MAIL US</span>
                  <span className="text-xs text-gold-600 font-semibold mt-2 break-all">{EMAIL}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-heading text-xl text-white">Join Our Team</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  We've been constantly working on disrupting the salon-at-home industry for Indian women and men, and are always looking for passionate people. Are you ready to do Hermosa work with us? Write to us at:
                </p>
              </div>

              <div className="pt-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center justify-center gap-3 p-5 rounded-2xl border border-gold-600/20 bg-gold-600/5 text-gold-600 hover:border-gold-600/40 hover:bg-gold-600/10 transition duration-300 w-full"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-widest luxe-subtitle uppercase break-all">{EMAIL}</span>
                </a>
              </div>
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
