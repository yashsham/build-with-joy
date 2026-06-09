"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/lib/context";
import { MessageCircle, User, MapPin, LogOut, ChevronDown } from "lucide-react";

const WHATSAPP = "917248253329";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

export default function Navbar() {
  const { selectedCity, setSelectedCity, setIsLoginModalOpen, user, setUser } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const citiesList = [
    { name: "Bareilly", slug: "bareilly" },
  ];

  const currentCityName = "Bareilly";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/hermosa-logo.png" alt="Hermosa Luxe Home Service" className="h-12 w-12 object-contain" />
          <div className="leading-tight hidden sm:block">
            <div className="font-heading text-xl text-gradient-gold">Hermosa</div>
            <div className="text-[9px] text-gold-600/70 luxe-subtitle">Luxe Home Service</div>
          </div>
        </Link>

        {/* Location badge (Locked to Bareilly) */}
        <div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gold-600/30 bg-black/40 text-xs font-semibold text-gold-600 cursor-default">
            <MapPin className="w-3.5 h-3.5" />
            <span>{currentCityName}</span>
          </div>
        </div>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-white/70 luxe-subtitle">
          <Link href="/services" className="hover:text-gold-600 transition">Services</Link>
          <Link href="/#milestones" className="hover:text-gold-600 transition">Milestones</Link>
          <Link href="/#press" className="hover:text-gold-600 transition">Media</Link>
          <Link href="/#reviews" className="hover:text-gold-600 transition">Reviews</Link>
          <Link href="/contact" className="hover:text-gold-600 transition">Contact Us</Link>
          <Link href="/professionals/register" className="hover:text-gold-600 transition text-gold-600">Register as Partner</Link>
        </nav>

        {/* CTA & Profile Buttons */}
        <div className="flex items-center gap-4">
          <a
            href={waLink("Hi Hermosa, I'd like a quick quote.")}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-gold-gradient text-dark text-xs font-bold shadow-[var(--shadow-gold-sm)] hover:scale-[1.03] transition duration-300"
          >
            <MessageCircle className="w-4 h-4" /> <span className="hidden sm:inline">Get Quote</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden md:inline-flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-gold-600 border border-white/10 px-4 py-2.5 rounded-full bg-white/5 transition"
              >
                <User className="w-4 h-4 text-gold-600" />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => setUser(null)}
                className="hidden md:inline-flex items-center p-2.5 rounded-full text-white/50 hover:text-red-500 border border-white/10 hover:border-red-500/20 bg-white/5 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-gold-600 border border-white/10 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 transition"
            >
              <User className="w-4 h-4 text-gold-600" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
