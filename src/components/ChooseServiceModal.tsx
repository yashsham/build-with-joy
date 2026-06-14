"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/context";

export default function ChooseServiceModal() {
  const { isChooseServiceOpen, setIsChooseServiceOpen, theme } = useApp();
  const [gender, setGender] = useState<"female" | "male">("female");
  const router = useRouter();

  const handleNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    router.push(href);
    setIsChooseServiceOpen(false);
  };

  return (
    <AnimatePresence>
      {isChooseServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-transparent"
            onClick={() => setIsChooseServiceOpen(false)}
          />
          
          {/* Modal Container */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-[#0a0a0a] rounded-t-3xl border-t border-white/10 p-6 z-10 shadow-2xl flex flex-col"
            style={{ 
              backgroundColor: theme === "light" ? "#ffffff" : "#0a0a0a", 
              borderTopColor: theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" 
            }}
          >
            {/* Drag Handle */}
            <div 
              className="mx-auto w-12 h-1 rounded-full mb-6" 
              style={{ backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)" }}
            />

            <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderBottomColor: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)" }}>
              <h3 className="font-heading text-lg font-medium" style={{ color: theme === "light" ? "#1a1a1e" : "#ffffff" }}>Choose Your Service</h3>
              <button
                onClick={() => setIsChooseServiceOpen(false)}
                className="h-8 w-8 rounded-full flex items-center justify-center transition"
                style={{ 
                  color: theme === "light" ? "#5c5c70" : "rgba(255, 255, 255, 0.6)",
                  borderColor: theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)",
                  backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.05)"
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Control */}
            <div className="flex border rounded-2xl p-1 mb-6" style={{ backgroundColor: theme === "light" ? "#f7f6f2" : "#000000", borderColor: theme === "light" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)" }}>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  gender === "female"
                    ? "bg-gold-gradient text-dark shadow-sm"
                    : ""
                }`}
                style={{
                  color: gender === "female" ? "#000000" : (theme === "light" ? "#5c5c70" : "rgba(255, 255, 255, 0.6)")
                }}
              >
                Women
              </button>
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  gender === "male"
                    ? "bg-gold-gradient text-dark shadow-sm"
                    : ""
                }`}
                style={{
                  color: gender === "male" ? "#000000" : (theme === "light" ? "#5c5c70" : "rgba(255, 255, 255, 0.6)")
                }}
              >
                Men
              </button>
            </div>

            {/* Category Cards */}
            <div className="space-y-4 pb-4">
              {gender === "female" ? (
                <>
                  {/* Women: Salon at Home */}
                  <Link
                    href="/services?gender=female&category=female-salon"
                    onClick={(e) => handleNav(e, "/services?gender=female&category=female-salon")}
                    className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left block"
                  >
                    <img 
                      src="/assets/cat-salon-women.png" 
                      alt="Salon at Home" 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500" 
                    />
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Salon at Home</h4>
                      <p className="text-[10px] text-white/60">Waxing, Facials, Mani-Pedi, Hair & more</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                        EXPLORE <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>

                  {/* Women: Spa at Home */}
                  <Link
                    href="/services?gender=female&category=spa-massage"
                    onClick={(e) => handleNav(e, "/services?gender=female&category=spa-massage")}
                    className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left block"
                  >
                    <img 
                      src="/assets/cat-spa-women.png" 
                      alt="Spa at Home" 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500" 
                    />
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Spa at Home</h4>
                      <p className="text-[10px] text-white/60">Relaxing & Pain Relieving Massage</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                        EXPLORE <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </>
              ) : (
                <>
                  {/* Men: Male Grooming */}
                  <Link
                    href="/services?gender=male&category=male-grooming"
                    onClick={(e) => handleNav(e, "/services?gender=male&category=male-grooming")}
                    className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left block"
                  >
                    <img 
                      src="/assets/service-mens-haircut-styling.png" 
                      alt="Male Grooming" 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500 animate-grayscale" 
                    />
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Male Grooming</h4>
                      <p className="text-[10px] text-white/60">Haircut, Shave, Beard Styling, D-Tan & Facial</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                        EXPLORE <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>

                  {/* Men: Male Spa */}
                  <Link
                    href="/services?gender=male&category=spa-massage"
                    onClick={(e) => handleNav(e, "/services?gender=male&category=spa-massage")}
                    className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left block"
                  >
                    <img 
                      src="/assets/service-mens-body-massage.png" 
                      alt="Male Spa" 
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500 animate-grayscale" 
                    />
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Male Spa</h4>
                      <p className="text-[10px] text-white/60">Relaxing & Pain Relieving Massage</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                        EXPLORE <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
