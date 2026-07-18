import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/bookings/[id] (Update booking status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body; // "pending", "confirmed", "completed", "cancelled"

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const previousStatus = booking.status;

    if (previousStatus === status) {
      return NextResponse.json(booking);
    }

    // Run in a transaction
    const updatedBooking = await prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id },
        data: { status }
      });

      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // Generate all dates in range
      const dates: Date[] = [];
      let current = new Date(startDate);
      while (current <= endDate) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      // If transition to cancelled: remove blocked dates
      if (status === "cancelled") {
        await tx.blockedDate.deleteMany({
          where: {
            productId: booking.productId,
            date: {
              in: dates
            }
          }
        });
      } 
      // If transition from cancelled back to pending/confirmed: recreate blocked dates (with check)
      else if (previousStatus === "cancelled" && (status === "pending" || status === "confirmed")) {
        // Check for conflicts
        const conflicts = await tx.blockedDate.findMany({
          where: {
            productId: booking.productId,
            date: {
              in: dates
            }
          }
        });

        if (conflicts.length > 0) {
          throw new Error("Cannot restore booking: Some dates in this range are already booked by another customer.");
        }

        // Re-create blocks
        for (const d of dates) {
          await tx.blockedDate.create({
            data: {
              productId: booking.productId,
              date: d
            }
          });
        }
      }

      return updated;
    });

    return NextResponse.json(updatedBooking);

  } catch (error: any) {
    console.error("PUT /api/bookings/[id] error:", error);
    return NextResponse.json({ error: error.message || "Failed to update booking" }, { status: 400 });
  }
}

// DELETE /api/bookings/[id] (Delete booking & free dates)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const booking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!booking) {
      // Fallback: Check if it's a purchase inquiry
      const inquiry = await prisma.purchaseInquiry.findUnique({
        where: { id }
      });

      if (!inquiry) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }

      await prisma.purchaseInquiry.delete({
        where: { id }
      });

      return NextResponse.json({ message: "Inquiry deleted successfully" });
    }

    // Run in a transaction
    await prisma.$transaction(async (tx) => {
      // If it wasn't already cancelled, free the dates
      if (booking.status !== "cancelled") {
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        const dates: Date[] = [];
        let current = new Date(startDate);
        while (current <= endDate) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }

        await tx.blockedDate.deleteMany({
          where: {
            productId: booking.productId,
            date: {
              in: dates
            }
          }
        });
      }

      // Delete the booking itself
      await tx.booking.delete({
        where: { id }
      });
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/bookings/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
