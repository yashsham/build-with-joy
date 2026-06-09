import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, MapPin, Sparkles, ShieldCheck, Clock, Award, Star, Users, Heart, Scissors, Flower2, Hand, Crown, Search, ChevronRight, Calendar, Home as HomeIcon } from "lucide-react";
import logoAsset from "@/assets/hermosa-logo.asset.json";
import heroImg from "@/assets/hero-interior.jpg";
import bridalImg from "@/assets/service-bridal.jpg";
import spaImg from "@/assets/service-spa.jpg";
import hairImg from "@/assets/service-hair.jpg";
import mehendiImg from "@/assets/service-mehendi.jpg";
import facialImg from "@/assets/service-facial.jpg";
import nailsImg from "@/assets/service-nails.jpg";

export const Route = createFileRoute("/")({ component: Index });

const WHATSAPP = "917248253329";
const PHONE = "+91 72482 53329";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const categories = [
  { icon: Flower2, title: "Female Salon", desc: "Threading, cleanup, head massage at home.", img: hairImg },
  { icon: Sparkles, title: "Spa & Massage", desc: "Aromatic full-body therapy in your room.", img: spaImg },
  { icon: Heart, title: "Waxing", desc: "Roll-on, honey & chocolate. Painless, premium.", img: nailsImg },
  { icon: Scissors, title: "Facial & Cleanup", desc: "Luxe brand facials. Glow that lasts.", img: facialImg },
  { icon: Crown, title: "Bridal Studio", desc: "Engagement to reception — your full glam squad.", img: bridalImg },
  { icon: Hand, title: "Mehendi Artistry", desc: "Bridal, party & arabic designs by master artists.", img: mehendiImg },
];

const milestones = [
  { icon: Users, num: "500+", label: "Trained Professionals" },
  { icon: Heart, num: "10k+", label: "Happy Households" },
  { icon: Star, num: "4.9", label: "Average Rating" },
  { icon: Award, num: "50+", label: "Signature Services" },
];

const steps = [
  { n: "01", title: "Choose Your Service", desc: "Browse 50+ at-home salon, spa, bridal & wellness services." },
  { n: "02", title: "Pick a Time Slot", desc: "Same-day or pre-book. We respect your calendar." },
  { n: "03", title: "Relax At Home", desc: "Certified artist arrives with premium kit & sanitised tools." },
  { n: "04", title: "Glow & Pay", desc: "Pay after the service. Cash, UPI, or card — your call." },
];

const promises = [
  { icon: ShieldCheck, title: "Background-Verified", desc: "Every professional vetted, trained and insured." },
  { icon: Sparkles, title: "Premium Brand Kits", desc: "Lotus, O3+, Cheryl's, Loreal — never compromise products." },
  { icon: Clock, title: "On-Time, Every Time", desc: "Live tracking & WhatsApp updates from booking to finish." },
  { icon: Award, title: "Glow Guarantee", desc: "Not delighted? We redo it free. No questions." },
];

const reviews = [
  { name: "Aanya M.", area: "Civil Lines, Bareilly", quote: "Booked the bridal trial a week before my engagement. The artist showed up early, kit organised like a film set. I cried (then laughed) when I saw the mirror." },
  { name: "Rohan K.", area: "Rampur Garden", quote: "Got the deep-tissue spa for my mother's birthday. She fell asleep mid-session and rebooked the next week. That's the only review you need." },
  { name: "Priya S.", area: "Sheel Chauraha", quote: "Mehendi for 14 cousins, 6 hours flat, three artists working in sync. Hermosa turned my haldi into the calmest part of the wedding." },
  { name: "Ishita R.", area: "Subhash Nagar", quote: "Honey waxing at home, candlelight, my own playlist. I am never going back to a salon." },
  { name: "Megha T.", area: "Krishna Puri", quote: "Facial + cleanup combo, brand products, no upselling. The therapist explained every step. Felt like a five-star resort in my own bedroom." },
];

function useCountUp(end: number, start: boolean, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.floor(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [end, start, duration]);
  return val;
}

