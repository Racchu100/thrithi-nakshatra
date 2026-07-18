import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subcategoryId = searchParams.get("subcategoryId");
    const type = searchParams.get("type"); // "rent", "sale", "both"
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const featured = searchParams.get("featured") === "true";
    const inStock = searchParams.get("inStock") === "true";
    const query = searchParams.get("query") || "";
    const sort = searchParams.get("sort") || "newest"; // "price_asc", "price_desc", "newest"

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (subcategoryId) {
      where.subcategoryId = subcategoryId;
    }
    if (featured) {
      where.featured = true;
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
      // In SQLite/Prisma, we need to filter based on whether it is a rental or sale item
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
      // Sort by sale price if exists, otherwise rent price
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

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      categoryId,
      subcategoryId,
      type,
      priceSale,
      priceRentPerPeriod,
      rentDurations, // Array or comma-separated string
      images, // Array or comma-separated string
      stockStatus,
      featured
    } = body;

    if (!name || !description || !categoryId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: finalSlug }
    });

    if (existing) {
      return NextResponse.json({ error: "Product with this slug or name already exists" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        categoryId,
        subcategoryId: subcategoryId || null,
        type,
        priceSale: priceSale ? parseFloat(priceSale) : null,
        priceRentPerPeriod: priceRentPerPeriod ? parseFloat(priceRentPerPeriod) : null,
        rentDurations: Array.isArray(rentDurations) ? rentDurations.join(",") : rentDurations || "",
        images: Array.isArray(images) ? images.join(",") : images || "",
        stockStatus: stockStatus || "available",
        featured: !!featured
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
