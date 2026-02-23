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
}

type EventData = {
  title?: string;
  eventDate?: Timestamp | null;
  venueName?: string;
};

type UserData = {
  name?: string;
  email?: string;
  phone?: string;
  nationality?: string;
  state?: string | null;
};

type PaymentSuccessViewProps = {
  bookingId?: string;
  orderId?: string;
};

export default function PaymentSuccessView({
  bookingId: bookingIdProp,
  orderId,
}: PaymentSuccessViewProps) {
  const [bookingId, setBookingId] = useState<string | undefined>(bookingIdProp);
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [event, setEvent] = useState<EventData | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [verifyDone, setVerifyDone] = useState(false);

  // Call Cashfree verify when we have bookingId + orderId (redirect from payment)
  useEffect(() => {
    if (!bookingIdProp || !orderId || verifyDone) return;
    setVerifyDone(true);
    fetch("/api/cashfree/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: bookingIdProp, orderId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "completed" || data.bookingId) {
          setBookingId(data.bookingId ?? bookingIdProp);
        }
      })
      .catch((err) => console.error("[PaymentSuccess] verify failed:", err));
  }, [bookingIdProp, orderId, verifyDone]);

  useEffect(() => {
    const effectiveBookingId = bookingId ?? bookingIdProp;
    if (!effectiveBookingId) {
      setLoading(false);
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

      try {
        const [eventSnap, userSnap] = await Promise.all([
          getDoc(doc(db, "events", String(bookingDoc.eventId))),
          getDoc(doc(db, "users", String(bookingDoc.userId))),
        ]);
        setEvent(eventSnap.exists() ? (eventSnap.data() as EventData) : null);
        setUserProfile(userSnap.exists() ? (userSnap.data() as UserData) : null);
      } catch (err) {
        console.error("[PaymentSuccess] related doc fetch failed:", err);
      }

      setLoading(false);
    });
    return () => unsub();
  }, [bookingId, bookingIdProp]);

  const effectiveBookingId = bookingId ?? bookingIdProp;
  if (!effectiveBookingId) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
        <p className="body-2 text-muted">No booking information in the URL.</p>
        <p className="body-2 text-muted" style={{ marginTop: 8 }}>
          If you just completed payment, your ticket and invoice have been sent to your email.
        </p>
        <Link href="/bookings" className="body-2" style={{ color: "var(--color-accent-primary)", marginTop: 12, display: "inline-block" }}>
          ← My bookings
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
        <p className="body-2 text-muted">Loading booking…</p>
      </div>
    );
  }

  if (!uid) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
        <p className="body-2 text-muted">Please log in to view this booking.</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
        <p className="body-2 text-muted">Booking not found.</p>
        <Link href="/bookings" className="body-2" style={{ color: "var(--color-accent-primary)", marginTop: 8, display: "inline-block" }}>
          ← My bookings
        </Link>
      </div>
    );
  }

  const sectionStyle = { marginBottom: "var(--spacing-8)" };
  const labelStyle = { fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "var(--color-muted)", marginBottom: 4 };
  const valueStyle = { fontSize: 15 };

  const eventTitle = event?.title ?? "Event";
  const eventDateStr = event?.eventDate instanceof Timestamp
    ? event.eventDate.toDate()
    : null;
  const totalTickets = booking.tickets?.reduce((s, t) => s + (t.quantity ?? 0), 0) ?? 0;

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)", maxWidth: 560 }}>
      <Link href="/bookings" className="body-2" style={{ color: "var(--color-accent-primary)", marginBottom: "var(--spacing-6)", display: "inline-block" }}>
        ← My bookings
      </Link>

      <h1 className="heading-1" style={{ marginBottom: "var(--spacing-2)" }}>{eventTitle}</h1>
      <p className="body-2 text-muted" style={{ marginBottom: "var(--spacing-8)" }}>
        {eventDateStr ? eventDateStr.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) : "—"}
        {event?.venueName && ` · ${event.venueName}`}
      </p>

      {/* QR for venue scan */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <div style={labelStyle}>Show at venue</div>
        <div style={{ background: "#fff", padding: 16, borderRadius: 12, display: "inline-block", marginTop: 4 }}>
          <BookingQR bookingId={booking.bookingId} size={220} />
        </div>
        <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 8 }}>
          Scan this QR at the venue to confirm entry. We recommend taking a screenshot and saving it on your phone.
        </p>
      </section>

      {/* Tickets */}
      <section style={sectionStyle}>
        <div style={labelStyle}>Tickets</div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {booking.tickets?.map((t, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={valueStyle}>
                {t.name} × {t.quantity}
              </span>
              <span style={valueStyle}>₹{t.lineTotal.toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        {booking.pricing?.grandTotal != null && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 600 }}>
            <span>Total</span>
            <span>₹{booking.pricing.grandTotal.toLocaleString("en-IN")}</span>
          </div>
        )}
      </section>

      {/* Billing */}
      {userProfile && (
        <section style={sectionStyle}>
          <div style={labelStyle}>Billing details</div>
          <div style={valueStyle}>
            {userProfile.name && <div>{userProfile.name}</div>}
            {userProfile.email && <div style={{ color: "var(--color-muted)" }}>{userProfile.email}</div>}
            {userProfile.phone && <div style={{ color: "var(--color-muted)" }}>{userProfile.phone}</div>}
            {userProfile.nationality && <div style={{ color: "var(--color-muted)", fontSize: 14 }}>{userProfile.nationality}</div>}
            {userProfile.state && (
              <div style={{ color: "var(--color-muted)", fontSize: 14 }}>{userProfile.state}</div>
            )}
          </div>
        </section>
      )}

      {/* Status */}
      <section style={sectionStyle}>
        <div style={labelStyle}>Status</div>
        <div style={valueStyle}>
          Payment: {booking.paymentStatus === "completed" ? "Confirmed" : booking.paymentStatus === "pending_payment" ? "Pending" : booking.paymentStatus}
          {booking.ticketStatus && ` · Tickets: ${booking.ticketStatus}`}
          {` · Qty: ${totalTickets}`}
        </div>
      </section>
    </div>
  );
}
