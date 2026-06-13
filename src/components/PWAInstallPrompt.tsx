"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Star, Share, Plus, MoreVertical, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSUser = /iphone|ipad|ipod/.test(ua);
    const isAndroidUser = /android/.test(ua);
    const isSafariBrowser = /safari/.test(ua) && !/chrome|crios|crmodo|firefox|fxios|opera|opr|samsungbrowser/.test(ua);

    setIsSafari(isSafariBrowser);
    if (isIOSUser) {
      setPlatform("ios");
    } else if (isAndroidUser) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if app is already running in standalone mode (already installed)
    const isStandalone = 
      window.matchMedia("(display-mode: standalone)").matches || 
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      return;
    }

    // Check if forced via query parameter
    const params = new URLSearchParams(window.location.search);
    const forceShow = params.get("pwa") === "true" || params.get("test-pwa") === "true";

    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent browser's default bar
      e.preventDefault();
      // Store event
      setDeferredPrompt(e);

      // Check if user has dismissed it in the last 24 hours
      const lastDismissed = localStorage.getItem("hermosa_pwa_dismissed");
      const oneDay = 24 * 60 * 60 * 1000;
      const shouldShow = !lastDismissed || Date.now() - parseInt(lastDismissed) > oneDay;

      if (shouldShow || forceShow) {
        // Show the banner after 8 seconds to let the user browse first
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 8000);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
      setShowInstructions(false);
      toast.success("Hermosa Luxe App installed successfully!");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Fallback trigger if beforeinstallprompt doesn't fire (e.g. iOS Safari, desktop browsers in development, etc.)
    const lastDismissed = localStorage.getItem("hermosa_pwa_dismissed");
    const oneDay = 24 * 60 * 60 * 1000;
    const shouldShowFallback = !lastDismissed || Date.now() - parseInt(lastDismissed) > oneDay;

    if (shouldShowFallback || forceShow) {
      const fallbackTimer = setTimeout(() => {
        setIsVisible((current) => {
          // Only show if not already visible and not standalone
          if (current) return current;
          return true;
        });
      }, 12000);
      return () => {
        clearTimeout(fallbackTimer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }

    // Listen to custom event for manual triggers (e.g., from Profile page)
    const handleForceTrigger = () => {
      setIsVisible(true);
    };
    window.addEventListener("trigger-hermosa-pwa-prompt", handleForceTrigger);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("trigger-hermosa-pwa-prompt", handleForceTrigger);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show native prompt
      deferredPrompt.prompt();
      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        setIsVisible(false);
      }
    } else {
      // Show custom instruction overlay
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal timestamp
    localStorage.setItem("hermosa_pwa_dismissed", Date.now().toString());
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="fixed z-50 bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-80 p-5 rounded-2xl bg-black/90 backdrop-blur-lg border border-gold-600/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col gap-4"
          >
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/40 hover:text-white p-1 rounded-full bg-white/5 border border-white/5 transition"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Body Content */}
            <div className="flex gap-3.5 items-start">
              <div className="w-12 h-12 rounded-xl border border-gold-600/20 overflow-hidden bg-black flex-shrink-0 flex items-center justify-center p-1.5 shadow-inner">
                <img src="/hermosa-logo.png" alt="Hermosa App Icon" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1 pr-4">
                <h4 className="font-heading text-sm font-bold text-white tracking-wide">Hermosa Luxe App</h4>
                <p className="text-[10px] text-white/50 leading-normal">
                  Install our PWA app on your device for lightning-fast home salon & spa bookings.
                </p>
                {/* Review Stars */}
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-gold-500">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <Star className="w-2.5 h-2.5 fill-current" />
                  </div>
                  <span className="text-[9px] text-white/30 font-semibold">(4.9/5 Rating)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 mt-1">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-[9px] font-bold uppercase tracking-widest transition duration-300"
              >
                Not Now
              </button>
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2 rounded-xl bg-gold-gradient text-dark text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-gold-900/10"
              >
                <Download className="w-3.5 h-3.5" /> Install App
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions Modal Overlay */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-[#090909] border border-gold-600/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white space-y-6"
            >
              {/* Close Icon */}
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-2xl border border-gold-600/30 bg-black flex items-center justify-center p-2.5 shadow-lg">
                  <img src="/hermosa-logo.png" alt="Hermosa Logo" className="w-full h-full object-contain" />
                </div>
                <h3 className="font-heading text-2xl text-gradient-gold font-bold">Install Hermosa Luxe</h3>
                <p className="text-xs text-white/50 px-4">
                  Add Hermosa to your home screen for instantaneous access, offline support, and priority booking notifications.
                </p>
              </div>

              {/* Instructions steps depending on platform */}
              <div className="p-5 rounded-2xl bg-black/50 border border-white/5 space-y-4">
                {platform === "ios" ? (
                  <>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold-600 luxe-subtitle">Safari on iOS Instructions</h4>
                    <ol className="space-y-3.5 text-xs text-white/80">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">1</span>
                        <span>
                          Tap the <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 text-white/95 font-semibold text-[10px] border border-white/10 gap-1"><Share className="w-3 h-3 text-gold-600" /> Share</span> icon in Safari at the bottom menu.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">2</span>
                        <span>
                          Scroll down the share list and select <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 text-white/95 font-semibold text-[10px] border border-white/10 gap-1"><Plus className="w-3 h-3 text-gold-600" /> Add to Home Screen</span>.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">3</span>
                        <span>
                          Tap <span className="text-gold-600 font-bold">Add</span> in the top right corner. The icon will appear on your device screen.
                        </span>
                      </li>
                    </ol>
                  </>
                ) : platform === "android" ? (
                  <>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold-600 luxe-subtitle">Chrome on Android Instructions</h4>
                    <ol className="space-y-3.5 text-xs text-white/80">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">1</span>
                        <span>
                          Tap the <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 text-white/95 font-semibold text-[10px] border border-white/10 gap-1"><MoreVertical className="w-3 h-3 text-gold-600" /> Menu</span> icon (three dots) in Chrome.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">2</span>
                        <span>
                          Select <span className="text-white font-semibold">"Install app"</span> or <span className="text-white font-semibold">"Add to Home Screen"</span> from the dropdown list.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">3</span>
                        <span>
                          Confirm the dialog popup by tapping <span className="text-gold-600 font-bold">Install</span>.
                        </span>
                      </li>
                    </ol>
                  </>
                ) : (
                  <>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gold-600 luxe-subtitle">Desktop Browser Instructions</h4>
                    <ol className="space-y-3.5 text-xs text-white/80">
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">1</span>
                        <span>
                          Look at the right side of the address bar at the top of your browser.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">2</span>
                        <span>
                          Click the <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-white/5 text-white/95 font-semibold text-[10px] border border-white/10 gap-1"><Monitor className="w-3 h-3 text-gold-600" /> Install</span> button (monitor with arrow or a plus sign).
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-gold-600/10 text-gold-600 flex items-center justify-center text-[10px] font-bold mt-0.5 border border-gold-600/20">3</span>
                        <span>
                          Or open the settings menu (three dots) and select <span className="text-white font-semibold">"Save and share"</span> &rarr; <span className="text-gold-600 font-bold">"Install Hermosa Luxe"</span>.
                        </span>
                      </li>
                    </ol>
                  </>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowInstructions(false)}
                  className="w-full py-3 rounded-2xl bg-gold-gradient text-dark font-black text-xs uppercase tracking-widest hover:scale-[1.01] transition"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
