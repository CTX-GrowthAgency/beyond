import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";
import { getCurrentUser } from "@/lib/auth/getUser";
import { buildInvoiceHtml } from "@/lib/email/buildInvoiceHtml";
import QRCode from "qrcode";

getAdminApp();

// ─── Types ────────────────────────────────────────────────────────────────────

interface TicketLine {
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface Booking {
  bookingId: string;
  userId?: string;
  eventTitle: string;
  eventDate: string;
  venueName?: string;
  tickets: TicketLine[];
  totalTickets: number;
  billing?: {
    legalName?: string;
    email?: string;
    whatsapp?: string;
    nationality?: string;
    residency?: string;
    state?: string | null;
  };
  pricing?: {
    subtotal?: number;
    grandTotal?: number;
    convenienceFee?: number;
    gst?: number;
  };
  paymentStatus: string;
  ticketStatus: string;
  paidAt?: { toDate: () => Date } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function fmtDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function normalisePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("91") && digits.length === 12) return digits;
  return `91${digits.slice(-10)}`;
}

// ─── WhatsApp (Meta Cloud API) ────────────────────────────────────────────────
// Switch body.type to "template" once you have Meta-approved templates.
// For sandbox / early testing, text messages work to numbers added to the test list.

async function sendWhatsApp(phone: string, booking: Booking) {
  const token         = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneNumberId) { console.warn("[WA] env vars missing, skip"); return; }

  const waTo = normalisePhone(phone);

  const ticketLines = booking.tickets
    .map((t) => `• ${t.name} × ${t.quantity}  —  ${inr(t.lineTotal)}`)
    .join("\n");

  const text = [
    `🎟 *Ticket Confirmed!*`,
    ``,
    `*${booking.eventTitle}*`,
    `📅 ${fmtDate(booking.eventDate)}`,
    booking.venueName ? `📍 ${booking.venueName}` : null,
    ``,
    `*Tickets Booked:*`,
    ticketLines,
    ``,
    `*Total Paid:* ${inr(booking.pricing?.grandTotal ?? 0)}`,
    ``,
    `🪪 *Booking ID:* \`${booking.bookingId}\``,
    ``,
    `Show the QR code at venue entry:`,
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookings/${booking.bookingId}`,
    ``,
    `_Keep this message for reference. Tickets are non-transferable._`,
  ].filter(Boolean).join("\n");

  const res = await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: waTo,
        type: "text",
        text: { body: text, preview_url: false },
      }),
    }
  );
  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
}

// ─── Email (Resend) ───────────────────────────────────────────────────────────

function buildEmailHtml(booking: Booking): string {
  const base         = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const grandTotal   = booking.pricing?.grandTotal ?? 0;
  const subtotal     = booking.pricing?.subtotal ?? grandTotal;
  const fee          = booking.pricing?.convenienceFee ?? 0;
  const gst          = booking.pricing?.gst ?? 0;
  const showBreakdown = fee > 0 || gst > 0;

  const ticketRows = booking.tickets.map((t) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:#f0ede6;font-size:14px;">${t.name}</td>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:rgba(240,237,230,0.4);font-size:13px;text-align:center;">× ${t.quantity}</td>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:#f0ede6;font-size:14px;text-align:right;white-space:nowrap;">${inr(t.lineTotal)}</td>
    </tr>`).join("");

  const breakdownRows = showBreakdown ? `
    <tr>
      <td colspan="2" style="padding:10px 0 4px;color:rgba(240,237,230,0.4);font-size:13px;">Subtotal</td>
      <td style="padding:10px 0 4px;color:rgba(240,237,230,0.4);font-size:13px;text-align:right;">${inr(subtotal)}</td>
    </tr>
    ${fee > 0 ? `<tr>
      <td colspan="2" style="padding:4px 0;color:rgba(240,237,230,0.4);font-size:13px;">Convenience Fee</td>
      <td style="padding:4px 0;color:rgba(240,237,230,0.4);font-size:13px;text-align:right;">${inr(fee)}</td>
    </tr>` : ""}
    ${gst > 0 ? `<tr>
      <td colspan="2" style="padding:4px 0;color:rgba(240,237,230,0.4);font-size:13px;">GST</td>
      <td style="padding:4px 0;color:rgba(240,237,230,0.4);font-size:13px;text-align:right;">${inr(gst)}</td>
    </tr>` : ""}
    <tr><td colspan="3" style="padding:0;"><div style="height:1px;background:#1e1e1e;margin:10px 0;"></div></td></tr>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Your ticket for ${booking.eventTitle}</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;color:#f0ede6;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px 60px;">
    <tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

      <!-- ── Logo / brand ── -->
      <tr>
        <td style="padding-bottom:32px;border-bottom:1px solid #141414;">
          <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c9b97a;">Beyond</span>
        </td>
      </tr>

      <!-- ── Event header ── -->
      <tr>
        <td style="padding:32px 0 24px;">
          <div style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c9b97a;margin-bottom:10px;">
            Booking Confirmed
          </div>
          <div style="font-size:38px;font-weight:800;color:#f0ede6;line-height:1.05;margin-bottom:10px;letter-spacing:-0.5px;">
            ${booking.eventTitle}
          </div>
          <div style="font-size:14px;color:rgba(240,237,230,0.45);">
            ${fmtDate(booking.eventDate)}${booking.venueName ? ` &nbsp;·&nbsp; ${booking.venueName}` : ""}
          </div>
        </td>
      </tr>

      <!-- ── Status pill ── -->
      <tr>
        <td style="padding-bottom:28px;">
          <span style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(201,185,122,0.12);border:1px solid rgba(201,185,122,0.35);color:#c9b97a;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
            ● Payment Confirmed
          </span>
        </td>
      </tr>

      <!-- ── QR entry pass ── -->
      <tr>
        <td style="padding:28px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:10px;text-align:center;margin-bottom:16px;">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,237,230,0.28);margin-bottom:14px;">
            Entry Pass — Show at Venue
          </div>
          <!-- QR rendered dynamically on the booking page -->
          <div style="display:inline-block;background:#fff;padding:14px;border-radius:10px;margin-bottom:16px;">
            <img
              src="${base}/api/qr/${booking.bookingId}"
              alt="QR Code"
              width="180" height="180"
              style="display:block;"
            />
          </div>
          <div style="font-size:13px;color:rgba(240,237,230,0.5);margin-bottom:18px;">
            Present this QR at the venue entrance to confirm entry
          </div>
          <a href="${base}/bookings/${booking.bookingId}"
             style="display:inline-block;padding:13px 28px;background:#c9b97a;color:#080808;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border-radius:6px;">
            Open My Ticket
          </a>
          <div style="font-family:monospace;font-size:11px;color:rgba(240,237,230,0.2);margin-top:14px;letter-spacing:0.06em;">
            ${booking.bookingId}
          </div>
        </td>
      </tr>

      <tr><td style="height:16px;"></td></tr>

      <!-- ── Ticket breakdown ── -->
      <tr>
        <td style="padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,237,230,0.28);margin-bottom:16px;">Tickets</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${ticketRows}
            ${breakdownRows}
            <tr>
              <td colspan="2" style="padding-top:14px;font-size:15px;font-weight:700;color:#f0ede6;">Grand Total</td>
              <td style="padding-top:14px;text-align:right;font-size:24px;font-weight:800;color:#c9b97a;white-space:nowrap;">${inr(grandTotal)}</td>
            </tr>
          </table>
        </td>
      </tr>

      <tr><td style="height:16px;"></td></tr>

      <!-- ── Billing details ── -->
      <tr>
        <td style="padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,237,230,0.28);margin-bottom:16px;">Billing Details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${booking.billing?.legalName ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);width:40%;">Name</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.legalName}</td></tr>` : ""}
            ${booking.billing?.email     ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);">Email</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.email}</td></tr>` : ""}
            ${booking.billing?.whatsapp  ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);">WhatsApp</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.whatsapp}</td></tr>` : ""}
          </table>
        </td>
      </tr>

      <!-- ── Footer ── -->
      <tr>
        <td style="padding-top:36px;text-align:center;">
          <div style="font-size:11px;color:rgba(240,237,230,0.18);letter-spacing:0.06em;margin-bottom:6px;">Booking Reference</div>
          <div style="font-family:monospace;font-size:12px;color:rgba(240,237,230,0.28);margin-bottom:20px;">${booking.bookingId}</div>
          <div style="height:1px;background:#141414;margin-bottom:20px;"></div>
          <div style="font-size:11px;color:rgba(240,237,230,0.18);line-height:1.6;">
            This is an automated confirmation from Beyond.<br/>
            Tickets are non-refundable and non-transferable.<br/>
            Questions? Contact us at <a href="mailto:support@beyondgoa.com" style="color:#c9b97a;text-decoration:none;">support@beyondgoa.com</a>
          </div>
        </td>
      </tr>

    </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendEmail(email: string, booking: Booking) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.warn("[Email] RESEND_API_KEY missing, skip"); return; }

  const qrImage = await QRCode.toDataURL(`${booking.bookingId}|${booking.eventTitle}`);
  const html = buildInvoiceHtml(booking, { qrImageDataUrl: qrImage });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "beyond@ctxgrowthagency.in",
      to: email,
      subject: `Your ticket for ${booking.eventTitle} ✓`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    const db   = getFirestore();
    const snap = await db.collection("bookings").doc(bookingId).get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const booking = { ...snap.data(), bookingId: snap.id } as Booking;

    if (booking.paymentStatus !== "completed") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    if (booking.userId !== user.uid) {
      return NextResponse.json({ error: "You can only resend tickets for your own booking" }, { status: 403 });
    }

    const whatsapp = booking.billing?.whatsapp;
    const email    = booking.billing?.email;
    const results: Record<string, string> = {};
    const errors:  string[] = [];

    // Send WhatsApp
    if (whatsapp) {
      try   { await sendWhatsApp(whatsapp, booking); results.whatsapp = "sent"; }
      catch (err) { errors.push((err as Error).message); results.whatsapp = "failed"; }
    }

    // Send email
    if (email) {
      try   { await sendEmail(email, booking); results.email = "sent"; }
      catch (err) { errors.push((err as Error).message); results.email = "failed"; }
    }

    // Persist notification timestamp regardless of partial failure
    await db.collection("bookings").doc(bookingId).update({
      notificationSentAt:    FieldValue.serverTimestamp(),
      notificationResults:   results,
    });

    // Return 200 if at least one channel succeeded
    const anySuccess = Object.values(results).includes("sent");
    if (!anySuccess) {
      return NextResponse.json({ error: errors.join(" | "), results }, { status: 500 });
    }

    return NextResponse.json({ success: true, results });

  } catch (err) {
    console.error("[send-ticket]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}