"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import SortSelect from "@/components/SortSelect";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  priceSale: number | null;
  priceRentPerPeriod: number | null;
  images: string;
  stockStatus: string;
  category: {
    name: string;
  };
}

interface ShopCatalogClientProps {
  products: Product[];
  shopTitle: string;
}

export default function ShopCatalogClient({ products, shopTitle }: ShopCatalogClientProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchParams.get("query") || "");

  // Keep searchVal in sync when query is cleared externally
  useEffect(() => {
    setSearchVal(searchParams.get("query") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchVal.trim()) {
      params.set("query", searchVal.trim());
    } else {
      params.delete("query");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchVal("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("query");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-[#FAF7F0]">
      {/* Title & Banner */}
      <div className="border-b border-[#C9A24B]/30 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <span className="text-[10px] text-[#7A1F2B] uppercase tracking-widest font-bold">
            Explore Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#111111] mt-1">
            {shopTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 self-stretch sm:self-auto justify-between sm:justify-start w-full sm:w-auto">
          {/* Filters Toggle Button */}
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="flex items-center gap-1 sm:gap-2 bg-white border border-[#C9A24B]/35 hover:border-[#C9A24B] px-2.5 py-2 sm:px-4 sm:py-2.5 rounded text-[10px] sm:text-xs font-bold uppercase tracking-normal sm:tracking-wider text-[#111111] transition duration-200 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#7A1F2B]" />
            <span>Show Filters</span>
          </button>
          <SortSelect />
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            placeholder="Search jewellery by name or details..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full bg-white border border-[#C9A24B]/35 focus:border-[#C9A24B] rounded pl-10 pr-10 py-3 text-xs text-[#111111] placeholder-gray-500 focus:outline-none transition duration-200 shadow-sm"
          />
          <div className="absolute left-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-[#7A1F2B]" />
          </div>
          {searchVal && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 p-1.5 text-gray-400 hover:text-black hover:bg-black/5 rounded-full transition duration-150 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Backdrop for Filters Drawer */}
      <div
        className={`fixed top-20 bottom-0 left-0 right-0 bg-black/40 z-30 transition-opacity duration-300 ease-in-out ${
          isFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsFiltersOpen(false)}
      />

      {/* Slide-out Filters Drawer (Left to Right) */}
      <div
        className={`fixed top-20 bottom-0 left-0 z-30 w-80 bg-white p-6 shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isFiltersOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsFiltersOpen(false)}
            className="p-1.5 text-gray-500 hover:text-black rounded hover:bg-black/5 transition duration-150 cursor-pointer"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <FilterSidebar />
      </div>

      {/* Product Grid Area (Full width) */}
      <div className="w-full">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#C9A24B]/25 rounded-lg text-center h-80 shadow-sm">
            <span className="text-3xl mb-4">💎</span>
            <h3 className="font-serif text-lg font-bold text-[#111111] mb-2">No Jewellery Found</h3>
            <p className="text-[#555555] text-xs max-w-md leading-relaxed">
              We couldn't find any products matching your current filters. Try resetting the filters or modifying your price range.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
