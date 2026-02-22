"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { app } from "@/lib/firebase/client";

interface BookingDoc {
  id: string;
  bookingId: string;
  userId: string;
  eventSlug: string;
  eventTitle: string;
  eventDate: string;
  venueName?: string;
  paymentStatus: string;
  ticketStatus: string;
  totalTickets: number;
  pricing?: { grandTotal?: number };
  createdAt?: Timestamp;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    completed:       { label: "Confirmed",       color: "#c9b97a", bg: "rgba(201,185,122,0.12)" },
    pending_payment: { label: "Pending Payment", color: "rgba(240,237,230,0.45)", bg: "rgba(255,255,255,0.05)" },
    failed:          { label: "Failed",           color: "#e05252", bg: "rgba(224,82,82,0.1)" },
  };
  const s = map[status] ?? { label: status, color: "rgba(240,237,230,0.4)", bg: "rgba(255,255,255,0.04)" };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 10px",
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      border: `1px solid ${s.color}33`,
    }}>
      <span style={{
        width: 5, height: 5,
        borderRadius: "50%",
        background: s.color,
        display: "inline-block",
        flexShrink: 0,
      }} />
      {s.label}
    </span>
  );
}

export default function BookingsList() {
  const [bookings, setBookings] = useState<BookingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setBookings([]);
        setLoading(false);
        return;
      }
      setUid(user.uid);
      const db = getFirestore(app);
      const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
      try {
        const snap = await getDocs(q);
        const list: BookingDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<BookingDoc, "id">),
        }));
        list.sort((a, b) => {
          const ta = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : 0;
          const tb = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : 0;
          return tb - ta;
        });
        setBookings(list);
      } catch (err) {
        console.error("Bookings fetch failed:", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

    .bl-root {
      min-height: 100vh;
      background: #080808;
      color: #f0ede6;
      font-family: 'DM Sans', sans-serif;
      padding: 60px clamp(20px, 5vw, 80px) 100px;
    }
    .bl-header {
      max-width: 900px;
      margin: 0 auto 40px;
    }
    .bl-eyebrow {
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c9b97a;
      margin-bottom: 10px;
    }
    .bl-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(40px, 6vw, 64px);
      letter-spacing: 0.04em;
      color: #f0ede6;
      margin: 0;
      line-height: 1;
    }
    .bl-subtitle {
      font-size: 14px;
      color: rgba(240,237,230,0.4);
      margin-top: 10px;
    }
    .bl-list {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
      list-style: none;
      padding: 0;
    }

    /* ── Booking card ── */
    .bl-card {
      display: block;
      text-decoration: none;
      color: inherit;
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 22px 26px;
      transition: border-color 0.2s, background 0.2s, transform 0.15s;
      position: relative;
      overflow: hidden;
    }
    .bl-card::before {
      content: '';
      position: absolute;
      left: 0; top: 0; bottom: 0;
      width: 3px;
      background: transparent;
      transition: background 0.2s;
      border-radius: 10px 0 0 10px;
    }
    .bl-card:hover {
      border-color: rgba(201,185,122,0.3);
      background: rgba(255,255,255,0.04);
      transform: translateY(-1px);
    }
    .bl-card:hover::before {
      background: #c9b97a;
    }
    .bl-card-confirmed::before { background: rgba(201,185,122,0.6); }

    .bl-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .bl-event-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 0.04em;
      color: #f0ede6;
      line-height: 1.1;
      margin: 0 0 6px;
    }
    .bl-event-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 14px;
      font-size: 12px;
      color: rgba(240,237,230,0.45);
    }
    .bl-meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .bl-card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.06);
      flex-wrap: wrap;
      gap: 12px;
    }
    .bl-price {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 0.04em;
      color: #c9b97a;
    }
    .bl-tickets {
      font-size: 12px;
      color: rgba(240,237,230,0.4);
      margin-top: 2px;
    }
    .bl-arrow {
      color: rgba(240,237,230,0.2);
      transition: color 0.2s, transform 0.2s;
    }
    .bl-card:hover .bl-arrow {
      color: #c9b97a;
      transform: translateX(3px);
    }

    /* ── Empty / loading ── */
    .bl-empty {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 0;
      text-align: center;
    }
    .bl-empty-icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 18px;
    }
    .bl-empty-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 0.04em;
      color: rgba(240,237,230,0.5);
      margin: 0 0 8px;
    }
    .bl-empty-sub {
      font-size: 14px;
      color: rgba(240,237,230,0.3);
      margin-bottom: 28px;
    }
    .bl-browse-btn {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(201,185,122,0.1);
      border: 1px solid rgba(201,185,122,0.3);
      border-radius: 6px;
      color: #c9b97a;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      transition: background 0.2s;
    }
    .bl-browse-btn:hover { background: rgba(201,185,122,0.18); }

    /* ── Skeleton loader ── */
    .bl-skeleton {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px;
      padding: 22px 26px;
      animation: bl-shimmer 1.5s infinite;
    }
    .bl-skel-line {
      height: 12px;
      border-radius: 4px;
      background: rgba(255,255,255,0.06);
      margin-bottom: 10px;
    }
    @keyframes bl-shimmer {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    /* ── Login prompt ── */
    .bl-login-prompt {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 0;
      text-align: center;
    }
    .bl-login-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 0.04em;
      color: rgba(240,237,230,0.6);
      margin: 0 0 8px;
    }
    .bl-login-sub {
      font-size: 14px;
      color: rgba(240,237,230,0.3);
      margin-bottom: 24px;
    }
  `;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="bl-root">
          <div className="bl-header">
            <div className="bl-eyebrow">Account</div>
            <h1 className="bl-title">My Bookings</h1>
          </div>
          <ul className="bl-list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="bl-skeleton">
                <div className="bl-skel-line" style={{ width: "40%", height: 18, marginBottom: 12 }} />
                <div className="bl-skel-line" style={{ width: "60%" }} />
                <div className="bl-skel-line" style={{ width: "30%", marginTop: 16 }} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  }

  // ── Not logged in ─────────────────────────────────────────────────────────
  if (!uid) {
    return (
      <>
        <style>{styles}</style>
        <div className="bl-root">
          <div className="bl-header">
            <div className="bl-eyebrow">Account</div>
            <h1 className="bl-title">My Bookings</h1>
          </div>
          <div className="bl-login-prompt">
            <div className="bl-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.3)" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <p className="bl-login-title">Sign in to view bookings</p>
            <p className="bl-login-sub">Your tickets and booking history will appear here.</p>
          </div>
        </div>
      </>
    );
  }

  // ── No bookings ───────────────────────────────────────────────────────────
  if (bookings.length === 0) {
    return (
      <>
        <style>{styles}</style>
        <div className="bl-root">
          <div className="bl-header">
            <div className="bl-eyebrow">Account</div>
            <h1 className="bl-title">My Bookings</h1>
          </div>
          <div className="bl-empty">
            <div className="bl-empty-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.3)" strokeWidth="1.5">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              </svg>
            </div>
            <p className="bl-empty-title">No bookings yet</p>
            <p className="bl-empty-sub">Tickets you book will show up here.</p>
            <Link href="/events" className="bl-browse-btn">Browse Events</Link>
          </div>
        </div>
      </>
    );
  }

  // ── Bookings list ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{styles}</style>
      <div className="bl-root">
        <div className="bl-header">
          <div className="bl-eyebrow">Account</div>
          <h1 className="bl-title">My Bookings</h1>
          <p className="bl-subtitle">{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</p>
        </div>

        <ul className="bl-list">
          {bookings.map((b) => {
            const isConfirmed = b.paymentStatus === "completed";
            return (
              <li key={b.id}>
                <Link
                  href={`/bookings/${b.bookingId || b.id}`}
                  className={`bl-card${isConfirmed ? " bl-card-confirmed" : ""}`}
                >
                  <div className="bl-card-top">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 className="bl-event-title">{b.eventTitle}</h2>
                      <div className="bl-event-meta">
                        {b.eventDate && (
                          <span className="bl-meta-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            {new Date(b.eventDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                        )}
                        {b.venueName && (
                          <span className="bl-meta-item">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                              <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            {b.venueName}
                          </span>
                        )}
                        <span className="bl-meta-item">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                          </svg>
                          {b.totalTickets} ticket{b.totalTickets !== 1 ? "s" : ""}
                        </span>
                        {b.createdAt instanceof Timestamp && (
                          <span className="bl-meta-item">
                            Booked {b.createdAt.toDate().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={b.paymentStatus} />
                  </div>

                  <div className="bl-card-bottom">
                    <div>
                      {b.pricing?.grandTotal != null && (
                        <div className="bl-price">₹{b.pricing.grandTotal.toLocaleString("en-IN")}</div>
                      )}
                      <div className="bl-tickets">
                        {b.totalTickets} ticket{b.totalTickets !== 1 ? "s" : ""}
                        {b.ticketStatus && b.ticketStatus !== "pending" && ` · ${b.ticketStatus}`}
                      </div>
                    </div>
                    <svg className="bl-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}