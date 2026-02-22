"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type VerifyStatus = "verifying" | "completed" | "failed" | "pending";

export default function PaymentSuccessView() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<VerifyStatus>("verifying");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!bookingId || !orderId) {
      setStatus("failed");
      return;
    }

    async function verify() {
      try {
        const res = await fetch("/api/cashfree/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, orderId }),
        });
        const data = await res.json();

        if (data.status === "completed") {
          setStatus("completed");
        } else if (data.status === "failed") {
          setStatus("failed");
        } else {
          setAttempts((a) => {
            if (a >= 4) {
              setStatus("pending");
              return a;
            }
            setTimeout(verify, 2000);
            return a + 1;
          });
        }
      } catch {
        setStatus("failed");
      }
    }

    verify();
  }, [bookingId, orderId]);

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
    .ps-root {
      min-height: 100vh;
      background: #080808;
      color: #f0ede6;
      font-family: 'DM Sans', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
    }
    .ps-card {
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .ps-icon {
      width: 72px; height: 72px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
    .ps-icon.success {
      background: rgba(201,185,122,0.12);
      border: 2px solid rgba(201,185,122,0.4);
    }
    .ps-icon.failed {
      background: rgba(224,82,82,0.1);
      border: 2px solid rgba(224,82,82,0.3);
    }
    .ps-icon.verifying {
      background: rgba(255,255,255,0.05);
      border: 2px solid rgba(255,255,255,0.1);
      animation: ps-spin 1.2s linear infinite;
    }
    @keyframes ps-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .ps-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 40px;
      letter-spacing: 0.05em;
      margin: 0 0 12px;
    }
    .ps-title.success { color: #c9b97a; }
    .ps-title.failed { color: #e05252; }
    .ps-title.verifying { color: rgba(240,237,230,0.5); }
    .ps-sub {
      font-size: 14px;
      line-height: 1.7;
      color: rgba(240,237,230,0.55);
      margin-bottom: 32px;
    }
    .ps-booking-id {
      display: inline-block;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 10px 16px;
      font-size: 12px;
      color: rgba(240,237,230,0.4);
      letter-spacing: 0.06em;
      margin-bottom: 28px;
      font-family: monospace;
    }
    .ps-btn {
      display: inline-block;
      padding: 14px 28px;
      background: #c9b97a;
      color: #080808;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.2s;
    }
    .ps-btn:hover { background: #ddd0a0; }
    .ps-link {
      display: block;
      margin-top: 16px;
      font-size: 13px;
      color: rgba(240,237,230,0.35);
      text-decoration: none;
    }
    .ps-link:hover { color: rgba(240,237,230,0.6); }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="ps-root">
        <div className="ps-card">
          {status === "verifying" && (
            <>
              <div className="ps-icon verifying">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.4)" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" strokeDasharray="40" strokeDashoffset="10" />
                </svg>
              </div>
              <h1 className="ps-title verifying">Verifying Payment…</h1>
              <p className="ps-sub">Please wait while we confirm your payment with the gateway. Do not close this page.</p>
            </>
          )}

          {status === "completed" && (
            <>
              <div className="ps-icon success">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9b97a" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h1 className="ps-title success">Payment Confirmed!</h1>
              <p className="ps-sub">
                Your tickets are confirmed. You&apos;ll receive your tickets and invoice on WhatsApp and email shortly.
              </p>
              {bookingId && (
                <div className="ps-booking-id">Booking ID: {bookingId}</div>
              )}
              <Link href="/" className="ps-btn">Back to Home</Link>
              <Link href="/bookings" className="ps-link">View my bookings →</Link>
            </>
          )}

          {status === "failed" && (
            <>
              <div className="ps-icon failed">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e05252" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </div>
              <h1 className="ps-title failed">Payment Failed</h1>
              <p className="ps-sub">
                Your payment could not be processed. No amount has been deducted. Please try again.
              </p>
              {bookingId && (
                <div className="ps-booking-id">Booking ID: {bookingId}</div>
              )}
              <Link href="/events" className="ps-btn" style={{ background: "#e05252", color: "#fff" }}>
                Try Again
              </Link>
              <Link href="/" className="ps-link">Back to Home</Link>
            </>
          )}

          {status === "pending" && (
            <>
              <div className="ps-icon" style={{ background: "rgba(255,200,50,0.1)", border: "2px solid rgba(255,200,50,0.3)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffc832" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h1 className="ps-title" style={{ color: "#ffc832" }}>Payment Processing</h1>
              <p className="ps-sub">
                Your payment is being processed by the bank. This can take a few minutes.
                You&apos;ll receive a confirmation once it&apos;s complete.
              </p>
              {bookingId && (
                <div className="ps-booking-id">Booking ID: {bookingId}</div>
              )}
              <Link href="/" className="ps-btn" style={{ background: "#ffc832" }}>Back to Home</Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
