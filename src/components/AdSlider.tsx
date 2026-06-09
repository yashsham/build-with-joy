"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AdSlide {
  id: string;
  ctaLink: string;
  image: string;
  alt: string;
}

const adSlides: AdSlide[] = [
  {
    id: "spa-ritual",
    ctaLink: "/services?gender=female&category=spa-massage",
    image: "/assets/ad-spa-ritual.png",
    alt: "Full Body Korean Spa Ritual Ad Banner"
  },
  {
    id: "hair-spa",
    ctaLink: "/services?gender=female&category=hair",
    image: "/assets/ad-hair-spa.png",
    alt: "Korean Hair Spa Ad Banner"
  },
  {
    id: "body-polishing",
    ctaLink: "/services?gender=female&category=spa-massage",
    image: "/assets/ad-body-polishing.png",
    alt: "Korean Body Polishing Ad Banner"
  },
  {
    id: "multisession",
    ctaLink: "/services?gender=female&category=spa-massage",
    image: "/assets/ad-multisession.png",
    alt: "More Relaxation More Savings Ad Banner"
  }
];

export default function AdSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent((index + adSlides.length) % adSlides.length);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto slide every 4 seconds
  useEffect(() => {
    autoPlayRef.current = setInterval(next, 4000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [next]);

  const resetTimer = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(next, 4000);
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        next();
      } else {
        prev();
      }
      resetTimer();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = adSlides[current];

  return (
    <section className="py-4 md:py-6 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-base md:text-lg text-white">
            Trending <span className="text-gradient-gold">Offers</span>
          </h2>
          <Link href="/services" className="text-[10px] text-gold-600 hover:underline flex items-center gap-1">
            See All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Slider Frame */}
        <div
          className="relative rounded-2xl overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-lg border border-white/5"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ aspectRatio: "16/9", minHeight: 150 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: -20 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Link href={slide.ctaLink} className="block w-full h-full relative">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover"
                />
                {/* Subtle sheen highlight for realistic engagement */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={() => { prev(); resetTimer(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all"
            aria-label="Previous Offer"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => { next(); resetTimer(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/70 hover:scale-105 active:scale-95 transition-all"
            aria-label="Next Offer"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {adSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`transition-all duration-300 rounded-full h-1.5 ${
                i === current
                  ? "w-6 bg-gold-600 shadow-[0_0_8px_rgba(201,168,76,0.5)]"
                  : "w-1.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
