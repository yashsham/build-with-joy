"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import Navbar from "@/components/Navbar";
import { 
  Search, Star, Clock, Sparkles, Heart, Scissors, Flower2, Hand, Crown, 
  Plus, Minus, Check, ArrowRight, ShoppingBag, X, Info
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration: number;
  price: number;
  discountPrice: number | null;
  image: string | null;
  categoryId: string | null;
  gender: "female" | "male" | "unisex";
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  gender: "female" | "male" | "unisex";
  services: Service[];
}

const getGenderizedImage = (image: string | null, slug: string, activeGender: "female" | "male") => {
  if (!image) return "/assets/service-o3-glow-facial.png";
  
  if (activeGender === "male") {
    if (slug.includes("massage") || slug.includes("spa") || slug.includes("reflexology")) {
      if (slug.includes("head") || slug.includes("shoulder")) {
        return "/assets/service-mens-head-shoulder-massage.png";
      }
      return "/assets/service-mens-body-massage.png";
    }
    if (slug.includes("hair") || slug.includes("color") || slug.includes("smooth") || slug.includes("keratin")) {
      return "/assets/service-mens-hair-spa.png";
    }
    if (slug.includes("hydraglo") || slug.includes("facial") || slug.includes("cleanup") || slug.includes("cleansing")) {
      return "/assets/service-mens-dtan-cleanup.png";
    }
  }
  
  return image;
};

function ServicesCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const genderParam = searchParams.get("gender") as "female" | "male" | null;
  const searchParam = searchParams.get("search") || "";

  const { cart, addToCart, removeFromCart } = useApp();
  const [activeGender, setActiveGender] = useState<"female" | "male">(genderParam || "female");
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(searchParams.get("category"));

  // Sync state with url params if they change
  useEffect(() => {
    if (genderParam) {
      setActiveGender(genderParam);
    }
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategorySlug(cat);
      // Give a tiny delay for the DOM to render
      setTimeout(() => {
        const el = document.getElementById(cat);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [genderParam, searchParams]);

  // Fetch all services and categories
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const data = await res.json();
          setCategoriesData(data);
          
          const cat = searchParams.get("category");
          if (cat) {
            setActiveCategorySlug(cat);
            setTimeout(() => {
              const el = document.getElementById(cat);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 500);
          } else {
            // Set initial active category matching the gender
            const filteredCats = data.filter((c: any) => 
              c.gender === "unisex" || c.gender === activeGender
            );
            if (filteredCats.length > 0) {
              setActiveCategorySlug(filteredCats[0].slug);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeGender, searchParams]);

  // Filter categories by gender and search
  const filteredCategories = categoriesData
    .map((cat) => {
      // Filter services in this category by gender & search query
      const filteredSvcs = cat.services.filter((svc) => {
        const matchesGender = svc.gender === "unisex" || svc.gender === activeGender;
        const matchesSearch = searchQuery
          ? svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (svc.description && svc.description.toLowerCase().includes(searchQuery.toLowerCase()))
          : true;
        return matchesGender && matchesSearch;
      });

      return {
        ...cat,
        services: filteredSvcs,
      };
    })
    .filter((cat) => {
      // Show category if it matches selected gender (or unisex) AND has services matching search
      const matchesGender = cat.gender === "unisex" || cat.gender === activeGender;
      return matchesGender && cat.services.length > 0;
    });

  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleGenderSwitch = (gender: "female" | "male") => {
    setActiveGender(gender);
    setSearchQuery("");
    
    // Update URL query parameters
    const params = new URLSearchParams(window.location.search);
    params.set("gender", gender);
    router.push(`/services?${params.toString()}`);
  };

  const getServiceQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Header Toggle and Search */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 md:pb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl text-white">
              Luxury At-Home <span className="text-gradient-gold italic">Services</span>
            </h1>
            <p className="mt-2 text-xs text-white/50 luxe-subtitle uppercase tracking-widest">
              Bareilly
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
            {/* Search Input */}
            <div className="flex-1 sm:max-w-xs flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-full px-4 py-3">
              <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-white placeholder:text-white/30 outline-none w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="w-4 h-4 text-white/40 hover:text-white" />
                </button>
              )}
            </div>

            {/* Gender Toggle */}
            <div className="flex bg-[#0a0a0a] border border-white/10 rounded-full p-1">
              <button
                onClick={() => handleGenderSwitch("female")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest luxe-subtitle transition-all ${
                  activeGender === "female" 
                    ? "bg-gold-gradient text-dark shadow-[var(--shadow-gold-sm)]" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                FOR HER
              </button>
              <button
                onClick={() => handleGenderSwitch("male")}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-[10px] font-bold tracking-widest luxe-subtitle transition-all ${
                  activeGender === "male" 
                    ? "bg-gold-gradient text-dark shadow-[var(--shadow-gold-sm)]" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                FOR HIM
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center text-white/50 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-600 mx-auto mb-4" />
            Loading luxury catalog...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="py-24 text-center text-white/40 space-y-4">
            <Info className="w-12 h-12 text-gold-600/30 mx-auto" />
            <h3 className="font-heading text-2xl text-white">No services found</h3>
            <p className="text-xs max-w-xs mx-auto">We couldn't find any services matching your filters. Try clearing your search.</p>
            <button 
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 rounded-full bg-gold-gradient text-dark font-bold text-xs"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="mt-6 md:mt-8 flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-10">
            {/* Category Pills on mobile / Sidebar on desktop */}
            <aside className="lg:col-span-3">
              {/* Mobile: horizontal scroll pills */}
              <div className="flex lg:hidden overflow-x-auto scrollbar-none gap-2 pb-2 -mx-1 px-1">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategorySlug(cat.slug);
                      const el = document.getElementById(cat.slug);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      activeCategorySlug === cat.slug
                        ? "bg-gold-gradient text-dark font-bold"
                        : "bg-[#0a0a0a] border border-white/10 text-white/60"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              {/* Desktop: vertical sidebar */}
              <div className="hidden lg:block space-y-2 sticky top-28 h-[70vh] overflow-y-auto pr-2 scrollbar-none">
                <div className="text-xs text-white/40 font-bold uppercase tracking-widest luxe-subtitle mb-4">Categories</div>
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategorySlug(cat.slug);
                      const el = document.getElementById(cat.slug);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition text-xs font-semibold flex items-center justify-between ${
                      activeCategorySlug === cat.slug
                        ? "border-gold-600/30 bg-gold-600/5 text-gold-600"
                        : "border-white/5 bg-[#050505] text-white/60 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{cat.services.length}</span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Services Cards List */}
            <main className="lg:col-span-9 space-y-10 md:space-y-16">
              {filteredCategories.map((cat) => (
                <section key={cat.id} id={cat.slug} className="scroll-mt-28 space-y-5 md:space-y-6">
                  <div className="border-b border-white/5 pb-3 md:pb-4">
                    <h2 className="font-heading text-xl md:text-3xl text-white">{cat.name}</h2>
                    {cat.description && (
                      <p className="text-xs text-white/40 mt-1 leading-relaxed">{cat.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {cat.services.map((svc) => {
                      const quantity = getServiceQuantity(svc.id);
                      return (
                        <div 
                          key={svc.id}
                          className="rounded-2xl border border-white/5 bg-[#070707] p-5 hover:border-gold-600/20 transition duration-300 flex flex-col justify-between"
                        >
                          <div className="flex gap-4">
                            {/* Service Image placeholder/render */}
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0 relative">
                              <img 
                                src={getGenderizedImage(svc.image, svc.slug, activeGender)} 
                                alt={svc.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="space-y-1">
                              <h3 className="text-sm font-bold text-white line-clamp-1">{svc.name}</h3>
                              {svc.description && (
                                <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">{svc.description}</p>
                              )}
                              <div className="flex items-center gap-4 pt-1.5 text-[10px] text-white/40">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gold-600" /> {svc.duration} Min</span>
                                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-gold-600 fill-gold-600" /> 4.8</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 border-t border-white/5 pt-4 flex items-center justify-between">
                            <div className="flex items-baseline gap-2">
                              <span className="text-sm font-bold text-gold-600">₹{svc.discountPrice || svc.price}</span>
                              {svc.discountPrice && (
                                <span className="text-xs text-white/30 line-through">₹{svc.price}</span>
                              )}
                            </div>

                            {/* ADD / Quantity Selector */}
                            {quantity === 0 ? (
                              <button
                                onClick={() => {
                                  addToCart({ id: svc.id, name: svc.name, price: svc.price, discountPrice: svc.discountPrice });
                                  toast.success(`${svc.name} added to cart`);
                                }}
                                className="px-5 py-2.5 rounded-full bg-gold-gradient text-dark text-xs font-bold hover:scale-[1.02] active:scale-[0.98] transition shadow-[var(--shadow-gold-sm)]"
                              >
                                ADD
                              </button>
                            ) : (
                              <div className="flex items-center bg-[#0d0d0d] border border-gold-600/30 rounded-full overflow-hidden">
                                <button
                                  onClick={() => removeFromCart(svc.id)}
                                  className="px-3 py-2 text-gold-600 hover:bg-gold-600/10 transition"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                                <button
                                  onClick={() => addToCart({ id: svc.id, name: svc.name, price: svc.price, discountPrice: svc.discountPrice })}
                                  className="px-3 py-2 text-gold-600 hover:bg-gold-600/10 transition"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </main>
          </div>
        )}
      </div>

      {/* Floating Cart checkout sticky bottom banner for desktop & mobile */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[400px] z-50 rounded-2xl border border-gold-600/30 bg-black/95 backdrop-blur-md p-5 shadow-[0_10px_45px_rgba(201,168,76,0.15)] animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-gold-600 luxe-subtitle uppercase tracking-widest font-bold">Selected Booking</div>
              <div className="text-white font-bold text-sm mt-0.5">{cartCount} Service{cartCount > 1 ? "s" : ""} added</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Amount</div>
              <div className="text-gold-600 font-bold text-base mt-0.5">₹{cartTotal}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              href="/booking"
              className="flex-1 py-3 rounded-xl bg-gold-gradient text-dark font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-[var(--shadow-gold-sm)] hover:scale-[1.01] transition"
            >
              <ShoppingBag className="w-4 h-4" /> PROCEED TO BOOKING
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gold-600" />
      </div>
    }>
      <ServicesCatalog />
    </React.Suspense>
  );
}
