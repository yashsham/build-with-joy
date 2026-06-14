"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
const LinkNext = Link;
import { useApp } from "@/lib/context";
import Navbar from "@/components/Navbar";
import AdSlider from "@/components/AdSlider";
import { HermosaImageRegistry } from "@/lib/imageRegistry";
import { 
  MessageCircle, Phone, MapPin, Sparkles, ShieldCheck, Clock, Award, Star, 
  Users, Heart, Scissors, Flower2, Hand, Crown, Search, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, ChevronDown, Check, HelpCircle, ArrowRight, ShoppingBag,
  X, Info, Sparkle, Mail, Gift, Share2, Quote
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







const STATIC_REVIEWS = [
  {
    userName: "Aanya M.",
    area: "Civil Lines",
    comment: "Booked the bridal trial a week before my engagement. The artist showed up early, kit organised like a film set. I cried (then laughed) when I saw the mirror.",
    rating: 5
  },
  {
    userName: "Rohan K.",
    area: "Rampur Garden",
    comment: "Got the deep-tissue spa for my mother's birthday. She fell asleep mid-session and rebooked the next week. That's the only review you need.",
    rating: 5
  },
  {
    userName: "Priya S.",
    area: "Sheel Chauraha",
    comment: "Mehendi for 14 cousins, 6 hours flat, three artists working in sync. Hermosa turned my haldi into the calmest part of the wedding.",
    rating: 5
  },
  {
    userName: "Ishita R.",
    area: "Subhash Nagar",
    comment: "Honey waxing at home, candlelight, my own playlist. I am never going back to a salon.",
    rating: 5
  },
  {
    userName: "Megha T.",
    area: "Krishna Puri",
    comment: "Facial + cleanup combo, brand products, no upselling. The therapist explained every step. Felt like a five-star resort in my own bedroom.",
    rating: 5
  }
];

function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [count, setCount] = useState<string | number>(value);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const numMatch = value.match(/^([\d.]+)(.*)$/);
    if (!numMatch) return;
    const target = parseFloat(numMatch[1]);
    const suffix = numMatch[2] || "";
    
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      let currentVal = progress * target;
      let displayCount = value.includes(".") ? currentVal.toFixed(1) : Math.floor(currentVal).toString();
      
      setCount(`${displayCount}${suffix}`);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{mounted ? count : value}</span>;
}

const CELEB_STORIES = [
  {
    id: "ekta",
    name: "Ekta Kapoor",
    role: "Director & Producer",
    image: "/assets/media-ekta.png",
    quote: "Convenience is the ultimate luxury. Hermosa brings five-star salon hygiene right to my dressing table before shoot hours."
  },
  {
    id: "divyanka",
    name: "Divyanka Tripathi",
    role: "Lifestyle Influencer",
    image: "/assets/media-divyanka.png",
    quote: "No loose cosmetic containers, strictly sealed brand-kits, and detailed hygiene kits. Truly the safest home spa in India."
  }
];

