"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/context";
import { Sparkles, Gift, ShoppingCart, Calendar, User, Plus } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart } = useApp();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    {
      label: "Women",
      icon: Sparkles,
      href: "/services?gender=female",
      active: pathname === "/services" && !pathname.includes("gender=male"),
    },
    {
      label: "Refer",
      icon: Gift,
      href: "/contact?tab=careers",
      active: pathname === "/refer",
    },
    {
      label: "Cart",
      icon: ShoppingCart,
      href: "/booking",
      active: pathname === "/booking",
      badge: cartCount > 0 ? cartCount : undefined,
      isFloating: true,
    },
    {
      label: "Booking",
      icon: Calendar,
      href: "/profile", // redirect to profile which lists bookings
      active: pathname === "/bookings",
    },
    {
      label: "Account",
      icon: User,
      href: "/profile",
      active: pathname === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur-md px-4 py-2 md:hidden h-16 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        
        if (item.isFloating) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="relative -mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gold-gradient text-dark shadow-[0_4px_20px_rgba(201,168,76,0.35)] border border-black hover:scale-105 active:scale-95 transition"
            >
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black border border-gold-600 text-[10px] font-bold text-gold-600 shadow-lg">
                  {item.badge}
                </span>
              )}
              <div className="relative">
                <ShoppingCart className="h-6 w-6 text-dark" />
                <Plus className="absolute -top-1 -right-1 h-3.5 w-3.5 text-dark font-black" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition ${
              item.active ? "text-gold-600 font-bold" : "text-white/60 hover:text-white"
            }`}
          >
            <Icon className={`h-5 w-5 mb-1 ${item.active ? "text-gold-600" : "text-white/60"}`} />
            <span className="text-[9px] font-semibold tracking-wider uppercase luxe-subtitle">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
