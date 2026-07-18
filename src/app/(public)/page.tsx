import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Calendar, BadgeCheck, ShieldCheck } from "lucide-react";

export const revalidate = 0; // Disable caching to always show live db state

export default async function HomePage() {
  // Query categories and featured products directly from the database
  const categories = await prisma.category.findMany({
    take: 8,
  });

  const featuredProducts = await prisma.product.findMany({
    where: { featured: true },
    take: 4,
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-20 pb-20 bg-[#FAF7F0]">
      {/* Hero Section */}
      <section className="relative bg-[#F3EAD3] text-[#111111] pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-hidden border-b border-[#C9A24B]/30">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full border-2 border-[#C9A24B] blur-xl bg-[#C9A24B]/10" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full border-2 border-[#C9A24B] blur-xl bg-[#C9A24B]/10" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-5">
            {/* Logo */}
            <div className="relative h-28 w-28 rounded-full bg-[#FAF7F0] shadow-2xl animate-fade-in overflow-hidden">
              <Image
                src="/logo.png"
                alt="THRITHI NAKSHATRA Logo"
                fill
                sizes="112px"
                className="object-cover scale-105"
                priority
              />
            </div>

            {/* Tagline & Headings */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.25em] text-[#7A1F2B] font-bold">
                Luxury Bridal & Fancy Collections
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] leading-none">
                Timeless Elegance, <br />
                <span className="text-[#B28E3E] font-normal italic">For Rent or Sale</span>
              </h1>
              <p className="text-[#444444] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                Make your special moments unforgettable. Thrithi Nakshatra offers an exquisite curated selection of premium bridal jewelry sets, chokers, bangles, and accessories for rent and sale in Mangaluru.
              </p>
            </div>

            {/* CTAs */}
            <div className="pt-1 flex justify-center">
              <Link
                href="/shop"
                className="gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs px-8 py-4 transition duration-300 rounded shadow-lg"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: <Calendar className="h-8 w-8 text-[#7A1F2B]" />,
              title: "Flexible Rental",
              desc: "Rent premium jewelry for 3, 5, 7, or up to 15 days based on your ceremony schedule."
            },
            {
              icon: <Sparkles className="h-8 w-8 text-[#7A1F2B]" />,
              title: "Buy & Keep",
              desc: "Purchase and cherish statement pieces forever from our exclusive retail catalog."
            },
            {
              icon: <BadgeCheck className="h-8 w-8 text-[#7A1F2B]" />,
              title: "Sanitized & Polished",
              desc: "Every rented ornament undergoes ultrasonic cleaning and inspection before collection."
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-[#7A1F2B]" />,
              title: "Easy Date Blocking",
              desc: "Secure booking immediately blocks your dates in our real-time calendar system."
            }
          ].map((val, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-[#C9A24B]/20 flex flex-col items-center text-center space-y-3 shadow-sm hover:border-[#C9A24B]/50 hover:shadow-md transition duration-300"
            >
              <div className="p-3 bg-[#C9A24B]/10 rounded-full mb-2">{val.icon}</div>
              <h3 className="font-serif text-base font-bold text-[#111111] uppercase tracking-wider">{val.title}</h3>
              <p className="text-[#555555] text-xs leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] text-[#7A1F2B] uppercase tracking-widest font-bold">
              Exclusive Picks
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111]">
              Featured Masterpieces
            </h2>
            <div className="h-0.5 w-16 bg-[#C9A24B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/shop"
              className="inline-block border-b-2 border-[#C9A24B] text-[#7A1F2B] hover:text-[#C9A24B] font-bold uppercase tracking-widest text-xs pb-1 transition duration-200"
            >
              View Full Store Catalog
            </Link>
          </div>
        </section>
      )}




    </div>
  );
}
