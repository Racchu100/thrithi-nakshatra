import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "THRITHI NAKSHATRA | Fancy & Rental Jewellery",
  description: "Premium rental and luxury jewellery for brides and special occasions. Shop or rent necklaces, jhumkas, bangles, bridal sets, and more in INR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-gold-50 text-dark-bg" suppressHydrationWarning>{children}</body>
    </html>
  );
}
