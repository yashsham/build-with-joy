"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      {/* Logo */}
      <div className="mb-8">
        <img src="/hermosa-logo.png" alt="Hermosa" className="h-16 w-16 mx-auto object-contain mb-4" />
        <div className="font-heading text-2xl text-gradient-gold">Hermosa</div>
        <div className="text-[10px] text-gold-600/60 tracking-widest luxe-subtitle mt-1">Luxe Home Service</div>
      </div>

      {/* Offline Icon */}
      <div className="w-20 h-20 rounded-full border border-gold-600/20 bg-gold-600/5 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-gold-600/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3l18 18M8.111 8.111A6.98 6.98 0 005 15h14c.545 0 1.07-.068 1.572-.196M10.59 10.59A4 4 0 0115.41 15.41M12 20v.01" />
        </svg>
      </div>

      <h1 className="font-heading text-3xl text-white mb-3">You're Offline</h1>
      <p className="text-sm text-white/50 max-w-xs leading-relaxed mb-8">
        It looks like you're not connected to the internet. Some features may not be available.
      </p>

      {/* Quick actions still available offline */}
      <div className="w-full max-w-xs space-y-3 mb-8">
        <div className="rounded-2xl border border-white/5 bg-[#0a0a0a] p-4 text-left">
          <div className="text-[10px] text-gold-600 luxe-subtitle tracking-widest uppercase mb-2">Still Available Offline</div>
          <ul className="space-y-2 text-xs text-white/60">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
              Previously visited pages
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
              Services catalog (if cached)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-600" />
              Your booking cart
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3.5 rounded-full bg-gold-gradient text-dark font-bold text-sm shadow-md"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="w-full py-3.5 rounded-full border border-white/10 text-white/70 text-sm text-center"
        >
          Go to Home
        </Link>
      </div>

      {/* Contact info */}
      <div className="mt-10 text-xs text-white/30">
        <p>Need help? Call us at</p>
        <a href="tel:+917248253329" className="text-gold-600 font-semibold">+91 72482 53329</a>
      </div>
    </div>
  );
}
