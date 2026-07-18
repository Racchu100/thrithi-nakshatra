"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Read initial states from URL
  const selectedCat = searchParams.get("categoryId") || "";
  const selectedSub = searchParams.get("subcategoryId") || "";
  const selectedType = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const inStock = searchParams.get("inStock") === "true";

  // Fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load categories in filter", err);
        setLoading(false);
      });
  }, []);

  // Update query params helper
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // If category changes, reset subcategory
    if (key === "categoryId") {
      params.delete("subcategoryId");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(pathname);
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCat);

  return (
    <aside className="w-full md:w-64 bg-white p-6 rounded-lg border border-[#C9A24B]/25 self-start shadow-sm">
      <div className="flex items-center justify-between border-b border-[#C9A24B]/20 pb-4 mb-6">
        <div className="flex items-center gap-2 text-[#111111] font-serif font-bold uppercase tracking-wider text-sm">
          <SlidersHorizontal className="h-4 w-4 text-[#7A1F2B]" />
          <span>Filters</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#555555] hover:text-[#C9A24B] flex items-center gap-1 transition duration-200"
          title="Reset All"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-4 bg-[#FAF7F0] animate-pulse rounded w-2/3"></div>
          <div className="h-32 bg-[#FAF7F0] animate-pulse rounded"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A1F2B]">
              Category
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCat === ""}
                  onChange={() => updateQuery("categoryId", null)}
                  className="accent-[#C9A24B] h-4 w-4"
                />
                <span>All Categories</span>
              </label>

              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCat === cat.id}
                    onChange={() => updateQuery("categoryId", cat.id)}
                    className="accent-[#C9A24B] h-4 w-4"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subcategory Filter (dependent on selected Category) */}
          {selectedCat && selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A1F2B]">
                Subcategory
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                <label className="flex items-center gap-2 text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer">
                  <input
                    type="radio"
                    name="subcategory"
                    checked={selectedSub === ""}
                    onChange={() => updateQuery("subcategoryId", null)}
                    className="accent-[#C9A24B] h-4 w-4"
                  />
                  <span>All Subcategories</span>
                </label>

                {selectedCategoryObj.subcategories.map((sub) => (
                  <label
                    key={sub.id}
                    className="flex items-center gap-2 text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSub === sub.id}
                      onChange={() => updateQuery("subcategoryId", sub.id)}
                      className="accent-[#C9A24B] h-4 w-4"
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Type Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A1F2B]">
              Transaction Type
            </h4>
            <div className="space-y-2">
              {[
                { label: "All Types", value: "" },
                { label: "For Rent", value: "rent" },
                { label: "For Sale", value: "sale" },
                { label: "Both (Rent & Buy)", value: "both" }
              ].map((t) => (
                <label
                  key={t.value}
                  className="flex items-center gap-2 text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer"
                >
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === t.value}
                    onChange={() => updateQuery("type", t.value || null)}
                    className="accent-[#C9A24B] h-4 w-4"
                  />
                  <span>{t.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#7A1F2B]">
              Price Range (INR)
            </h4>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateQuery("minPrice", e.target.value || null)}
                className="w-1/2 bg-[#FAF7F0] border border-gray-300 rounded px-2.5 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#C9A24B] placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateQuery("maxPrice", e.target.value || null)}
                className="w-1/2 bg-[#FAF7F0] border border-gray-300 rounded px-2.5 py-1.5 text-xs text-[#111111] focus:outline-none focus:border-[#C9A24B] placeholder-gray-400"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-[#C9A24B]/20">
            <label className="flex items-center justify-between text-sm text-[#333333] hover:text-[#C9A24B] cursor-pointer">
              <span>In Stock Only</span>
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateQuery("inStock", e.target.checked ? "true" : null)}
                className="accent-[#C9A24B] h-4 w-4 cursor-pointer"
              />
            </label>
          </div>
        </div>
      )}
    </aside>
  );
}
