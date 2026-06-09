"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/context";
import Navbar from "@/components/Navbar";
import { 
  Calendar, MapPin, CreditCard, ShieldCheck, Check, Clock, Trash2, 
  ChevronRight, CalendarDays, ShoppingBag, ArrowRight, User
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function BookingPage() {
  const { cart, removeFromCart, addToCart, clearCart, user, setIsLoginModalOpen } = useApp();
  const [step, setStep] = useState(1); // 1: Cart, 2: Address & Time, 3: Payment
  
  // Date & Time states
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  
  // Address states
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "Bareilly",
    pincode: "",
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState("upi"); // upi, cash, card
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState<any | null>(null);

  const cartTotal = cart.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const timeSlots = ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM", "07:00 PM"];

  const handleNextStep = () => {
    if (step === 1) {
      if (cart.length === 0) {
        toast.error("Your cart is empty. Please add services first.");
        return;
      }
      if (!user) {
        toast.warning("Please sign in or register to continue booking.");
        setIsLoginModalOpen(true);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTime) {
        toast.error("Please pick a date and time slot.");
        return;
      }
      if (!address.line1 || !address.pincode) {
        toast.error("Please complete the address details.");
        return;
      }
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cart,
          address,
          scheduledAt: `${selectedDate}T${selectedTime.replace(" ", "")}`,
          paymentMethod,
          totalAmount: cartTotal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        if (paymentMethod === "cash") {
          setBookingCompleted(data.booking);
          clearCart();
          toast.success("Booking placed successfully!");
        } else {
          // Stripe Online Payment Flow
          toast.info("Initiating secure payment session...");
          const stripeRes = await fetch("/api/stripe/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: data.booking.id,
              bookingNumber: data.booking.bookingNumber,
              items: cart,
              totalAmount: cartTotal,
            }),
          });
          
          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            clearCart();
            // Redirect to Stripe checkout page
            window.location.href = stripeData.url;
          } else {
            toast.error("Stripe session creation failed. Please try again.");
          }
        }
      } else {
        toast.error("Failed to place booking. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during booking.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (bookingCompleted) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 pt-28">
          <div className="w-full max-w-md rounded-3xl border border-gold-600/30 bg-[#0a0a0a] p-8 text-center space-y-6 shadow-[0_0_50px_rgba(201,168,76,0.15)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-600/10 text-gold-600 border border-gold-600/20 animate-bounce">
              <Check className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-3xl text-white">Booking Confirmed!</h2>
              <p className="text-xs text-white/50 luxe-subtitle tracking-widest">
                Booking ID: {bookingCompleted.bookingNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-5 text-left text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-white/40">Scheduled for</span>
                <span className="font-semibold text-white">{selectedDate} at {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Service Address</span>
                <span className="font-semibold text-white max-w-[200px] text-right line-clamp-2">{address.line1}, {address.city}</span>
              </div>
              <div className="flex justify-between border-t border-white/5 pt-3">
                <span className="text-white/40 font-bold">Total Paid</span>
                <span className="font-bold text-gold-600 text-sm">₹{bookingCompleted.totalAmount}</span>
              </div>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              We have assigned a certified Hermosa expert for your session. You will receive live updates on WhatsApp.
            </p>
            <div className="flex gap-4 pt-4">
              <Link 
                href="/profile" 
                className="flex-1 py-3.5 rounded-xl bg-gold-gradient text-dark font-bold text-xs hover:scale-[1.01] transition"
              >
                Track Booking
              </Link>
              <Link 
                href="/" 
                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/70 text-xs hover:bg-white/5 transition"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-28">
        {/* Step Indicator Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 md:pb-6 mb-6 md:mb-10">
          <div>
            <h1 className="font-heading text-xl sm:text-2xl md:text-4xl text-white">Booking Checkout</h1>
            <p className="text-[10px] text-white/40 luxe-subtitle tracking-widest mt-1">Glow at home</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`text-[11px] font-semibold ${step >= 1 ? "text-gold-600" : "text-white/30"}`}>1. Cart</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className={`text-[11px] font-semibold ${step >= 2 ? "text-gold-600" : "text-white/30"}`}>2. Details</span>
            <ChevronRight className="w-3 h-3 text-white/20" />
            <span className={`text-[11px] font-semibold ${step >= 3 ? "text-gold-600" : "text-white/30"}`}>3. Pay</span>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center text-white/40 space-y-5">
            <ShoppingBag className="w-12 h-12 text-gold-600/30 mx-auto" />
            <h3 className="font-heading text-2xl text-white">Your cart is empty</h3>
            <p className="text-xs max-w-xs mx-auto">Explore our menu of luxury at-home salon & spa treatments to add them here.</p>
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-gradient text-dark font-bold text-xs"
            >
              Browse Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-6 md:gap-10">
            {/* Main column */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              {/* STEP 1: CART REVISION */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-heading text-xl text-white border-b border-white/5 pb-2">Review Added Treatments</h3>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div 
                        key={item.id} 
                        className="rounded-2xl border border-white/5 bg-[#070707] p-5 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <span className="text-xs text-gold-600 font-semibold mt-1 block">
                            ₹{item.discountPrice || item.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center bg-[#0d0d0d] border border-gold-600/30 rounded-full overflow-hidden">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="px-3 py-1.5 text-gold-600 hover:bg-gold-600/10 transition"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, discountPrice: item.discountPrice })}
                              className="px-3 py-1.5 text-gold-600 hover:bg-gold-600/10 transition"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-white/30 hover:text-red-500 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: ADDRESS & TIME PICKER */}
              {step === 2 && (
                <div className="space-y-8">
                  {/* DateTime Pickers */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl text-white border-b border-white/5 pb-2 flex items-center gap-2">
                      <CalendarDays className="w-5 h-5 text-gold-600" /> Select Date & Time Slot
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Appointment Date</label>
                        <input 
                          type="date" 
                          required
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs text-white outline-none focus:border-gold-600/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Time Slot</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`py-2.5 rounded-xl border text-[10px] font-bold text-center transition ${
                                selectedTime === time 
                                  ? "border-gold-600 bg-gold-600/5 text-gold-600" 
                                  : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Forms */}
                  <div className="space-y-4">
                    <h3 className="font-heading text-xl text-white border-b border-white/5 pb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gold-600" /> Service Address Details
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Flat / Street Address</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Flat 304, Block C, Sheel Chauraha"
                          value={address.line1}
                          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs text-white outline-none focus:border-gold-600/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">City</label>
                          <select 
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs text-white outline-none focus:border-gold-600/50"
                            disabled
                          >
                            <option value="Bareilly">Bareilly</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-semibold text-white/50 uppercase tracking-widest luxe-subtitle">Pincode</label>
                          <input 
                            type="text" 
                            required
                            maxLength={6}
                            placeholder="6-digit pincode"
                            value={address.pincode}
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-xs text-white outline-none focus:border-gold-600/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT TYPE */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="font-heading text-xl text-white border-b border-white/5 pb-2 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold-600" /> Choose Payment Option
                  </h3>
                  <div className="space-y-3">
                    {[
                      { id: "upi", label: "Instant UPI (GPay / PhonePe)", desc: "Pay securely via UPI on Stripe Checkout" },
                      { id: "card", label: "Credit / Debit Card", desc: "Pay securely with Visa, Mastercard, or RuPay via Stripe" },
                      { id: "cash", label: "Cash On Service", desc: "Pay our beauty expert in cash or UPI after service" }
                    ].map((method) => (
                      <label 
                        key={method.id}
                        className={`flex items-start gap-4 p-5 rounded-2xl border cursor-pointer select-none transition ${
                          paymentMethod === method.id 
                            ? "border-gold-600 bg-gold-600/5" 
                            : "border-white/5 bg-[#070707] hover:border-white/10"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="mt-1 h-4 w-4 accent-gold-600"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white luxe-subtitle">{method.label}</h4>
                          <p className="text-[10px] text-white/40 mt-1">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar billing total card */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-white/5 bg-[#070707] p-6 space-y-6 sticky top-28">
                <h3 className="text-xs font-bold text-white/55 luxe-subtitle uppercase tracking-widest border-b border-white/5 pb-3">Bill Summary</h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between text-white/50">
                    <span>Item Total ({cartCount} Service{cartCount > 1 ? "s" : ""})</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Convenience & Hygiene fee</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-white/50">
                    <span>Safety Transport fee</span>
                    <span className="text-green-500">FREE</span>
                  </div>
                  <div className="border-t border-white/5 pt-4 flex justify-between font-bold text-sm">
                    <span className="text-white">To Pay</span>
                    <span className="text-gold-600">₹{cartTotal}</span>
                  </div>
                </div>

                <div className="rounded-xl bg-gold-600/5 border border-gold-600/10 p-4 text-[10px] text-gold-600 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                  <span>Hermosa Luxe Safe Home Service Guarantee. Background verified artists.</span>
                </div>

                {step < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold text-xs shadow-[var(--shadow-gold-sm)] hover:scale-[1.01] transition flex items-center justify-center gap-2"
                  >
                    CONTINUE TO NEXT <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl bg-gold-gradient text-dark font-bold text-xs shadow-[var(--shadow-gold-sm)] hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isProcessing ? "PROCESSING SECURE PAYMENT..." : `PAY & PLACE BOOKING · ₹${cartTotal}`}
                  </button>
                )}

                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="w-full text-center text-xs text-white/40 hover:text-white transition font-medium"
                  >
                    Back to Previous Step
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
