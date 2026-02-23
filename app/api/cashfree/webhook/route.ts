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
        cashfreeOrderId: cashfreeOrderId,
        paymentReference: cashfreeOrderId,
        paidAt: FieldValue.serverTimestamp(),
        verifiedAt: FieldValue.serverTimestamp(),
        ticketStatus: "issued",
        updatedAt: FieldValue.serverTimestamp(),
      });

      const userRef = db.collection("users").doc(String(booking.userId));
      const userSnap = await userRef.get();
      const toEmail = userSnap.exists ? (userSnap.data() as any).email : undefined;

      const eventRef = db.collection("events").doc(String(booking.eventId));
      const eventSnap = await eventRef.get();
      const eventData = eventSnap.exists ? (eventSnap.data() as any) : {};

      if (toEmail && !booking.notificationSentAt) {
        try {
          const bookingForEmail = {
            ...booking,
            eventTitle: eventData.title,
            eventDate: eventData.eventDate?.toDate ? eventData.eventDate.toDate().toISOString() : undefined,
            venueName: eventData.venueName,
            id: bookingId,
            bookingId,
            name: (userSnap.exists ? (userSnap.data() as any).name : undefined) ?? "Guest",
            billing: {
              legalName: (userSnap.exists ? (userSnap.data() as any).name : undefined) ?? "Guest",
              email: toEmail,
              whatsapp: userSnap.exists ? (userSnap.data() as any).phone : undefined,
              nationality: userSnap.exists ? (userSnap.data() as any).nationality : undefined,
              residency: "indian",
              state: userSnap.exists ? (userSnap.data() as any).state : undefined,
            },
          };
          await sendTicketEmail({ to: toEmail, booking: bookingForEmail as any });
          await bookingRef.update({
            notificationSentAt: FieldValue.serverTimestamp(),
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
        verifiedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}