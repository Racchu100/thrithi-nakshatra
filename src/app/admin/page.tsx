import { prisma } from "@/lib/db";
import Link from "next/link";
import { format } from "date-fns";
import {
  ShoppingBag,
  CalendarRange,
  Users,
  Tags,
  ArrowUpRight,
  TrendingUp,
  Inbox,
  AlertCircle
} from "lucide-react";

export const revalidate = 0; // live data

export default async function AdminDashboardPage() {
  // Query counts
  const totalProducts = await prisma.product.count();
  const activeBookingsCount = await prisma.booking.count({
    where: { status: { in: ["pending", "confirmed"] } }
  });
  const totalInquiries = await prisma.purchaseInquiry.count();
  const totalCategories = await prisma.category.count();

  // Query feeds
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true }
  });

  const recentInquiries = await prisma.purchaseInquiry.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { product: true }
  });

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-[#E9C878]" />,
      color: "border-[#C9A24B]/30 bg-[#C9A24B]/5"
    },
    {
      label: "Active Bookings",
      value: activeBookingsCount,
      icon: <CalendarRange className="h-5 w-5 sm:h-6 sm:w-6 text-[#E9C878]" />,
      color: "border-[#C9A24B]/30 bg-[#C9A24B]/5"
    },
    {
      label: "Purchase Inquiries",
      value: totalInquiries,
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#E9C878]" />,
      color: "border-[#C9A24B]/30 bg-[#C9A24B]/5"
    },
    {
      label: "Total Categories",
      value: totalCategories,
      icon: <Tags className="h-5 w-5 sm:h-6 sm:w-6 text-[#E9C878]" />,
      color: "border-[#C9A24B]/30 bg-[#C9A24B]/5"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
          Dashboard Overview
        </h1>
        <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
          Thrithi Nakshatra Boutique analytics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`border rounded-lg p-3.5 sm:p-6 flex items-center justify-between shadow-md ${stat.color}`}
          >
            <div className="space-y-1.5 sm:space-y-2 min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider block truncate">
                {stat.label}
              </span>
              <p className="text-xl sm:text-3xl font-serif font-bold text-white leading-none">
                {stat.value}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-white/5 rounded-full border border-white/10 shrink-0">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Booking and inquiry feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent bookings table */}
        <div className="bg-[#111111] border border-white/5 rounded-lg p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#C9A24B]/10 pb-4">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CalendarRange className="h-4.5 w-4.5 text-[#E9C878]" />
              <span>Recent Rental Bookings</span>
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs text-[#E9C878] hover:text-white flex items-center gap-1 transition duration-200"
            >
              <span>Manage</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-xs">
              <AlertCircle className="h-8 w-8 text-gray-700 mb-2" />
              <span>No rental bookings found</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentBookings.map((b) => (
                <div key={b.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate font-serif">{b.product.name}</p>
                    <p className="text-gray-400 mt-1 text-[11px]">
                      Customer: {b.customerName} | Phone: {b.phone}
                    </p>
                    <p className="text-gray-500 mt-0.5 text-[10px]">
                      Range: {format(new Date(b.startDate), "dd MMM")} –{" "}
                      {format(new Date(b.endDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-white block">{formatPrice(b.totalAmount)}</span>
                    <span
                      className={`inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 rounded ${
                        b.status === "confirmed"
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/20"
                          : b.status === "cancelled"
                          ? "bg-red-950/60 text-rose-300 border border-red-500/20"
                          : "bg-amber-950/60 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent purchase inquiries table */}
        <div className="bg-[#111111] border border-white/5 rounded-lg p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-[#C9A24B]/10 pb-4">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Inbox className="h-4.5 w-4.5 text-[#E9C878]" />
              <span>Recent Sale Inquiries</span>
            </h3>
            <Link
              href="/admin/bookings"
              className="text-xs text-[#E9C878] hover:text-white flex items-center gap-1 transition duration-200"
            >
              <span>Manage</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-xs">
              <AlertCircle className="h-8 w-8 text-gray-700 mb-2" />
              <span>No sale inquiries found</span>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3.5 flex items-center justify-between text-xs gap-4">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate font-serif">{inq.product.name}</p>
                    <p className="text-gray-400 mt-1 text-[11px]">
                      Customer: {inq.customerName} | Phone: {inq.phone}
                    </p>
                    <p className="text-gray-500 mt-0.5 text-[10px]">
                      Created: {format(new Date(inq.createdAt), "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {inq.product.priceSale && (
                      <span className="font-bold text-[#E9C878] block">
                        {formatPrice(inq.product.priceSale)}
                      </span>
                    )}
                    <span className="inline-block text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 mt-1 rounded bg-[#7A1F2B]/20 text-rose-300 border border-[#7A1F2B]/20">
                      Inquiry
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
