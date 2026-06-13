"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/context";
import { toast } from "sonner";

interface TrendingOffer {
  id: string; // matches slug in database for direct lookup
  category: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  savings: string;
  image: string;
  ctaLink: string;
}

const femaleTrendingOffers: TrendingOffer[] = [
  {
    id: "aroma-therapy-body-massage",
    category: "Spa & Massage",
    badge: "BESTSELLER",
    title: "Aroma Therapy Full Body Massage",
    subtitle: "Signature Korean Spa Ritual",
    description: "90 minutes of pure therapeutic relaxation utilizing premium essential oils, warm hot stones, and traditional pressure-point release.",
    originalPrice: 1799,
    discountPrice: 1499,
    savings: "Flat ₹300 OFF",
    image: "/assets/ad-spa-ritual.png",
    ctaLink: "/services?gender=female&category=spa-massage"
  },
  {
    id: "loreal-hair-spa",
    category: "Hair Care",
    badge: "LIMITED TIME",
    title: "L'Oreal Hair Spa Treatment",
    subtitle: "Nourishing Steam Therapy & Repair",
    description: "A premium hair repair treatment utilizing deep moisture steam infusion, specialized split-end serums, and a relaxing scalp massage.",
    originalPrice: 1199,
    discountPrice: 899,
    savings: "Save 25% OFF",
    image: "/assets/ad-hair-spa.png",
    ctaLink: "/services?gender=female&category=hair"
  },
  {
    id: "body-polishing",
    category: "Spa & Massage",
    badge: "BRIDAL FAVORITE",
    title: "Korean Body Polishing & Scrub",
    subtitle: "Scrubbing, Tan Removal & Radiance",
    description: "Complete body exfoliation with fine walnut micro-particles and white rose extracts, followed by a deeply hydrating radiance wrap.",
    originalPrice: 2499,
    discountPrice: 1899,
    savings: "Flat ₹600 OFF",
    image: "/assets/ad-body-polishing.png",
    ctaLink: "/services?gender=female&category=spa-massage"
  },
  {
    id: "multisession-spa-package",
    category: "Exclusive Combos",
    badge: "ELITE BUNDLE",
    title: "Multi-Session Spa Massage",
    subtitle: "Pack of 3 Relaxation Sessions",
    description: "Lock in an exclusive package of 3 premium Swedish or Deep Tissue body massage sessions. Redeemable over 6 months or shareable.",
    originalPrice: 5499,
    discountPrice: 3999,
    savings: "Save ₹1,500",
    image: "/assets/ad-multisession.png",
    ctaLink: "/services?gender=female&category=spa-massage"
  }
];

const maleTrendingOffers: TrendingOffer[] = [
  {
    id: "mens-body-massage",
    category: "Spa & Massage",
    badge: "BESTSELLER",
    title: "Men's Full Body Stress Massage",
    subtitle: "Signature Korean Spa Ritual",
    description: "90 minutes of therapeutic muscle recovery utilizing premium essential oils, hot stones, and traditional deep pressure-point release.",
    originalPrice: 1699,
    discountPrice: 1399,
    savings: "Flat ₹300 OFF",
    image: "/assets/ad-spa-ritual-male.png",
    ctaLink: "/services?gender=male&category=spa-massage"
  },
  {
    id: "mens-head-shoulder-massage",
    category: "Hair Care",
    badge: "LIMITED TIME",
    title: "Men's Head & Shoulder Massage",
    subtitle: "Nourishing Oil Therapy & Scalp Spa",
    description: "A premium scalp treatment utilizing deep conditioning warm oils, split-end scalp revitalization, and a highly relaxing massage.",
    originalPrice: 499,
    discountPrice: 349,
    savings: "Save 30% OFF",
    image: "/assets/service-mens-hair-spa.png",
    ctaLink: "/services?gender=male&category=spa-massage"
  },
  {
    id: "mens-dtan-cleanup",
    category: "Skincare",
    badge: "MOST POPULAR",
    title: "Men's Skin Brightening D-Tan",
    subtitle: "Deep Tan Removal & Clean Pore Scrub",
    description: "Exfoliating skin scrub and brightening cream mask designed specifically for men's skin to remove tan, blackheads, and impurities.",
    originalPrice: 699,
    discountPrice: 499,
    savings: "Save 28% OFF",
    image: "/assets/service-mens-dtan-cleanup.png",
    ctaLink: "/services?gender=male&category=male-grooming"
  },
  {
    id: "multisession-spa-package",
    category: "Exclusive Combos",
    badge: "ELITE BUNDLE",
    title: "Multi-Session Spa Massage",
    subtitle: "Pack of 3 Relaxation Sessions",
    description: "Lock in an exclusive package of 3 premium Swedish or Deep Tissue body massage sessions. Redeemable over 6 months or shareable.",
    originalPrice: 5499,
    discountPrice: 3999,
    savings: "Save ₹1,500",
    image: "/assets/ad-multisession-male.png",
    ctaLink: "/services?gender=male&category=spa-massage"
  }
];

