"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase/client";
import BookingQR from "@/components/checkout/BookingQR";

interface TicketLine {
  name: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

interface BookingData {
  bookingId: string;
  userId: string;
  eventSlug: string;
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
  paidAt?: Timestamp | null;
  createdAt?: Timestamp;
  notificationSentAt?: Timestamp | null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    completed:       { label: "Confirmed",       color: "#c9b97a", bg: "rgba(201,185,122,0.12)" },
    pending_payment: { label: "Pending Payment", color: "rgba(240,237,230,0.5)", bg: "rgba(255,255,255,0.05)" },
    failed:          { label: "Failed",           color: "#e05252", bg: "rgba(224,82,82,0.1)" },
  };
  const s = map[status] ?? { label: status, color: "rgba(240,237,230,0.4)", bg: "rgba(255,255,255,0.04)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "4px 12px", borderRadius: 20,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", border: `1px solid ${s.color}40`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, padding: "22px 24px", marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "rgba(240,237,230,0.3)", marginBottom: 16,
    }}>
      {children}
    </div>
  );
}

function SkeletonBlock({ height = 120 }: { height?: number }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 10, height, marginBottom: 14,
      animation: "bd-pulse 1.6s ease-in-out infinite",
    }} />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BookingDetail({ bookingId }: { bookingId: string }) {
  const [booking, setBooking]     = useState<BookingData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [uid, setUid]             = useState<string | null>(null);
  const [sending, setSending]     = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setUid(null); setLoading(false); return; }
      setUid(user.uid);
      try {
        const db   = getFirestore(app);
        const snap = await getDoc(doc(db, "bookings", bookingId));
        if (!snap.exists()) { setLoading(false); return; }
        const data = snap.data() as BookingData;
        if (data.userId !== user.uid) { setLoading(false); return; }
        setBooking({ ...data, bookingId: snap.id });
      } catch (err) {
        console.error("Booking fetch error:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [bookingId]);

  async function handleSendNotification() {
    if (!booking || sending) return;
    setSending(true);
    setSendStatus("sending");
    try {
      const res = await fetch("/api/notifications/send-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      });
      if (!res.ok) throw new Error("Failed");
      setSendStatus("sent");
    } catch {
      setSendStatus("error");
    } finally {
      setSending(false);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

    .bd-root {
      min-height: 100vh;
      background: #080808;
      color: #f0ede6;
      font-family: 'DM Sans', sans-serif;
      padding-bottom: 100px;
    }
    .bd-topbar {
      padding: 16px clamp(20px, 5vw, 80px);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .bd-back {
      display: inline-flex; align-items: center; gap: 7px;
      font-size: 13px; color: rgba(240,237,230,0.4);
      text-decoration: none; transition: color 0.2s;
    }
    .bd-back:hover { color: #c9b97a; }

    .bd-body {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px clamp(20px, 5vw, 40px);
    }

    /* Event header */
    .bd-eyebrow {
      font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
      color: #c9b97a; margin-bottom: 8px;
    }
    .bd-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(34px, 5vw, 52px);
      letter-spacing: 0.04em; color: #f0ede6;
      margin: 0 0 12px; line-height: 1;
    }
    .bd-meta {
      display: flex; flex-wrap: wrap; gap: 14px;
      font-size: 13px; color: rgba(240,237,230,0.45);
      margin-bottom: 28px; align-items: center;
    }
    .bd-meta-item { display: flex; align-items: center; gap: 5px; }

    /* QR */
    .bd-qr-outer { text-align: center; }
    .bd-qr-box {
      display: inline-block;
      background: #fff; padding: 16px; border-radius: 12px; margin-bottom: 12px;
    }
    .bd-qr-hint { font-size: 12px; color: rgba(240,237,230,0.3); }
    .bd-qr-id {
      font-family: monospace; font-size: 11px;
      color: rgba(240,237,230,0.2); margin-top: 6px; letter-spacing: 0.06em;
    }
    .bd-qr-locked {
      padding: 36px 0;
      color: rgba(240,237,230,0.3); font-size: 13px; text-align: center;
    }

    /* Ticket rows */
    .bd-ticket-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .bd-ticket-row:last-of-type { border-bottom: none; }
    .bd-ticket-name { font-size: 14px; color: #f0ede6; }
    .bd-ticket-sub  { font-size: 11px; color: rgba(240,237,230,0.35); margin-top: 2px; }
    .bd-ticket-price {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 17px; letter-spacing: 0.03em; color: #f0ede6; white-space: nowrap;
    }

    /* Pricing */
    .bd-price-row {
      display: flex; justify-content: space-between;
      font-size: 13px; color: rgba(240,237,230,0.45); margin-bottom: 8px;
    }
    .bd-price-divider { height: 1px; background: rgba(255,255,255,0.07); margin: 14px 0; }
    .bd-total-row {
      display: flex; justify-content: space-between; align-items: baseline;
    }
    .bd-total-label { font-size: 14px; font-weight: 600; color: #f0ede6; }
    .bd-total-val {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px; letter-spacing: 0.04em; color: #c9b97a;
    }

    /* Billing */
    .bd-billing-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
    }
    @media (max-width: 440px) { .bd-billing-grid { grid-template-columns: 1fr; } }
    .bd-billing-label {
      font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase;
      color: rgba(240,237,230,0.28); margin-bottom: 4px;
    }
    .bd-billing-val { font-size: 14px; color: #f0ede6; word-break: break-all; }

    /* Send notification button */
    .bd-send-btn {
      display: flex; align-items: center; justify-content: center; gap: 9px;
      width: 100%; padding: 14px 20px;
      background: rgba(201,185,122,0.07);
      border: 1px solid rgba(201,185,122,0.25);
      border-radius: 8px; color: #c9b97a;
      font-family: 'DM Sans', sans-serif;
      font-size: 12px; font-weight: 600;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.15s;
    }
    .bd-send-btn:hover:not(:disabled) {
      background: rgba(201,185,122,0.14);
      border-color: rgba(201,185,122,0.4);
      transform: translateY(-1px);
    }
    .bd-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
    .bd-send-btn.sent  { background: rgba(201,185,122,0.1);  border-color: rgba(201,185,122,0.35); }
    .bd-send-btn.error { background: rgba(224,82,82,0.07); border-color: rgba(224,82,82,0.3); color: #e05252; }
    .bd-send-sub {
      font-size: 11px; color: rgba(240,237,230,0.28);
      text-align: center; margin-top: 8px; line-height: 1.5;
    }

    /* Spinner */
    @keyframes bd-spin   { to { transform: rotate(360deg); } }
    @keyframes bd-pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
    .bd-spin { animation: bd-spin 0.9s linear infinite; }
    .bd-skel { animation: bd-pulse 1.6s ease-in-out infinite; }

    /* Footer ref */
    .bd-ref-block {
      text-align: center; margin-top: 32px;
      font-size: 11px; color: rgba(240,237,230,0.18); letter-spacing: 0.05em;
    }
    .bd-ref-id {
      font-family: monospace; font-size: 12px;
      color: rgba(240,237,230,0.25); margin-top: 4px;
    }
  `;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <>
      <style>{css}</style>
      <div className="bd-root">
        <div className="bd-topbar">
          <Link href="/bookings" className="bd-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            My Bookings
          </Link>
        </div>
        <div className="bd-body">
          <div className="bd-skel" style={{ height: 16, width: "20%", borderRadius: 4, background: "rgba(255,255,255,0.06)", marginBottom: 14 }} />
          <div className="bd-skel" style={{ height: 44, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.06)", marginBottom: 24 }} />
          <SkeletonBlock height={280} />
          <SkeletonBlock height={140} />
          <SkeletonBlock height={100} />
        </div>
      </div>
    </>
  );

  // ── Not logged in ───────────────────────────────────────────────────────────
  if (!uid) return (
    <>
      <style>{css}</style>
      <div className="bd-root">
        <div className="bd-topbar"><Link href="/bookings" className="bd-back">← My Bookings</Link></div>
        <div className="bd-body" style={{ paddingTop: 80, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(240,237,230,0.4)" }}>Please log in to view this booking.</p>
        </div>
      </div>
    </>
  );

  // ── Not found / unauthorised ────────────────────────────────────────────────
  if (!booking) return (
    <>
      <style>{css}</style>
      <div className="bd-root">
        <div className="bd-topbar"><Link href="/bookings" className="bd-back">← My Bookings</Link></div>
        <div className="bd-body" style={{ paddingTop: 80, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "rgba(240,237,230,0.4)", marginBottom: 16 }}>Booking not found.</p>
          <Link href="/bookings" style={{ color: "#c9b97a", fontSize: 13, textDecoration: "none" }}>← Back to my bookings</Link>
        </div>
      </div>
    </>
  );

  // ── Computed values ─────────────────────────────────────────────────────────
  const isConfirmed     = booking.paymentStatus === "completed";
  const grandTotal      = booking.pricing?.grandTotal ?? 0;
  const subtotal        = booking.pricing?.subtotal ?? grandTotal;
  const convenienceFee  = booking.pricing?.convenienceFee ?? 0;
  const gst             = booking.pricing?.gst ?? 0;
  const showBreakdown   = convenienceFee > 0 || gst > 0;
  const alreadySent     = !!booking.notificationSentAt;

  const btnClass = sendStatus === "sent" ? "bd-send-btn sent"
                 : sendStatus === "error" ? "bd-send-btn error"
                 : "bd-send-btn";

  return (
    <>
      <style>{css}</style>
      <div className="bd-root">

        {/* Top bar */}
        <div className="bd-topbar">
          <Link href="/bookings" className="bd-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            My Bookings
          </Link>
        </div>

        <div className="bd-body">

          {/* ── Event header ── */}
          <div className="bd-eyebrow">Booking Details</div>
          <h1 className="bd-title">{booking.eventTitle}</h1>
          <div className="bd-meta">
            {booking.eventDate && (
              <span className="bd-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                  weekday: "short", day: "2-digit", month: "long", year: "numeric"
                })}
              </span>
            )}
            {booking.venueName && (
              <span className="bd-meta-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {booking.venueName}
              </span>
            )}
            <StatusBadge status={booking.paymentStatus} />
          </div>

          {/* ── QR Entry Pass ── */}
          <Card>
            <CardLabel>Entry Pass — Show at Venue</CardLabel>
            {isConfirmed ? (
              <div className="bd-qr-outer">
                <div className="bd-qr-box">
                  <BookingQR bookingId={booking.bookingId} size={210} />
                </div>
                <p className="bd-qr-hint">
                  Present this QR at the venue entrance to confirm entry. We recommend taking a screenshot and keeping it handy.
                </p>
                <p className="bd-qr-id">{booking.bookingId}</p>
              </div>
            ) : (
              <div className="bd-qr-locked">
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.18)" strokeWidth="1.5" style={{ display: "block", margin: "0 auto 12px" }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                QR code will appear once payment is confirmed
              </div>
            )}
          </Card>

          {/* ── Resend ticket ── */}
          {isConfirmed && (
            <Card>
              <CardLabel>Send Ticket</CardLabel>
              <button
                className={btnClass}
                disabled={sending || sendStatus === "sent"}
                onClick={handleSendNotification}
              >
                {sendStatus === "sending" ? (
                  <>
                    <svg className="bd-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6-8.485"/>
                    </svg>
                    Sending…
                  </>
                ) : sendStatus === "sent" ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    Sent to WhatsApp &amp; Email
                  </>
                ) : sendStatus === "error" ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Failed — Tap to Retry
                  </>
                ) : (
                  <>
                    {/* WhatsApp icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Send to WhatsApp &amp; Email
                  </>
                )}
              </button>
              <p className="bd-send-sub">
                {alreadySent && sendStatus === "idle"
                  ? `Previously sent · tap to resend to ${booking.billing?.whatsapp ?? "your WhatsApp"} & ${booking.billing?.email ?? "your email"}`
                  : `Ticket QR + invoice → ${booking.billing?.whatsapp ?? "your WhatsApp"} & ${booking.billing?.email ?? "your email"}`
                }
              </p>
            </Card>
          )}

          {/* ── Ticket breakdown ── */}
          <Card>
            <CardLabel>Tickets</CardLabel>
            {booking.tickets?.map((t, i) => (
              <div key={i} className="bd-ticket-row">
                <div>
                  <div className="bd-ticket-name">{t.name}</div>
                  <div className="bd-ticket-sub">₹{t.price.toLocaleString("en-IN")} × {t.quantity}</div>
                </div>
                <div className="bd-ticket-price">₹{t.lineTotal.toLocaleString("en-IN")}</div>
              </div>
            ))}

            <div className="bd-price-divider" />

            {showBreakdown && (
              <>
                <div className="bd-price-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {convenienceFee > 0 && (
                  <div className="bd-price-row">
                    <span>Convenience Fee</span>
                    <span>₹{convenienceFee.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {gst > 0 && (
                  <div className="bd-price-row">
                    <span>GST</span>
                    <span>₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="bd-price-divider" />
              </>
            )}

            <div className="bd-total-row">
              <span className="bd-total-label">Grand Total</span>
              <span className="bd-total-val">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </Card>

          {/* ── Billing details ── */}
          {booking.billing && (
            <Card>
              <CardLabel>Billing Details</CardLabel>
              <div className="bd-billing-grid">
                {booking.billing.legalName && (
                  <div>
                    <div className="bd-billing-label">Name</div>
                    <div className="bd-billing-val">{booking.billing.legalName}</div>
                  </div>
                )}
                {booking.billing.email && (
                  <div>
                    <div className="bd-billing-label">Email</div>
                    <div className="bd-billing-val" style={{ fontSize: 13 }}>{booking.billing.email}</div>
                  </div>
                )}
                {booking.billing.whatsapp && (
                  <div>
                    <div className="bd-billing-label">WhatsApp</div>
                    <div className="bd-billing-val">{booking.billing.whatsapp}</div>
                  </div>
                )}
                {booking.billing.nationality && (
                  <div>
                    <div className="bd-billing-label">Nationality</div>
                    <div className="bd-billing-val">{booking.billing.nationality}</div>
                  </div>
                )}
                {booking.billing.residency === "indian" && booking.billing.state && (
                  <div>
                    <div className="bd-billing-label">State</div>
                    <div className="bd-billing-val">{booking.billing.state}</div>
                  </div>
                )}
                {booking.paidAt instanceof Timestamp && (
                  <div>
                    <div className="bd-billing-label">Paid On</div>
                    <div className="bd-billing-val">
                      {booking.paidAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── Booking reference ── */}
          <div className="bd-ref-block">
            <div>Booking Reference</div>
            <div className="bd-ref-id">{booking.bookingId}</div>
            {booking.createdAt instanceof Timestamp && (
              <div style={{ marginTop: 4 }}>
                Booked {booking.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}