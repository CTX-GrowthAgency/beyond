"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
}

export default function BookingDetail({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setLoading(false);
        return;
      }
      setUid(user.uid);
      const db = getFirestore(app);
      const snap = await getDoc(doc(db, "bookings", bookingId));
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
      setBooking({ ...data, bookingId: snap.id });
      setLoading(false);
    });
    return () => unsub();
  }, [bookingId]);

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

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)", maxWidth: 560 }}>
      <Link href="/bookings" className="body-2" style={{ color: "var(--color-accent-primary)", marginBottom: "var(--spacing-6)", display: "inline-block" }}>
        ← My bookings
      </Link>

      <h1 className="heading-1" style={{ marginBottom: "var(--spacing-2)" }}>{booking.eventTitle}</h1>
      <p className="body-2 text-muted" style={{ marginBottom: "var(--spacing-8)" }}>
        {booking.eventDate ? new Date(booking.eventDate).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" }) : "—"}
        {booking.venueName && ` · ${booking.venueName}`}
      </p>

      {/* QR for venue scan */}
      <section style={{ ...sectionStyle, textAlign: "center" }}>
        <div style={labelStyle}>Show at venue</div>
        <div style={{ background: "#fff", padding: 16, borderRadius: 12, display: "inline-block", marginTop: 4 }}>
          <BookingQR bookingId={booking.bookingId} size={220} />
        </div>
        <p style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 8 }}>Scan this QR at the venue to confirm entry</p>
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
      {booking.billing && (
        <section style={sectionStyle}>
          <div style={labelStyle}>Billing details</div>
          <div style={valueStyle}>
            {booking.billing.legalName && <div>{booking.billing.legalName}</div>}
            {booking.billing.email && <div style={{ color: "var(--color-muted)" }}>{booking.billing.email}</div>}
            {booking.billing.whatsapp && <div style={{ color: "var(--color-muted)" }}>{booking.billing.whatsapp}</div>}
            {booking.billing.nationality && <div style={{ color: "var(--color-muted)", fontSize: 14 }}>{booking.billing.nationality}</div>}
            {booking.billing.residency === "indian" && booking.billing.state && (
              <div style={{ color: "var(--color-muted)", fontSize: 14 }}>{booking.billing.state}</div>
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
        </div>
      </section>
    </div>
  );
}