export default function AdSlider({ activeGender = "female" }: { activeGender?: "female" | "male" }) {
  const { addToCart } = useApp();

  const currentOffers = activeGender === "female" ? femaleTrendingOffers : maleTrendingOffers;

  const handleBookNow = (offer: TrendingOffer) => {
    addToCart({
      id: offer.id,
      name: offer.title,
      price: offer.originalPrice,
      discountPrice: offer.discountPrice
    });
    toast.success(`${offer.title} added to booking cart!`);
  };

  return (
    <section className="py-16 bg-black border-t border-b border-white/5 scroll-mt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[9px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
              <Sparkles className="w-3.5 h-3.5" /> High-Demand Experiences
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mt-4 leading-tight">
              Trending <span className="text-gradient-gold italic">Special Offers</span>
            </h2>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              Curated luxury wellness packages and salon combinations at locked-in rates. Book now to secure your session.
            </p>
          </div>
          <Link
            href={`/services?gender=${activeGender}`}
            className="text-[10px] text-gold-600 hover:text-gold-500 font-bold uppercase tracking-widest flex items-center gap-2 group border border-gold-600/20 bg-gold-600/5 hover:bg-gold-600/10 px-4 py-2.5 rounded-full transition-all duration-300 self-start md:self-auto"
          >
            Explore Catalog <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {currentOffers.map((offer) => (
            <div
              key={offer.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0c0c0c] hover:border-gold-600/30 hover:shadow-[0_0_35px_rgba(201,168,76,0.12)] transition-all duration-500 overflow-hidden h-full"
            >
              {/* Image with overlay */}
              <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.04] transition-transform duration-700 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[8px] font-bold text-white uppercase tracking-widest">
                    {offer.category}
                  </span>
                </div>

                {/* Special Tag */}
                <div className="absolute bottom-3.5 left-3.5 px-2.5 py-0.5 rounded bg-gold-gradient text-[8px] font-extrabold text-dark uppercase tracking-widest shadow-sm z-10">
                  {offer.badge}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[9px] text-gold-600 font-extrabold uppercase tracking-widest luxe-subtitle block">
                    {offer.subtitle}
                  </span>
                  <h3 className="font-heading text-base font-semibold text-white leading-tight tracking-tight group-hover:text-gold-500 transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-[11px] text-white/50 leading-relaxed line-clamp-3">
                    {offer.description}
                  </p>
                </div>

                {/* Pricing & CTA Button */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[8px] text-white/40 uppercase tracking-widest luxe-subtitle block mb-1">
                        Locked Rate
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold text-white">₹{offer.discountPrice}</span>
                        <span className="text-xs text-white/30 line-through">₹{offer.originalPrice}</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-extrabold text-gold-500 uppercase tracking-wider bg-gold-600/10 border border-gold-600/20 px-2 py-0.5 rounded">
                      {offer.savings}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookNow(offer)}
                    className="w-full py-3 rounded-xl bg-gold-gradient text-dark text-[10px] font-black tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
