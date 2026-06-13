"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HermosaImageRegistry } from "@/lib/imageRegistry";

interface AdBanner {
  id: string;
  title: string;
  ctaLink: string;
}

const femaleBanners: AdBanner[] = [
  { id: "bloomads", title: "Blossom Glow Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "daimond-ads", title: "Diamond Glow Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "fluxads", title: "Glow Luxe Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "glassskin-ads", title: "Glass Skin Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "hydroglo-ads-d", title: "HydraGlo Facials", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "hydroglowads", title: "HydraGlo Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "korean-body-posiling-ads", title: "Korean Body Polishing", ctaLink: "/services?gender=female&category=spa-massage" },
  { id: "korean-hair-spa-ads", title: "Korean Hair Spa", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "korean-wax-ads", title: "Korean Waxing", ctaLink: "/services?gender=female&category=waxing" },
  { id: "korean-wax-adsk", title: "Korean Waxing K", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "mani-cure-ads", title: "Korean Mani & Pedi", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "radiant-ads", title: "Radiant Facial", ctaLink: "/services?gender=female&category=female-salon" },
  { id: "revivl-ads", title: "Glow Revival Facial", ctaLink: "/services?gender=female&category=female-salon" }
];

const maleBanners: AdBanner[] = [
  { id: "refersh-ads", title: "Men's Refresh & Revive Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "smooth-sharpads", title: "Advanced Smooth & Sharp Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "glowboost-ads", title: "Men's Glow Boost Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "mens-facialads", title: "Men's Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "deepclean-aads", title: "Men's Deep Clean Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "greenads", title: "Men's Hydrate & Glow Facial", ctaLink: "/services?gender=male&category=hydraglo" },
  { id: "dextfacads", title: "Men's Detox Facial", ctaLink: "/services?gender=male&category=hydraglo" }
];

export default function AdSlider({ activeGender = "female" }: { activeGender?: "female" | "male" }) {
  const banners = activeGender === "female" ? femaleBanners : maleBanners;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);

  // Reset index when activeGender changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeGender]);

  // Auto-play sliding logic
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered, banners.length]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 }
      }
    })
  };

  const safeIndex = currentIndex >= banners.length ? 0 : currentIndex;
  const currentBanner = banners[safeIndex];

  return (
    <section className="py-12 md:py-16 bg-[#070707] border-t border-b border-white/5 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[9px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
            <Sparkles className="w-3.5 h-3.5" /> High-Demand Offers
          </span>
          <h2 className="font-heading text-2xl md:text-4xl text-white mt-4 leading-tight">
            Exclusive <span className="text-gradient-gold italic">Spotlight Deals</span>
          </h2>
          <p className="mt-2 text-xs text-white/50 leading-relaxed">
            Curated premium wellness packages and seasonal treatments at locked-in luxury rates.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 bg-[#070707] shadow-[0_15px_45px_rgba(201,168,76,0.05)] aspect-[2/1] max-h-[480px] group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={`${activeGender}-${safeIndex}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <Link href={currentBanner.ctaLink} className="block w-full h-full">
                <img
                  src={HermosaImageRegistry.resolveAdBannerImage(currentBanner.id)}
                  alt={currentBanner.title}
                  className="w-full h-full object-cover object-center select-none cursor-pointer hover:scale-[1.01] transition-transform duration-700"
                />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-gold-600 hover:text-dark hover:border-gold-600 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Previous Offer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-gold-600 hover:text-dark hover:border-gold-600 transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Next Offer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Progress Indicators (Dots) in a Glassmorphic Container for high contrast */}
          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-gold-500" : "w-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
