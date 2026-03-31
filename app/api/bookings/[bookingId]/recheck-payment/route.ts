import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { checkCashfreeOrderStatus, updateBookingFromCashfreeStatus } from "@/lib/cashfree/payment-status";
import { rateLimit } from "@/lib/security/rate-limiter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    // Rate limiting
    const limiter = rateLimit({ windowMs: 60 * 1000, maxRequests: 5 }); // 5 requests per minute
    const rateLimitResult = limiter(req);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Get booking from Firestore
    const db = getAdminDb();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();

    // Only recheck pending payments
    if (bookingData?.paymentStatus !== "pending_payment") {
      return NextResponse.json(
        { 
          error: "Only pending payments can be rechecked",
          currentStatus: bookingData?.paymentStatus
        },
        { status: 400 }
      );
    }

    // Check if booking has a Cashfree order ID
    const cashfreeOrderId = bookingData?.cashfreeOrderId;
    if (!cashfreeOrderId) {
      return NextResponse.json(
        { error: "No payment reference found for this booking" },
        { status: 400 }
      );
    }

    // Check payment status with Cashfree
    const cashfreeStatus = await checkCashfreeOrderStatus(cashfreeOrderId);
    if (!cashfreeStatus) {
      return NextResponse.json(
        { error: "Unable to verify payment status. Please try again later." },
        { status: 503 }
      );
    }

    // Update booking if status changed
    let statusUpdated = false;
    if (cashfreeStatus.order_status !== 'PENDING') {
      statusUpdated = await updateBookingFromCashfreeStatus(bookingId, cashfreeStatus);
    }

    return NextResponse.json({
      success: true,
      cashfreeStatus: {
        orderId: cashfreeStatus.order_id,
        status: cashfreeStatus.order_status,
        amount: cashfreeStatus.order_amount,
        currency: cashfreeStatus.order_currency,
        updatedAt: cashfreeStatus.updated_at,
      },
      bookingStatus: statusUpdated ? 
        (cashfreeStatus.order_status === 'PAID' ? 'completed' : 
         cashfreeStatus.order_status === 'CANCELLED' ? 'cancelled' : 
         cashfreeStatus.order_status === 'EXPIRED' ? 'expired' : 'pending_payment') : 
        bookingData.paymentStatus,
      statusUpdated,
      message: statusUpdated ? 
        "Payment status updated successfully" : 
        "Payment status is already up to date"
    });

  } catch (error) {
    console.error("Payment recheck error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong while checking payment status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
