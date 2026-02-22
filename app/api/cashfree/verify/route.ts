import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import { sendTicketEmail } from "@/lib/email/sendTicketEmail";

getAdminApp();

export async function POST(req: NextRequest) {
  try {
    const { bookingId, orderId } = await req.json();

    if (!bookingId || !orderId) {
      return NextResponse.json({ error: "Missing bookingId or orderId" }, { status: 400 });
    }

    // ── Fetch order status from Cashfree (same env as orders/create) ───────────
    const cfBaseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";
    const cfRes = await fetch(`${cfBaseUrl}/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": process.env.CASHFREE_APP_ID!,
        "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
      },
    });

    const cfData = await cfRes.json();
    const orderStatus = cfData.order_status; // PAID | ACTIVE | EXPIRED | CANCELLED

    const db = getFirestore(getAdminApp());
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = bookingSnap.data()!;

    if (orderStatus === "PAID") {
      // ── Mark booking as completed ───────────────────────────────────────────
      await bookingRef.update({
        paymentStatus: "completed",
        paymentMethod: cfData.payment_method ?? null,
        paymentReference: orderId,
        paidAt: FieldValue.serverTimestamp(),
        ticketStatus: "issued",
        updatedAt: FieldValue.serverTimestamp(),
      });

      // ── Mirror status on event subcollection ─────────────────────────────────
      await db
        .collection("events")
        .doc(booking.eventId)
        .collection("bookings")
        .doc(bookingId)
        .update({
          paymentStatus: "completed",
          updatedAt: FieldValue.serverTimestamp(),
        });

      // ── Send ticket + invoice email if not already sent (e.g. by webhook) ─────
      const toEmail = booking.billing?.email ?? (booking as any).email;
      if (toEmail && !booking.ticketEmailSentAt) {
        try {
          const bookingForEmail = {
            ...booking,
            id: bookingId,
            bookingId,
            name: booking.billing?.legalName ?? (booking as any).name,
          };
          await sendTicketEmail({ to: toEmail, booking: bookingForEmail });
          await bookingRef.update({
            ticketEmailSentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("[verify] sendTicketEmail failed:", err);
        }
      }

      return NextResponse.json({ status: "completed", bookingId });
    }

    if (orderStatus === "EXPIRED" || orderStatus === "CANCELLED") {
      await bookingRef.update({
        paymentStatus: "failed",
        updatedAt: FieldValue.serverTimestamp(),
      });

      await db
        .collection("events")
        .doc(booking.eventId)
        .collection("bookings")
        .doc(bookingId)
        .update({
          paymentStatus: "failed",
          updatedAt: FieldValue.serverTimestamp(),
        });

      return NextResponse.json({ status: "failed", bookingId });
    }

    // ACTIVE = payment still in progress
    return NextResponse.json({ status: "pending", orderStatus, bookingId });
  } catch (err) {
    console.error("verify-payment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}