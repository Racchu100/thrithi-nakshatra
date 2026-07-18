import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/subcategories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const subcategories = await prisma.subcategory.findMany({
      where,
      orderBy: {
        name: "asc"
      }
    });

    return NextResponse.json(subcategories);
  } catch (error: any) {
    console.error("GET /api/subcategories error:", error);
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 });
  }
}

// POST /api/subcategories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, categoryId } = body;

    if (!name || !categoryId) {
      return NextResponse.json({ error: "Name and Category ID are required" }, { status: 400 });
    }

    const finalSlug = slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

    const existing = await prisma.subcategory.findUnique({
      where: { slug: finalSlug }
    });

    if (existing) {
      return NextResponse.json({ error: "Subcategory slug already exists" }, { status: 400 });
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug: finalSlug,
        categoryId
      }
    });

    return NextResponse.json(subcategory, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/subcategories error:", error);
    return NextResponse.json({ error: "Failed to create subcategory" }, { status: 500 });
  }
}
