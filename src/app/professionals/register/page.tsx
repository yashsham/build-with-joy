"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Check, ShieldCheck, Award, Send, Star, Users, Wallet,
  Clock, Sparkles, ChevronRight, BadgeCheck, Zap, Heart,
  TrendingUp, Gift, MapPin, Phone
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const WHATSAPP = "917248253329";

// ─── Real Hermosa Experts ──────────────────────────────────────────────────
const experts = [
  {
    name: "Priya Sharma",
    role: "Senior Beautician",
    specialty: "Facial & Cleanup",
    city: "Bareilly",
    experience: "4 yrs",
    rating: 4.9,
    reviews: 312,
    earned: "₹54,000",
    period: "last month",
    image: "/assets/expert-priya-sharma.png",
    badge: "Top Earner",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    accent: "from-rose-900/30 to-pink-900/10",
    skills: ["Facial", "Cleanup", "Waxing", "Mani-Pedi"],
  },
  {
    name: "Anjali Verma",
    role: "Makeup Artist",
    specialty: "Bridal & Party Makeup",
    city: "Bareilly",
    experience: "6 yrs",
    rating: 5.0,
    reviews: 198,
    earned: "₹71,000",
    period: "last month",
    image: "/assets/expert-anjali-verma.png",
    badge: "⭐ Elite",
    badgeColor: "bg-gold-600/20 text-gold-400 border-gold-600/30",
    accent: "from-purple-900/30 to-fuchsia-900/10",
    skills: ["Bridal Makeup", "Airbrush", "Saree Draping", "Hair"],
  },
  {
    name: "Sunita Rawat",
    role: "Spa Therapist",
    specialty: "Aromatherapy & Massage",
    city: "Bareilly",
    experience: "3 yrs",
    rating: 4.8,
    reviews: 145,
    earned: "₹42,000",
    period: "last month",
    image: "/assets/expert-sunita-rawat.png",
    badge: "Rising Star",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    accent: "from-teal-900/30 to-emerald-900/10",
    skills: ["Aroma Massage", "Deep Tissue", "Foot Reflexology", "Head Massage"],
  },
  {
    name: "Rajesh Kumar",
    role: "Male Grooming Expert",
    specialty: "Hair & Beard Styling",
    city: "Bareilly",
    experience: "5 yrs",
    rating: 4.9,
    reviews: 267,
    earned: "₹48,000",
    period: "last month",
    image: "/assets/expert-rajesh-kumar.png",
    badge: "Verified Pro",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    accent: "from-blue-900/30 to-indigo-900/10",
    skills: ["Haircut", "Beard Trim", "Head Massage", "Charcoal Facial"],
  },
  {
    name: "Kavita Singh",
    role: "HydraGlo Specialist",
    specialty: "Advanced Skin Treatments",
    city: "Bareilly",
    experience: "5 yrs",
    rating: 4.9,
    reviews: 231,
    earned: "₹62,000",
    period: "last month",
    image: "/assets/expert-kavita-singh.png",
    badge: "Certified",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    accent: "from-sky-900/30 to-cyan-900/10",
    skills: ["HydraGlo", "Anti-Acne Facial", "O3+ Glow", "Body Toning"],
  },
  {
    name: "Meena Patel",
    role: "Body Care Expert",
    specialty: "Polishing & Toning",
    city: "Bareilly",
    experience: "4 yrs",
    rating: 4.8,
    reviews: 176,
    earned: "₹39,000",
    period: "last month",
    image: "/assets/expert-meena-patel.png",
    badge: "Popular",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    accent: "from-amber-900/30 to-orange-900/10",
    skills: ["Body Polishing", "Body Toning", "Waxing", "D-Tan"],
  },
];

