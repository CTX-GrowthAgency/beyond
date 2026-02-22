// Shared invoice/ticket confirmation HTML for post-payment emails.

export interface BookingForEmail {
  bookingId: string;
  eventTitle: string;
  eventDate: string;
  venueName?: string;
  tickets: { name: string; price: number; quantity: number; lineTotal: number }[];
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
}

function inr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function fmtDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function buildInvoiceHtml(
  booking: BookingForEmail,
  options?: { qrImageDataUrl?: string }
): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";
  const qrApiUrl = base ? `${base}/api/qr/${booking.bookingId}` : "";
  const qrSrc = qrApiUrl || options?.qrImageDataUrl || "";
  const grandTotal = booking.pricing?.grandTotal ?? 0;
  const subtotal = booking.pricing?.subtotal ?? grandTotal;
  const fee = booking.pricing?.convenienceFee ?? 0;
  const gst = booking.pricing?.gst ?? 0;
  const showBreakdown = fee > 0 || gst > 0;

  const ticketRows = booking.tickets
    .map(
      (t) => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:#f0ede6;font-size:14px;">${t.name}</td>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:rgba(240,237,230,0.4);font-size:13px;text-align:center;">× ${t.quantity}</td>
      <td style="padding:11px 0;border-bottom:1px solid #141414;color:#f0ede6;font-size:14px;text-align:right;white-space:nowrap;">${inr(t.lineTotal)}</td>
    </tr>`
    )
    .join("");

  const breakdownRows = showBreakdown
    ? `
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
    <tr><td colspan="3" style="padding:0;"><div style="height:1px;background:#1e1e1e;margin:10px 0;"></div></td></tr>`
    : "";

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

      <tr>
        <td style="padding-bottom:32px;border-bottom:1px solid #141414;">
          <span style="font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#c9b97a;">Beyond</span>
        </td>
      </tr>

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

      <tr>
        <td style="padding-bottom:28px;">
          <span style="display:inline-block;padding:5px 14px;border-radius:20px;background:rgba(201,185,122,0.12);border:1px solid rgba(201,185,122,0.35);color:#c9b97a;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
            ● Payment Confirmed
          </span>
        </td>
      </tr>

      <tr>
        <td style="padding:28px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:10px;text-align:center;margin-bottom:16px;">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,237,230,0.28);margin-bottom:14px;">
            Entry Pass — Show at Venue
          </div>
          <div style="display:inline-block;background:#fff;padding:14px;border-radius:10px;margin-bottom:16px;">
            <img
              src="${qrSrc}"
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

      <tr>
        <td style="padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.08);border-radius:10px;">
          <div style="font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(240,237,230,0.28);margin-bottom:16px;">Billing Details</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${booking.billing?.legalName ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);width:40%;">Name</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.legalName}</td></tr>` : ""}
            ${booking.billing?.email ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);">Email</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.email}</td></tr>` : ""}
            ${booking.billing?.whatsapp ? `<tr><td style="padding:4px 0;font-size:13px;color:rgba(240,237,230,0.4);">WhatsApp</td><td style="padding:4px 0;font-size:14px;color:#f0ede6;">${booking.billing.whatsapp}</td></tr>` : ""}
          </table>
        </td>
      </tr>

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
