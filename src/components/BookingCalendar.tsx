"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Info, X } from "lucide-react";
import "react-day-picker/dist/style.css";

interface BookingCalendarProps {
  productId: string;
  duration: number; // e.g. 3, 5, 7
  onRangeSelect: (range: { start: Date; end: Date } | null) => void;
}

export default function BookingCalendar({ productId, duration, onRangeSelect }: BookingCalendarProps) {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [tempStart, setTempStart] = useState<Date | undefined>(undefined);
  const [selectedStart, setSelectedStart] = useState<Date | undefined>(undefined);
  const [selectedEnd, setSelectedEnd] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Fetch blocked dates for product
  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}/blocked-dates`)
      .then((res) => res.json())
      .then((data) => {
        setBlockedDates(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading blocked dates:", err);
        setLoading(false);
      });
  }, [productId]);

  // Handle temporary end date calculation when tempStart changes
  const tempEnd = tempStart ? addDays(tempStart, duration - 1) : undefined;

  // Validate date range conflict
  const checkConflict = (start: Date, end: Date) => {
    let checkDate = new Date(start);
    while (checkDate <= end) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, "0");
      const day = String(checkDate.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      
      if (blockedDates.includes(dateStr)) {
        return true;
      }
      checkDate = addDays(checkDate, 1);
    }
    return false;
  };

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) return;
    const end = addDays(day, duration - 1);
    if (checkConflict(day, end)) {
      setError(`The selected ${duration}-day range overlaps with an existing booking. Please choose a different start date.`);
      setTempStart(undefined);
    } else {
      setError("");
      setTempStart(day);
    }
  };

  const handleSave = () => {
    if (tempStart && tempEnd) {
      setSelectedStart(tempStart);
      setSelectedEnd(tempEnd);
      onRangeSelect({ start: tempStart, end: tempEnd });
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setTempStart(undefined);
    setSelectedStart(undefined);
    setSelectedEnd(undefined);
    onRangeSelect(null);
    setError("");
  };

  // Handle duration changes on already selected range
  useEffect(() => {
    if (selectedStart) {
      const end = addDays(selectedStart, duration - 1);
      if (checkConflict(selectedStart, end)) {
        // If conflict arises when duration changes, clear the selection and show error
        setError(`The new ${duration}-day duration overlaps with an existing booking. Selections cleared.`);
        setSelectedStart(undefined);
        setSelectedEnd(undefined);
        setTempStart(undefined);
        onRangeSelect(null);
      } else {
        setError("");
        setSelectedEnd(end);
        setTempStart(selectedStart);
        onRangeSelect({ start: selectedStart, end });
      }
    }
  }, [duration, blockedDates]);

  // Matcher for disabled days (past days + blocked days)
  const isDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (isBefore(date, today)) return true;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return blockedDates.includes(dateStr);
  };

  // Get days in between start and end to highlight them
  const getDaysInBetween = (start: Date, end: Date) => {
    const days: Date[] = [];
    let current = addDays(start, 1);
    while (current < end) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }
    return days;
  };

  const middleDays = tempStart && tempEnd ? getDaysInBetween(tempStart, tempEnd) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#555555]">
        <CalendarIcon className="h-4 w-4 text-[#7A1F2B]" />
        <span>Select Start Date</span>
      </div>

      {loading ? (
        <div className="h-12 bg-white animate-pulse rounded border border-[#C9A24B]/20 flex items-center justify-center text-xs text-gray-400">
          Loading booking details...
        </div>
      ) : (
        <div className="space-y-2">
          {/* Main Picker Button Input */}
          <button
            type="button"
            onClick={() => {
              setTempStart(selectedStart);
              setIsOpen(true);
            }}
            className="w-full flex items-center justify-between bg-white border border-[#C9A24B]/35 hover:border-[#C9A24B] px-4 py-3 rounded text-sm text-[#111111] transition duration-200 cursor-pointer shadow-sm text-left font-medium"
          >
            <span>{selectedStart ? format(selectedStart, "MMMM d, yyyy") : "Select Start Date"}</span>
            <CalendarIcon className="h-4 w-4 text-[#7A1F2B]" />
          </button>

          {/* Return Date Text */}
          {selectedStart && selectedEnd && !error && (
            <p className="text-xs font-bold text-[#111111] tracking-wide mt-1 pl-1">
              Return : {format(selectedEnd, "MMMM d, yyyy")}
            </p>
          )}
        </div>
      )}

      {/* Booking Calendar Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/55 backdrop-blur-xs transition-opacity duration-300">
          {/* Backdrop click closer */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl flex flex-col z-10 max-h-[90vh] overflow-y-auto transform transition-transform duration-300 translate-y-0">
            {/* Modal Header */}
            <div className="flex items-center pb-3 border-b border-gray-100 mb-4 relative">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="font-serif font-bold text-base text-[#111111] absolute left-1/2 transform -translate-x-1/2">
                Booking Dates
              </span>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex gap-2 items-start bg-red-50 border border-red-200 p-3 rounded text-xs text-[#7A1F2B] mb-4">
                <Info className="h-4 w-4 text-[#7A1F2B] shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{error}</p>
              </div>
            )}

            {/* Calendar */}
            <div className="flex justify-center bg-white border border-[#C9A24B]/15 rounded-lg p-3 shadow-inner">
              <style>{`
                .rdp {
                  --rdp-color-brand: #111111;
                  --rdp-color-brand-text: #ffffff;
                  --rdp-font-family: var(--font-inter), sans-serif;
                  margin: 0;
                }
                .rdp-day_button {
                  color: #111111;
                  font-weight: 500;
                  border-radius: 9999px;
                  width: 38px;
                  height: 38px;
                }
                .rdp-day_button:hover {
                  background-color: #FAF7F0;
                }
                .rdp-day_selected {
                  background-color: #111111 !important;
                  color: white !important;
                  border-radius: 9999px;
                }
                .rdp-day_disabled {
                  color: #d1d5db !important;
                  text-decoration: line-through;
                  opacity: 0.35;
                }
                .rdp-caption_label {
                  font-family: var(--font-serif);
                  font-size: 1.1rem;
                  font-weight: 750;
                  color: #111111 !important;
                }
                .rdp-caption {
                  justify-content: space-between;
                  margin-bottom: 0.5rem;
                }
                .rdp-chevron {
                  fill: #111111;
                }
                /* Custom styles for range highlighting with high specificity targeting */
                .rdp-day_selected,
                .rdp-day_start,
                .rdp-day_end {
                  background-color: #111111 !important;
                  color: white !important;
                  border-radius: 9999px !important;
                }
                .rdp-day_selected *,
                .rdp-day_start *,
                .rdp-day_end *,
                button.rdp-day_selected,
                button.rdp-day_start,
                button.rdp-day_end {
                  color: white !important;
                  background-color: #111111 !important;
                }
                .rdp-day_middle {
                  background-color: #F3EAD3 !important;
                  border-radius: 0 !important;
                }
                .rdp-day_middle *,
                button.rdp-day_middle {
                  color: #111111 !important;
                  background-color: #F3EAD3 !important;
                }
              `}</style>
              <DayPicker
                mode="single"
                selected={tempStart}
                onSelect={handleDaySelect}
                disabled={isDisabled}
                className="text-black"
                modifiers={{
                  start: tempStart ? [tempStart] : [],
                  end: tempEnd ? [tempEnd] : [],
                  middle: middleDays,
                }}
                modifiersClassNames={{
                  start: "rdp-day_start",
                  end: "rdp-day_end",
                  middle: "rdp-day_middle",
                }}
              />
            </div>

            {/* Selected Dates Display */}
            {tempStart && tempEnd && (
              <div className="mt-4 p-3 bg-[#FAF7F0] border border-[#C9A24B]/20 rounded-lg w-full text-center shadow-xs">
                <div className="flex justify-around items-center text-xs gap-1">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Collect Date</span>
                    <span className="font-bold text-[#111111] mt-0.5">{format(tempStart, "MMM d, yyyy")}</span>
                  </div>
                  
                  {/* Duration in between */}
                  <div className="flex flex-col items-center justify-center px-3 border-x border-gray-200">
                    <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Duration</span>
                    <span className="bg-[#111111] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs whitespace-nowrap">
                      {duration} days
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Return Date</span>
                    <span className="font-bold text-[#111111] mt-0.5">{format(tempEnd, "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Container */}
            <div className="mt-4 flex flex-col items-center w-full">

              {/* Action Buttons */}
              <div className="flex w-full items-center justify-between pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-bold text-gray-500 hover:text-black uppercase tracking-wider transition duration-150 px-4 py-2 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!tempStart || !!error}
                  className="bg-[#111111] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-lg shadow transition duration-200 cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
