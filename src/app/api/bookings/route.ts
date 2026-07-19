import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/bookings (Admin list)
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const purchaseInquiries = await prisma.purchaseInquiry.findMany({
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ bookings, purchaseInquiries });
  } catch (error: any) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings and inquiries" }, { status: 500 });
  }
}

// POST /api/bookings (Create bookings from cart checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerName, phone } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }

    if (!customerName || !phone) {
      return NextResponse.json({ error: "Customer details are required" }, { status: 400 });
    }

    const createdBookings: any[] = [];
    const createdInquiries: any[] = [];

    // Run in a transaction to ensure atomic execution and date locking
    await prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.mode === "rent") {
          const startDate = new Date(item.startDate);
          const endDate = new Date(item.endDate);
          
          // Clear time component for dates to prevent timezone mismatches
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          // Check if any of these dates are already blocked
          let checkDate = new Date(startDate);
          const datesToCheck: Date[] = [];
          while (checkDate <= endDate) {
            datesToCheck.push(new Date(checkDate));
            checkDate.setDate(checkDate.getDate() + 1);
          }

          const existingBlocks = await tx.blockedDate.findMany({
            where: {
              productId: item.productId,
              date: {
                in: datesToCheck
              }
            }
          });

          if (existingBlocks.length > 0) {
            throw new Error(`Conflict: Dates are already booked for product: ${item.name}`);
          }

           // Create Booking record
          const booking = await tx.booking.create({
            data: {
              productId: item.productId,
              customerName,
              phone,
              startDate,
              endDate,
              durationDays: item.duration,
              totalAmount: parseFloat(item.price),
              status: "pending",
              quantity: item.quantity || 1
            }
          });

          // Subtract booked quantity from product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity || 1
              }
            }
          });

          // Block the dates
          for (const d of datesToCheck) {
            await tx.blockedDate.create({
              data: {
                productId: item.productId,
                date: d
              }
            });
          }

          createdBookings.push(booking);
        } else if (item.mode === "sale") {
          // Create Purchase Inquiry
          const inquiry = await tx.purchaseInquiry.create({
            data: {
              productId: item.productId,
              customerName,
              phone
            }
          });
          createdInquiries.push(inquiry);
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      bookings: createdBookings, 
      inquiries: createdInquiries 
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to complete booking" 
    }, { status: 400 });
  }
}
