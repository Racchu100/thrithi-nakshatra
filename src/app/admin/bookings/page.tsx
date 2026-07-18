"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarRange, Inbox, Trash2, ShieldAlert, Sparkles, Phone, User, Calendar } from "lucide-react";

interface Product {
  name: string;
  priceSale: number | null;
  priceRentPerPeriod: number | null;
}

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  product: Product;
}

interface Inquiry {
  id: string;
  customerName: string;
  phone: string;
  createdAt: string;
  product: Product;
}

export default function AdminBookingsPage() {
  const [activeTab, setActiveTab] = useState<"rentals" | "sales">("rentals");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status === statusFilter;
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to load booking data");
      const data = await res.json();
      setBookings(data.bookings || []);
      setInquiries(data.purchaseInquiries || []);
    } catch (err: any) {
      setError(err.message || "Failed to load booking data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update booking status");
      }

      // Update in state
      setBookings(
        bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err: any) {
      alert(err.message || "Failed to update booking status");
    }
  };

  const handleDeleteBooking = async (id: string, customer: string) => {
    if (!confirm(`Are you sure you want to delete rental booking for "${customer}"? This will also unblock the selected dates.`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete booking");
      }
      setBookings(bookings.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete booking");
    }
  };

  const handleDeleteInquiry = async (id: string, customer: string) => {
    if (!confirm(`Are you sure you want to delete sale inquiry for "${customer}"?`)) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete inquiry");
      }
      setInquiries(inquiries.filter((inq) => inq.id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete inquiry");
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#C9A24B]/10 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wider uppercase">
            Manage Bookings
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
            Monitor rental schedules and direct purchase inquiries
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex bg-[#111111] p-1 rounded border border-[#C9A24B]/15 self-start">
          <button
            onClick={() => setActiveTab("rentals")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-300 rounded ${
              activeTab === "rentals" ? "bg-[#C9A24B] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <CalendarRange className="h-4 w-4" />
            <span>Rentals ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-300 rounded ${
              activeTab === "sales" ? "bg-[#C9A24B] text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            <Inbox className="h-4 w-4" />
            <span>Inquiries ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex gap-2.5 items-center bg-red-950/60 border border-red-500/30 text-rose-200 text-xs px-4 py-3 rounded">
          <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-64 bg-white/5 animate-pulse rounded flex items-center justify-center text-xs text-gray-500">
          Loading booking data...
        </div>
      ) : activeTab === "rentals" ? (
        /* rentals bookings view */
        bookings.length === 0 ? (
          <div className="bg-[#111111] border border-white/5 rounded-lg p-12 text-center shadow-md">
            <Sparkles className="h-8 w-8 text-gray-650 mx-auto mb-3" />
            <p className="text-gray-400 text-xs font-serif font-bold uppercase tracking-wide">
              No Rental Bookings Yet
            </p>
            <p className="text-gray-500 text-[10px] mt-1">
              Rental bookings created by customers on the shop page will show up here.
            </p>
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-[10px] sm:text-xs border-collapse min-w-[720px] sm:min-w-full">
                <thead>
                  <tr className="bg-[#0B0B0B] border-b border-[#C9A24B]/20 text-[#E9C878] uppercase tracking-widest font-bold">
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Product</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Customer Details</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Rental Dates</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Amount</th>
                    <th className="py-2.5 px-2.5 sm:py-4 sm:px-6">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-[9px] sm:text-[10px] tracking-wider uppercase opacity-85 shrink-0">Status:</span>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="bg-[#111111] border border-[#C9A24B]/35 text-white text-[9px] sm:text-[10px] rounded px-1 py-0.5 sm:px-1.5 sm:py-1 focus:outline-none focus:border-[#C9A24B] cursor-pointer font-bold uppercase tracking-wider shrink-0"
                        >
                          <option value="all">All</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500 font-serif italic text-sm">
                        No bookings found with status "{statusFilter}"
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-white/5 transition duration-150">
                        {/* Product Name */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6 font-serif text-[11px] sm:text-sm font-bold text-white max-w-[120px] sm:max-w-xs truncate">
                          {booking.product.name}
                        </td>

                        {/* Customer Details */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6 space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-white font-medium text-[10px] sm:text-xs">
                            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E9C878] shrink-0" />
                            <span>{booking.customerName}</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400 text-[9px] sm:text-xs">
                            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0" />
                            <a href={`tel:${booking.phone}`} className="hover:text-[#E9C878]">
                              {booking.phone}
                            </a>
                          </div>
                        </td>

                        {/* Rental Dates */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6 space-y-0.5 sm:space-y-1">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-white text-[10px] sm:text-xs">
                            <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E9C878] shrink-0" />
                            <span>
                              {format(new Date(booking.startDate), "dd MMM yyyy")} –{" "}
                              {format(new Date(booking.endDate), "dd MMM yyyy")}
                            </span>
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-gray-500 pl-4 sm:pl-5">
                            Duration: {booking.durationDays} Days (Blocked in Calendar)
                          </p>
                        </td>

                        {/* Total Amount */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6 font-bold text-white text-[11px] sm:text-sm">
                          {formatPrice(booking.totalAmount)}
                        </td>

                        {/* Booking Status Dropdown */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                            className={`bg-[#0B0B0B] border border-white/10 rounded px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                              booking.status === "confirmed"
                                ? "text-emerald-400 border-emerald-500/20"
                                : booking.status === "cancelled"
                                ? "text-rose-400 border-red-500/20"
                                : "text-amber-400 border-amber-500/20"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Delete Action */}
                        <td className="py-3 px-2.5 sm:py-4 sm:px-6 text-right shrink-0">
                          <button
                            onClick={() => handleDeleteBooking(booking.id, booking.customerName)}
                            className="p-1 text-gray-500 hover:text-rose-400 rounded hover:bg-white/5 transition duration-150"
                            title="Delete Booking"
                          >
                            <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* sales inquiries view */
        inquiries.length === 0 ? (
          <div className="bg-[#111111] border border-white/5 rounded-lg p-12 text-center shadow-md">
            <Sparkles className="h-8 w-8 text-gray-650 mx-auto mb-3" />
            <p className="text-gray-400 text-xs font-serif font-bold uppercase tracking-wide">
              No Purchase Inquiries Yet
            </p>
            <p className="text-gray-500 text-[10px] mt-1">
              Direct purchase requests made by customers checkout will show up here.
            </p>
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/5 rounded-lg overflow-hidden shadow-md">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-[10px] sm:text-xs border-collapse min-w-[620px] sm:min-w-full">
                <thead>
                  <tr className="bg-[#0B0B0B] border-b border-[#C9A24B]/20 text-[#E9C878] uppercase tracking-widest font-bold">
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Product</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Customer Details</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Sale Value</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6">Inquiry Date</th>
                    <th className="py-3 px-2.5 sm:py-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-white/5 transition duration-150">
                      {/* Product Name */}
                      <td className="py-3 px-2.5 sm:py-4 sm:px-6 font-serif text-[11px] sm:text-sm font-bold text-white max-w-[120px] sm:max-w-xs truncate">
                        {inq.product.name}
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-2.5 sm:py-4 sm:px-6 space-y-0.5 sm:space-y-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 text-white font-medium text-[10px] sm:text-xs">
                          <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#E9C878] shrink-0" />
                          <span>{inq.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400 text-[9px] sm:text-xs">
                          <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-500 shrink-0" />
                          <a href={`tel:${inq.phone}`} className="hover:text-[#E9C878]">
                            {inq.phone}
                          </a>
                        </div>
                      </td>

                      {/* Sale Price */}
                      <td className="py-3 px-2.5 sm:py-4 sm:px-6 font-bold text-white text-[11px] sm:text-sm">
                        {formatPrice(inq.product.priceSale)}
                      </td>

                      {/* Inquiry Date */}
                      <td className="py-3 px-2.5 sm:py-4 sm:px-6 text-gray-400 text-[10px] sm:text-xs">
                        {format(new Date(inq.createdAt), "dd MMM yyyy HH:mm")}
                      </td>

                      {/* Delete Action */}
                      <td className="py-3 px-2.5 sm:py-4 sm:px-6 text-right shrink-0">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id, inq.customerName)}
                          className="p-1 text-gray-500 hover:text-rose-400 rounded hover:bg-white/5 transition duration-150"
                          title="Delete Inquiry"
                        >
                          <Trash2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
