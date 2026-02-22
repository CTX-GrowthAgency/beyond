import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import crypto from "crypto";
import { sendTicketEmail } from "@/lib/email/sendTicketEmail";

getAdminApp();

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-webhook-signature");
    const timestamp = req.headers.get("x-webhook-timestamp");

    // ── Verify webhook signature (required to prevent fake PAYMENT_SUCCESS) ─────
    const webhookSecret = process.env.CASHFREE_WEBHOOK_SECRET;
    if (webhookSecret) {
      if (!signature || !timestamp) {
        console.warn("Webhook missing signature or timestamp");
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }
      const signedPayload = `${timestamp}${rawBody}`;
      const expectedSig = crypto
        .createHmac("sha256", webhookSecret)
        .update(signedPayload)
        .digest("base64");
      if (expectedSig !== signature) {
        console.warn("Invalid webhook signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (process.env.NODE_ENV === "production") {
      console.warn("CASHFREE_WEBHOOK_SECRET not set in production");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.type; // PAYMENT_SUCCESS_WEBHOOK | PAYMENT_FAILED_WEBHOOK

    if (!eventType) {
      return NextResponse.json({ received: true });
    }

    const orderData = event.data?.order;
    const cashfreeOrderId = orderData?.order_id;

    if (!cashfreeOrderId) {
      return NextResponse.json({ received: true });
    }

    // bookingId is encoded in order_id as `order_${bookingId}`
    const bookingId = cashfreeOrderId.replace(/^order_/, "");
    const db = getFirestore();
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      console.warn(`Webhook: booking ${bookingId} not found`);
      return NextResponse.json({ received: true });
    }

    const booking = bookingSnap.data()!;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      // Idempotency: already completed → accept but skip update (avoid re-send)
      if (booking.paymentStatus === "completed") {
        return NextResponse.json({ received: true });
      }
      await bookingRef.update({
        paymentStatus: "completed",
        paymentMethod: event.data?.payment?.payment_method ?? null,
        paymentReference: cashfreeOrderId,
        paidAt: FieldValue.serverTimestamp(),
        ticketStatus: "issued",
        updatedAt: FieldValue.serverTimestamp(),
      });

      await db
        .collection("events")
        .doc(booking.eventId)
        .collection("bookings")
        .doc(bookingId)
        .update({
          paymentStatus: "completed",
          updatedAt: FieldValue.serverTimestamp(),
        });

      const toEmail = booking.billing?.email ?? booking.email;
      if (toEmail && !booking.ticketEmailSentAt) {
        try {
          const bookingForEmail = {
            ...booking,
            id: bookingId,
            bookingId,
            name: booking.billing?.legalName ?? booking.name,
          };
          await sendTicketEmail({ to: toEmail, booking: bookingForEmail });
          await bookingRef.update({
            ticketEmailSentAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
          });
        } catch (err) {
          console.error("[webhook] sendTicketEmail failed:", err);
        }
      }
    }

    if (eventType === "PAYMENT_FAILED_WEBHOOK") {
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
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}