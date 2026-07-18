import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAF7F0] text-[#222222] border-t border-[#C9A24B]/30 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo & Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-16 w-16 rounded-full overflow-hidden bg-[#FAF7F0]">
                <Image
                  src="/logo.png"
                  alt="THRITHI NAKSHATRA Logo"
                  fill
                  sizes="64px"
                  className="object-cover scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl tracking-wider text-[#111111] font-bold leading-tight uppercase">
                  Thrithi Nakshatra
                </span>
                <span className="text-xs tracking-widest text-[#7A1F2B] font-semibold uppercase">
                  Fancy & Rental Jewellery
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#444444]">
              Experience the pinnacle of luxury bridal and fancy jewellery rentals and sales. We elevate your special moments with timeless elegance and handcrafted brilliance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest border-b border-[#C9A24B]/50 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-[#444444]">
              <li>
                <Link href="/" className="hover:text-[#C9A24B] transition duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#C9A24B] transition duration-200">
                  Shop Jewellery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#C9A24B] transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#C9A24B] transition duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-widest border-b border-[#C9A24B]/50 pb-2 inline-block">
              Store Details
            </h3>
            <ul className="space-y-3.5 text-sm text-[#444444]">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#7A1F2B] shrink-0 mt-0.5" />
                <span>
                  5th Cross Rd, near KMC Hospital,
                  Attavar, Mangaluru,
                  Karnataka - 575001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#7A1F2B]" />
                <a href="tel:+919999999999" className="hover:text-[#C9A24B] transition duration-200">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#7A1F2B]" />
                <a href="mailto:info@thrithinakshatra.com" className="hover:text-[#C9A24B] transition duration-200">
                  info@thrithinakshatra.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-[#C9A24B]/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#555555]">
          <p>© {new Date().getFullYear()} Thrithi Nakshatra. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-[#C9A24B] transition duration-200">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-[#C9A24B] transition duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