export default function Home() {
  const { 
    gender: activeGender, 
    setGender: setActiveGender,
    cart, 
    addToCart, 
    removeFromCart, 
    setIsChooseServiceOpen,
    theme
  } = useApp();
  const [customerReviews, setCustomerReviews] = useState<any[]>(STATIC_REVIEWS);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewArea, setNewReviewArea] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCustomerReviews(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load reviews:", err);
      });
  }, []);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [activePopupCategory, setActivePopupCategory] = useState<string | null>(null);
  const [mostBookedTab, setMostBookedTab] = useState<"salon" | "spa" | "hydraglo">("salon");
  const [openSeoAccordion, setOpenSeoAccordion] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // Refer Now Modal States & Submissions
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [referStep, setReferStep] = useState<"form" | "success">("form");
  const [referType, setReferType] = useState<"partner" | "customer">("customer");
  const [referForm, setReferForm] = useState({
    yourName: "",
    yourPhone: "",
    friendName: "",
    friendPhone: "",
    friendRole: "beautician",
  });

  const handleReferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReferral = {
      ...referForm,
      type: referType,
      date: new Date().toLocaleDateString(),
      status: "Pending Verification"
    };
    const existing = JSON.parse(localStorage.getItem("hermosa_referrals") || "[]");
    localStorage.setItem("hermosa_referrals", JSON.stringify([newReferral, ...existing]));
    setReferStep("success");
    toast.success("Referral registered successfully!");
  };

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



  const getServiceQuantity = (id: string) => {
    const item = cart.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  // Subcategories mapping for bottom sheet popups (Women)
  const popupCategoriesData: Record<string, { title: string; items: { name: string; slug: string; search?: string; image: string; tagline?: string }[] }> = {
    "salon-for-women": {
      title: "Salon for Women",
      items: [
        { name: "Waxing", slug: "waxing", search: "", image: "/assets/service-waxing.png", tagline: "Rica & Honey waxing" },
        { name: "Clean-Up", slug: "facial-cleanup", search: "cleanup", image: "/assets/service-cleanup.png", tagline: "Dirt & tan extraction" },
        { name: "Body Polishing", slug: "spa-massage", search: "polishing", image: "/assets/service-body-polishing.png", tagline: "Full body scrub glow" },
        { name: "Bleach, Dtan & Scrub", slug: "female-salon", search: "dtan", image: "/assets/service-premium-dtan-face-neck.png", tagline: "Instant skin brightening" },
        { name: "Mani-Pedi", slug: "female-salon", search: "pedi", image: "/assets/service-pedi-mani-classic.png", tagline: "Relaxing nail groom" },
        { name: "Hair", slug: "hair", search: "", image: "/assets/service-womens-blowdry-styling.png", tagline: "Hair wash, cut & style" },
        { name: "Facial", slug: "facial-cleanup", search: "facial", image: "/assets/service-o3-glow-facial.png", tagline: "Signature brand facials" },
        { name: "Threading & Face Wax", slug: "female-salon", search: "threading", image: "/assets/service-threading.png", tagline: "Precision eyebrow shape" },
      ]
    },
    "spa-for-women": {
      title: "Spa for Women",
      items: [
        { name: "Spa Services", slug: "spa-massage", search: "", image: "/assets/sub-spa-services.png", tagline: "Therapeutic body healing" },
      ]
    },
    "hydraglo-facials": {
      title: "HydraGlo Facials",
      items: [
        { name: "HydraGlo Facials", slug: "hydraglo", search: "hydraglo", image: "/assets/sub-hydra-facial.png", tagline: "US-FDA skin infusion" },
        { name: "HydraGlo Clean-Up", slug: "hydraglo", search: "hydraglo", image: "/assets/sub-hydra-cleanup.png", tagline: "Deep blackhead removal" },
        { name: "Body Polishing", slug: "spa-massage", search: "polishing", image: "/assets/sub-body-polishing.png", tagline: "Hydrating body scrub" },
        { name: "Intimate Care", slug: "waxing", search: "brazilian", image: "/assets/sub-intimate-care.png", tagline: "Painless & gentle care" },
        { name: "Add On", slug: "hydraglo", search: "hydraglo", image: "/assets/sub-add-on.png", tagline: "Specialized peel boosters" },
      ]
    },
    "laser-treatments": {
      title: "Laser Treatments",
      items: [
        { name: "Packages", slug: "laser", search: "laser", image: "/assets/sub-laser-packages.png", tagline: "Multi-session value packs" },
        { name: "Laser Hair Reduction", slug: "laser", search: "laser", image: "/assets/sub-laser-hair-reduction.png", tagline: "FDA-approved hair free" },
        { name: "Laser Facials", slug: "laser", search: "laser", image: "/assets/sub-laser-facials.png", tagline: "Carbon peel laser glow" },
        { name: "Laser Body Polishing", slug: "laser", search: "laser", image: "/assets/sub-laser-body-polishing.png", tagline: "Skin tone even-out" },
        { name: "Add-Ons", slug: "laser", search: "laser", image: "/assets/sub-laser-addons.png", tagline: "Small patch treatments" },
      ]
    },
    "body-toning": {
      title: "Body Toning",
      items: [
        { name: "Packages", slug: "spa-massage", search: "massage", image: "/assets/sub-toning-packages.png", tagline: "Slimming & contouring" },
        { name: "Face & Body Toning", slug: "spa-massage", search: "massage", image: "/assets/sub-face-body-toning.png", tagline: "Firming massage lift" },
      ]
    },
    "makeup-styling": {
      title: "Makeup & Styling",
      items: [
        { name: "Party Makeup", slug: "bridal", search: "party", image: "/assets/sub-party-makeup.png", tagline: "Occasion glam makeover" },
        { name: "Eye Makeup", slug: "bridal", search: "makeup", image: "/assets/sub-eye-makeup.png", tagline: "Smokey/glittery eye art" },
        { name: "Best Packages", slug: "bridal", search: "makeup", image: "/assets/sub-best-packages.png", tagline: "Combo trials & prep" },
        { name: "Wedding Packages", slug: "bridal", search: "bridal", image: "/assets/sub-wedding-packages.png", tagline: "Full bridal glam squad" },
        { name: "Hair Style", slug: "bridal", search: "makeup", image: "/assets/sub-hair-style.png", tagline: "Buns, braids & curls" },
        { name: "Saree Draping", slug: "bridal", search: "saree", image: "/assets/sub-saree-draping.png", tagline: "Elegant draping & pins" },
        { name: "Engagement Makeup", slug: "bridal", search: "engagement", image: "/assets/sub-engagement-makeup.png", tagline: "Soft elegant celebration glow" },
        { name: "Bridal Makeup", slug: "bridal", search: "bridal", image: "/assets/sub-bridal-makeup.png", tagline: "Airbrush/HD luxury glam" },
        { name: "Add On", slug: "bridal", search: "makeup", image: "/assets/sub-add-on-makeup.png", tagline: "Hair extensions & lashes" },
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
    female: {
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
    },
    male: {
      salon: [
        { id: "mens-haircut-styling", name: "Men's Designer Haircut & Styling", price: 299, discountPrice: 199, duration: 30, image: "/assets/service-mens-haircut-styling.png", badge: "Classic Cut" },
        { id: "mens-beard-trim-shave", name: "Royal Beard Trim & Hot Towel Shave", price: 199, discountPrice: 149, duration: 25, image: "/assets/service-mens-beard-trim-shave.png", badge: "Royal Groom" },
        { id: "mens-dtan-cleanup", name: "Men's Skin Brightening D-Tan Cleanup", price: 699, discountPrice: 499, duration: 40, image: "/assets/service-mens-dtan-cleanup.png", badge: "D-Tan Scrub" },
      ],
      spa: [
        { id: "mens-body-massage", name: "Men's Full Body Stress Relief Massage", price: 1699, discountPrice: 1399, duration: 75, image: "/assets/service-mens-body-massage.png", badge: "Full Body" },
        { id: "mens-head-shoulder-massage", name: "Men's Energizing Head & Shoulder Massage", price: 499, discountPrice: 349, duration: 30, image: "/assets/service-mens-head-shoulder-massage.png", badge: "Stress Relief" },
      ],
      hydraglo: [
        { id: "mens-charcoal-facial", name: "Men's Charcoal Blackhead Peel-off Facial", price: 899, discountPrice: 699, duration: 45, image: "/assets/service-mens-charcoal-facial.png", badge: "Deep Clean" },
        { id: "classic-hydraglo", name: "Classic HydraGlo Skin Infusion Facial", price: 2999, discountPrice: 2499, duration: 60, image: "/assets/service-mens-hair-spa.png", badge: "Classic Glow" },
      ]
    }
  };

  const currentMostBooked = mostBookedServices[activeGender][mostBookedTab];

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
              onClick={() => setIsChooseServiceOpen(true)}
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
      <section id="milestones" className="py-14 md:py-20 bg-[#050505] border-y border-white/5 relative overflow-hidden bg-luxe-mesh">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold-950/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
            {milestones.map((m) => {
              const Icon = m.icon;
              return (
                <div 
                  key={m.label} 
                  className="text-center px-4 py-8 rounded-2xl border border-white/5 bg-[#0a0a0a]/40 backdrop-blur-sm hover:border-gold-600/30 hover:bg-gold-600/[0.02] hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(201,168,76,0.04)] transition-all duration-500 group cursor-default"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-600/20 bg-gold-600/5 text-gold-600 group-hover:scale-110 group-hover:border-gold-600/40 group-hover:bg-gold-600/10 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.2)] transition-all duration-500">
                    <Icon className="h-5 w-5 group-hover:rotate-6 transition-transform duration-500" />
                  </div>
                  <div className="font-heading text-2xl md:text-3.5xl text-gradient-gold font-bold tracking-tight select-none">
                    <AnimatedCounter value={m.num} />
                  </div>
                  <div className="mt-2 text-[9px] tracking-widest text-white/40 uppercase luxe-subtitle font-semibold">
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AD SLIDER BANNER */}
      <AdSlider activeGender={activeGender} />

      {/* EXPLORE OUR CATEGORIES SECTION */}
      <section 
        id="explore-categories" 
        className="py-14 md:py-20 bg-black scroll-mt-24"
        style={{ backgroundColor: theme === "light" ? "#fdfcf9" : "#000000" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-heading text-2xl md:text-4xl text-white" style={{ color: theme === "light" ? "#1a1a1e" : "#ffffff" }}>Explore Our Categories</h2>
            <p className="mt-2 text-xs text-white/50 leading-relaxed" style={{ color: theme === "light" ? "#6a6a80" : "rgba(255, 255, 255, 0.5)" }}>
              Certified salon and wellness rituals delivered directly to your home.
            </p>
          </div>

          {/* Gender Selector with Face avatars */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveGender("female")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all"
              style={{
                borderColor: activeGender === "female" ? "rgba(201,168,76,0.4)" : (theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)"),
                backgroundColor: activeGender === "female" ? "rgba(201,168,76,0.1)" : (theme === "light" ? "#ffffff" : "#0a0a0a"),
                color: activeGender === "female" ? "#c9a84c" : (theme === "light" ? "#5c5c70" : "rgba(255,255,255,0.6)")
              }}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-gold-600/20">
                <img src={HermosaImageRegistry.resolveServiceImage("o3-glow-facial", undefined, undefined, "female")} alt="Women" className="w-full h-full object-cover" />
              </div>
              Women
            </button>
            <button
              onClick={() => setActiveGender("male")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all"
              style={{
                borderColor: activeGender === "male" ? "rgba(201,168,76,0.4)" : (theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.05)"),
                backgroundColor: activeGender === "male" ? "rgba(201,168,76,0.1)" : (theme === "light" ? "#ffffff" : "#0a0a0a"),
                color: activeGender === "male" ? "#c9a84c" : (theme === "light" ? "#5c5c70" : "rgba(255,255,255,0.6)")
              }}
            >
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white/10 flex-shrink-0 border border-gold-600/20">
                <img src={HermosaImageRegistry.resolveServiceImage("mens-haircut-styling", undefined, undefined, "male")} alt="Men" className="w-full h-full object-cover animate-grayscale" />
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
                      src={HermosaImageRegistry.resolveCategoryImage(cat.id, "female")}
                      alt={cat.name}
                      className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = HermosaImageRegistry.resolveServiceImage("o3-glow-facial", "O3+ Glow Facial", "female-salon", "female");
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold mt-2.5 leading-snug transition group-hover:text-gold-600 luxe-category-name">
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
                      <img src={HermosaImageRegistry.resolveCategoryImage(cat.id, "male")} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    </div>
                    <span className="text-[11px] font-bold mt-2.5 leading-snug transition group-hover:text-gold-600 luxe-category-name">
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
                {activeGender === "female" ? "Salon for Women" : "Grooming & Hair"}
              </button>
              <button
                onClick={() => setMostBookedTab("spa")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  mostBookedTab === "spa" 
                    ? "bg-gold-gradient text-dark font-black shadow-sm" 
                    : "bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {activeGender === "female" ? "Spa for Women" : "Spa & Relaxation"}
              </button>
              <button
                onClick={() => setMostBookedTab("hydraglo")}
                className={`flex-shrink-0 px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all ${
                  mostBookedTab === "hydraglo" 
                    ? "bg-gold-gradient text-dark font-black shadow-sm" 
                    : "bg-[#0a0a0a] border border-white/10 text-white/60 hover:text-white"
                }`}
              >
                {activeGender === "female" ? "HydraGlo Facials" : "Facial & Skin Care"}
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
                    <img src={HermosaImageRegistry.resolveServiceImage(svc.id, svc.name, mostBookedTab, activeGender)} alt={svc.name} className="w-full h-full object-cover" />
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
            <button
              onClick={() => setIsReferOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gold-gradient text-dark text-[10px] font-black tracking-widest uppercase shadow-sm flex items-center gap-1.5 hover:scale-105 transition duration-300"
            >
              <Share2 className="w-3.5 h-3.5" /> Refer Now
            </button>
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
      <section id="press" className="py-16 md:py-24 bg-[#050505] border-y border-white/5 scroll-mt-24 relative overflow-hidden bg-luxe-mesh">
        {/* Background Glowing Orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div id="press-content" className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[9px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
              Spotlight
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mt-3 leading-tight">
              Stories From the <span className="text-gradient-gold italic">Best</span>
            </h2>
            <p className="mt-2 text-xs text-white/50">Loved by leading creators, directors, and celebrity stylists.</p>
          </div>

          {/* Interactive Profile Tabs */}
          <div className="flex justify-center items-center gap-8 md:gap-12 mb-10 md:mb-12">
            {CELEB_STORIES.map((story, idx) => {
              const isActive = idx === activeStoryIndex;
              return (
                <button
                  key={story.id}
                  onClick={() => setActiveStoryIndex(idx)}
                  className="group relative flex flex-col items-center focus:outline-none"
                >
                  <div className="relative">
                    {/* Orbiting Sparkle (Active Only) */}
                    {isActive && (
                      <div className="animate-orbit w-6 h-6 text-gold-500">
                        <Sparkle className="w-5 h-5 fill-gold-500" />
                      </div>
                    )}
                    
                    {/* Profile Avatar */}
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-500 ${
                      isActive 
                        ? "border-gold-500 scale-105 gold-glow-pulse" 
                        : "border-white/10 opacity-40 group-hover:opacity-75 group-hover:scale-102"
                    }`}>
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold mt-3 tracking-wider uppercase luxe-subtitle transition-colors duration-300 ${
                    isActive ? "text-gold-500" : "text-white/40 group-hover:text-white/70"
                  }`}>
                    {story.name.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Story Card */}
          <div className="max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="rounded-3xl border border-white/[0.07] bg-[#090909]/60 backdrop-blur-md p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-gold-600/20 transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
                  {/* Left Column: Floating Image */}
                  <div className="flex-shrink-0 animate-float">
                    <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl overflow-hidden border border-gold-600/30 shadow-[0_10px_25px_rgba(201,168,76,0.15)] bg-white/5">
                      <img 
                        src={CELEB_STORIES[activeStoryIndex].image} 
                        alt={CELEB_STORIES[activeStoryIndex].name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>

                  {/* Right Column: Quote Text */}
                  <div className="flex-grow text-center md:text-left">
                    <Quote className="w-10 h-10 text-gold-500/25 mx-auto md:mx-0 mb-3" />
                    <p className="text-sm md:text-base text-white/90 italic font-medium leading-relaxed font-accent">
                      "{CELEB_STORIES[activeStoryIndex].quote}"
                    </p>
                    
                    <div className="mt-5 pt-4 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-gold-500 uppercase tracking-widest luxe-subtitle">
                          {CELEB_STORIES[activeStoryIndex].name}
                        </h4>
                        <p className="text-[10px] text-white/40 mt-0.5">
                          {CELEB_STORIES[activeStoryIndex].role}
                        </p>
                      </div>
                      
                      <div className="hidden md:flex items-center gap-1 text-[9px] text-gold-600/60 font-bold uppercase tracking-widest luxe-subtitle border border-gold-600/15 bg-gold-600/5 px-2.5 py-1 rounded">
                        Verified Creator
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS SECTION */}
      <section id="reviews" className="py-16 md:py-24 bg-black border-b border-white/5 scroll-mt-24 relative overflow-hidden bg-luxe-mesh">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-gold-950/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[9px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
              Voices
            </span>
            <h2 className="font-heading text-2xl md:text-4xl text-white mt-3 leading-tight">
              From Bareilly's <span className="text-gradient-gold italic">finest homes.</span>
            </h2>
            <p className="mt-2 text-xs text-white/50">Real experiences from our valued customers.</p>
          </div>

          {/* Infinite Scroll Rows */}
          <div className="flex flex-col gap-6 md:gap-8 max-w-6xl mx-auto overflow-hidden">
            {/* Row 1: Left Scrolling Marquee */}
            <div className="marquee-container">
              <div className="marquee-row-left">
                {[...customerReviews.filter((_, idx) => idx % 2 === 0), ...customerReviews.filter((_, idx) => idx % 2 === 0)].map((r: any, i: number) => (
                  <div 
                    key={`${r.id || i}-row1`}
                    className="w-[280px] md:w-[320px] flex-shrink-0 rounded-2xl border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-gold-600/30 hover:bg-gold-600/[0.01] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(201,168,76,0.04)] transition duration-300 select-none cursor-default group"
                  >
                    <div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(r.rating || 5)].map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-gold-400 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                        ))}
                      </div>
                      <blockquote className="font-accent text-[12px] md:text-[13px] leading-relaxed text-white/80 mb-4 italic">
                        "{r.comment}"
                      </blockquote>
                    </div>
                    <div className="border-t border-white/5 pt-3 mt-2 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-white">{r.userName}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{r.area || "Bareilly"}, Bareilly</div>
                      </div>
                      <span className="text-[9px] text-gold-600/80 font-bold uppercase tracking-widest luxe-subtitle border border-gold-600/10 bg-gold-600/5 px-2 py-0.5 rounded">
                        Client
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 2: Right Scrolling Marquee */}
            <div className="marquee-container">
              <div className="marquee-row-right">
                {[...customerReviews.filter((_, idx) => idx % 2 !== 0), ...customerReviews.filter((_, idx) => idx % 2 !== 0)].map((r: any, i: number) => (
                  <div 
                    key={`${r.id || i}-row2`}
                    className="w-[280px] md:w-[320px] flex-shrink-0 rounded-2xl border border-white/5 bg-[#0a0a0a]/60 backdrop-blur-sm p-6 flex flex-col justify-between hover:border-gold-600/30 hover:bg-gold-600/[0.01] hover:-translate-y-1 hover:shadow-[0_12px_25px_rgba(201,168,76,0.04)] transition duration-300 select-none cursor-default group"
                  >
                    <div>
                      <div className="flex gap-1 mb-3">
                        {[...Array(r.rating || 5)].map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-gold-400 text-gold-400 group-hover:scale-110 transition-transform duration-300" />
                        ))}
                      </div>
                      <blockquote className="font-accent text-[12px] md:text-[13px] leading-relaxed text-white/80 mb-4 italic">
                        "{r.comment}"
                      </blockquote>
                    </div>
                    <div className="border-t border-white/5 pt-3 mt-2 flex justify-between items-center">
                      <div>
                        <div className="text-xs font-bold text-white">{r.userName}</div>
                        <div className="text-[10px] text-white/40 mt-0.5">{r.area || "Bareilly"}, Bareilly</div>
                      </div>
                      <span className="text-[9px] text-gold-600/80 font-bold uppercase tracking-widest luxe-subtitle border border-gold-600/10 bg-gold-600/5 px-2 py-0.5 rounded">
                        Client
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA: Share Experience */}
          <div className="text-center mt-12">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-gold-600/40 bg-gold-600/5 text-xs text-gold-500 font-bold uppercase tracking-widest hover:bg-gold-600 hover:text-black transition-all duration-500 shadow-[0_0_20px_rgba(201,168,76,0.07)] hover:shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:scale-102"
            >
              <MessageCircle className="w-4 h-4" /> Share Your Experience
            </button>
          </div>
        </div>

        {/* Rating Submission Modal */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-[0_25px_60px_rgba(201,168,76,0.15)]"
              >
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="absolute top-4 right-4 text-white/40 hover:text-white transition focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <h3 className="font-heading text-lg text-white">Write a Review</h3>
                  <p className="text-[11px] text-white/50 mt-1">Let Bareilly know about your Hermosa Luxe experience.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newReviewName || !newReviewComment) {
                      toast.error("Please fill out your name and comment.");
                      return;
                    }
                    const submitted = {
                      id: Date.now().toString(),
                      userName: newReviewName,
                      area: newReviewArea || "Bareilly",
                      comment: newReviewComment,
                      rating: newReviewRating
                    };
                    setCustomerReviews((prev) => [submitted, ...prev]);
                    setIsReviewModalOpen(false);
                    // Clear inputs
                    setNewReviewName("");
                    setNewReviewArea("");
                    setNewReviewComment("");
                    setNewReviewRating(5);
                    toast.success("Thank you! Your review is now live in the spotlight.");
                  }}
                  className="space-y-4"
                >
                  {/* Name Input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aanya Sharma"
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-gold-600/50 focus:bg-white/5 transition"
                    />
                  </div>

                  {/* Area Select */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold">Select Area</label>
                    <select
                      value={newReviewArea}
                      onChange={(e) => setNewReviewArea(e.target.value)}
                      className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-gold-600/50 focus:bg-white/5 transition appearance-none"
                    >
                      <option value="" className="bg-[#0a0a0a] text-white">Select Bareilly Area</option>
                      <option value="Civil Lines" className="bg-[#0a0a0a] text-white">Civil Lines</option>
                      <option value="Rampur Garden" className="bg-[#0a0a0a] text-white">Rampur Garden</option>
                      <option value="Sheel Chauraha" className="bg-[#0a0a0a] text-white">Sheel Chauraha</option>
                      <option value="Subhash Nagar" className="bg-[#0a0a0a] text-white">Subhash Nagar</option>
                      <option value="DD Puram" className="bg-[#0a0a0a] text-white">DD Puram</option>
                      <option value="Suresh Sharma Nagar" className="bg-[#0a0a0a] text-white">Suresh Sharma Nagar</option>
                      <option value="Mahanagar" className="bg-[#0a0a0a] text-white">Mahanagar</option>
                      <option value="Pilibhit Bypass" className="bg-[#0a0a0a] text-white">Pilibhit Bypass</option>
                    </select>
                  </div>

                  {/* Star Rating Input */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold text-center">Your Rating</label>
                    <div className="flex gap-2 justify-center py-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="focus:outline-none transition active:scale-90"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReviewRating 
                                ? "fill-gold-400 text-gold-400 scale-110 drop-shadow-[0_0_6px_rgba(201,168,76,0.3)]" 
                                : "text-white/20 hover:text-white/40"
                            } transition-all duration-300`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Textarea */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/50 mb-1.5 font-bold">Your Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your thoughts about the service, products, hygiene..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full bg-white/3 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-gold-600/50 focus:bg-white/5 transition resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="w-1/2 border border-white/10 bg-white/3 text-white rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-gold-600 text-black rounded-xl py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gold-500 transition shadow-[0_0_15px_rgba(201,168,76,0.2)]"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
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
              style={{ backgroundColor: theme === "light" ? "#ffffff" : "#0a0a0a", borderTopColor: theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)" }}
            >
              {/* Drag Handle */}
              <div 
                className="mx-auto w-12 h-1 rounded-full mb-6 luxe-popup-handle" 
                style={{ backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.15)" }}
              />

              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderBottomColor: theme === "light" ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.05)" }}>
                <h3 className="font-heading text-lg luxe-popup-title">
                  {popupCategoriesData[activePopupCategory].title}
                </h3>
                <button
                  onClick={() => setActivePopupCategory(null)}
                  className="h-8 w-8 rounded-full flex items-center justify-center luxe-popup-close"
                  style={{ 
                    borderColor: theme === "light" ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)",
                    backgroundColor: theme === "light" ? "rgba(0, 0, 0, 0.02)" : "rgba(255, 255, 255, 0.05)"
                  }}
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
                      href={
                        sub.search === ""
                          ? `/services?gender=female&category=${sub.slug}`
                          : `/services?gender=female&category=${sub.slug}&search=${encodeURIComponent(sub.search || sub.name)}`
                      }
                      onClick={() => setActivePopupCategory(null)}
                      className="flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(201,168,76,0.25)]"
                        style={{ background: "linear-gradient(135deg, #dbeafe 0%, #e0f2fe 60%, #bfdbfe 100%)" }}
                      >
                        <img 
                          src={HermosaImageRegistry.appendVersion(sub.image)} 
                          alt={sub.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = HermosaImageRegistry.resolveServiceImage("o3-glow-facial", "O3+ Glow Facial", "female-salon", "female");
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold mt-2 transition leading-tight luxe-popup-item-name">
                        {sub.name}
                      </span>
                      {sub.tagline && (
                        <span className="text-[8px] mt-0.5 leading-tight luxe-popup-item-tagline max-w-[85px] line-clamp-2">
                          {sub.tagline}
                        </span>
                      )}
                    </LinkNext>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REFER & EARN CASH MODAL */}
      <AnimatePresence>
        {isReferOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setReferStep("form");
                setIsReferOpen(false);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-6 shadow-[0_0_50px_rgba(201,168,76,0.15)] z-10 text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => {
                  setReferStep("form");
                  setIsReferOpen(false);
                }}
                className="absolute right-4 top-4 text-white/50 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
              
              {referStep === "form" ? (
                <div className="space-y-5">
                  <div className="text-center space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-600/20 bg-gold-600/5 text-[9px] text-gold-500 font-bold uppercase tracking-wider luxe-subtitle">
                      <Gift className="w-3.5 h-3.5" /> Refer & Earn Cash
                    </span>
                    <h3 className="font-heading text-xl font-bold text-white mt-1">Invite Friends & Partners</h3>
                    <p className="text-[10px] text-white/50 leading-relaxed">
                      Refer a friend to get ₹200 off their first booking, or invite a beautician to earn ₹10,000 when they join our partner network.
                    </p>
                  </div>
                  
                  {/* Referral Type Selector */}
                  <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 gap-1">
                    <button
                      type="button"
                      onClick={() => setReferType("customer")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider luxe-subtitle transition-all ${
                        referType === "customer" 
                          ? "bg-gold-gradient text-dark font-black" 
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Refer a Friend
                    </button>
                    <button
                      type="button"
                      onClick={() => setReferType("partner")}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider luxe-subtitle transition-all ${
                        referType === "partner" 
                          ? "bg-gold-gradient text-dark font-black" 
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      Refer a Professional
                    </button>
                  </div>
                  
                  {/* Form */}
                  <form onSubmit={handleReferSubmit} className="space-y-4">
                    <div className="space-y-3.5">
                      {/* Referrer Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Your Name</label>
                          <input 
                            required
                            type="text" 
                            value={referForm.yourName}
                            onChange={(e) => setReferForm({...referForm, yourName: e.target.value})}
                            placeholder="Enter name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold-600/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Your Phone</label>
                          <input 
                            required
                            type="tel" 
                            value={referForm.yourPhone}
                            onChange={(e) => setReferForm({...referForm, yourPhone: e.target.value})}
                            placeholder="Phone number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold-600/50 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      {/* Referee Details */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Friend's Name</label>
                          <input 
                            required
                            type="text" 
                            value={referForm.friendName}
                            onChange={(e) => setReferForm({...referForm, friendName: e.target.value})}
                            placeholder="Friend's name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold-600/50 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Friend's Phone</label>
                          <input 
                            required
                            type="tel" 
                            value={referForm.friendPhone}
                            onChange={(e) => setReferForm({...referForm, friendPhone: e.target.value})}
                            placeholder="WhatsApp number"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold-600/50 focus:outline-none"
                          />
                        </div>
                      </div>

                      {referType === "partner" && (
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold uppercase tracking-wider text-white/40 luxe-subtitle">Professional Specialty</label>
                          <select
                            value={referForm.friendRole}
                            onChange={(e) => setReferForm({...referForm, friendRole: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white/80 focus:border-gold-600/50 focus:outline-none"
                          >
                            <option value="beautician" className="bg-[#0a0a0a]">Beautician / Salon Expert</option>
                            <option value="hair" className="bg-[#0a0a0a]">Hair Stylist</option>
                            <option value="makeup" className="bg-[#0a0a0a]">Makeup Artist</option>
                            <option value="massage" className="bg-[#0a0a0a]">Massage Therapist</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gold-gradient text-dark font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition mt-2"
                    >
                      Submit & Get Invitation Link
                    </button>
                  </form>
                </div>
              ) : (
                <div className="space-y-5 text-center py-2">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <Check className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-xl font-bold text-white">Referral Registered!</h3>
                    <p className="text-[10px] text-white/50 leading-relaxed max-w-[280px] mx-auto">
                      Thank you! We've registered {referForm.friendName}'s referral. Invite them now via WhatsApp to complete the process.
                    </p>
                  </div>
                  
                  <div className="space-y-3 pt-3">
                    <a
                      href={
                        referType === "customer"
                          ? `https://wa.me/${referForm.friendPhone.replace(/\+/g, "").trim()}?text=Hey%20${encodeURIComponent(referForm.friendName)}!%20I%20highly%20recommend%20Hermosa%20for%20luxury%20salon%20and%20spa%20services%20at%20home.%20Book%20here%20and%20get%20%E2%82%B9200%20off%20your%20first%20order!%20https://hermosa.luxe%20-%20Referred%20by%20${encodeURIComponent(referForm.yourName)}`
                          : `https://wa.me/${referForm.friendPhone.replace(/\+/g, "").trim()}?text=Hey%20${encodeURIComponent(referForm.friendName)}!%20Join%20Hermosa%20as%20a%20beautician%20and%20earn%20up%20to%20%E2%82%B950,000/month%20with%20flexible%20hours.%20Apply%20here%20or%20reply%20to%20this%20chat:%20https://hermosa.luxe/join`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 fill-white text-emerald-600" /> Invite via WhatsApp
                    </a>
                    
                    <a
                      href={`https://wa.me/917248253329?text=Hi%20Hermosa,%20I'd%20like%20to%20register%20a%20referral.%20My%20Name:%20${encodeURIComponent(referForm.yourName)}%20(${encodeURIComponent(referForm.yourPhone)}).%20Referred%20Friend:%20${encodeURIComponent(referForm.friendName)}%20(${encodeURIComponent(referForm.friendPhone)})%20as%20a%20${encodeURIComponent(referType === "partner" ? "Partner (" + referForm.friendRole + ")" : "Customer")}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-[10px] uppercase tracking-wider transition"
                    >
                      Confirm with Hermosa Desk
                    </a>
                  </div>
                  
                  <button
                    onClick={() => {
                      setReferStep("form");
                      setIsReferOpen(false);
                    }}
                    className="text-[10px] text-gold-500 hover:underline mt-4"
                  >
                    Done & Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
