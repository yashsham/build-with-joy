"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Check, ShieldCheck, Award, Send } from "lucide-react";
import { toast } from "sonner";

export default function PartnerRegistrationPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "bareilly",
    profession: "beautician", // beautician | therapist
    gender: "female", // female | male
    comfortableHome: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map profession & gender to a category string for the backend bio
      const categoryMapping = `${formData.gender} ${formData.profession}`;
      const res = await fetch("/api/professionals/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.city,
          experience: "2", // Default experience value
          category: categoryMapping,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-32 pb-20 bg-[radial-gradient(ellipse_at_top,#1a1500_0%,#000_60%)] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-600/40 bg-gold-600/5 text-xs text-gold-600 luxe-subtitle font-bold">
              HERMOSA CAREER PORTAL
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl text-white leading-tight">
              Earn up to <span className="text-gradient-gold italic">₹70,000 / month</span> <br/>
              as a Hermosa Partner.
            </h1>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-xl">
              Join India's most premium home salon and spa network. Get weekly payouts, free luxury uniforms, certified training, and regular booking schedules in your city.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold-600/10 text-gold-600 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white luxe-subtitle">Weekly Payouts</h4>
                  <p className="text-[11px] text-white/50 mt-1">Direct bank transfers every Tuesday.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gold-600/10 text-gold-600 flex-shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white luxe-subtitle">Free Equipment</h4>
                  <p className="text-[11px] text-white/50 mt-1">Receive premium kits & custom uniforms.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="md:col-span-5 relative">
            <div className="relative overflow-hidden rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-8 shadow-[0_0_50px_rgba(201,168,76,0.1)]">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="font-heading text-xl text-white border-b border-white/5 pb-3 text-center">
                    Submit your Details & get started!
                  </h3>
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-gold-600/50"
                    />
                  </div>

                  {/* Mobile Number Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Mobile Number</label>
                    <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden focus-within:border-gold-600/50">
                      <span className="flex items-center px-3 border-r border-white/10 text-xs text-white/50 font-bold bg-white/5">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-transparent px-4 py-3 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Select City */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Select City</label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-gold-600/50"
                      disabled
                    >
                      <option value="bareilly">Bareilly</option>
                    </select>
                  </div>

                  {/* Profession Radio Group */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle block">What is your profession?</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                        <input
                          type="radio"
                          name="profession"
                          value="beautician"
                          checked={formData.profession === "beautician"}
                          onChange={() => setFormData({ ...formData, profession: "beautician" })}
                          className="accent-gold-600 h-4 w-4"
                        />
                        Beautician
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                        <input
                          type="radio"
                          name="profession"
                          value="therapist"
                          checked={formData.profession === "therapist"}
                          onChange={() => setFormData({ ...formData, profession: "therapist" })}
                          className="accent-gold-600 h-4 w-4"
                        />
                        Spa Therapist
                      </label>
                    </div>
                  </div>

                  {/* Gender Radio Group */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle block">Select Gender</label>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={() => setFormData({ ...formData, gender: "female" })}
                          className="accent-gold-600 h-4 w-4"
                        />
                        Female
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-white/80">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={() => setFormData({ ...formData, gender: "male" })}
                          className="accent-gold-600 h-4 w-4"
                        />
                        Male
                      </label>
                    </div>
                  </div>

                  {/* Comfortable for Home Services Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-white/70">
                      <input
                        type="checkbox"
                        checked={formData.comfortableHome}
                        onChange={(e) => setFormData({ ...formData, comfortableHome: e.target.checked })}
                        className="accent-gold-600 h-4 w-4 rounded border-white/10 mt-0.5"
                      />
                      <span>I am comfortable for Home Services</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold text-xs hover:scale-[1.01] active:scale-[0.99] transition shadow-[var(--shadow-gold-sm)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-2xl text-white">Application Received!</h3>
                  <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                    Thank you for applying. Our recruiting team will review your application and call you on +91 {formData.phone} within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 rounded-full border border-white/10 text-xs text-white/70 hover:bg-white/5 transition"
                  >
                    Submit Another Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Uniforms & Training Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden border border-white/5 relative aspect-video md:aspect-[4/3] bg-gradient-to-tr from-amber-950/20 to-black">
          <img 
            src="/assets/service-bridal.jpg" 
            alt="Hermosa Partners in Uniforms" 
            className="w-full h-full object-cover grayscale-[10%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm">
            <h4 className="text-sm font-bold text-white">Certified Hermosa Professionals</h4>
            <p className="text-[11px] text-white/50 mt-1">Our professionals are equipped with smart uniforms and premium kits.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="text-xs text-gold-600 luxe-subtitle">Professional Growth</div>
          <h2 className="font-heading text-3xl md:text-5xl text-white">
            State-Of-The-Art <br />
            <span className="text-gradient-gold italic">Training & Uniforms</span>
          </h2>
          <p className="text-xs md:text-sm text-white/60 leading-relaxed">
            At Hermosa, we elevate home-beauty professionals to luxury service standards. Every selected candidate undergoes a 7-day intensive hands-on workshop covering advanced facial technologies, massage ergonomics, client safety protocols, and premium brand product guidelines.
          </p>
          <ul className="space-y-3 text-xs text-white/70">
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-600" /> Free smart black & gold uniform package.</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-600" /> Advanced training certifications recognized nationwide.</li>
            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-600" /> Flexible scheduling — work whenever you choose.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
