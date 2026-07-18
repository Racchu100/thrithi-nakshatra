"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import BookingCalendar from "@/components/BookingCalendar";
import { Calendar, Tag, ShoppingBag, CheckCircle, MessageSquare } from "lucide-react";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string; // "rent", "sale", "both"
    priceSale: number | null;
    priceRentPerPeriod: number | null;
    rentDurations: string; // "3,5,7"
    images: string; // Comma-separated images
    stockStatus: string;
    category: {
      name: string;
    };
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const imagesList = product.images.split(",");
  const [activeImage, setActiveImage] = useState(imagesList[0] || "/images/placeholder.jpg");
  
  // Tabs: "rent" or "buy"
  const [mode, setMode] = useState<"rent" | "sale">(
    product.type === "sale" ? "sale" : "rent"
  );

  // Rental states
  const durations = product.rentDurations.split(",").map(Number).filter(Boolean);
  const [selectedDuration, setSelectedDuration] = useState<number>(durations[0] || 3);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const [addSuccess, setAddSuccess] = useState(false);

  // Helper to scale rental price by duration
  const getRentPrice = (basePrice: number, days: number) => {
    if (days <= 3) return basePrice;
    if (days <= 5) return Math.round(basePrice * 1.4);
    if (days <= 7) return Math.round(basePrice * 1.8);
    if (days <= 10) return Math.round(basePrice * 2.4);
    return Math.round(basePrice * 3.5); // 15 days
  };

  const currentPrice =
    mode === "sale"
      ? product.priceSale || 0
      : getRentPrice(product.priceRentPerPeriod || 0, selectedDuration);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handleAddToCart = () => {
    if (mode === "rent" && !dateRange) return;

    // YYYY-MM-DD helper
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images,
      mode,
      price: currentPrice,
      duration: mode === "rent" ? selectedDuration : undefined,
      startDate: mode === "rent" && dateRange ? formatDate(dateRange.start) : undefined,
      endDate: mode === "rent" && dateRange ? formatDate(dateRange.end) : undefined,
    });

    setAddSuccess(true);
    setCartOpen(true);
    setTimeout(() => setAddSuccess(false), 3000);
  };

  // WhatsApp click handler
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent(
      `Hello Thrithi Nakshatra! I'm interested in "${product.name}" (${
        mode === "rent"
          ? `Rent for ${selectedDuration} days starting ${dateRange ? dateRange.start.toDateString() : "soon"}`
          : "Purchase"
      }). Please let me know its availability.`
    );
    window.open(`https://wa.me/919999999999?text=${text}`, "_blank");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-[#FAF7F0]">
      {/* Column 1: Image Gallery */}
      <div className="space-y-4">
        {/* Main Display Image */}
        <div className="relative aspect-square w-full bg-[#FAF7F0] rounded-lg border border-[#C9A24B]/25 overflow-hidden">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        {/* Thumbnails */}
        {imagesList.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`relative h-20 w-20 shrink-0 rounded overflow-hidden border-2 transition duration-200 ${
                  activeImage === img ? "border-[#C9A24B]" : "border-[#C9A24B]/20 hover:border-[#C9A24B]/50"
                }`}
              >
                <Image src={img} alt={`thumbnail-${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Column 2: Interactive Controls & details */}
      <div className="space-y-8">
        <div>
          <span className="text-xs text-[#7A1F2B] uppercase font-bold tracking-widest bg-[#C9A24B]/10 border border-[#C9A24B]/30 px-3 py-1 rounded">
            {product.category.name}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] mt-4">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-2xl font-serif font-bold text-[#7A1F2B]">
              {formatPrice(currentPrice)}
            </span>
            {mode === "rent" && (
              <span className="text-xs text-[#555555] font-medium">
                total for {selectedDuration} days
              </span>
            )}
          </div>
        </div>

        {/* Rent vs Buy Toggle (Shown only if type is "both") */}
        {product.type === "both" && (
          <div className="flex bg-[#FAF7F0] p-1 rounded border border-[#C9A24B]/25 max-w-xs">
            <button
              onClick={() => {
                setMode("rent");
                setDateRange(null);
              }}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider transition duration-300 rounded ${
                mode === "rent" ? "bg-[#C9A24B] text-black" : "text-[#555555] hover:text-[#C9A24B]"
              }`}
            >
              Rent Jewellery
            </button>
            <button
              onClick={() => {
                setMode("sale");
                setDateRange(null);
              }}
              className={`flex-1 text-center py-2.5 text-xs font-bold uppercase tracking-wider transition duration-300 rounded ${
                mode === "sale" ? "bg-[#C9A24B] text-black" : "text-[#555555] hover:text-[#C9A24B]"
              }`}
            >
              Buy Outright
            </button>
          </div>
        )}

        <p className="text-[#444444] text-sm leading-relaxed border-t border-[#C9A24B]/20 pt-6">
          {product.description}
        </p>

        {/* Rent Mode Settings */}
        {mode === "rent" && (
          <div className="space-y-6 border-t border-[#C9A24B]/20 pt-6">
            {/* Duration Selector chips */}
            <div className="space-y-3">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#222222]">
                Choose Rental Duration
              </span>
              <div className="flex flex-wrap gap-3">
                {durations.map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDuration(d);
                    }}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition duration-300 rounded ${
                      selectedDuration === d
                        ? "border-[#C9A24B] bg-[#C9A24B]/15 text-[#7A1F2B] font-bold"
                        : "border-gray-300 hover:border-gray-450 text-[#555555] hover:text-[#111111] bg-white"
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Selector */}
            <BookingCalendar
              productId={product.id}
              duration={selectedDuration}
              onRangeSelect={setDateRange}
            />
          </div>
        )}

        {/* Add to Cart Actions */}
        <div className="space-y-4 pt-6 border-t border-[#C9A24B]/20">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={
                product.stockStatus === "out_of_stock" ||
                (mode === "rent" && !dateRange)
              }
              className="flex-1 gold-gradient disabled:bg-[#FAF7F0] disabled:opacity-60 disabled:text-gray-400 hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs py-4 transition duration-300 rounded shadow-lg flex items-center justify-center gap-2"
            >
              {addSuccess ? (
                <>
                  Added to Cart
                  <CheckCircle className="h-4 w-4" />
                </>
              ) : (
                <>
                  Add to Cart
                  <ShoppingBag className="h-4 w-4" />
                </>
              )}
            </button>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppClick}
              className="border border-[#25D366]/50 hover:border-[#25D366] hover:bg-[#25D366]/5 text-[#222222] hover:text-[#25D366] font-bold uppercase tracking-widest text-xs py-4 px-6 transition duration-300 rounded flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Inquire</span>
            </button>
          </div>

          {mode === "sale" && (
            <p className="text-[10px] text-[#555555] leading-normal text-center">
              * Purchased jewelry must be collected in-store. Delivery is available upon manual inquiry.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
