import Image from "next/image";
import Link from "next/link";
import { Sparkles, Calendar, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-10 sm:space-y-20 pb-10 sm:pb-20">
      {/* Title Header */}
      <section className="bg-[#F3EAD3] border-b border-[#C9A24B]/35 py-8 sm:py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-2 sm:space-y-4">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#7A1F2B] font-bold">
            The Legend of T/N Monogram
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-[#111111] tracking-tight">
            Our Heritage & Story
          </h1>
          <div className="h-0.5 w-12 sm:w-16 bg-[#C9A24B] mx-auto mt-2 sm:mt-3" />
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111111] leading-snug">
            Redefining Bridal Luxury with <br />
            <span className="text-[#B28E3E] italic font-normal">Thrithi Nakshatra</span>
          </h2>
          
          <p className="text-[#444444] text-sm leading-relaxed">
            At **Thrithi Nakshatra**, we believe that every bride deserves to shine like a celestial star on her wedding day. Founded in Mangaluru, our boutique boutique jewelry showroom is curated specifically for brides, bridesmaid party members, and families looking for high-quality jewelry without the heavy price tags.
          </p>

          <p className="text-[#444444] text-sm leading-relaxed">
            Our signature **black and gold T/N monogram** symbolizes our promise: crafting traditional, heavy bridal jewelry designs with the gold standard of craftsmanship. By providing options to **rent, purchase, or both**, we offer modern solutions to timeless desires.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#111111] flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#7A1F2B]" />
                <span>Handcrafted</span>
              </h4>
              <p className="text-[#555555] text-xs leading-normal">
                Detailed Kundan, Polki, and Temple pieces handpicked by master artisans.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#111111] flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#7A1F2B]" />
                <span>Premium Quality</span>
              </h4>
              <p className="text-[#555555] text-xs leading-normal">
                Using high-grade gold plating, semi-precious gems, and premium pearls.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href="/shop"
              className="gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs px-8 py-3.5 transition duration-300 rounded inline-block"
            >
              Browse Our Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* The Rent or Buy Philosophy */}
      <section className="bg-[#F3EAD3]/30 border-y border-[#C9A24B]/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-[#111111]">Our Retail & Rental Philosophy</h2>
            <p className="text-[#555555] text-xs">
              Bridging the gap between luxurious heritage designs and modern practicality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-[#C9A24B]/25 space-y-4 text-left shadow-sm">
              <Calendar className="h-10 w-10 text-[#7A1F2B]" />
              <h3 className="font-serif text-lg font-bold text-[#111111]">Rental Boutique</h3>
              <p className="text-[#444444] text-xs leading-relaxed">
                Why purchase heavy jewelry sets that will only sit in a locker? Renting allows you to wear grand, matching sets for your reception, marriage ceremony, or pre-wedding shoots at a fraction of the cost.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg border border-[#C9A24B]/25 space-y-4 text-left shadow-sm">
              <Sparkles className="h-10 w-10 text-[#7A1F2B]" />
              <h3 className="font-serif text-lg font-bold text-[#111111]">Exclusive Sales</h3>
              <p className="text-[#444444] text-xs leading-relaxed">
                Fall in love with a statement ring, studs, or jhumkas? We offer direct purchases on select ornaments. Secure your heirloom jewelry and keep it in your collection forever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
