import Link from "next/link";
import Image from "next/image";
import { Eye, Calendar, Tag } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: string; // "rent", "sale", "both"
    priceSale: number | null;
    priceRentPerPeriod: number | null;
    images: string;
    stockStatus: string;
    category: {
      name: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage = product.images.split(",")[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600";

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden bg-white rounded-lg border border-[#C9A24B]/25 hover:border-[#C9A24B]/50 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F0] border-b border-[#C9A24B]/20">
        <Image
          src={firstImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover overlay quick actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            href={`/product/${product.slug}`}
            className="p-3 bg-[#FAF7F0] hover:bg-[#C9A24B] hover:text-black text-black rounded-full shadow-md transition duration-200"
            title="View Details"
          >
            <Eye className="h-5 w-5" />
          </Link>
        </div>

        {/* Stock tag */}
        {product.stockStatus === "out_of_stock" && (
          <span className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 bg-[#7A1F2B] text-white text-[7px] sm:text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 sm:px-2 sm:py-1 rounded shadow-md">
            Out of Stock
          </span>
        )}

        {/* Type badge */}
        <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 bg-[#FAF7F0]/95 border border-[#C9A24B]/40 text-[#7A1F2B] text-[7px] sm:text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
          {product.type === "both" ? "Rent & Buy" : product.type === "rent" ? "Rent Only" : "Buy Only"}
        </span>
      </div>

      {/* Info Container */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 bg-white">
        <span className="text-[8px] sm:text-[10px] text-[#7A1F2B] uppercase font-bold tracking-widest mb-1 sm:mb-1.5">
          {product.category.name}
        </span>
        
        <h3 className="font-serif text-xs sm:text-sm font-bold text-[#111111] mb-1.5 sm:mb-2 group-hover:text-[#C9A24B] transition duration-200 line-clamp-1">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Pricing Area */}
        <div className="border-t border-[#C9A24B]/20 pt-2 sm:pt-3.5 flex flex-col gap-1 sm:gap-1.5 mt-auto">
          {/* Rental pricing */}
          {(product.type === "rent" || product.type === "both") && product.priceRentPerPeriod && (
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#7A1F2B] shrink-0" />
              <span className="text-[#444444]">Rent:</span>
              <span className="font-bold text-[#111111] whitespace-nowrap">
                {formatPrice(product.priceRentPerPeriod)} <span className="text-[8px] sm:text-[10px] text-gray-500 font-normal">/ period</span>
              </span>
            </div>
          )}

          {/* Sale pricing */}
          {(product.type === "sale" || product.type === "both") && product.priceSale && (
            <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
              <Tag className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-rose-650 shrink-0" />
              <span className="text-[#444444]">Price:</span>
              <span className="font-bold text-[#111111] whitespace-nowrap">{formatPrice(product.priceSale)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
