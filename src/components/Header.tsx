"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F0] border-b border-[#C9A24B]/30 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-[#FAF7F0]">
                <Image
                  src="/logo.png"
                  alt="THRITHI NAKSHATRA Logo"
                  fill
                  sizes="56px"
                  className="object-cover scale-105"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-sm font-semibold text-[#222222] hover:text-[#C9A24B] transition duration-200 uppercase tracking-widest"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm font-semibold text-[#222222] hover:text-[#C9A24B] transition duration-200 uppercase tracking-widest"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#222222] hover:text-[#C9A24B] transition duration-200 uppercase tracking-widest"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-[#222222] hover:text-[#C9A24B] transition duration-200 uppercase tracking-widest"
            >
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">


            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-[#222222] hover:text-[#C9A24B] transition duration-200 rounded-full hover:bg-black/5 border border-transparent hover:border-[#C9A24B]/30"
              aria-label="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#7A1F2B] text-[10px] font-bold text-white ring-2 ring-[#FAF7F0]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#222222] hover:text-[#C9A24B]"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-45 md:hidden transition-opacity duration-300 ease ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Menu (Slides from Right to Left) */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-[#F3EAD3] p-6 shadow-2xl md:hidden transform transition-transform duration-300 ease ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#C9A24B]/30 pb-4 mb-6">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#FAF7F0]">
            <Image
              src="/logo.png"
              alt="THRITHI NAKSHATRA Logo"
              fill
              sizes="48px"
              className="object-cover scale-105"
            />
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-[#222222] hover:text-[#C9A24B] transition duration-200"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-5">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-[#222222] hover:text-[#C9A24B] py-1 uppercase tracking-wider transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-[#222222] hover:text-[#C9A24B] py-1 uppercase tracking-wider transition duration-200"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-[#222222] hover:text-[#C9A24B] py-1 uppercase tracking-wider transition duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-bold text-[#222222] hover:text-[#C9A24B] py-1 uppercase tracking-wider transition duration-200"
          >
            Contact
          </Link>

        </nav>
      </div>
    </header>
  );
}
