"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { useApp } from "@/lib/context";

export default function ChooseServiceModal() {
  const { isChooseServiceOpen, setIsChooseServiceOpen } = useApp();
  const [gender, setGender] = useState<"female" | "male">("female");

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
          >
            {/* Drag Handle */}
            <div className="mx-auto w-12 h-1 bg-white/10 rounded-full mb-6" />

            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h3 className="font-heading text-lg text-white font-medium">Choose Your Service</h3>
              <button
                onClick={() => setIsChooseServiceOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Control */}
            <div className="flex bg-black border border-white/5 rounded-2xl p-1 mb-6">
              <button
                onClick={() => setGender("female")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  gender === "female"
                    ? "bg-gold-gradient text-dark shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setGender("male")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  gender === "male"
                    ? "bg-gold-gradient text-dark shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
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
                    onClick={() => setIsChooseServiceOpen(false)}
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
                    onClick={() => setIsChooseServiceOpen(false)}
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
                    onClick={() => setIsChooseServiceOpen(false)}
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
                    onClick={() => setIsChooseServiceOpen(false)}
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
