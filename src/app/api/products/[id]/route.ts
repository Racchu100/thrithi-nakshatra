import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        subcategory: true
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
      rentDurations,
      images,
      stockStatus,
      quantity,
      featured
    } = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (categoryId !== undefined) data.categoryId = categoryId;
    if (subcategoryId !== undefined) data.subcategoryId = subcategoryId || null;
    if (type !== undefined) data.type = type;
    
    if (priceSale !== undefined) data.priceSale = priceSale ? parseFloat(priceSale) : null;
    if (priceRentPerPeriod !== undefined) data.priceRentPerPeriod = priceRentPerPeriod ? parseFloat(priceRentPerPeriod) : null;
    
    if (rentDurations !== undefined) {
      data.rentDurations = Array.isArray(rentDurations) ? rentDurations.join(",") : rentDurations || "";
    }
    
    if (images !== undefined) {
      data.images = Array.isArray(images) ? images.join(",") : images || "";
    }
    
    if (stockStatus !== undefined) data.stockStatus = stockStatus;
    if (quantity !== undefined) data.quantity = parseInt(quantity);
    if (featured !== undefined) data.featured = !!featured;

    const updated = await prisma.product.update({
      where: { id },
      data
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
