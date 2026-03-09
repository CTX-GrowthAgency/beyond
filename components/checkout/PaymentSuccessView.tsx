"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase/client";

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
}

type EventData = {
  title?: string;
  eventDate?: Timestamp | null;
  venueName?: string;
};

type PaymentSuccessViewProps = {
  bookingId?: string;
  orderId?: string;
};

/* ───────────────────────────────────────── */
/* CSS  */
/* ───────────────────────────────────────── */

// ─── CSS ──────────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes ps-spin {
    to { transform: rotate(360deg); }
  }
  @keyframes ps-pulse {
    0%, 100% { opacity: 0.45; transform: scale(0.9); }
    50%       { opacity: 1;    transform: scale(1); }
  }
  @keyframes ps-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ps-dot {
    0%, 80%, 100% { background: rgba(201,185,122,0.2); transform: scale(0.8); }
    40%           { background: #c9b97a; transform: scale(1.35); }
  }
  @keyframes ps-ring-pop {
    0%   { transform: scale(0.5); opacity: 0; }
    65%  { transform: scale(1.08); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes ps-check {
    from { stroke-dashoffset: 56; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes ps-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes ps-countdown {
    from { width: 100%; }
    to   { width: 0%; }
  }

  /* ── Loading ── */
  .bkl-root {
    min-height: 72vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 80px 24px;
    text-align: center;
  }
  .bkl-icon-wrap {
    position: relative;
    width: 80px; height: 80px;
  }
  .bkl-ring {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 1px solid rgba(201,185,122,0.12);
    border-top-color: #c9b97a;
    animation: ps-spin 1.1s linear infinite;
  }
  .bkl-ring-2 {
    position: absolute; inset: 10px;
    border-radius: 50%;
    border: 1px solid rgba(201,185,122,0.07);
    border-bottom-color: rgba(201,185,122,0.3);
    animation: ps-spin 1.9s linear infinite reverse;
  }
  .bkl-icon {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    animation: ps-pulse 1.8s ease-in-out infinite;
  }
  .bkl-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(26px, 5vw, 38px);
    letter-spacing: 0.06em;
    color: #FAFAFA; margin: 0;
  }
  .bkl-sub {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: #6F6F6F; margin: 6px 0 0;
  }
  .bkl-dots { display: flex; gap: 7px; align-items: center; }
  .bkl-dot {
    width: 4px; height: 4px; border-radius: 50%;
    animation: ps-dot 1.2s ease-in-out infinite;
  }
  .bkl-dot:nth-child(1) { animation-delay: 0s; }
  .bkl-dot:nth-child(2) { animation-delay: 0.18s; }
  .bkl-dot:nth-child(3) { animation-delay: 0.36s; }

  /* ── Success ── */
  .ps-root {
    min-height: 100vh;
    padding: 48px 0 96px;
    animation: ps-up 0.5s ease both;
  }
  .ps-inner {
    max-width: 520px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Hero */
  .ps-hero {
    text-align: center;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 40px;
  }
  .ps-check-wrap {
    width: 72px; height: 72px;
    margin: 0 auto 24px;
    animation: ps-ring-pop 0.55s cubic-bezier(0.22,1,0.36,1) both;
  }
  .ps-check-bg {
    width: 100%; height: 100%;
    border-radius: 50%;
    border: 1.5px solid rgba(201,185,122,0.35);
    background: rgba(201,185,122,0.07);
    display: flex; align-items: center; justify-content: center;
  }
  .ps-check-path {
    stroke-dasharray: 56;
    stroke-dashoffset: 56;
    animation: ps-check 0.38s ease 0.4s forwards;
  }
  .ps-eyebrow {
    font-size: 10px; letter-spacing: 0.24em;
    text-transform: uppercase; color: #c9b97a;
    margin-bottom: 10px;
  }
  .ps-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(40px, 9vw, 72px);
    line-height: 0.88; letter-spacing: 0.01em;
    color: #FAFAFA; margin: 0 0 16px;
  }
  .ps-event-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(20px, 4vw, 30px);
    letter-spacing: 0.04em;
    background: linear-gradient(90deg, #c9b97a 0%, #f0e5b0 45%, #c9b97a 65%, #a89660 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: ps-shimmer 3s linear infinite;
    margin: 0 0 10px;
  }
  .ps-event-meta {
    font-size: 13px; color: #6F6F6F;
    font-weight: 300; line-height: 1.65;
  }

  /* Countdown redirect bar */
  .ps-redirect-bar {
    margin-top: 28px;
    padding: 14px 18px;
    background: rgba(201,185,122,0.05);
    border: 1px solid rgba(201,185,122,0.18);
    display: flex; flex-direction: column; gap: 10px;
  }
  .ps-redirect-text {
    font-size: 11px; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(201,185,122,0.7);
    display: flex; align-items: center; justify-content: space-between;
  }
  .ps-redirect-count {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; color: #c9b97a;
  }
  .ps-redirect-track {
    height: 1px; background: rgba(201,185,122,0.12); overflow: hidden;
  }
  .ps-redirect-fill {
    height: 100%; background: #c9b97a;
    animation: ps-countdown 5s linear forwards;
  }

  /* Section labels */
  .ps-label {
    display: flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 600;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: #c9b97a; margin-bottom: 14px;
  }
  .ps-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(to right, rgba(201,185,122,0.18), transparent);
  }

  /* Ticket list */
  .ps-tickets {
    display: flex; flex-direction: column;
    gap: 1px; background: rgba(255,255,255,0.05);
    margin-bottom: 2px;
  }
  .ps-ticket-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 14px 18px;
    background: #020202;
  }
  .ps-ticket-name {
    font-size: 14px; font-weight: 500; color: #FAFAFA;
  }
  .ps-ticket-qty {
    font-size: 11px; color: #6F6F6F; margin-top: 2px;
  }
  .ps-ticket-price {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px; color: #c9b97a; letter-spacing: 0.04em;
  }
  .ps-total-row {
    display: flex; justify-content: space-between;
    align-items: center; padding: 14px 18px;
    border: 1px solid rgba(201,185,122,0.15);
    background: rgba(201,185,122,0.035);
    margin-bottom: 36px;
  }
  .ps-total-label {
    font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: #CFCFCF; font-weight: 600;
  }
  .ps-total-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 30px; color: #FAFAFA; letter-spacing: 0.02em;
  }

  /* View ticket CTA */
  .ps-cta {
    display: flex; flex-direction: column; gap: 10px;
    margin-top: 12px;
  }
  .ps-cta-primary {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 18px;
    background: #c9b97a; color: #020202;
    font-family: var(--font-family-avalon, sans-serif);
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.16em; text-transform: uppercase;
    text-decoration: none; border-radius: 0;
    transition: opacity 0.18s, transform 0.15s;
  }
  .ps-cta-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .ps-cta-secondary {
    display: flex; align-items: center; justify-content: center;
    width: 100%; padding: 15px;
    border: 1px solid rgba(255,255,255,0.1);
    color: #6F6F6F; background: transparent;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.14em; text-transform: uppercase;
    text-decoration: none; border-radius: 0;
    transition: border-color 0.18s, color 0.18s;
  }
  .ps-cta-secondary:hover {
    border-color: rgba(255,255,255,0.25);
    color: #CFCFCF; opacity: 1;
  }

  /* Error / empty states */
  .ps-state {
    min-height: 50vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; text-align: center;
    padding: 48px 24px;
  }
  .ps-state-icon { opacity: 0.25; margin-bottom: 8px; }
  .ps-state-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px; letter-spacing: 0.06em;
    color: #FAFAFA; margin: 0;
  }
  .ps-state-sub {
    font-size: 13px; color: #6F6F6F;
    font-weight: 300; line-height: 1.6;
    max-width: 320px; margin: 0;
  }
  .ps-state-link {
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: #c9b97a;
    text-decoration: none; margin-top: 8px;
    transition: opacity 0.15s;
  }
  .ps-state-link:hover { opacity: 0.7; }