// ─── Onboarding Steps ──────────────────────────────────────────────────────
const steps = [
  {
    num: "01",
    title: "Apply Online",
    desc: "Fill the short form below with your name, mobile, and specialty. Takes 2 minutes.",
    icon: Send,
    color: "text-gold-500",
    bg: "bg-gold-600/10",
  },
  {
    num: "02",
    title: "Interview Call",
    desc: "Our HR team calls you within 24 hours for a friendly 10-minute skill chat.",
    icon: Phone,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    num: "03",
    title: "3-Day Training",
    desc: "Attend our free Bareilly training workshop. Learn Hermosa hygiene & service standards.",
    icon: Award,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    num: "04",
    title: "Start Earning",
    desc: "Get onboarded on the app, receive bookings, and earn weekly via direct bank transfer.",
    icon: Wallet,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

// ─── Benefits ──────────────────────────────────────────────────────────────
const benefits = [
  { icon: Wallet,     title: "Weekly Payouts",       desc: "Direct bank transfer every Tuesday. No delays, no cuts." },
  { icon: Gift,       title: "Free Kit + Uniform",   desc: "Get a premium black & gold Hermosa uniform + branded cosmetic kit for free." },
  { icon: TrendingUp, title: "Earn ₹40K–₹70K/month",desc: "Top partners earn ₹70,000+ from home visits in Bareilly." },
  { icon: Zap,        title: "Flexible Hours",       desc: "Work on your schedule. Accept or decline bookings freely." },
  { icon: BadgeCheck, title: "Verified Badge",       desc: "Get your Hermosa verified badge — clients trust you more." },
  { icon: Heart,      title: "Insurance Cover",      desc: "All active partners get accidental insurance coverage worth ₹2 Lakhs." },
];

export default function PartnerRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "bareilly",
    profession: "beautician",
    gender: "female",
    experience: "1-2",
    comfortableHome: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const FORMSUBMIT_EMAIL = "hermosasalon325@gmail.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Internal API (DB + SMS logging)
      fetch("/api/professionals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          experience: formData.experience,
          category: `${formData.gender} ${formData.profession}`,
        }),
      }).catch(() => {});

      // 2. Direct FormSubmit.co POST from browser (free email delivery, no SMTP needed)
      const fd = new FormData();
      fd.append("_subject", `Hermosa New Partner Application: ${formData.name}`);
      fd.append("_captcha", "false");
      fd.append("_template", "table");
      fd.append("Full Name", formData.name);
      fd.append("Mobile Number", `+91 ${formData.phone}`);
      fd.append("City", "Bareilly, UP");
      fd.append("Specialty", `${formData.gender} ${formData.profession}`);
      fd.append("Experience", `${formData.experience} years`);
      fd.append("Submitted At", new Date().toLocaleString("en-IN"));
      await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_EMAIL}`, {
        method: "POST",
        body: fd,
      });

      setSubmitted(true);
      toast.success("Application submitted! We'll call you within 24 hours.");
    } catch {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#1a1200_0%,#000_55%)]">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#C9A84C 1px,transparent 1px),linear-gradient(90deg,#C9A84C 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          {/* Pill badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-600/40 bg-gold-600/5 text-[10px] text-gold-500 font-bold tracking-widest uppercase luxe-subtitle">
              <Sparkles className="w-3 h-3" /> Hermosa Career Portal · Bareilly
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl text-white leading-tight">
              Join India's Most<br />
              <span className="text-gradient-gold italic">Premium Beauty Network</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
              500+ verified Hermosa experts in Bareilly earn <strong className="text-white">₹40,000–₹70,000/month</strong> from home visits. 
              Weekly payouts, free premium kit, flexible hours — apply in 2 minutes.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-8">
              {[
                { num: "500+", label: "Active Partners" },
                { num: "₹70K", label: "Top Monthly Earning" },
                { num: "4.9★", label: "Partner Satisfaction" },
                { num: "24 hrs", label: "Onboarding Time" },
              ].map((stat) => (
                <div key={stat.num} className="text-center">
                  <div className="font-heading text-2xl md:text-3xl text-gradient-gold">{stat.num}</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-wider luxe-subtitle mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <a
                href="#apply-form"
                className="px-8 py-3.5 rounded-full bg-gold-gradient text-dark font-bold text-xs uppercase tracking-widest shadow-[var(--shadow-gold-sm)] hover:scale-105 transition"
              >
                Apply Now — It's Free
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Hermosa! I want to register as a beauty professional partner.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full border border-white/15 text-white/70 text-xs font-semibold hover:border-gold-600/40 hover:text-gold-500 transition"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR EXPERTS (Social Proof) ────────────────────────── */}
      <section className="py-16 bg-[#020202] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] text-gold-500 luxe-subtitle uppercase tracking-widest font-bold">Meet Our Experts</span>
            <h2 className="font-heading text-2xl md:text-3xl text-white mt-2">
              Real Hermosa Professionals <span className="text-gradient-gold italic">Earning Big</span>
            </h2>
            <p className="text-xs text-white/45 mt-2">Verified experts currently active in Bareilly</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {experts.map((expert, i) => (
              <motion.div
                key={expert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className={`relative rounded-3xl border border-white/8 bg-gradient-to-br ${expert.accent} overflow-hidden group hover:border-gold-600/30 transition-all duration-300`}
              >
                {/* Top image strip */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80" />

                  {/* Badge */}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full border text-[9px] font-bold tracking-wider ${expert.badgeColor}`}>
                    {expert.badge}
                  </span>

                  {/* Earnings pill floating on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-1.5">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-white font-black text-xs">{expert.earned}</span>
                    <span className="text-white/40 text-[9px]">{expert.period}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm">{expert.name}</h3>
                      <p className="text-[10px] text-gold-500 font-semibold mt-0.5 luxe-subtitle">{expert.role}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{expert.specialty}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
                        <span className="text-white text-xs font-bold">{expert.rating}</span>
                      </div>
                      <span className="text-[9px] text-white/35">{expert.reviews} reviews</span>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 text-[9px] text-white/40">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{expert.city}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{expert.experience} exp.</span>
                    <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-emerald-400" /> Verified</span>
                  </div>

                  {/* Skill chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {expert.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-[9px] text-white/55 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[10px] text-white/30 mt-8">
            + 490 more verified professionals actively working in Bareilly
          </p>
        </div>
      </section>

      {/* ── BENEFITS ──────────────────────────────────────────── */}
      <section className="py-16 bg-black border-t border-white/5">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <span className="text-[10px] text-gold-500 luxe-subtitle uppercase tracking-widest font-bold">Why Join Hermosa</span>
            <h2 className="font-heading text-2xl md:text-3xl text-white mt-2">
              Benefits That Make <span className="text-gradient-gold italic">All the Difference</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="group rounded-2xl border border-white/5 bg-[#080808] p-5 hover:border-gold-600/25 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-gold-600/10 text-gold-500 flex items-center justify-center mb-4 group-hover:bg-gold-600/20 transition">
                  <b.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                <p className="text-[11px] text-white/45 mt-1.5 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-16 bg-[#040404] border-t border-white/5">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-[10px] text-gold-500 luxe-subtitle uppercase tracking-widest font-bold">Simple Process</span>
            <h2 className="font-heading text-2xl md:text-3xl text-white mt-2">
              Get Onboarded in <span className="text-gradient-gold italic">4 Easy Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex flex-col items-center text-center group">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 top-7 w-full h-px bg-gradient-to-r from-white/10 to-transparent translate-x-8" />
                )}
                <div className={`h-14 w-14 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-[9px] font-black text-white/20 luxe-subtitle tracking-widest mb-1">{step.num}</div>
                <h3 className="text-sm font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-[11px] text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ─────────────────────────────────── */}
      <section id="apply-form" className="py-16 bg-black border-t border-white/5 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — persuasion panel */}
          <div className="space-y-8">
            <div>
              <span className="text-[10px] text-gold-500 luxe-subtitle uppercase tracking-widest font-bold">Apply Now</span>
              <h2 className="font-heading text-3xl md:text-4xl text-white mt-2 leading-snug">
                Start Your Journey<br />
                <span className="text-gradient-gold italic">as a Hermosa Expert</span>
              </h2>
              <p className="text-sm text-white/50 mt-3 leading-relaxed">
                Fill in the short form and our team will call you within <strong className="text-white">24 hours</strong> to schedule your welcome interview and free training session.
              </p>
            </div>

            {/* Earnings spotlight */}
            <div className="rounded-2xl border border-gold-600/20 bg-[#0a0a0a] p-5 space-y-4">
              <div className="text-[10px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
                💰 This Month's Top Earners
              </div>
              {experts.slice(0, 3).map((e) => (
                <div key={e.name} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl overflow-hidden flex-shrink-0 border border-white/8">
                    <img src={e.image} alt={e.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white">{e.name}</div>
                    <div className="text-[10px] text-white/40">{e.specialty}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-black text-emerald-400">{e.earned}</div>
                    <div className="text-[9px] text-white/30">{e.period}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: ShieldCheck, label: "Background Verified" },
                { icon: Award,       label: "Certified Training" },
                { icon: Users,       label: "500+ Active Partners" },
              ].map((t) => (
                <div key={t.label} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 bg-white/3 text-[10px] text-white/55">
                  <t.icon className="w-3.5 h-3.5 text-gold-500" />
                  {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="relative">
            {/* Glow rings */}
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-gold-600/20 via-transparent to-gold-600/10 pointer-events-none" />
            <div className="relative rounded-3xl border border-gold-600/25 bg-[#090909] p-7 shadow-[0_0_60px_rgba(201,168,76,0.08)]">
              {/* Logo on form top */}
              <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5">
                <img src="/hermosa-logo.png" alt="Hermosa" className="h-10 w-10 object-contain" />
                <div>
                  <div className="font-heading text-base text-gradient-gold">Hermosa</div>
                  <div className="text-[9px] text-white/35 luxe-subtitle tracking-wider">Partner Application</div>
                </div>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-gold-600/50 transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle">Mobile Number</label>
                    <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden focus-within:border-gold-600/50 transition">
                      <span className="flex items-center px-3 border-r border-white/10 text-xs text-white/50 font-bold bg-white/5 flex-shrink-0">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-transparent px-4 py-3 text-xs text-white placeholder:text-white/20 outline-none"
                      />
                    </div>
                  </div>

                  {/* Profession */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">Your Specialty</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: "beautician",  label: "💄 Beautician" },
                        { val: "therapist",   label: "🧘 Spa Therapist" },
                        { val: "makeup",      label: "💍 Makeup Artist" },
                        { val: "hair",        label: "✂️ Hair Stylist" },
                      ].map((opt) => (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, profession: opt.val })}
                          className={`py-2.5 px-3 rounded-xl text-[10px] font-bold border transition text-left ${
                            formData.profession === opt.val
                              ? "bg-gold-gradient text-dark border-transparent"
                              : "bg-white/5 border-white/10 text-white/55 hover:border-white/20"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle block">Gender</label>
                    <div className="flex gap-3">
                      {[
                        { val: "female", label: "Female" },
                        { val: "male",   label: "Male" },
                      ].map((g) => (
                        <button
                          key={g.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, gender: g.val })}
                          className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold border transition ${
                            formData.gender === g.val
                              ? "bg-gold-gradient text-dark border-transparent"
                              : "bg-white/5 border-white/10 text-white/55 hover:border-white/20"
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle">Years of Experience</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/80 outline-none focus:border-gold-600/50 transition"
                    >
                      <option value="0-1" className="bg-[#0a0a0a]">Less than 1 year (Fresher welcome!)</option>
                      <option value="1-2" className="bg-[#0a0a0a]">1–2 years</option>
                      <option value="3-5" className="bg-[#0a0a0a]">3–5 years</option>
                      <option value="5+" className="bg-[#0a0a0a]">5+ years (Senior)</option>
                    </select>
                  </div>

                  {/* City locked */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest luxe-subtitle">City</label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <MapPin className="w-3.5 h-3.5 text-gold-500" />
                      <span className="text-xs text-white/70">Bareilly, Uttar Pradesh</span>
                      <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-gold-600/10 text-gold-500 border border-gold-600/20 font-bold luxe-subtitle">ACTIVE</span>
                    </div>
                  </div>

                  {/* Consent */}
                  <label className="flex items-start gap-3 cursor-pointer text-xs text-white/50 leading-relaxed group">
                    <input
                      type="checkbox"
                      checked={formData.comfortableHome}
                      onChange={(e) => setFormData({ ...formData, comfortableHome: e.target.checked })}
                      className="accent-gold-600 h-4 w-4 rounded mt-0.5 flex-shrink-0"
                    />
                    <span className="group-hover:text-white/70 transition">
                      I am comfortable providing services at customers' homes and agree to Hermosa's hygiene & conduct guidelines.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || formData.phone.length !== 10}
                    className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-black text-xs uppercase tracking-widest shadow-[var(--shadow-gold-sm)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Submitting..." : "Submit Application — It's Free"}
                  </button>

                  <p className="text-center text-[10px] text-white/25">
                    No fees. No hidden charges. We call you within 24 hours.
                  </p>
                </form>
              ) : (
                <div className="text-center py-10 space-y-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-600/10 text-gold-500 border border-gold-600/30"
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>
                  <div>
                    <h3 className="font-heading text-2xl text-white">Application Received! 🎉</h3>
                    <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto mt-2">
                      Thank you, <strong className="text-white">{formData.name}</strong>! Our team will call you on{" "}
                      <strong className="text-white">+91 {formData.phone}</strong> within 24 hours to schedule your welcome interview.
                    </p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Hermosa! My name is ${formData.name}. I just applied to become a partner. Looking forward to hearing from you!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md"
                    >
                      💬 Confirm on WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="w-full py-2.5 rounded-xl border border-white/10 text-xs text-white/50 hover:bg-white/5 transition"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER NOTE ───────────────────────────────────────── */}
      <section className="py-12 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <img src="/hermosa-logo.png" alt="Hermosa" className="h-10 w-10 mx-auto object-contain opacity-60" />
          <p className="text-xs text-white/35 leading-relaxed">
            Hermosa Luxe Home Service · Sheel Chauraha, Civil Lines, Bareilly, UP<br />
            For partner enquiries: <a href={`https://wa.me/${WHATSAPP}`} className="text-gold-500 hover:underline">WhatsApp us</a>
          </p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] text-white/30 hover:text-gold-500 transition luxe-subtitle uppercase tracking-wider">
            ← Back to Home <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
