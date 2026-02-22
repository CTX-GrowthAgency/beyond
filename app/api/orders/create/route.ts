import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

function getCashfreeErrorMessage(cfData: unknown): string {
  if (!cfData || typeof cfData !== "object") return "Unknown error";
  const d = cfData as Record<string, unknown>;
  if (typeof d.message === "string") return d.message;
  if (d.error && typeof (d.error as Record<string, unknown>).message === "string") {
    return (d.error as Record<string, unknown>).message as string;
  }
  if (typeof d.error === "string") return d.error;
  return "Payment gateway error. Check server logs.";
}

export async function POST(req: NextRequest) {
  try {
    const { bookingId, amount, customer } = await req.json();

    if (!bookingId || !amount || !customer?.id || !customer?.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ── Validate env (fail fast with clear message) ────────────────────────────
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const appId = process.env.CASHFREE_APP_ID;
    const secret = process.env.CASHFREE_SECRET_KEY;

    if (!appId || !secret) {
      console.error("Missing CASHFREE_APP_ID or CASHFREE_SECRET_KEY");
      return NextResponse.json(
        { error: "Payment gateway not configured. Contact support." },
        { status: 503 }
      );
    }
    if (!baseUrl || baseUrl === "undefined") {
      console.error("Missing or invalid NEXT_PUBLIC_BASE_URL");
      return NextResponse.json(
        { error: "Server misconfiguration. Set NEXT_PUBLIC_BASE_URL." },
        { status: 503 }
      );
    }
    if (process.env.CASHFREE_ENV === "production" && !baseUrl.startsWith("https://")) {
      return NextResponse.json(
        {
          error: "Production Cashfree requires HTTPS.",
          message:
            "NEXT_PUBLIC_BASE_URL must be https (e.g. https://yourdomain.com or https://xxx.ngrok.io for local testing).",
        },
        { status: 503 }
      );
    }

    let db;
    try {
      db = getAdminDb();
    } catch (adminErr) {
      console.error("Firebase Admin init failed:", adminErr);
      return NextResponse.json(
        { error: "Payment service temporarily unavailable." },
        { status: 503 }
      );
    }

    // ── Verify booking exists and is still pending ────────────────────────────
    const bookingRef = db.collection("bookings").doc(bookingId);
    const bookingSnap = await bookingRef.get();

    if (!bookingSnap.exists) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const bookingData = bookingSnap.data();

    if (bookingData?.paymentStatus !== "pending_payment") {
      return NextResponse.json(
        { error: "Booking already processed" },
        { status: 400 }
      );
    }

    // ── Create Cashfree order ID ──────────────────────────────────────────────
    const cashfreeOrderId = `order_${bookingId}`;
    const orderAmount = Number(amount);
    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount" },
        { status: 400 }
      );
    }

    const payload = {
      order_id: cashfreeOrderId,
      order_amount: orderAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: String(customer.id),
        customer_email: String(customer.email),
        customer_phone:
          customer.phone?.replace(/\D/g, "").slice(-10) || "9999999999",
      },
      order_meta: {
        return_url: `${baseUrl}/payment-success?bookingId=${bookingId}&order_id={order_id}`,
        notify_url: `${baseUrl}/api/cashfree/webhook`,
      },
    };

    // ── Call Cashfree ─────────────────────────────────────────────────────────
    const cfBaseUrl =
      process.env.CASHFREE_ENV === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    const cfRes = await fetch(cfBaseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": appId,
        "x-client-secret": secret,
      },
      body: JSON.stringify(payload),
    });

    const cfData = await cfRes.json().catch(() => ({}));

    if (!cfRes.ok || !cfData.payment_session_id) {
      const message = getCashfreeErrorMessage(cfData);
      const isAuthError =
        cfRes.status === 401 ||
        /authentication failed|invalid credentials|unauthorized/i.test(String(message));
      console.error("Cashfree order creation failed:", cfRes.status, cfData);
      return NextResponse.json(
        {
          error: isAuthError
            ? "Payment gateway authentication failed. Use sandbox App ID and Secret with CASHFREE_ENV=sandbox, or production credentials with CASHFREE_ENV=production."
            : "Payment gateway could not create order.",
          message,
          details: process.env.NODE_ENV === "development" ? cfData : undefined,
        },
        { status: 500 }
      );
    }

    // ── Store order reference in booking ─────────────────────────────────────
    await bookingRef.update({
      cashfreeOrderId,
      paymentReference: cashfreeOrderId,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      payment_session_id: cfData.payment_session_id,
      order_id: cashfreeOrderId,
    });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}