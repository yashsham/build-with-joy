"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/lib/context";
import Navbar from "@/components/Navbar";
import { 
  User, Calendar, MapPin, Phone, MessageCircle, LogOut, Award, 
  HelpCircle, ChevronRight, BookOpen, Clock, Star, LayoutDashboard
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const WHATSAPP = "917248253329";
const PHONE = "+91 72482 53329";
const waLink = (msg: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

interface BookingItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Booking {
  id: string;
  bookingNumber: string;
  scheduledAt: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  items?: BookingItem[];
  addressLine?: string;
}

export default function ProfilePage() {
  const { user, setUser, setIsLoginModalOpen } = useApp();
  const [bookingsList, setBookingsList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    async function fetchUserBookings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/bookings/user?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookingsList(data.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUserBookings();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully");
  };

  const blogsList = [
    { title: "5 Secrets to a Long-Lasting Bridal Glow", slug: "bridal-glow-secrets", excerpt: "Premium facial routines and skin preparation tips straight from our master artists." },
    { title: "Why Rica Wax is Better Than Honey Wax", slug: "rica-vs-honey-wax", excerpt: "Learn the scientific benefits of liposoluble waxing for sensitive skin types." }
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-28">
        {!user ? (
          /* NOT LOGGED IN STATE */
          <div className="py-20 text-center max-w-md mx-auto space-y-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20">
              <User className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-3xl text-white">Your Profile</h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Log in with your mobile number to view active bookings, manage addresses, and access gold-tier benefits.
            </p>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold text-xs shadow-[var(--shadow-gold-sm)] hover:scale-[1.01] transition"
            >
              LOGIN / SIGN UP
            </button>

            <div className="border-t border-white/5 pt-6 mt-6 grid grid-cols-2 gap-4">
              <Link
                href="/professionals/register"
                className="p-4 rounded-2xl border border-white/5 bg-[#070707] hover:border-white/10 transition block text-left"
              >
                <Award className="w-5 h-5 text-gold-600 mb-2" />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider luxe-subtitle">Join as Partner</h4>
                <p className="text-[10px] text-white/40 mt-1">Earn up to ₹70,000/mo</p>
              </Link>
              <Link
                href="/#faq"
                className="p-4 rounded-2xl border border-white/5 bg-[#070707] hover:border-white/10 transition block text-left"
              >
                <HelpCircle className="w-5 h-5 text-gold-600 mb-2" />
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider luxe-subtitle">Help & FAQ</h4>
                <p className="text-[10px] text-white/40 mt-1">Hygiene standards & refunds</p>
              </Link>
            </div>
          </div>
        ) : (
          /* LOGGED IN PROFILE */
          <div className="space-y-10">
            {/* User Header Details */}
            <div className="rounded-3xl border border-white/5 bg-[#070707] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                <div className="h-16 w-16 rounded-full bg-gold-gradient flex items-center justify-center text-dark font-bold text-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-heading text-2xl text-white">{user.name}</h2>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-1.5 text-xs text-white/50">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gold-600" /> +91 {user.phone}</span>
                    {user.email && <span className="h-3 w-px bg-white/20" />}
                    {user.email && <span className="text-white/40">{user.email}</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <Link
                  href="/professionals/register"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-gold-600/30 text-gold-600 hover:bg-gold-600/10 transition text-xs font-semibold text-center"
                >
                  Apply as Partner
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-white/10 text-white/40 hover:text-red-500 hover:border-red-500/20 bg-white/5 transition"
                  title="Logout"
                >
                  <LogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Bookings Section */}
            <div className="space-y-4">
              <h3 className="font-heading text-xl text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold-600" /> Your Bookings
              </h3>

              {loading ? (
                <div className="py-8 text-center text-white/40 text-xs">Loading bookings...</div>
              ) : bookingsList.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-[#070707] p-8 text-center space-y-4">
                  <p className="text-xs text-white/40">You don't have any bookings yet. Ready to glow?</p>
                  <Link 
                    href="/services" 
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold-gradient text-dark font-bold text-xs"
                  >
                    Explore Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingsList.map((bk) => (
                    <div 
                      key={bk.id}
                      className="rounded-2xl border border-white/5 bg-[#070707] p-6 space-y-4 hover:border-gold-600/20 transition"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-3 text-xs">
                        <div>
                          <span className="font-bold text-white block">{bk.bookingNumber}</span>
                          <span className="text-[10px] text-white/40 block mt-0.5">{new Date(bk.scheduledAt).toLocaleDateString()}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full border border-gold-600/30 bg-gold-600/5 text-[9px] text-gold-600 uppercase tracking-wider font-bold">
                          {bk.status}
                        </span>
                      </div>

                      {/* Display items if available */}
                      {bk.items && bk.items.length > 0 && (
                        <div className="space-y-1.5">
                          {bk.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-white/70">
                              <span>{item.name} <span className="text-white/40 font-normal">x{item.quantity}</span></span>
                              <span>₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 text-xs">
                        <span className="text-white/40">Paid via {bk.paymentStatus}</span>
                        <span className="font-bold text-gold-600 text-sm">₹{bk.totalAmount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Links & Info grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* FAQ / Support */}
              <div className="rounded-2xl border border-white/5 bg-[#070707] p-6 space-y-4">
                <h4 className="text-xs font-bold text-white/50 luxe-subtitle uppercase tracking-widest">Support & Help</h4>
                <div className="space-y-2 text-xs">
                  <a href={`tel:${PHONE}`} className="flex items-center justify-between py-2 border-b border-white/5 text-white/70 hover:text-gold-600 transition">
                    <span>Call Helpline</span>
                    <Phone className="w-3.5 h-3.5 text-gold-600" />
                  </a>
                  <a href={waLink("Hi Hermosa, I need assistance with a booking.")} target="_blank" rel="noopener" className="flex items-center justify-between py-2 border-b border-white/5 text-white/70 hover:text-gold-600 transition">
                    <span>WhatsApp Support</span>
                    <MessageCircle className="w-3.5 h-3.5 text-gold-600" />
                  </a>
                  <Link href="/#faq" className="flex items-center justify-between py-2 text-white/70 hover:text-gold-600 transition">
                    <span>Read Help FAQ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Blogs Column */}
              <div className="rounded-2xl border border-white/5 bg-[#070707] p-6 space-y-4">
                <h4 className="text-xs font-bold text-white/50 luxe-subtitle uppercase tracking-widest flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-gold-600" /> Beauty Blogs
                </h4>
                <div className="space-y-3">
                  {blogsList.map((blog) => (
                    <div key={blog.slug} className="group cursor-pointer">
                      <h5 className="text-xs font-bold text-white group-hover:text-gold-600 transition line-clamp-1">{blog.title}</h5>
                      <p className="text-[10px] text-white/40 mt-0.5 line-clamp-2 leading-relaxed">{blog.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
