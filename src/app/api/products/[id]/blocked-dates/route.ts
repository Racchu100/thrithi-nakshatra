import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/products/[id]/blocked-dates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch all BlockedDates for this product
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        productId: id
      },
      select: {
        id: true,
        date: true
      }
    });

    // Format as flat string array 'YYYY-MM-DD'
    const formattedDates = blockedDates.map(b => {
      const d = new Date(b.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });

    return NextResponse.json(formattedDates);
  } catch (error: any) {
    console.error("GET /api/products/[id]/blocked-dates error:", error);
    return NextResponse.json({ error: "Failed to fetch blocked dates" }, { status: 500 });
  }
}

// POST /api/products/[id]/blocked-dates (Add manual block)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const blockDate = new Date(date);
    blockDate.setHours(0, 0, 0, 0);

    // Check if already blocked
    const existing = await prisma.blockedDate.findFirst({
      where: {
        productId: id,
        date: blockDate
      }
    });

    if (existing) {
      return NextResponse.json({ message: "Date is already blocked", alreadyExists: true });
    }

    const created = await prisma.blockedDate.create({
      data: {
        productId: id,
        date: blockDate
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products/[id]/blocked-dates error:", error);
    return NextResponse.json({ error: "Failed to block date" }, { status: 500 });
  }
}

// DELETE /api/products/[id]/blocked-dates (Remove manual block)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const blockDate = new Date(dateStr);
    blockDate.setHours(0, 0, 0, 0);

    // Find and delete
    const result = await prisma.blockedDate.deleteMany({
      where: {
        productId: id,
        date: blockDate
      }
    });

    return NextResponse.json({ message: "Blocked date removed successfully", count: result.count });
  } catch (error: any) {
    console.error("DELETE /api/products/[id]/blocked-dates error:", error);
    return NextResponse.json({ error: "Failed to unblock date" }, { status: 500 });
  }
}
