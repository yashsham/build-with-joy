import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageCircle, Phone, MapPin, Sparkles, ShieldCheck, Clock, Award, Star } from "lucide-react";
import logoAsset from "@/assets/hermosa-logo.asset.json";
import heroImg from "@/assets/hero-interior.jpg";
import deepImg from "@/assets/service-deep.jpg";
import sofaImg from "@/assets/service-sofa.jpg";
import kitchenImg from "@/assets/service-kitchen.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hermosa — Luxe Home Service in Bareilly" },
      { name: "description", content: "Premium home cleaning & care in Bareilly. Trained, vetted staff. Spotless results, white-glove service. Book on WhatsApp." },
      { property: "og:title", content: "Hermosa — Luxe Home Service" },
      { property: "og:description", content: "Premium home cleaning & care in Bareilly." },
    ],
  }),
  component: Index,
});

const WHATSAPP = "917248253329";
const PHONE = "+91 72482 53329";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

const services = [
  { title: "Deep Home Cleaning", desc: "Top-to-bottom restoration of every surface. Marble, wood, glass — restored to showroom shine.", img: deepImg },
  { title: "Sofa & Upholstery", desc: "Steam-extraction care for velvet, leather, fabric. Stains lifted, fibers renewed.", img: sofaImg },
  { title: "Kitchen Detail", desc: "De-greased, sanitized, polished. Chimneys, hobs, cabinets — handled with precision.", img: kitchenImg },
];

const promises = [
  { icon: ShieldCheck, title: "Vetted & Trained", desc: "Background-verified staff, hospitality-grade training." },
  { icon: Sparkles, title: "Premium Products", desc: "Imported, surface-safe formulas. Safe for kids & pets." },
  { icon: Clock, title: "On Time, Every Time", desc: "Scheduled windows respected. Updates on WhatsApp." },
  { icon: Award, title: "Spotless Guarantee", desc: "Not satisfied? We return and redo — no questions asked." },
];

const testimonials = [
  { name: "Aanya M.", area: "Civil Lines", quote: "Felt like a five-star hotel turndown — except it was my own living room. Worth every rupee." },
  { name: "Rohan K.", area: "Rampur Garden", quote: "The sofa came back like new. Their attention to corners and edges is unreal." },
  { name: "Priya S.", area: "Sheel Chauraha", quote: "Most professional house service we've used in Bareilly. Quiet, careful, fast." },
];

function Index() {
  const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Hermosa" className="h-12 w-12 object-contain" />
            <div className="leading-tight hidden sm:block">
              <div className="font-display text-xl text-gradient-gold">Hermosa</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Luxe Home Service</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-10 text-sm text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition">Services</a>
            <a href="#promise" className="hover:text-foreground transition">The Promise</a>
            <a href="#voices" className="hover:text-foreground transition">Voices</a>
            <a href="#contact" className="hover:text-foreground transition">Contact</a>
          </nav>
          <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-primary-foreground text-sm font-medium shadow-gold hover:scale-[1.03] transition-transform">
            <MessageCircle className="w-4 h-4" /> Book
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative pt-32 pb-24 md:pt-44 md:pb-32">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          <motion.div className="md:col-span-7" {...fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs tracking-[0.25em] uppercase text-muted-foreground mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Now serving Bareilly
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] tracking-tight">
              A home cared for <br />
              <span className="text-gradient-gold italic">like an heirloom.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
              Hermosa brings white-glove cleaning and home care to discerning households across Bareilly. Trained hands. Quiet craft. Surfaces that breathe again.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={waLink("Hi Hermosa, I'd like a quote.")} target="_blank" rel="noopener" className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-primary-foreground font-medium shadow-gold hover:scale-[1.02] transition">
                <MessageCircle className="w-5 h-5" /> Book on WhatsApp
              </a>
              <a href="#services" className="inline-flex items-center gap-2 px-7 py-4 rounded-full border border-border text-foreground/90 hover:border-gold/60 transition">
                Explore services
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                <span className="ml-2">4.9 average</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <div className="hidden sm:block">500+ homes served</div>
            </div>
          </motion.div>

          <motion.div className="md:col-span-5 hidden md:block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-gold-gradient">
              <img src={heroImg} alt="Luxurious clean interior" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs tracking-[0.25em] uppercase text-gold mb-2">Signature Service</div>
                <div className="font-display text-2xl">The Heirloom Deep Clean</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="max-w-2xl mb-16" {...fadeUp}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Craft</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Services rendered with <span className="text-gradient-gold italic">intention.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.article key={s.title} {...fadeUp} transition={{ duration: 0.7, delay: i * 0.1 }} className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-gold/40 transition-colors">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={s.img} alt={s.title} loading="lazy" className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                </div>
                <div className="p-7">
                  <div className="text-xs tracking-[0.25em] uppercase text-gold/80 mb-3">0{i + 1}</div>
                  <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section id="promise" className="py-24 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="text-center max-w-2xl mx-auto mb-16" {...fadeUp}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">The Hermosa Promise</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">
              Four standards we will <span className="text-gradient-gold italic">never compromise.</span>
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden">
            {promises.map((p, i) => (
              <motion.div key={p.title} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }} className="bg-background p-8 hover:bg-card transition-colors">
                <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center mb-6">
                  <p.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-xl mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="voices" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="mb-16 max-w-2xl" {...fadeUp}>
            <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Voices</div>
            <h2 className="font-display text-4xl md:text-5xl leading-tight">From Bareilly's <span className="text-gradient-gold italic">finest homes.</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.figure key={t.name} {...fadeUp} transition={{ duration: 0.6, delay: i * 0.1 }} className="rounded-2xl border border-border bg-card/50 p-8 hover:border-gold/40 transition">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />)}
                </div>
                <blockquote className="font-display text-xl leading-snug mb-6">"{t.quote}"</blockquote>
                <figcaption className="text-sm">
                  <div className="text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{t.area}</div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="relative rounded-3xl overflow-hidden border-gold-gradient p-10 md:p-16 text-center">
            <div className="absolute inset-0 -z-10 opacity-30">
              <img src={heroImg} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-background/80" />
            </div>
            <img src={logoAsset.url} alt="Hermosa" className="h-20 w-20 object-contain mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5">
              Reserve a <span className="text-gradient-gold italic">Hermosa</span> visit.
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-10">
              Tell us the home, the date, the moment. We arrive prepared, leave it perfect.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-primary-foreground font-medium shadow-gold hover:scale-[1.02] transition">
                <MessageCircle className="w-5 h-5" /> WhatsApp Us
              </a>
              <a href={`tel:${WHATSAPP}`} className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-border hover:border-gold/60 transition">
                <Phone className="w-5 h-5" /> {PHONE}
              </a>
            </div>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-gold" /> Sheel Chauraha, Bareilly
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-8 w-8 object-contain" />
            <span className="tracking-[0.2em] uppercase">Hermosa Luxe Home Service</span>
          </div>
          <div>© {new Date().getFullYear()} Hermosa. Crafted in Bareilly.</div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href={waLink("Hi Hermosa, I'd like to book a service.")} target="_blank" rel="noopener" aria-label="WhatsApp" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold-soft to-gold-deep flex items-center justify-center shadow-gold hover:scale-110 transition-transform">
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
      </a>
    </div>
  );
}
