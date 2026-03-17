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
  eventId: string;
  eventSlug: string;
  tickets: TicketLine[];
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

type EventLite = {
  title?: string;
  eventDate?: Timestamp | null;
  venueName?: string;
  venueAddress?: string;
};

type UserLite = {
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  state?: string | null;
};

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
  const [event, setEvent]         = useState<EventLite | null>(null);
  const [userProfile, setUserProfile] = useState<UserLite | null>(null);
  const [loading, setLoading]     = useState(true);
  const [uid, setUid]             = useState<string | null>(null);
  const [sending, setSending]     = useState(false);
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [recheckingPayment, setRecheckingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

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
        const bookingDoc = { ...data, bookingId: snap.id };
        setBooking(bookingDoc);

        const [eventSnap, userSnap] = await Promise.all([
          getDoc(doc(db, "events", String(bookingDoc.eventId))),
          getDoc(doc(db, "users", String(bookingDoc.userId))),
        ]);
        setEvent(eventSnap.exists() ? (eventSnap.data() as EventLite) : null);
        setUserProfile(userSnap.exists() ? (userSnap.data() as UserLite) : null);
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

  async function handleRecheckPayment() {
    if (!booking || recheckingPayment) return;
    setRecheckingPayment(true);
    setPaymentMessage(null);
    
    try {
      const res = await fetch(`/api/bookings/${booking.bookingId}/recheck-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to check payment status");
      }
      
      // Update booking if status changed
      if (data.statusUpdated) {
        setBooking(prev => prev ? { ...prev, paymentStatus: data.bookingStatus } : null);
      }
      
      setPaymentMessage(data.message);
      
      // Refresh booking data after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      setPaymentMessage(error instanceof Error ? error.message : "Failed to check payment status");
    } finally {
      setRecheckingPayment(false);
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

  const eventTitle = event?.title ?? "Event";
  const eventDate = event?.eventDate instanceof Timestamp ? event.eventDate.toDate() : null;
  const totalTickets = booking?.tickets?.reduce((s, t) => s + (t.quantity ?? 0), 0) ?? 0;

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
          <div className="bd-eyebrow">Booking</div>
          <h1 className="bd-title">{eventTitle}</h1>

          <div className="bd-meta">
            {eventDate && (
              <div className="bd-meta-item">
                {eventDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            )}
            {event?.venueName && <div className="bd-meta-item">{event.venueName}</div>}
            <div className="bd-meta-item">
              <StatusBadge status={booking.paymentStatus} />
            </div>
            {booking.paymentStatus === "pending_payment" && (
              <div className="bd-meta-item">
                <button
                  onClick={handleRecheckPayment}
                  disabled={recheckingPayment}
                  style={{
                    padding: "4px 8px",
                    fontSize: "10px",
                    background: recheckingPayment ? "rgba(201,185,122,0.2)" : "rgba(201,185,122,0.1)",
                    border: "1px solid rgba(201,185,122,0.3)",
                    borderRadius: "4px",
                    color: "#c9b97a",
                    cursor: recheckingPayment ? "not-allowed" : "pointer",
                    opacity: recheckingPayment ? 0.6 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {recheckingPayment ? "Checking..." : "Recheck Payment"}
                </button>
              </div>
            )}
            <div className="bd-meta-item">{totalTickets} ticket{totalTickets === 1 ? "" : "s"}</div>
          </div>

          {paymentMessage && (
            <div style={{
              padding: "8px 12px",
              background: paymentMessage.includes("updated") ? "rgba(201,185,122,0.1)" : "rgba(224,82,82,0.1)",
              border: `1px solid ${paymentMessage.includes("updated") ? "rgba(201,185,122,0.3)" : "rgba(224,82,82,0.3)"}`,
              borderRadius: "6px",
              fontSize: "12px",
              color: paymentMessage.includes("updated") ? "#c9b97a" : "#e05252",
              marginBottom: "16px",
              textAlign: "center",
            }}>
              {paymentMessage}
            </div>
          )}

          <Card>
            <CardLabel>Entry Pass</CardLabel>
            {isConfirmed ? (
              <div className="bd-qr-outer">
                <div className="bd-qr-box">
                  <BookingQR bookingId={booking.bookingId} />
                </div>
                <div className="bd-qr-hint">Show this QR at the entry gate</div>
                <div className="bd-qr-id">{booking.bookingId}</div>
              </div>
            ) : (
              <div className="bd-qr-locked">QR will be available after payment is confirmed.</div>
            )}
          </Card>

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

          <button
            className={btnClass}
            onClick={handleSendNotification}
            disabled={sending || !isConfirmed || alreadySent || sendStatus === "sent"}
          >
            {sendStatus === "sent" ? "Sent" : sendStatus === "sending" ? "Sending" : alreadySent ? "Already Sent" : "Send Ticket"}
          </button>

          {sendStatus !== "idle" && sendStatus !== "sent" && (
            <div className="bd-send-sub">
              {sendStatus === "sending" ? "Sending ticket notification..." : "Could not send notification. Please try again."}
            </div>
          )}

          {/* ── Billing details ── */}
          {userProfile && (
            <Card>
              <CardLabel>Billing Details</CardLabel>
              <div className="bd-billing-grid">
                {userProfile.name && (
                  <div>
                    <div className="bd-billing-label">Name</div>
                    <div className="bd-billing-val">{userProfile.name}</div>
                  </div>
                )}
                {userProfile.email && (
                  <div>
                    <div className="bd-billing-label">Email</div>
                    <div className="bd-billing-val" style={{ fontSize: 13 }}>{userProfile.email}</div>
                  </div>
                )}
                {userProfile.phone && (
                  <div>
                    <div className="bd-billing-label">WhatsApp</div>
                    <div className="bd-billing-val">{userProfile.phone}</div>
                  </div>
                )}
                {userProfile.nationality && (
                  <div>
                    <div className="bd-billing-label">Nationality</div>
                    <div className="bd-billing-val">{userProfile.nationality}</div>
                  </div>
                )}
                {userProfile.state && (
                  <div>
                    <div className="bd-billing-label">State</div>
                    <div className="bd-billing-val">{userProfile.state}</div>
                  </div>
                )}
                {booking.paidAt instanceof Timestamp && (
                  <div>
                    <div className="bd-billing-label">Paid At</div>
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