`;

/* ───────────────────────────────────────── */
/* COMPONENT                                */
/* ───────────────────────────────────────── */

export default function PaymentSuccessView({
  bookingId: bookingIdProp,
  orderId,
}: PaymentSuccessViewProps) {

  const router = useRouter();

  const [bookingId, setBookingId] = useState<string | undefined>(bookingIdProp);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  /* ─────────────────────────────────────────
     STEP 1 — KEEP VERIFYING PAYMENT FOREVER
  ───────────────────────────────────────── */

  useEffect(() => {

    if (!bookingIdProp || !orderId) return;

    let stopped = false;

    async function verifyLoop() {

      try {

        const res = await fetch("/api/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: bookingIdProp,
            orderId
          }),
        });

        const data = await res.json();

        if (data.status === "completed" || data.bookingId) {

          const confirmedBookingId = data.bookingId ?? bookingIdProp;

          if (!stopped) {
            setBookingId(confirmedBookingId);

            // redirect immediately once confirmed
            router.replace(`/bookings/${confirmedBookingId}`);
          }

          return;

        }

      } catch (err) {

        console.error("Payment verification failed:", err);

      }

      if (!stopped) {
        setTimeout(verifyLoop, 5000);
      }

    }

    verifyLoop();

    return () => {
      stopped = true;
    };

  }, [bookingIdProp, orderId, router]);


  /* ─────────────────────────────────────────
     STEP 2 — LOAD BOOKING + EVENT
  ───────────────────────────────────────── */

  useEffect(() => {

    const effectiveBookingId = bookingId ?? bookingIdProp;

    if (!effectiveBookingId) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }

    const auth = getAuth(app);

    const unsub = onAuthStateChanged(auth, async (user) => {

      if (!user) {
        setUid(null);
        setLoading(false);
        return;
      }

      setUid(user.uid);

      try {

        const db = getFirestore(app);

        const snap = await getDoc(doc(db, "bookings", effectiveBookingId));

        if (!snap.exists()) {
          setBooking(null);
          setLoading(false);
          return;
        }

        const data = snap.data() as BookingData;

        if (data.userId !== user.uid) {
          setBooking(null);
          setLoading(false);
          return;
        }

        const bookingDoc = { ...data, bookingId: snap.id };

        setBooking(bookingDoc);

        const eventSnap = await getDoc(doc(db, "events", String(bookingDoc.eventId)));

        if (eventSnap.exists()) {
          setEvent(eventSnap.data() as EventData);
        }

      } catch (err) {

        console.error("Booking fetch failed:", err);

      }

      setLoading(false);

    });

    return () => unsub();

  }, [bookingId, bookingIdProp]);


  /* ─────────────────────────────────────────
     DERIVED VALUES
  ───────────────────────────────────────── */

  const effectiveBookingId = bookingId ?? bookingIdProp;

  const eventDateStr =
    event?.eventDate instanceof Timestamp
      ? event.eventDate
          .toDate()
          .toLocaleString("en-IN", {
            dateStyle: "long",
            timeStyle: "short",
          })
      : null;


  /* ─────────────────────────────────────────
     LOADING SCREEN
  ───────────────────────────────────────── */

  if (loading) {
    return (
      <>
        <style>{STYLES}</style>

        <div className="bkl-root">

          <div className="bkl-icon-wrap">
            <div className="bkl-ring" />
            <div className="bkl-ring-2" />

            <div className="bkl-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#c9b97a" strokeWidth="1.5">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
              </svg>
            </div>
          </div>

          <div>
            <h2 className="bkl-heading">
              Waiting for payment confirmation
            </h2>

            <p className="bkl-sub">
              Please do not close this page — confirmation may take a moment
            </p>
          </div>

          <div className="bkl-dots">
            <span className="bkl-dot"/>
            <span className="bkl-dot"/>
            <span className="bkl-dot"/>
          </div>

        </div>
      </>
    );
  }


  /* ─────────────────────────────────────────
     REST OF UI (UNCHANGED)
  ───────────────────────────────────────── */

  if (!uid) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="ps-state">
          <h2 className="ps-state-title">Please log in</h2>
          <p className="ps-state-sub">
            You need to be logged in to view this booking.
          </p>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="ps-state">
          <h2 className="ps-state-title">Booking not found</h2>
          <p className="ps-state-sub">
            It may still be processing. Please check again shortly.
          </p>
          <Link href="/bookings" className="ps-state-link">
            View my bookings →
          </Link>
        </div>
      </>
    );
  }

  const totalTickets =
    booking.tickets?.reduce((s, t) => s + (t.quantity ?? 0), 0) ?? 0;

  return (
    <>
      <style>{STYLES}</style>

      <div className="ps-root">
        <div className="ps-inner">

          <div className="ps-hero">

            <p className="ps-eyebrow">Payment confirmed</p>

            <h1 className="ps-title">You&apos;re in.</h1>

            {event?.title && (
              <p className="ps-event-name">{event.title}</p>
            )}

            <p className="ps-event-meta">
              {eventDateStr ?? ""}
              {event?.venueName && eventDateStr
                ? ` · ${event.venueName}`
                : event?.venueName ?? ""}
              {totalTickets > 0 &&
                ` · ${totalTickets} ticket${totalTickets > 1 ? "s" : ""}`}
            </p>

          </div>

          <div className="ps-cta">

            <Link
              href={`/bookings/${booking.bookingId}`}
              className="ps-cta-primary"
            >
              View ticket & QR code
            </Link>

            <Link href="/bookings" className="ps-cta-secondary">
              All my bookings
            </Link>

          </div>

        </div>
      </div>
    </>
  );
}