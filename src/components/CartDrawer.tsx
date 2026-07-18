"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Trash2, Plus, Minus, Send, PhoneCall } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import BookingConfirmationModal from "./BookingConfirmationModal";

export default function CartDrawer() {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  // Checkout form state
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isCartOpen && !showConfirmation) return null;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) {
      setError("Please fill in all details");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerName,
          phone
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to make booking");
      }

      // Success
      clearCart();
      setCheckoutMode(false);
      setCustomerName("");
      setPhone("");
      setCartOpen(false);
      setShowConfirmation(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => {
              if (!loading) {
                setCartOpen(false);
                setCheckoutMode(false);
              }
            }}
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <div className="w-screen max-w-md transform bg-[#111111] border-l border-[#C9A24B]/30 shadow-2xl transition-transform duration-300">
              <div className="flex h-full flex-col overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#C9A24B]/20 px-4 py-4 sm:px-6 sm:py-5">
                  <h2 className="font-serif text-base sm:text-lg font-bold uppercase tracking-wider text-white">
                    {checkoutMode ? "Booking Details" : "Your Cart"}
                  </h2>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutMode(false);
                    }}
                    className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-[#E9C878] transition duration-200"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-xs px-6 py-3">
                    {error}
                  </div>
                )}

                {/* Content */}
                {items.length === 0 && !showConfirmation ? (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <ShoppingBag className="h-16 w-16 text-gray-600 mb-4 stroke-1" />
                    <p className="text-gray-400 font-medium">Your cart is empty</p>
                    <p className="text-gray-500 text-xs mt-1">Add items from the shop to make a booking</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="mt-6 border border-[#C9A24B] hover:bg-[#C9A24B] hover:text-black text-[#C9A24B] px-6 py-2.5 text-xs uppercase tracking-widest transition duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : !checkoutMode ? (
                  /* Cart Items View */
                  <>
                    <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4 space-y-4">
                      {items.map((item) => {
                        const firstImg = item.image.split(",")[0] || "/images/placeholder.jpg";
                        return (
                          <div
                            key={`${item.productId}-${item.mode}-${item.startDate || "sale"}`}
                            className="flex items-center gap-2.5 sm:gap-4 bg-white/5 border border-white/5 p-2 sm:p-3 rounded-lg relative group"
                          >
                            <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded overflow-hidden border border-white/10">
                              <Image
                                src={firstImg}
                                alt={item.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate font-serif">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1">
                                <span
                                  className={`text-[8px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 sm:px-2 rounded ${
                                    item.mode === "rent"
                                      ? "bg-[#C9A24B]/20 text-[#E9C878] border border-[#C9A24B]/20"
                                      : "bg-[#7A1F2B]/20 text-rose-300 border border-[#7A1F2B]/20"
                                  }`}
                                >
                                  {item.mode === "rent" ? "Rent" : "Purchase"}
                                </span>
                                <span className="text-[11px] sm:text-xs text-gray-300">{formatPrice(item.price)}</span>
                              </div>

                              {/* Rent Dates */}
                              {item.mode === "rent" && (
                                <p className="text-[9px] sm:text-[10px] text-[#E9C878]/80 mt-1 bg-[#C9A24B]/5 p-1 rounded border border-[#C9A24B]/10">
                                  Duration: {item.duration} Days <br />
                                  {item.startDate} to {item.endDate}
                                </p>
                              )}

                              {/* Quantity controller */}
                              <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.mode,
                                      Math.max(1, item.quantity - 1),
                                      item.startDate
                                    )
                                  }
                                  className="p-1 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition duration-200"
                                >
                                  <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                                <span className="text-xs sm:text-sm font-medium text-white px-2 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.mode,
                                      item.quantity + 1,
                                      item.startDate
                                    )
                                  }
                                  className="p-1 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition duration-200"
                                >
                                  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId, item.mode, item.startDate)}
                              className="absolute bottom-2.5 right-2.5 p-1.5 text-gray-400 hover:text-rose-400 rounded-md hover:bg-white/5 transition duration-200 cursor-pointer"
                              aria-label="Delete item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary & Booking Trigger */}
                    <div className="border-t border-[#C9A24B]/20 bg-black/40 px-4 py-4 sm:px-6 sm:py-6 space-y-4">
                      <div className="flex items-center justify-between text-sm sm:text-base font-bold text-white">
                        <span className="font-serif">Subtotal</span>
                        <span className="text-[#E9C878] pr-2">{formatPrice(totalPrice)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Store Pickup: Collect your jewelry pieces directly from our boutique. Delivery options can be arranged over the phone.
                      </p>
                      <button
                        onClick={() => setCheckoutMode(true)}
                        className="w-full gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs py-3.5 transition duration-300 rounded shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </>
                ) : (
                  /* Checkout Form View */
                  <form onSubmit={handleBookingSubmit} className="flex-1 flex flex-col justify-between p-6">
                    <div className="space-y-6">
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Please enter your contact details. A team member from **Thrithi Nakshatra** will reach out to you shortly to confirm your booking dates and coordinate collection.
                      </p>

                      <div>
                        <label htmlFor="customer-name" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="customer-name"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Pooja Sharma"
                          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                        />
                      </div>

                      <div>
                        <label htmlFor="customer-phone" className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="customer-phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +91 99999 99999"
                          className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                        />
                      </div>

                      <div className="bg-[#C9A24B]/5 border border-[#C9A24B]/20 p-4 rounded text-xs space-y-2 text-[#E9C878]">
                        <div className="flex items-center gap-2 font-bold">
                          <PhoneCall className="h-4 w-4" />
                          <span>Instant Support</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-gray-400">
                          Need immediate assistance with sizing or rentals? Contact us directly on WhatsApp.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#7A1F2B] hover:bg-[#631821] disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold uppercase tracking-widest text-xs py-3.5 transition duration-300 rounded shadow-md flex items-center justify-center gap-2"
                      >
                        {loading ? "Processing..." : "Confirm Booking"}
                        {!loading && <Send className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => setCheckoutMode(false)}
                        className="w-full border border-gray-600 hover:border-[#C9A24B] text-gray-400 hover:text-white font-bold uppercase tracking-widest text-xs py-3 transition duration-300 rounded"
                      >
                        Back to Cart
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal overlay */}
      {showConfirmation && (
        <BookingConfirmationModal onClose={() => setShowConfirmation(false)} />
      )}
    </>
  );
}

// Inline fallback / import helper
import { ShoppingBag } from "lucide-react";
