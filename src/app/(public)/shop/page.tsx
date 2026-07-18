import { prisma } from "@/lib/db";
import ShopCatalogClient from "@/components/ShopCatalogClient";

export const revalidate = 0; // live data

interface ShopPageProps {
  searchParams: Promise<{
    categoryId?: string;
    subcategoryId?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
    query?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categoryId = params.categoryId;
  const subcategoryId = params.subcategoryId;
  const type = params.type;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const inStock = params.inStock === "true";
  const query = params.query || "";
  const sort = params.sort || "newest";

  // Build Prisma Query
  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (subcategoryId) {
    where.subcategoryId = subcategoryId;
  }
  if (inStock) {
    where.stockStatus = "available";
  }

  // Type filter
  if (type) {
    if (type === "rent") {
      where.type = { in: ["rent", "both"] };
    } else if (type === "sale") {
      where.type = { in: ["sale", "both"] };
    } else {
      where.type = type;
    }
  }

  // Search query
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } }
    ];
  }

  // Price filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceConditions: any[] = [];
    
    if (minPrice !== undefined) {
      priceConditions.push({
        OR: [
          { priceSale: { gte: minPrice } },
          { priceRentPerPeriod: { gte: minPrice } }
        ]
      });
    }
    
    if (maxPrice !== undefined) {
      priceConditions.push({
        OR: [
          { priceSale: { lte: maxPrice } },
          { priceRentPerPeriod: { lte: maxPrice } }
        ]
      });
    }

    if (priceConditions.length > 0) {
      where.AND = priceConditions;
    }
  }

  // Sorting
  let orderBy: any = {};
  if (sort === "price_asc") {
    orderBy = { priceSale: "asc" };
  } else if (sort === "price_desc") {
    orderBy = { priceSale: "desc" };
  } else {
    orderBy = { createdAt: "desc" };
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      subcategory: true
    }
  });

  // Custom sorting fallback for products with mixed rent/sale prices
  if (sort === "price_asc" || sort === "price_desc") {
    products.sort((a, b) => {
      const priceA = a.priceSale ?? a.priceRentPerPeriod ?? 0;
      const priceB = b.priceSale ?? b.priceRentPerPeriod ?? 0;
      return sort === "price_asc" ? priceA - priceB : priceB - priceA;
    });
  }

  // Category title display helper
  let shopTitle = "Jewellery Catalogue";
  if (categoryId) {
    const selectedCat = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (selectedCat) {
      shopTitle = selectedCat.name;
    }
  }

  return <ShopCatalogClient products={products} shopTitle={shopTitle} />;
}
