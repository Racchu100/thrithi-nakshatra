"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  CalendarRange,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/products", label: "Products", icon: <ShoppingBag className="h-5 w-5" /> },
    { href: "/admin/categories", label: "Categories", icon: <Tags className="h-5 w-5" /> },
    { href: "/admin/bookings", label: "Bookings", icon: <CalendarRange className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-gray-300 flex">
      {/* Mobile Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111111] border-r border-[#C9A24B]/20 transform transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand/Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-[#C9A24B]/20 bg-[#0B0B0B]">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-black shrink-0">
            <Image
              src="/logo.png"
              alt="THRITHI NAKSHATRA Logo"
              fill
              sizes="40px"
              className="object-cover scale-105"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-sm font-bold text-white uppercase tracking-wider truncate">
              Admin Portal
            </span>
            <span className="text-[9px] tracking-widest text-[#E9C878] uppercase truncate">
              Boutique Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium uppercase tracking-wider transition duration-200 ${
                  isActive
                    ? "bg-[#C9A24B] text-black font-bold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#C9A24B]/10 bg-[#0B0B0B] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-md text-xs font-semibold text-gray-400 hover:text-[#E9C878] hover:bg-white/5 transition duration-200 uppercase tracking-widest"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              <span>Live Website</span>
            </span>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-950/20 transition duration-200 uppercase tracking-widest"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="h-20 border-b border-[#C9A24B]/20 bg-[#111111] px-4 flex items-center justify-between md:hidden shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Thrithi Nakshatra Admin
            </span>
          </div>

          <div className="w-10"></div> {/* Spacer for alignment */}
        </header>

        {/* Main Content Page Container */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto bg-gradient-to-b from-[#111111] to-[#0B0B0B]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}
