"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
const LinkNext = Link;
import { useApp } from "@/lib/context";
import Navbar from "@/components/Navbar";
import AdSlider from "@/components/AdSlider";
import { 
  MessageCircle, Phone, MapPin, Sparkles, ShieldCheck, Clock, Award, Star, 
  Users, Heart, Scissors, Flower2, Hand, Crown, Search, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, ChevronDown, Check, HelpCircle, ArrowRight, ShoppingBag,
  X, Info, Sparkle, Mail, Gift, Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const WHATSAPP = "917248253329";
const PHONE = "+91 72482 53329";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const milestones = [
  { icon: Users, num: "500+", label: "Trained Professionals" },
  { icon: Heart, num: "10k+", label: "Happy Households" },
  { icon: Star, num: "4.9", label: "Average Rating" },
  { icon: Award, num: "50+", label: "Signature Services" },
];

const loungeImages = [
  {
    src: "/assets/salon-interior-4.jpg",
    alt: "Hermosa Hair Styling Station",
    title: "Premium Hair Styling Lounge"
  },
  {
    src: "/assets/salon-interior-5.jpg",
    alt: "Hermosa Styling Area",
    title: "Luxury Seating & Styling Zone"
  },
  {
    src: "/assets/salon-interior-1.jpg",
    alt: "Hermosa Treatment Room",
    title: "Advanced Skin & Beauty Room"
  },
  {
    src: "/assets/salon-interior-2.jpg",
    alt: "Hermosa Spa & Massage Beds",
    title: "Private Therapy Rooms"
  },
  {
    src: "/assets/salon-interior-3.jpg",
    alt: "Hermosa Hair Wash Station",
    title: "Relaxing Hair Spa & Wash Zone"
  }
];

export default function Home() {
  const [activeGender, setActiveGender] = useState<"female" | "male">("female");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chooseServiceOpen, setChooseServiceOpen] = useState(false);
  const [chooseServiceGender, setChooseServiceGender] = useState<"female" | "male">("female");
  const [activePopupCategory, setActivePopupCategory] = useState<string | null>(null);
  const [mostBookedTab, setMostBookedTab] = useState<"salon" | "spa" | "hydraglo">("salon");
  const [openSeoAccordion, setOpenSeoAccordion] = useState<number | null>(null);
  const { cart, addToCart, removeFromCart } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  const [currentLoungeImage, setCurrentLoungeImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLoungeImage((prev) => (prev + 1) % loungeImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  // Drag-to-scroll for Most Booked section on desktop
  const mostBookedScrollRef = useRef<HTMLDivElement>(null);
  const isDraggingMostBooked = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const dragMoved = useRef(false);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!mostBookedScrollRef.current) return;
    isDraggingMostBooked.current = true;
    dragMoved.current = false;
    dragStartX.current = e.pageX - mostBookedScrollRef.current.offsetLeft;
    dragScrollLeft.current = mostBookedScrollRef.current.scrollLeft;
  };

  const handleDragEnd = () => {
    isDraggingMostBooked.current = false;
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDraggingMostBooked.current || !mostBookedScrollRef.current) return;
    const x = e.pageX - mostBookedScrollRef.current.offsetLeft;
    const walk = (x - dragStartX.current) * 1.5;
    if (Math.abs(x - dragStartX.current) > 5) {
      dragMoved.current = true;
    }
    mostBookedScrollRef.current.scrollLeft = dragScrollLeft.current - walk;
  };

  const handleDragClickCapture = (e: React.MouseEvent) => {
    if (dragMoved.current) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  // Show "Choose Your Service" modal on load once per session
  useEffect(() => {
    const shown = sessionStorage.getItem("hermosa_choose_service_shown");
    if (!shown) {
      const timer = setTimeout(() => {
        setChooseServiceOpen(true);
        sessionStorage.setItem("hermosa_choose_service_shown", "true");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const getServiceQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  // Subcategories mapping for bottom sheet popups (Women)
  const popupCategoriesData: Record<string, { title: string; items: { name: string; slug: string; search?: string; image: string }[] }> = {
    "salon-for-women": {
      title: "Salon for Women",
      items: [
        { name: "Waxing", slug: "waxing", image: "/assets/unique-service-42.jpg" },
        { name: "Clean-Up", slug: "facial-cleanup", image: "/assets/unique-service-45.jpg" },
        { name: "Body Polishing", slug: "female-salon", image: "/assets/unique-service-14.jpg" },
        { name: "Bleach, Dtan & Scrub", slug: "female-salon", image: "/assets/unique-service-1.jpg" },
        { name: "Mani-Pedi", slug: "female-salon", image: "/assets/unique-service-41.jpg" },
        { name: "Hair", slug: "hair", image: "/assets/unique-service-9.jpg" },
        { name: "Facial", slug: "facial-cleanup", image: "/assets/unique-service-40.jpg" },
        { name: "Threading & Face Wax", slug: "female-salon", image: "/assets/unique-service-43.jpg" },
      ]
    },
    "spa-for-women": {
      title: "Spa for Women",
      items: [
        { name: "Spa Services", slug: "spa-massage", image: "/assets/sub-spa-services.png" },
      ]
    },
    "hydraglo-facials": {
      title: "HydraGlo Facials",
      items: [
        { name: "HydraGlo Facials", slug: "hydraglo", image: "/assets/sub-hydra-facial.png" },
        { name: "HydraGlo Clean-Up", slug: "hydraglo", image: "/assets/sub-hydra-cleanup.png" },
        { name: "Body Polishing", slug: "spa-massage", image: "/assets/sub-body-polishing.png" },
        { name: "Intimate Care", slug: "female-salon", image: "/assets/sub-intimate-care.png" },
        { name: "Add On", slug: "hydraglo", image: "/assets/sub-add-on.png" },
      ]
    },
    "laser-treatments": {
      title: "Laser Treatments",
      items: [
        { name: "Packages", slug: "laser", image: "/assets/sub-laser-packages.png" },
        { name: "Laser Hair Reduction", slug: "laser", image: "/assets/sub-laser-hair-reduction.png" },
        { name: "Laser Facials", slug: "laser", image: "/assets/sub-laser-facials.png" },
        { name: "Laser Body Polishing", slug: "laser", image: "/assets/sub-laser-body-polishing.png" },
        { name: "Add-Ons", slug: "laser", image: "/assets/sub-laser-addons.png" },
      ]
    },
    "body-toning": {
      title: "Body Toning",
      items: [
        { name: "Packages", slug: "spa-massage", image: "/assets/sub-toning-packages.png" },
        { name: "Face & Body Toning", slug: "spa-massage", image: "/assets/sub-face-body-toning.png" },
      ]
    },
    "makeup-styling": {
      title: "Makeup & Styling",
      items: [
        { name: "Party Makeup", slug: "bridal", image: "/assets/sub-party-makeup.png" },
        { name: "Eye Makeup", slug: "bridal", image: "/assets/sub-eye-makeup.png" },
        { name: "Best Packages", slug: "bridal", image: "/assets/sub-best-packages.png" },
        { name: "Wedding Packages", slug: "bridal", image: "/assets/sub-wedding-packages.png" },
        { name: "Hair Style", slug: "bridal", image: "/assets/sub-hair-style.png" },
        { name: "Saree Draping", slug: "bridal", image: "/assets/sub-saree-draping.png" },
        { name: "Engagement Makeup", slug: "bridal", image: "/assets/sub-engagement-makeup.png" },
        { name: "Bridal Makeup", slug: "bridal", image: "/assets/sub-bridal-makeup.png" },
        { name: "Add On", slug: "bridal", image: "/assets/sub-add-on-makeup.png" },
      ]
    }
  };

  // Categories list based on gender (matching Explore Our Categories grid)
  const womenCategoriesList = [
    { id: "salon-for-women", name: "Salon for Women", image: "/assets/cat-salon-women.png" },
    { id: "spa-for-women", name: "Spa for Women", image: "/assets/cat-spa-women.png" },
    { id: "hydraglo-facials", name: "HydraGlo Facials", image: "/assets/cat-hydraglo.png", isMostBooked: true },
    { id: "laser-treatments", name: "Laser Treatments", image: "/assets/cat-laser.png" },
    { id: "body-toning", name: "Body Toning", image: "/assets/cat-body-toning.png" },
    { id: "makeup-styling", name: "Makeup & Styling", image: "/assets/cat-makeup.png" },
  ];

  const menCategoriesList = [
    { id: "male-grooming", name: "Male Grooming", image: "/assets/service-mens-haircut-styling.png", slug: "male-grooming" },
    { id: "male-spa", name: "Male Spa", image: "/assets/service-mens-body-massage.png", slug: "spa-massage" },
    { id: "male-hair", name: "Premium Hair Spa", image: "/assets/service-mens-head-shoulder-massage.png", slug: "hair" },
    { id: "male-hydraglo", name: "HydraGlo Facials", image: "/assets/service-mens-charcoal-facial.png", slug: "hydraglo" },
  ];

  // Most Booked services
  const mostBookedServices = {
    salon: [
      { id: "premium-honey-wax-arms-legs", name: "Premium Honey Full Arms + Half Legs Waxing", price: 399, discountPrice: 299, duration: 45, image: "/assets/service-premium-honey-wax-arms-legs.png", badge: "Most Booked" },
      { id: "o3-glow-facial", name: "O3+ Glow Facial (9 Steps)", price: 2199, discountPrice: 1899, duration: 60, image: "/assets/service-o3-glow-facial.png", badge: "9-Step Ritual" },
      { id: "threading-eyebrow-upperlip", name: "Threading (Eyebrows + Upper Lip)", price: 99, discountPrice: 59, duration: 15, image: "/assets/service-threading-eyebrow-upperlip.png", badge: "Express Care" },
      { id: "loreal-hair-spa", name: "L'Oreal Hair Spa & Nutrition", price: 1199, discountPrice: 899, duration: 50, image: "/assets/service-loreal-hair-spa.png", badge: "4 Free Gifts" },
    ],
    spa: [
      { id: "aroma-therapy-body-massage", name: "Aroma Therapy Full Body Massage", price: 1799, discountPrice: 1499, duration: 75, image: "/assets/service-aroma-therapy-body-massage.png", badge: "Sensory Healing" },
      { id: "deep-tissue-stress-relief", name: "Deep Tissue Stress Relief Massage", price: 2299, discountPrice: 1899, duration: 90, image: "/assets/service-deep-tissue-stress-relief.png", badge: "Hot Towel" },
      { id: "swedish-back-shoulder-massage", name: "Swedish Back & Shoulder Massage", price: 999, discountPrice: 799, duration: 45, image: "/assets/service-swedish-back-shoulder-massage.png", badge: "Pain Relief" },
    ],
    hydraglo: [
      { id: "classic-hydraglo", name: "Classic HydraGlo Skin Infusion Facial", price: 2999, discountPrice: 2499, duration: 60, image: "/assets/service-classic-hydraglo.png", badge: "Most Booked" },
      { id: "superbright-hydraglo", name: "SuperBright HydraGlo with Vitamin C", price: 3999, discountPrice: 3199, duration: 75, image: "/assets/service-superbright-hydraglo.png", badge: "Glass Skin" },
      { id: "agedefying-hydraglo", name: "Age-Defying Gold-Peptide HydraGlo", price: 4999, discountPrice: 3999, duration: 90, image: "/assets/service-agedefying-hydraglo.png", badge: "US-FDA Approved" },
    ]
  };

  const currentMostBooked = mostBookedServices[mostBookedTab];

  // Collapsible SEO description blocks
  const seoAccordions = [
    {
      title: "Redefine Beauty & Wellness With Hermosa Home Salon Services in Bareilly",
      content: "In a fast-paced city like Bareilly, where harsh weather, rising pollution, and long commutes are part of everyday life, skincare isn't just about beauty; it's a necessity. The dust, heat, and air quality often take a toll on skin and hair, making regular care essential. That's where Hermosa Luxe Home Service makes all the difference. Redefining grooming in Bareilly, we bring certified, background-verified beauty therapists and 5-star salon experiences directly to your doorstep. From quick cleanups to complex bridal consultations and relaxing massages, Hermosa ensures hygienic, affordable, and expert-driven beauty care."
    },
    {
      title: "Why Bareilly Needs Smarter Beauty & Skin Care Solutions",
      content: "Demanding schedules mean skipped self-care. Visiting traditional parlours involves long waits and traffic. Hermosa's home services let you fight back against these challenges. All treatments utilize strictly single-use original premium brands (O3+, Cheryl's, L'Oreal, Rica) sealed to guarantee purity and prevent skin contamination. Certified professionals bring complete equipment, sanitised tools, and protective uniforms, transforming your space into a private spa suite."
    },
    {
      title: "Facials & Cleanup at Home: Breathe Fresh into Tired Skin",
      content: "Hermosa's facials at home are designed to restore your glow. Choose from specialized D-Tan packs, Vitamin C brighteners, and US-FDA approved HydraGlo medical-grade facials. Our therapists assess your skin type, exfoliate, extract impurities, and infuse nutrients, leaving skin light, hydrated, and completely refreshed."
    },
    {
      title: "Waxing & Threading: Confidence and Comfort in Every Detail",
      content: "Say goodbye to painful salon waxing. Hermosa offers pain-free Rica Liposoluble waxing, chocolate waxing, and hygienic roll-on waxing combinations. Each booking includes a free disposal personal hygiene kit, pre-wax sanitization, and skin soothing post-wax lotions, preventing ingrown hair and redness."
    },
    {
      title: "Relax and Recharge With Calming Spa Services After a Hectic Week",
      content: "Step away from chaos with Hermosa's premium body spa and massage therapies. We offer aromatic oil massages, deep tissue stress relief, and foot reflexology. Our certified massage experts use proper pressure techniques to relieve muscle tension, improve circulation, and promote deep, restful sleep in the quiet comfort of your home."
    },
    {
      title: "Stunning Bridal & Occasion Makeups Without Leaving Home",
      content: "Prepare for your big day without the stress. Hermosa provides master HD and Airbrush bridal makeup packages, sagans, engagement glam, party styling, and professional saree/lehenga draping. We conduct trial consultations to create your dream look, executing it flawlessly at your home or wedding venue."
    }
  ];

  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold-600 selection:text-dark pb-20 md:pb-0 overflow-x-hidden">
      <Navbar />

      {/* STICKY SEARCH HEADER FOR MOBILE */}
      <div className="fixed top-20 left-0 right-0 z-30 bg-black/90 border-b border-white/5 p-4 flex items-center gap-3 lg:hidden backdrop-blur-md">
        <div className="flex-1 flex items-center gap-2 bg-[#0c0c0c] border border-white/10 rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-gold-600 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search waxing, facial, spa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder:text-white/35 outline-none w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="w-4 h-4 text-white/40 hover:text-white" />
            </button>
          )}
        </div>
        <LinkNext
          href={`/services?search=${encodeURIComponent(searchQuery)}`}
          className="text-[10px] text-dark font-bold bg-gold-gradient px-4 py-2.5 rounded-full shadow-md"
        >
          GO
        </LinkNext>
      </div>

      {/* HERO HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative h-[85vh] md:h-screen w-full flex items-center justify-center overflow-hidden pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover brightness-100 transition-all duration-500"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />
        </div>

        {/* Floating mute/unmute control */}
        <button
          onClick={() => setIsVideoMuted(!isVideoMuted)}
          className="absolute bottom-6 right-6 z-20 h-10 w-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition backdrop-blur-md shadow-md"
          title={isVideoMuted ? "Unmute Video" : "Mute Video"}
        >
          {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-600/40 bg-black/60 backdrop-blur-md text-xs text-gold-600 luxe-subtitle mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-pulse" />
            Luxury Home Salon · Bareilly
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
          >
            Glow in the <span className="text-gradient-gold italic">Comfort</span> of <br className="hidden md:block" />
            Your Own Home.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-xs sm:text-sm md:text-base lg:text-lg text-white/90 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium"
          >
            Bringing India's top-tier beauty therapists, massage experts, and bridal makeup artists directly to your doorstep. Pure ingredients, sealed brand-kits, and 5-star hygiene.
          </motion.p>

          {/* Quick Search for Desktop */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 w-full max-w-lg hidden lg:flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full p-2"
          >
            <Search className="w-5 h-5 text-gold-600 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search waxing, O3+ facial, bridal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none px-2 py-3"
            />
            <LinkNext
              href={`/services?search=${encodeURIComponent(searchQuery)}`}
              className="text-xs text-dark font-bold bg-gold-gradient px-6 py-3.5 rounded-full shadow-[var(--shadow-gold-sm)] hover:scale-[1.02] active:scale-[0.98] transition"
            >
              FIND
            </LinkNext>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setChooseServiceOpen(true)}
              className="px-6 py-3 rounded-full bg-gold-gradient text-dark text-sm font-bold shadow-[var(--shadow-gold-sm)] hover:scale-105 active:scale-95 transition"
            >
              Book Service Now
            </button>
            <LinkNext
              href="/services"
              className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/5 active:bg-white/10 transition text-sm text-white/80"
            >
              Explore Menu
            </LinkNext>
          </div>
        </div>
      </section>

      {/* MILESTONES SECTION */}
      <section id="milestones" className="py-12 md:py-16 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="text-center px-2">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-gold-600/20 bg-gold-600/5 text-gold-600">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="font-heading text-2xl md:text-3xl text-gradient-gold">
                    {m.num}
                  </div>
                  <div className="mt-1 text-[9px] tracking-widest text-white/40 uppercase luxe-subtitle">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AD SLIDER BANNER */}
      <AdSlider />

      {/* EXPLORE OUR CATEGORIES SECTION */}
      <section id="explore-categories" className="py-14 md:py-20 bg-black scroll-mt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-heading text-2xl md:text-4xl text-white">Explore Our Categories</h2>
            <p className="mt-2 text-xs text-white/50 leading-relaxed">
              Certified salon and wellness rituals delivered directly to your home.
            </p>
          </div>

          {/* Gender Selector with Face avatars */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveGender("female")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all ${
                activeGender === "female"
                  ? "border-gold-600/40 bg-gold-600/10 text-gold-600 shadow-[var(--shadow-gold-sm)]"
                  : "border-white/5 bg-[#0a0a0a] text-white/60 hover:text-white"
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-gold-600/20">
                <img src="/assets/service-facial.jpg" alt="Women" className="w-full h-full object-cover" />
              </div>
              Women
            </button>
            <button
              onClick={() => setActiveGender("male")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all ${
                activeGender === "male"
                  ? "border-gold-600/40 bg-gold-600/10 text-gold-600 shadow-[var(--shadow-gold-sm)]"
                  : "border-white/5 bg-[#0a0a0a] text-white/60 hover:text-white"
              }`}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-gold-600/20">
                <img src="/assets/service-deep.jpg" alt="Men" className="w-full h-full object-cover animate-grayscale" />
              </div>
              Men
            </button>
          </div>

          {/* Categories Circle/Avatar Grid */}
          <AnimatePresence mode="wait">
          {activeGender === "female" ? (
            <motion.div
              key="female-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-3 md:grid-cols-3 gap-6 max-w-2xl mx-auto justify-items-center"
            >
              {womenCategoriesList.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  onClick={() => setActivePopupCategory(cat.id)}
                  className="flex flex-col items-center text-center group cursor-pointer w-24 sm:w-28"
                >
                  {/* Light blue circle background like reference images */}
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                    style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 60%, #bfdbfe 100%)" }}
                  >
                    {cat.isMostBooked && (
                      <span className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 bg-gold-600 text-dark text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full tracking-wider whitespace-nowrap shadow">
                        Most Booked
                      </span>
                    )}
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/service-facial.jpg";
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white/80 group-hover:text-gold-600 mt-2.5 leading-snug transition">
                    {cat.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="male-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto justify-items-center"
            >
              {menCategoriesList.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <LinkNext
                    href={`/services?gender=male&category=${cat.slug}`}
                    className="flex flex-col items-center text-center group cursor-pointer w-24 sm:w-28"
                  >
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                      style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 60%, #bfdbfe 100%)" }}
                    >
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <span className="text-[11px] font-bold text-white/80 group-hover:text-gold-600 mt-2.5 leading-snug transition">
                      {cat.name}
                    </span>
                  </LinkNext>
                </motion.div>
              ))}
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </section>

      {/* MOST BOOKED SECTION */}
      <section className="py-14 md:py-20 bg-[#040404] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col gap-5 mb-8 md:mb-10">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl text-white">Most Booked</h2>
              <p className="mt-1.5 text-xs text-white/45">Our signature beauty, cleanup and massage packages.</p>
            </div>

            {/* Slider Tabs - scrollable on mobile */}
            <div className="flex overflow-x-auto scrollbar-none -mx-1 px-1 pb-1 gap-2">
              <button
                onClick={() => setMostBookedTab("salon")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  mostBookedTab === "salon" 
                    ? "bg-gold-gradient text-dark font-black shadow-sm" 
                    : "bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Salon for Women
              </button>
              <button
                onClick={() => setMostBookedTab("spa")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  mostBookedTab === "spa" 
                    ? "bg-gold-gradient text-dark font-black shadow-sm" 
                    : "bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Spa for Women
              </button>
              <button
                onClick={() => setMostBookedTab("hydraglo")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  mostBookedTab === "hydraglo" 
                    ? "bg-gold-gradient text-dark font-black shadow-sm" 
                    : "bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                HydraGlo Facials
              </button>
            </div>
          </div>

          {/* Horizontal scroll list */}
          <div 
            ref={mostBookedScrollRef}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onMouseMove={handleDragMove}
            onClickCapture={handleDragClickCapture}
            className="flex gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none cursor-grab active:cursor-grabbing select-none"
          >
            {currentMostBooked.map((svc) => {
              const qty = getServiceQuantity(svc.id);
              return (
                <div 
                  key={svc.id}
                  className="w-72 rounded-2xl border border-white/5 bg-[#090909] p-4 flex flex-col justify-between flex-shrink-0 relative hover:border-gold-600/30 transition duration-300"
                >
                  <span className="absolute top-6 left-6 z-10 bg-gold-600 text-dark text-[8px] font-bold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-md">
                    {svc.badge}
                  </span>
                  
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-white/5 bg-white/5 mb-4">
                    <img src={svc.image} alt={svc.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1">{svc.name}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-white/45">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3 text-gold-600" /> {svc.duration} Mins</span>
                      <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-gold-600 fill-gold-600" /> 4.9</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-gold-600">₹{svc.discountPrice}</span>
                      <span className="text-[10px] text-white/30 line-through">₹{svc.price}</span>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => {
                          addToCart({ id: svc.id, name: svc.name, price: svc.price, discountPrice: svc.discountPrice });
                          toast.success(`${svc.name} added to cart`);
                        }}
                        className="px-4 py-1.5 rounded-full bg-gold-gradient text-dark text-[10px] font-black hover:scale-105 active:scale-95 transition shadow-sm"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center bg-[#0d0d0d] border border-gold-600/30 rounded-full overflow-hidden">
                        <button
                          onClick={() => removeFromCart(svc.id)}
                          className="px-2.5 py-1 text-gold-600 hover:bg-gold-600/10 transition"
                        >
                          -
                        </button>
                        <span className="px-2 text-[10px] font-bold text-white">{qty}</span>
                        <button
                          onClick={() => addToCart({ id: svc.id, name: svc.name, price: svc.price, discountPrice: svc.discountPrice })}
                          className="px-2.5 py-1 text-gold-600 hover:bg-gold-600/10 transition"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MULTISESSION BANNER */}
      <section className="py-12 md:py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-gradient-to-br from-yellow-950/20 via-black to-[#060606] p-6 sm:p-8 md:p-12 text-center space-y-5 md:space-y-6">
            <h3 className="font-heading text-xl md:text-2xl text-gradient-gold">More Relaxation, More Savings</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              Unlock cumulative discounts with our multisession package. Perfect for regular routines.
            </p>
            
            <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-lg mx-auto pt-3">
              <div className="border border-gold-600/20 rounded-xl bg-gold-600/5 p-2.5 md:p-3 flex flex-col items-center">
                <span className="text-[10px] md:text-xs text-white/40">2 Sessions</span>
                <span className="text-sm font-bold text-gold-600 mt-1">₹300 OFF</span>
              </div>
              <div className="border border-gold-600/20 rounded-xl bg-gold-600/5 p-2.5 md:p-3 flex flex-col items-center">
                <span className="text-[10px] md:text-xs text-white/40">4 Sessions</span>
                <span className="text-sm font-bold text-gold-600 mt-1">₹700 OFF</span>
              </div>
              <div className="border border-gold-600/20 rounded-xl bg-gold-600/5 p-2.5 md:p-3 flex flex-col items-center">
                <span className="text-[10px] md:text-xs text-white/40">6 Sessions</span>
                <span className="text-sm font-bold text-gold-600 mt-1">₹1500 OFF</span>
              </div>
            </div>
            
            <div className="pt-4">
              <LinkNext
                href="/services?category=spa-massage"
                className="px-6 py-2.5 rounded-full bg-gold-gradient text-dark text-xs font-bold shadow-[var(--shadow-gold-sm)] hover:scale-105 transition"
              >
                Book Spa Ritual
              </LinkNext>
            </div>
          </div>
        </div>
      </section>

      {/* REFER AND EARN BANNER */}
      <section className="py-12 bg-black border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-2xl overflow-hidden border border-gold-600/20 bg-[#0c0c0c] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="h-12 w-12 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center">
                <Gift className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider luxe-subtitle">Refer a Partner & Earn</h4>
                <p className="text-[11px] text-white/50 mt-0.5">Invite a professional beautician to Hermosa & earn up to ₹10,000</p>
              </div>
            </div>
            <LinkNext
              href="/contact?tab=careers"
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark text-[10px] font-black tracking-widest uppercase shadow-sm flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" /> Refer Now
            </LinkNext>
          </div>
        </div>
      </section>

      {/* Flagship physical lounges section */}
      <section id="lounge" className="py-14 md:py-20 relative overflow-hidden bg-[#020202] scroll-mt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <div className="text-xs text-gold-600 luxe-subtitle">Visit Our Lounges</div>
            <h2 className="font-heading text-2xl md:text-4xl text-white leading-tight">
              Prefer a Salon Visit? <br />
              <span className="text-gradient-gold italic">Experience Our Flagship Lounges</span>
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              While we specialize in home services, Hermosa also hosts exclusive flagship lounges for premium bridal consultations, micro-pigmentation, and advanced laser treatments.
            </p>
            <div className="pt-4 flex gap-4">
              <a
                href={waLink("Hi Hermosa, I'd like to book an appointment at your Bareilly Flagship Lounge.")}
                target="_blank"
                className="px-5 py-3 rounded-full bg-gold-gradient text-dark font-bold hover:scale-105 transition shadow-md text-[10px]"
              >
                Book Lounge Visit
              </a>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden border border-gold-600/20 aspect-[4/3] shadow-lg group">
            {/* Carousel images */}
            <div className="absolute inset-0 w-full h-full">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentLoungeImage}
                  src={loungeImages[currentLoungeImage].src}
                  alt={loungeImages[currentLoungeImage].alt}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

            {/* Image caption badge */}
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-sm pointer-events-none z-10">
              <span className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">
                {loungeImages[currentLoungeImage].title}
              </span>
            </div>

            {/* Manual Controls (Arrow Buttons) */}
            <button
              onClick={() => setCurrentLoungeImage((prev) => (prev - 1 + loungeImages.length) % loungeImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100 z-20"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentLoungeImage((prev) => (prev + 1) % loungeImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition opacity-0 group-hover:opacity-100 z-20"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Indicators */}
            <div className="absolute top-4 right-4 flex gap-1.5 z-20">
              {loungeImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentLoungeImage(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentLoungeImage ? "bg-gold-500 w-3" : "bg-white/40"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Location banner */}
            <a 
              href="https://www.google.com/maps/place/28%C2%B023'01.0%22N+79%C2%B025'26.1%22E/@28.3836079,79.4213448,17z/data=!3m1!4b1!4m4!3m3!8m2!3d28.3836079!4d79.4239197"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 left-4 right-4 p-4 rounded-xl border border-white/5 bg-black/60 backdrop-blur-md hover:border-gold-600/50 hover:bg-black/80 transition duration-300 block group/link z-20"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-xs group-hover/link:text-gold-600 transition">Sheel Chauraha, Civil Lines, Bareilly</h3>
                  <p className="text-[10px] text-white/50 mt-0.5">Open daily: 9:00 AM — 9:00 PM</p>
                </div>
                <span className="text-[9px] text-gold-600 uppercase tracking-widest font-bold border border-gold-600/30 px-2.5 py-1 rounded bg-gold-600/5 group-hover/link:bg-gold-600 group-hover/link:text-dark transition">Map</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* CELEBRITIES STORIES SECTION */}
      <section id="press" className="py-14 md:py-20 bg-[#050505] border-y border-white/5 scroll-mt-24">
        <div id="reviews" className="max-w-4xl mx-auto px-4 sm:px-6 scroll-mt-24">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-white">Stories From the Best</h2>
            <p className="mt-1.5 text-xs text-white/50">Loved by leading creators and celebrity stylists.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-2xl mx-auto">
            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 flex flex-col items-center text-center space-y-4">
              <div className="h-28 w-28 rounded-full overflow-hidden border border-gold-600/20 bg-white/5">
                <img src="/assets/media-ekta.png" alt="Ekta Kapoor" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gold-600 uppercase tracking-widest luxe-subtitle">Ekta Kapoor</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Director & Producer</p>
              </div>
              <p className="text-xs text-white/70 italic leading-relaxed">
                "Convenience is the ultimate luxury. Hermosa brings five-star salon hygiene right to my dressing table before shoot hours."
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 flex flex-col items-center text-center space-y-4">
              <div className="h-28 w-28 rounded-full overflow-hidden border border-gold-600/20 bg-white/5">
                <img src="/assets/media-divyanka.png" alt="Divyanka Tripathi" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gold-600 uppercase tracking-widest luxe-subtitle">Divyanka Tripathi</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Lifestyle Influencer</p>
              </div>
              <p className="text-xs text-white/70 italic leading-relaxed">
                "No loose cosmetic containers, strictly sealed brand-kits, and detailed hygiene kits. Truly the safest home spa in India."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-14 md:py-20 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-heading text-2xl md:text-3xl text-white">Frequently Asked</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "How to find beauty parlour services at home in Bareilly?", a: "Book parlour at home on Hermosa by selecting your required service, choosing a verified beautician in Bareilly, and scheduling your preferred time slot." },
              { q: "How does Hermosa ensure safety and hygiene?", a: "All Hermosa professionals undergo rigorous background verification, police vetting, and comprehensive hygiene training. They carry single-use mono-dose brand kits, wear fresh protective uniforms, and sterilize all tools in front of you." },
              { q: "Do I need to provide anything for the service?", a: "Not at all. Our beauty professionals bring everything required, including folding massage tables/beds, towels, disposable sheets, hot water warmers, and premium branded cosmetic kits." },
              { q: "Which beauty brands do you use?", a: "We only use original premium brands. Depending on your service selection, this includes O3+, Lotus Herbals, Cheryl's, and Rica. We strictly prohibit loose products." }
            ].map((faq, index) => (
              <div 
                key={index}
                className="border border-white/5 bg-[#070707] rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:text-gold-600 transition"
                >
                  <span className="text-xs font-bold">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${activeFaq === index ? "rotate-180 text-gold-600" : ""}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs text-white/60 leading-relaxed border-t border-white/5 mt-2 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO ACCORDIONS SECTION */}
      <section className="py-16 bg-[#040404] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-2 border-b border-white/5 pb-4 mb-6">
            <h4 className="text-[10px] font-bold text-gold-600 uppercase tracking-widest luxe-subtitle">More About Hermosa Services</h4>
          </div>
          <div className="space-y-4">
            {seoAccordions.map((seo, index) => (
              <div key={index} className="border-b border-white/5 pb-3">
                <button
                  onClick={() => setOpenSeoAccordion(openSeoAccordion === index ? null : index)}
                  className="w-full flex items-center justify-between text-left py-2 hover:text-gold-600 transition text-xs font-bold"
                >
                  <span>{seo.title}</span>
                  <ChevronDown className={`w-4 h-4 text-white/45 transition-transform ${openSeoAccordion === index ? "rotate-180 text-gold-600" : ""}`} />
                </button>
                {openSeoAccordion === index && (
                  <p className="text-[11px] text-white/50 leading-relaxed mt-2 pt-2 border-t border-white/5">
                    {seo.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 pt-12 md:pt-16 pb-28 md:pb-12 text-white/40 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/hermosa-logo.png" alt="Hermosa Logo" className="h-10 w-10 object-contain" />
              <div>
                <div className="font-heading text-base text-gradient-gold">Hermosa</div>
                <div className="text-[8px] text-gold-600/50 luxe-subtitle tracking-widest">Luxe Home Service</div>
              </div>
            </div>
            <p className="leading-relaxed text-white/40 text-[11px]">
              India's premium door-step beauty, spa, and bridal salon. Built for absolute safety, transparency, and glowing results.
            </p>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] text-gold-600 luxe-subtitle uppercase tracking-widest font-black">Services</div>
            <ul className="space-y-2 text-[11px] text-white/40">
              <li><LinkNext href="/services?gender=female&category=female-salon" className="hover:text-gold-600">Female Salon Menu</LinkNext></li>
              <li><LinkNext href="/services?gender=female&category=spa-massage" className="hover:text-gold-600">Aromatic Body Spa</LinkNext></li>
              <li><LinkNext href="/services?gender=female&category=waxing" className="hover:text-gold-600">Painless Rica Waxing</LinkNext></li>
              <li><LinkNext href="/services?gender=female&category=bridal" className="hover:text-gold-600">Bridal Makeups</LinkNext></li>
              <li><LinkNext href="/services?gender=male&category=male-grooming" className="hover:text-gold-600">Male Haircut & Grooming</LinkNext></li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] text-gold-600 luxe-subtitle uppercase tracking-widest font-black">Company</div>
            <ul className="space-y-2 text-[11px] text-white/40">
              <li><LinkNext href="/#milestones" className="hover:text-gold-600">Our Milestones</LinkNext></li>
              <li><LinkNext href="/professionals/register" className="hover:text-gold-600 text-gold-600 font-semibold">Join as Partner</LinkNext></li>
              <li><LinkNext href="/contact?tab=support" className="hover:text-gold-600">Contact Support</LinkNext></li>
              <li><LinkNext href="/contact?tab=careers" className="hover:text-gold-600">Careers</LinkNext></li>
              <li><LinkNext href="/#reviews" className="hover:text-gold-600">Customer Reviews</LinkNext></li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] text-gold-600 luxe-subtitle uppercase tracking-widest font-black">Reach Us</div>
            <ul className="space-y-2.5 text-[11px] text-white/40">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-600 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/place/28%C2%B023'01.0%22N+79%C2%B025'26.1%22E/@28.3836079,79.4213448,17z/data=!3m1!4b1!4m4!3m3!8m2!3d28.3836079!4d79.4239197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-600 transition"
                >
                  Sheel Chauraha, Civil Lines, Bareilly, UP
                </a>
              </li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-600" /> {PHONE}</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-gold-600" /> WhatsApp Support 24/7</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold-600" /> <a href="mailto:hermosasalon325@gmail.com" className="hover:text-gold-600">hermosasalon325@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-[10px]">
          <div>© {new Date().getFullYear()} Hermosa Luxe Home Service. All rights reserved.</div>
          <div className="luxe-subtitle tracking-widest text-[9px]">Crafted with love in India</div>
        </div>
      </footer>

      {/* FLOATING CART STICKY BANNER */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-[380px] z-50 rounded-2xl border border-gold-600/30 bg-black/95 backdrop-blur-md p-4 shadow-[0_10px_45px_rgba(201,168,76,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-600 text-dark text-[10px] font-black">
                {cartCount}
              </span>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-widest luxe-subtitle">Selected Booking</div>
              <div className="text-white font-bold text-xs mt-0.5">₹{cartTotal}</div>
            </div>
          </div>
          <LinkNext
            href="/booking"
            className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark font-bold text-[10px] uppercase tracking-wider shadow-[var(--shadow-gold-sm)] hover:scale-102 transition"
          >
            PROCEED
          </LinkNext>
        </div>
      )}

      {/* CHOOSE YOUR SERVICE BOTTOM SHEET POPUP */}
      <AnimatePresence>
        {chooseServiceOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setChooseServiceOpen(false)}
            />
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
                <h3 className="font-heading text-lg text-white">Choose Your Service</h3>
                <button
                  onClick={() => setChooseServiceOpen(false)}
                  className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab control in popup */}
              <div className="flex bg-[#000] border border-white/5 rounded-2xl p-1 mb-6">
                <button
                  onClick={() => setChooseServiceGender("female")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    chooseServiceGender === "female"
                      ? "bg-gold-gradient text-dark"
                      : "text-white/60"
                  }`}
                >
                  Women
                </button>
                <button
                  onClick={() => setChooseServiceGender("male")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    chooseServiceGender === "male"
                      ? "bg-gold-gradient text-dark"
                      : "text-white/60"
                  }`}
                >
                  Men
                </button>
              </div>

              {/* Popup Category Content */}
              <div className="space-y-4">
                {chooseServiceGender === "female" ? (
                  <>
                    <button
                      onClick={() => {
                        setChooseServiceOpen(false);
                        setActiveGender("female");
                        const el = document.getElementById("explore-categories");
                        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left"
                    >
                      <img src="/assets/service-hair.jpg" alt="Salon at Home" className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500" />
                      <div className="relative z-10 space-y-1">
                        <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Salon at Home</h4>
                        <p className="text-[10px] text-white/60">Waxing, Facials, Mani-Pedi and more</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                          EXPLORE <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </button>

                    <LinkNext
                      href="/services?gender=female&category=spa-massage"
                      onClick={() => setChooseServiceOpen(false)}
                      className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left"
                    >
                      <img src="/assets/service-spa.jpg" alt="Spa at Home" className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500" />
                      <div className="relative z-10 space-y-1">
                        <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Spa at Home</h4>
                        <p className="text-[10px] text-white/60">Relaxing & Pain Relieving Massage</p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                          EXPLORE <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </LinkNext>
                  </>
                ) : (
                  <LinkNext
                    href="/services?gender=male&category=spa-massage"
                    onClick={() => setChooseServiceOpen(false)}
                    className="w-full relative h-36 rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-t from-black via-black/40 to-transparent group flex items-end p-6 text-left"
                  >
                    <img src="/assets/service-deep.jpg" alt="Male Spa" className="absolute inset-0 w-full h-full object-cover brightness-[0.45] group-hover:scale-105 transition duration-500 animate-grayscale" />
                    <div className="relative z-10 space-y-1">
                      <h4 className="text-base font-bold text-white uppercase tracking-wider luxe-subtitle">Male Spa</h4>
                      <p className="text-[10px] text-white/60">Relaxing & Pain Relieving Massage</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold-600 font-bold mt-2">
                        EXPLORE <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </LinkNext>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUBCATEGORY POPUP BOTTOM SHEETS */}
      <AnimatePresence>
        {activePopupCategory && popupCategoriesData[activePopupCategory] && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent"
              onClick={() => setActivePopupCategory(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-[#0a0a0a] rounded-t-3xl border-t border-white/10 p-6 z-10 shadow-2xl flex flex-col max-h-[75vh]"
            >
              {/* Drag Handle */}
              <div className="mx-auto w-12 h-1 bg-white/10 rounded-full mb-6" />

              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <h3 className="font-heading text-lg text-white">
                  {popupCategoriesData[activePopupCategory].title}
                </h3>
                <button
                  onClick={() => setActivePopupCategory(null)}
                  className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Subcategories Grid */}
              <div className="overflow-y-auto pr-1 flex-1 pb-4">
                <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                  {popupCategoriesData[activePopupCategory].items.map((sub, idx) => (
                    <LinkNext
                      key={idx}
                      href={`/services?gender=female&category=${sub.slug}&search=${encodeURIComponent(sub.name)}`}
                      onClick={() => setActivePopupCategory(null)}
                      className="flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                        style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 60%, #bfdbfe 100%)" }}
                      >
                        <img 
                          src={sub.image} 
                          alt={sub.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/assets/service-facial.jpg";
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/70 group-hover:text-gold-600 mt-2 transition leading-tight">
                        {sub.name}
                      </span>
                    </LinkNext>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
