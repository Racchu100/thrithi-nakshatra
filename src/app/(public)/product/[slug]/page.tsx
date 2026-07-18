import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductDetailClient from "@/components/ProductDetailClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const revalidate = 0; // live data

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  // Query product details from database
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategory: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumbs / Back button */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#E9C878] transition duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to shop</span>
        </Link>
      </div>

      {/* Main product presentation */}
      <ProductDetailClient product={product} />
    </div>
  );
}