function Milestone({ icon: Icon, num, label, delay }: { icon: typeof Users; num: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const numeric = parseInt(num.replace(/\D/g, "")) || 0;
  const suffix = num.replace(/[0-9.]/g, "");
  const isDecimal = num.includes(".");
  const display = useCountUp(numeric, inView);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className="text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-full border border-gold-600/40 flex items-center justify-center bg-dark-card/60">
        <Icon className="w-6 h-6 text-gold-600" />
      </div>
      <div className="font-heading text-5xl md:text-6xl text-gradient-gold">
        {isDecimal ? num : `${display}${suffix}`}
      </div>
      <div className="mt-2 text-sm text-white/60 luxe-subtitle">{label}</div>
    </motion.div>
  );
}

function Index() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  };

  const press = ["Economic Times", "Hindustan Times", "Business Standard", "The Hindu", "Forbes India", "YourStory", "Inc42", "NDTV"];

  return (
    <div className="min-h-screen overflow-x-hidden bg-dark">
      {/* NAVBAR */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-dark/95 backdrop-blur-md border-b border-dark-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Hermosa Luxe Home Service" className="h-12 w-12 object-contain" />
            <div className="leading-tight hidden sm:block">
              <div className="font-heading text-xl text-gradient-gold">Hermosa</div>
              <div className="text-[9px] text-gold-600/70 luxe-subtitle">Luxe Home Service</div>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-9 text-sm text-white/70">
            <a href="#milestones" className="hover:text-gold-600 transition">Milestones</a>
            <a href="#services" className="hover:text-gold-600 transition">Services</a>
            <a href="#press" className="hover:text-gold-600 transition">Media</a>
            <a href="#reviews" className="hover:text-gold-600 transition">Reviews</a>
            <a href="#how" className="hover:text-gold-600 transition">How it Works</a>
            <a href="#contact" className="hover:text-gold-600 transition">Contact</a>
          </nav>
          <a href={waLink("Hi Hermosa, I'd like a quick quote.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-gradient text-dark text-sm font-semibold shadow-[var(--shadow-gold-sm)] hover:shadow-[var(--shadow-gold)] hover:scale-[1.03] transition">
            <MessageCircle className="w-4 h-4" /> Get Quote
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative pt-32 pb-24 md:pt-44 md:pb-32 bg-[radial-gradient(ellipse_at_top,#1a1500_0%,#000_60%)]">
        <div className="absolute inset-0 -z-10 opacity-30">
          <img src={heroImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <motion.div className="md:col-span-7" {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-600/40 bg-dark-card/60 text-xs text-gold-600 luxe-subtitle mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-600 animate-pulse" /> Now Booking in Bareilly
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight text-white">
              Salon expertise. <br />
              <span className="text-gradient-gold italic font-accent">At your doorstep.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-white/70 leading-relaxed">
              Hermosa brings India's most-loved at-home salon, spa, bridal & wellness experience to discerning households across Bareilly. Trained artists. Premium brand kits. Pure indulgence.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gold-gradient text-dark font-semibold shadow-[var(--shadow-gold)] hover:scale-[1.02] transition">
                <MessageCircle className="w-5 h-5" /> Book on WhatsApp
              </a>
              <a href="#services" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-gold-600/40 text-white/90 hover:bg-gold-600/10 hover:border-gold-600 transition">
                Explore Services <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* search bar */}
            <div className="mt-10 max-w-md flex items-center gap-2 bg-dark-card border border-gold-600/20 rounded-full px-5 py-3">
              <Search className="w-4 h-4 text-gold-600" />
              <input className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none" placeholder="Search facial, spa, mehendi..." />
              <button className="text-xs text-dark font-semibold bg-gold-gradient px-4 py-1.5 rounded-full">Find</button>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />)}
                <span className="ml-2">4.9 / 5</span>
              </div>
              <div className="h-4 w-px bg-dark-border" />
              <div>10,000+ services delivered</div>
            </div>
          </motion.div>

          <motion.div className="md:col-span-5 hidden md:block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-gold-gradient shadow-[var(--shadow-gold-lg)]">
              <img src={bridalImg} alt="Bridal makeup at home" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs text-gold-600 luxe-subtitle mb-2">Signature Booking</div>
                <div className="font-heading text-2xl text-white">The Hermosa Bridal Studio</div>
                <div className="mt-2 text-xs text-white/60">From ₹4,999 · 90 min · Trial included</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MILESTONES */}
      <section id="milestones" className="py-20 md:py-28 bg-dark-soft border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto mb-14" {...fadeUp}>
            <div className="text-xs text-gold-600 luxe-subtitle mb-3">Milestones</div>
            <h2 className="font-heading text-4xl md:text-5xl text-white">
              Numbers that <span className="text-gradient-gold italic">speak.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {milestones.map((m, i) => <Milestone key={m.label} {...m} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="max-w-2xl mb-16" {...fadeUp}>
            <div className="text-xs text-gold-600 luxe-subtitle mb-3">Our Services</div>
            <h2 className="font-heading text-4xl md:text-5xl leading-tight text-white">
              The full at-home <span className="text-gradient-gold italic">salon menu.</span>
            </h2>
            <p className="mt-5 text-white/60 max-w-lg">Six signature categories. Fifty plus services. Each delivered by a vetted Hermosa artist with a premium brand kit.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <motion.article key={c.title} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.08 }} className="group relative rounded-2xl overflow-hidden bg-dark-card border border-dark-border hover:border-gold-600/50 hover:shadow-[var(--shadow-gold-card)] transition-all">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={c.img} alt={c.title} loading="lazy" width={800} height={1000} className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent" />
                </div>
                <div className="absolute top-5 left-5 w-11 h-11 rounded-full bg-dark/80 backdrop-blur-md border border-gold-600/40 flex items-center justify-center">
                  <c.icon className="w-5 h-5 text-gold-600" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="text-[10px] text-gold-600 luxe-subtitle mb-2">0{i + 1}</div>
                  <h3 className="font-heading text-2xl text-white mb-2">{c.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{c.desc}</p>
                  <a href={waLink(`Hi Hermosa, I'm interested in ${c.title}.`)} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-600 hover:text-gold-400 transition">
                    Book this <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* PRESS MARQUEE */}
      <section id="press" className="py-20 border-y border-dark-border bg-dark-soft">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <div className="text-xs text-gold-600 luxe-subtitle mb-3">As Featured In</div>
          <h2 className="font-heading text-3xl md:text-4xl text-white">India's press, in our corner.</h2>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-16 whitespace-nowrap animate-[marquee_28s_linear_infinite] w-max">
            {[...press, ...press].map((name, i) => (
              <div key={i} className="font-heading text-2xl md:text-3xl text-white/40 hover:text-gold-600 transition italic">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeUp}>
            <div className="text-xs text-gold-600 luxe-subtitle mb-3">The Hermosa Promise</div>
            <h2 className="font-heading text-4xl md:text-5xl text-white">
              Four standards we will <span className="text-gradient-gold italic">never compromise.</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-dark-border rounded-2xl overflow-hidden border border-dark-border">
            {promises.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-dark p-8 hover:bg-dark-card transition-colors">
                <div className="w-12 h-12 rounded-full border border-gold-600/40 flex items-center justify-center mb-6 bg-dark-card">
                  <p.icon className="w-5 h-5 text-gold-600" />
                </div>
                <h3 className="font-heading text-xl text-white mb-2">{p.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 md:py-32 bg-dark-soft border-y border-dark-border">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="mb-14 max-w-2xl" {...fadeUp}>
            <div className="text-xs text-gold-600 luxe-subtitle mb-3">Voices</div>
            <h2 className="font-heading text-4xl md:text-5xl text-white">From Bareilly's <span className="text-gradient-gold italic">finest homes.</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.slice(0, 3).map((t, i) => (
              <motion.figure key={t.name} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="rounded-2xl border border-dark-border bg-dark-card p-8 hover:border-gold-600/50 hover:shadow-[var(--shadow-gold-card)] transition">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                </div>
                <blockquote className="font-accent text-xl leading-snug text-white/90 mb-6 italic">"{t.quote}"</blockquote>
                <figcaption className="text-sm">
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="text-white/50 text-xs mt-0.5">{t.area}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {reviews.slice(3).map((t, i) => (
              <motion.figure key={t.name} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="rounded-2xl border border-dark-border bg-dark-card p-8 hover:border-gold-600/50 transition">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />)}
                </div>
                <blockquote className="font-accent text-xl leading-snug text-white/90 mb-6 italic">"{t.quote}"</blockquote>
                <figcaption className="text-sm">
                  <div className="text-white font-medium">{t.name}</div>
                  <div className="text-white/50 text-xs mt-0.5">{t.area}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeUp}>
            <div className="text-xs text-gold-600 luxe-subtitle mb-3">How It Works</div>
            <h2 className="font-heading text-4xl md:text-5xl text-white">From booking to <span className="text-gradient-gold italic">glow.</span></h2>
          </motion.div>
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] border-t-2 border-dashed border-gold-600/30 -z-0" />
            {steps.map((s, i) => (
              <motion.div key={s.n} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="relative bg-dark-card border border-dark-border rounded-2xl p-7 hover:border-gold-600/50 transition">
                <div className="w-14 h-14 mb-5 rounded-full bg-gold-gradient text-dark font-heading text-xl font-bold flex items-center justify-center shadow-[var(--shadow-gold-sm)]">
                  {s.n}
                </div>
                <h3 className="font-heading text-xl text-white mb-2">{s.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GOLD CTA BANNER */}
      <section className="py-16 bg-gold-gradient">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-dark">
          <div>
            <div className="text-xs luxe-subtitle mb-2 opacity-70">Open · Today</div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Ready for your Hermosa moment?</h2>
            <p className="mt-2 text-dark/80 text-sm">Book in 60 seconds on WhatsApp · 100% Purely Bhartiya 🇮🇳</p>
          </div>
          <div className="flex gap-3">
            <a href={waLink("Hi Hermosa, I'd like to book.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-dark text-gold-600 font-semibold hover:bg-dark-card transition">
              <MessageCircle className="w-5 h-5" /> Book Now
            </a>
            <a href={`tel:${WHATSAPP}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border-2 border-dark text-dark font-semibold hover:bg-dark hover:text-gold-600 transition">
              <Phone className="w-5 h-5" /> Call
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="relative rounded-3xl overflow-hidden border-gold-gradient p-10 md:p-16 text-center">
            <div className="absolute inset-0 -z-10 opacity-25">
              <img src={spaImg} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-dark/80" />
            </div>
            <img src={logoAsset.url} alt="Hermosa" className="h-20 w-20 object-contain mx-auto mb-6" />
            <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
              Reserve a <span className="text-gradient-gold italic">Hermosa</span> visit.
            </h2>
            <p className="text-white/60 max-w-lg mx-auto mb-10">Tell us the home, the date, the moment. We arrive prepared and leave you glowing.</p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gold-gradient text-dark font-semibold shadow-[var(--shadow-gold)] hover:scale-[1.02] transition">
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
              <a href={`tel:${WHATSAPP}`} className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-gold-600/40 text-white hover:bg-gold-600/10 transition">
                <Phone className="w-5 h-5" /> {PHONE}
              </a>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-white/60">
              <MapPin className="w-4 h-4 text-gold-600" /> Sheel Chauraha, Bareilly · Uttar Pradesh
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-dark-border bg-[#050505] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <img src={logoAsset.url} alt="Hermosa" className="h-10 w-10 object-contain" />
              <div>
                <div className="font-heading text-lg text-gradient-gold">Hermosa</div>
                <div className="text-[9px] text-gold-600/60 luxe-subtitle">Luxe Home Service</div>
              </div>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">India's luxe at-home salon, spa & bridal service. Crafted with care in Bareilly.</p>
          </div>
          <div>
            <div className="text-xs text-gold-600 luxe-subtitle mb-4">Services</div>
            <ul className="space-y-2 text-sm text-white/60">
              {categories.map(c => <li key={c.title}><a href="#services" className="hover:text-gold-600 transition">{c.title}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="text-xs text-gold-600 luxe-subtitle mb-4">Company</div>
            <ul className="space-y-2 text-sm text-white/60">
              <li><a href="#milestones" className="hover:text-gold-600 transition">Milestones</a></li>
              <li><a href="#reviews" className="hover:text-gold-600 transition">Reviews</a></li>
              <li><a href="#how" className="hover:text-gold-600 transition">How it Works</a></li>
              <li><a href="#contact" className="hover:text-gold-600 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs text-gold-600 luxe-subtitle mb-4">Reach Us</div>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gold-600 mt-0.5" /> Sheel Chauraha, Bareilly, UP</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold-600" /> {PHONE}</li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-gold-600" /> WhatsApp 24×7</li>
            </ul>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-600/30 bg-dark-card text-[10px] text-gold-600 luxe-subtitle">
              🇮🇳 100% Bhartiya Brand
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Hermosa Luxe Home Service · All rights reserved</div>
          <div className="luxe-subtitle text-[10px]">Crafted in Bareilly</div>
        </div>
      </footer>

      {/* FLOATING WA */}
      <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" aria-label="WhatsApp" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-gradient flex items-center justify-center shadow-[var(--shadow-gold)] hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6 text-dark" />
      </a>
    </div>
  );
}
