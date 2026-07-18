"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail, ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-2 border-[#C9A24B] blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full border-2 border-[#C9A24B] blur-2xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#E9C878] transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Storefront</span>
        </Link>

        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="relative h-20 w-20 rounded-full bg-black shadow-2xl overflow-hidden">
            <Image
              src="/logo.png"
              alt="THRITHI NAKSHATRA Logo"
              fill
              sizes="80px"
              className="object-cover scale-105"
              priority
            />
          </div>
          <h2 className="mt-4 text-center font-serif text-2xl font-bold tracking-wider text-white uppercase">
            Admin Access Portal
          </h2>
          <p className="text-[10px] tracking-widest text-[#E9C878] uppercase">
            Thrithi Nakshatra Boutique
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#111111] py-8 px-4 shadow-2xl border border-[#C9A24B]/20 rounded-lg sm:px-10">
          {error && (
            <div className="mb-6 flex gap-2.5 items-center bg-red-950/60 border border-red-500/30 text-rose-200 text-xs px-4 py-3 rounded">
              <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-550">
                  <Mail className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@thrithinakshatra.com"
                  className="pl-10 w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24B] transition duration-200"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gold-gradient disabled:opacity-50 text-black font-bold uppercase tracking-widest text-xs py-3.5 transition duration-300 rounded shadow-md flex items-center justify-center gap-2"
              >
                {loading ? "Verifying..." : "Sign In to Admin"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
