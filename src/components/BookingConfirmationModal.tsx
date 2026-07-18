"use client";

import { CheckCircle2 } from "lucide-react";

interface BookingConfirmationModalProps {
  onClose: () => void;
}

export default function BookingConfirmationModal({ onClose }: BookingConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-[#111111] border border-[#C9A24B] p-8 text-center shadow-2xl transition-all duration-300 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center">
          {/* Checkmark icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A24B]/10 border border-[#C9A24B]/30 mb-6 animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-[#E9C878]" />
          </div>

          <h3 className="font-serif text-2xl font-bold tracking-wide text-white uppercase mb-4">
            Booking Confirmed
          </h3>

          <p className="text-gray-300 text-sm leading-relaxed mb-8 px-2">
            Thank you for booking with THRITHI NAKSHATRA. Our team will connect with you. You can visit our shop and collect your product.
          </p>

          <button
            onClick={onClose}
            className="w-full gold-gradient hover:opacity-95 text-black font-bold uppercase tracking-widest text-xs py-3.5 transition duration-300 rounded shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
