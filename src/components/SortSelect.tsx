"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "newest";

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <label htmlFor="sort-select" className="text-[10px] sm:text-xs text-[#555555] font-bold uppercase tracking-normal sm:tracking-wider shrink-0">
        Sort By:
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleChange}
        className="bg-white border border-[#C9A24B]/35 text-[#111111] text-[10px] sm:text-xs rounded px-1.5 py-1.5 sm:px-3 sm:py-2 focus:outline-none focus:border-[#C9A24B] cursor-pointer shadow-sm"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
}
