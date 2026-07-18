import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/subcategories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, categoryId } = body;

    const data: any = {};
    if (name) data.name = name;
    if (slug) data.slug = slug;
    if (categoryId) data.categoryId = categoryId;

    const updated = await prisma.subcategory.update({
      where: { id },
      data
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PUT /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Failed to update subcategory" }, { status: 500 });
  }
}

// DELETE /api/subcategories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.subcategory.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Subcategory deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete subcategory" }, { status: 500 });
  }
}
