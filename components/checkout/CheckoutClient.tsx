"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { app } from "@/lib/firebase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TicketSelection {
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutClientProps {
  slug: string;
  ticketSelections: TicketSelection[];
  eventTitle: string;
  eventDate: string;
  venueName: string;
  eventSanityId: string;
}

// ─── Indian States ────────────────────────────────────────────────────────────

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

// ─── Timer ────────────────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft]);
  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");
  return { timeLeft, display: `${mm}:${ss}` };
}

// ─── Form completeness check ──────────────────────────────────────────────────

function isFormComplete(form: {
  legalName: string;
  whatsapp: string;
  nationality: string;
  residency: string;
  state: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  acceptDisclaimer: boolean;
}) {
  if (!form.legalName.trim()) return false;
  if (!form.whatsapp.trim()) return false;
  if (!form.nationality.trim()) return false;
  if (form.residency === "indian" && !form.state) return false;
  if (!form.acceptTerms || !form.acceptPrivacy || !form.acceptDisclaimer) return false;
  return true;
}

// ─── CheckoutClient ───────────────────────────────────────────────────────────

export default function CheckoutClient({
  slug,
  ticketSelections,
  eventTitle,
  eventDate,
  venueName,
  eventSanityId,
}: CheckoutClientProps) {
  const router = useRouter();
  const { timeLeft, display: timerDisplay } = useCountdown(10 * 60);

  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (u) => {
      if (u) {
        setUserEmail(u.email ?? "");
        setUserId(u.uid);
      }
    });
  }, []);

  const [form, setFormState] = useState({
    legalName: "",
    whatsapp: "",
    nationality: "Indian",
    residency: "indian",
    state: "",
    acceptTerms: false,
    acceptPrivacy: false,
    acceptDisclaimer: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // ── Derived totals ──────────────────────────────────────────────────────────
  const subtotal = ticketSelections.reduce((s, t) => s + t.price * t.quantity, 0);
  // TODO: enable fees in future
  // const convenienceFee = Math.round(subtotal * 0.02);
  // const gst = Math.round(subtotal * 0.18);
  const convenienceFee = 0;
  const gst = 0;
  const grandTotal = subtotal + convenienceFee + gst;
  const totalTickets = ticketSelections.reduce((s, t) => s + t.quantity, 0);

  const formReady = isFormComplete(form);

  // ── Timer expiry ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === 0) router.push(`/events/${slug}`);
  }, [timeLeft, slug, router]);

  // ── Field setter ────────────────────────────────────────────────────────────
  function set(field: string, value: string | boolean) {
    setFormState((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  }

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e: Record<string, string> = {};
    if (!form.legalName.trim()) e.legalName = "Legal name is required";
    if (!form.whatsapp.trim()) e.whatsapp = "WhatsApp number is required";
    else if (!/^\+?\d{10,15}$/.test(form.whatsapp.replace(/\s/g, "")))
      e.whatsapp = "Enter a valid WhatsApp number";
    if (!form.nationality.trim()) e.nationality = "Nationality is required";
    if (form.residency === "indian" && !form.state) e.state = "Please select your state";
    if (!form.acceptTerms) e.acceptTerms = "Required";
    if (!form.acceptPrivacy) e.acceptPrivacy = "Required";
    if (!form.acceptDisclaimer) e.acceptDisclaimer = "Required";
    return e;
  }

  // ── Save booking to Firestore ───────────────────────────────────────────────
  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (!userId) { router.push(`/events/${slug}`); return; }

    setSubmitting(true);
    try {
      const db = getFirestore(app);

      // 1. Upsert user — only profile fields, no event data
      await setDoc(
        doc(db, "users", userId),
        {
          uid: userId,
          email: userEmail,
          legalName: form.legalName,
          whatsapp: form.whatsapp,
          nationality: form.nationality,
          residency: form.residency,
          state: form.residency === "indian" ? form.state : null,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 2. Ensure event stub exists in Firestore (keyed by Sanity _id)
      //    Only writes if the doc doesn't already exist — avoids overwriting.
      const eventRef = doc(db, "events", eventSanityId);
      const eventSnap = await getDoc(eventRef);
      if (!eventSnap.exists()) {
        await setDoc(eventRef, {
          sanityId: eventSanityId,
          slug,
          title: eventTitle,
          eventDate,
          venueName,
          createdAt: serverTimestamp(),
        });
      }

      // 3. Create booking
      const bookingRef = doc(collection(db, "bookings"));
      const newBookingId = bookingRef.id;

      await setDoc(bookingRef, {
        bookingId: newBookingId,

        // References
        userId,
        eventId: eventSanityId,   // FK → events/{eventSanityId}
        eventSlug: slug,

        // Event snapshot (denormalised — survives Sanity edits)
        eventTitle,
        eventDate,
        venueName,

        // Ticket breakdown
        tickets: ticketSelections
          .filter((t) => t.quantity > 0)
          .map((t) => ({
            name: t.name,
            price: t.price,
            quantity: t.quantity,
            lineTotal: t.price * t.quantity,
          })),
        totalTickets,

        // Billing snapshot
        billing: {
          legalName: form.legalName,
          email: userEmail,
          whatsapp: form.whatsapp,
          nationality: form.nationality,
          residency: form.residency,
          state: form.residency === "indian" ? form.state : null,
        },

        // Pricing
        pricing: {
          subtotal,
          convenienceFee,  // 0 for now
          gst,             // 0 for now
          grandTotal,
        },

        // Agreements
        acceptedTerms: form.acceptTerms,
        acceptedPrivacy: form.acceptPrivacy,
        acceptedDisclaimer: form.acceptDisclaimer,

        // Payment lifecycle: pending_payment → completed | failed
        paymentStatus: "pending_payment",
        paymentMethod: null,      // filled after gateway callback
        paymentReference: null,   // Cashfree order_id
        cashfreeOrderId: null,    // Cashfree order_id
        paidAt: null,

        // Ticket lifecycle: pending → issued → cancelled
        ticketStatus: "pending",
        qrIssued: false,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 4. Lightweight reference on the event document
      await setDoc(
        doc(db, "events", eventSanityId, "bookings", newBookingId),
        {
          bookingId: newBookingId,
          userId,
          totalTickets,
          grandTotal,
          paymentStatus: "pending_payment",
          createdAt: serverTimestamp(),
        }
      );

      setBookingId(newBookingId);
      setSubmitted(true);
    } catch (err) {
      console.error("Booking save failed:", err);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  // ── Load Cashfree SDK (required for checkout) ────────────────────────────────
  const CASHFREE_SDK = "https://sdk.cashfree.com/js/v3/cashfree.js";

  function loadCashfreeSDK(): Promise<void> {
    if (typeof window === "undefined") return Promise.reject(new Error("Not in browser"));
    const w = window as any;
    if (w.Cashfree) return Promise.resolve();
    const existing = document.querySelector(`script[src="${CASHFREE_SDK}"]`);
    if (existing) {
      return new Promise((resolve) => {
        if (w.Cashfree) resolve();
        else existing.addEventListener("load", () => resolve());
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CASHFREE_SDK;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
      document.head.appendChild(script);
    });
  }

  // ── Cashfree payment init ───────────────────────────────────────────────────
  async function startPayment() {
    if (!bookingId) return;
    setPaymentLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          amount: grandTotal,
          customer: {
            id: userId,
            email: userEmail,
            phone: form.whatsapp,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || data?.error || "Payment initialisation failed.";
        alert(msg);
        return;
      }

      if (!data.payment_session_id) {
        alert("Payment initialisation failed. Please try again.");
        return;
      }

      await loadCashfreeSDK();

      const Cashfree = (window as any).Cashfree;
      if (!Cashfree) {
        alert("Could not load payment gateway. Please refresh and try again.");
        return;
      }

      const cashfree = Cashfree({
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENV === "production" ? "production" : "sandbox",
      });

      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (err) {
      console.error("Payment init failed:", err);
      alert("Could not connect to payment gateway. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

    .ck-root {
      min-height: 100vh;
      background: #080808;
      color: #f0ede6;
      font-family: 'DM Sans', sans-serif;
      padding: 0 0 80px;
    }

    /* ── Timer bar ── */
    .ck-timer-bar {
      background: #111;
      border-bottom: 1px solid rgba(255,255,255,0.07);
      padding: 12px clamp(20px,5vw,64px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .ck-timer-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: rgba(240,237,230,0.5);
      text-decoration: none;
      transition: color 0.2s;
    }
    .ck-timer-back:hover { color: #c9b97a; }
    .ck-timer-center {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ck-timer-label {
      font-size: 12px;
      color: rgba(240,237,230,0.45);
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .ck-timer-count {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 0.06em;
      line-height: 1;
      transition: color 0.3s;
    }
    .ck-timer-count.urgent { color: #e05252; }
    .ck-timer-count.normal { color: #c9b97a; }
    .ck-timer-pulse {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #c9b97a;
      animation: ck-pulse 1s infinite;
    }
    .ck-timer-pulse.urgent { background: #e05252; }
    @keyframes ck-pulse {
      0%,100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }

    /* ── Layout ── */
    .ck-body {
      max-width: 1100px;
      margin: 0 auto;
      padding: 40px clamp(20px,5vw,64px) 0;
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 40px;
      align-items: start;
    }
    @media (max-width: 860px) {
      .ck-body { grid-template-columns: 1fr; }
      .ck-sidebar { order: -1; }
    }

    /* ── Section card ── */
    .ck-card {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 28px;
      margin-bottom: 20px;
    }
    .ck-card-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 20px;
      letter-spacing: 0.06em;
      color: #f0ede6;
      margin: 0 0 24px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ck-card-title-num {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: rgba(201,185,122,0.15);
      border: 1px solid rgba(201,185,122,0.4);
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #c9b97a;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ── Form fields ── */
    .ck-field { margin-bottom: 18px; }
    .ck-label {
      display: block;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(240,237,230,0.4);
      margin-bottom: 7px;
    }
    .ck-label-hint {
      font-size: 10px;
      letter-spacing: 0.04em;
      text-transform: none;
      color: rgba(240,237,230,0.25);
      margin-left: 6px;
    }
    .ck-input {
      width: 100%;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      color: #f0ede6;
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      padding: 12px 14px;
      outline: none;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .ck-input::placeholder { color: rgba(240,237,230,0.2); }
    .ck-input:focus {
      border-color: rgba(201,185,122,0.5);
      background: rgba(255,255,255,0.06);
    }
    .ck-input.error { border-color: rgba(224,82,82,0.5); }
    .ck-input-disabled {
      background: rgba(255,255,255,0.02);
      color: rgba(240,237,230,0.4);
      cursor: not-allowed;
    }
    .ck-error-msg {
      font-size: 11px;
      color: #e05252;
      margin-top: 5px;
    }
    .ck-hint {
      font-size: 11px;
      color: rgba(201,185,122,0.7);
      margin-top: 5px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* radio group */
    .ck-radio-group { display: flex; gap: 12px; flex-wrap: wrap; }
    .ck-radio-option { flex: 1; min-width: 120px; }
    .ck-radio-option input { display: none; }
    .ck-radio-label {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      color: rgba(240,237,230,0.6);
      transition: all 0.2s;
      background: rgba(255,255,255,0.03);
      user-select: none;
    }
    .ck-radio-dot {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      transition: border-color 0.2s;
    }
    .ck-radio-dot-inner {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #c9b97a;
      display: none;
    }
    .ck-radio-option input:checked + .ck-radio-label {
      border-color: rgba(201,185,122,0.5);
      color: #f0ede6;
      background: rgba(201,185,122,0.07);
    }
    .ck-radio-option input:checked + .ck-radio-label .ck-radio-dot { border-color: #c9b97a; }
    .ck-radio-option input:checked + .ck-radio-label .ck-radio-dot-inner { display: block; }

    /* checkbox */
    .ck-checkbox-field {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 14px;
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 6px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .ck-checkbox-field:hover { border-color: rgba(255,255,255,0.12); }
    .ck-checkbox-field.error { border-color: rgba(224,82,82,0.3); }
    .ck-checkbox-box {
      width: 18px; height: 18px;
      border: 1.5px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      flex-shrink: 0;
      margin-top: 1px;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .ck-checkbox-box.checked { background: #c9b97a; border-color: #c9b97a; }
    .ck-checkbox-text {
      font-size: 13px;
      line-height: 1.5;
      color: rgba(240,237,230,0.65);
    }
    .ck-checkbox-text a { color: #c9b97a; text-decoration: none; }
    .ck-checkbox-text a:hover { text-decoration: underline; }

    /* ── Sidebar ── */
    .ck-sidebar { position: sticky; top: 76px; }

    .ck-event-banner {
      background: rgba(255,255,255,0.025);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .ck-event-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 22px;
      letter-spacing: 0.04em;
      color: #f0ede6;
      margin: 0 0 8px;
      line-height: 1.1;
    }
    .ck-event-meta {
      font-size: 12px;
      color: rgba(240,237,230,0.45);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    /* ticket rows */
    .ck-ticket-summary { margin-bottom: 20px; }
    .ck-ticket-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .ck-ticket-row:last-child { border-bottom: none; }
    .ck-ticket-name { font-size: 13px; color: rgba(240,237,230,0.75); }
    .ck-ticket-qty { font-size: 11px; color: rgba(240,237,230,0.35); margin-top: 1px; }
    .ck-ticket-amount {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 16px;
      color: #f0ede6;
      letter-spacing: 0.04em;
    }

    /* pricing */
    .ck-pricing { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; }
    .ck-pricing-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: rgba(240,237,230,0.55);
      margin-bottom: 10px;
    }
    .ck-pricing-row.total {
      font-size: 15px;
      color: #f0ede6;
      font-weight: 600;
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 12px;
      margin-top: 4px;
      margin-bottom: 0;
    }
    .ck-pricing-row.total .ck-price-val {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      color: #c9b97a;
      letter-spacing: 0.04em;
    }

    /* ── Payment CTA ── */
    .ck-pay-btn {
      display: block;
      width: 100%;
      padding: 16px;
      background: #c9b97a;
      color: #080808;
      font-family: 'DM Sans', sans-serif;
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s, opacity 0.2s, box-shadow 0.2s;
      margin-top: 20px;
      position: relative;
      overflow: hidden;
    }
    .ck-pay-btn:hover:not(:disabled) {
      background: #ddd0a0;
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(201,185,122,0.25);
    }
    .ck-pay-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .ck-pay-btn-hint {
      font-size: 10px;
      letter-spacing: 0.04em;
      text-transform: none;
      font-weight: 400;
      opacity: 0.7;
      display: block;
      margin-top: 2px;
    }
    .ck-secure-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: 11px;
      color: rgba(240,237,230,0.3);
      margin-top: 12px;
    }
    .ck-incomplete-notice {
      font-size: 11px;
      color: rgba(240,237,230,0.35);
      text-align: center;
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }

    /* ── Success ── */
    .ck-success {
      max-width: 480px;
      margin: 80px auto;
      text-align: center;
      padding: 0 24px;
    }
    .ck-success-icon {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(201,185,122,0.12);
      border: 2px solid rgba(201,185,122,0.4);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 24px;
    }
    .ck-success-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 36px;
      letter-spacing: 0.05em;
      color: #f0ede6;
      margin: 0 0 12px;
    }
    .ck-success-sub {
      font-size: 14px;
      color: rgba(240,237,230,0.55);
      line-height: 1.6;
    }

    select.ck-input {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(240,237,230,0.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 14px center;
      padding-right: 36px;
    }
    select.ck-input option { background: #1a1a1a; color: #f0ede6; }
  `;

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="ck-root">
          <div className="ck-success">
            <div className="ck-success-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9b97a" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="ck-success-title">Details Saved!</h2>
            <p className="ck-success-sub">
              Your booking details have been saved. Proceed to payment to confirm your tickets.
              Tickets &amp; invoice will be sent to your WhatsApp and email.
            </p>
            <button
              className="ck-pay-btn"
              style={{ marginTop: "32px" }}
              disabled={paymentLoading}
              onClick={startPayment}
            >
              {paymentLoading ? "Connecting…" : "Continue to Payment"}
            </button>
            <Link
              href={`/events/${slug}`}
              style={{ display: "block", marginTop: "16px", fontSize: "13px", color: "rgba(240,237,230,0.4)", textDecoration: "none" }}
            >
              ← Back to event
            </Link>
          </div>
        </div>
      </>
    );
  }

  const isUrgent = timeLeft <= 120;

  return (
    <>
      <style>{styles}</style>
      <div className="ck-root">

        {/* ── Timer bar ── */}
        <div className="ck-timer-bar">
          <Link href={`/events/${slug}`} className="ck-timer-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back
          </Link>
          <div className="ck-timer-center">
            <div className={`ck-timer-pulse ${isUrgent ? "urgent" : ""}`} />
            <span className="ck-timer-label">Tickets held for</span>
            <span className={`ck-timer-count ${isUrgent ? "urgent" : "normal"}`}>{timerDisplay}</span>
          </div>
          <div style={{ width: "60px" }} />
        </div>

        {/* ── Body ── */}
        <div className="ck-body">

          {/* ── LEFT ── */}
          <div>

            {/* Card 1 — Personal */}
            <div className="ck-card">
              <h2 className="ck-card-title">
                <span className="ck-card-title-num">1</span>
                Personal Details
              </h2>

              <div className="ck-field">
                <label className="ck-label">
                  Legal Name <span className="ck-label-hint">(as on Govt. ID)</span>
                </label>
                <input
                  className={`ck-input${errors.legalName ? " error" : ""}`}
                  placeholder="Full legal name"
                  value={form.legalName}
                  onChange={(e) => set("legalName", e.target.value)}
                />
                {errors.legalName && <div className="ck-error-msg">{errors.legalName}</div>}
              </div>

              <div className="ck-field">
                <label className="ck-label">Email</label>
                <input
                  className="ck-input ck-input-disabled"
                  value={userEmail}
                  readOnly
                  tabIndex={-1}
                />
                <div className="ck-hint">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Email from your login account
                </div>
              </div>

              <div className="ck-field">
                <label className="ck-label">
                  WhatsApp Number
                  <span className="ck-label-hint">(tickets &amp; invoice sent here)</span>
                </label>
                <input
                  className={`ck-input${errors.whatsapp ? " error" : ""}`}
                  placeholder="+91 or intl. with country code"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  inputMode="tel"
                />
                {errors.whatsapp && <div className="ck-error-msg">{errors.whatsapp}</div>}
                {!errors.whatsapp && (
                  <div className="ck-hint">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Tickets &amp; invoice will be sent via WhatsApp
                  </div>
                )}
              </div>
            </div>

            {/* Card 2 — Nationality */}
            <div className="ck-card">
              <h2 className="ck-card-title">
                <span className="ck-card-title-num">2</span>
                Nationality &amp; Residency
              </h2>

              <div className="ck-field">
                <label className="ck-label">Nationality</label>
                <input
                  className={`ck-input${errors.nationality ? " error" : ""}`}
                  placeholder="e.g. Indian, British, American"
                  value={form.nationality}
                  onChange={(e) => set("nationality", e.target.value)}
                />
                {errors.nationality && <div className="ck-error-msg">{errors.nationality}</div>}
              </div>

              <div className="ck-field">
                <label className="ck-label">Visitor Type</label>
                <div className="ck-radio-group">
                  {[
                    { val: "indian", label: "🇮🇳 Indian Resident" },
                    { val: "international", label: "✈️ International Visitor" },
                  ].map(({ val, label }) => (
                    <label key={val} className="ck-radio-option">
                      <input
                        type="radio"
                        checked={form.residency === val}
                        onChange={() => set("residency", val)}
                      />
                      <span className="ck-radio-label">
                        <span className="ck-radio-dot">
                          <span className="ck-radio-dot-inner" />
                        </span>
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {form.residency === "indian" && (
                <div className="ck-field">
                  <label className="ck-label">State of Residence</label>
                  <select
                    className={`ck-input${errors.state ? " error" : ""}`}
                    value={form.state}
                    onChange={(e) => set("state", e.target.value)}
                  >
                    <option value="">Select state…</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <div className="ck-error-msg">{errors.state}</div>}
                </div>
              )}
            </div>

            {/* Card 3 — Agreements */}
            <div className="ck-card">
              <h2 className="ck-card-title">
                <span className="ck-card-title-num">3</span>
                Agreements
              </h2>

              {([
                { key: "acceptTerms", label: <>I have read and accept the <a href="/terms">Terms &amp; Conditions</a></> },
                { key: "acceptPrivacy", label: <>I agree to the <a href="/privacy">Privacy Policy</a> and consent to data processing</> },
                { key: "acceptDisclaimer", label: <>I acknowledge the <a href="/disclaimer">Disclaimer</a>. Tickets are non-refundable and non-transferable.</> },
              ] as const).map(({ key, label }) => (
                <div
                  key={key}
                  className={`ck-checkbox-field${errors[key] ? " error" : ""}`}
                  onClick={() => set(key, !form[key])}
                >
                  <div className={`ck-checkbox-box${form[key] ? " checked" : ""}`}>
                    {form[key] && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#080808" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                  <div className="ck-checkbox-text">{label}</div>
                </div>
              ))}

              {(errors.acceptTerms || errors.acceptPrivacy || errors.acceptDisclaimer) && (
                <div className="ck-error-msg" style={{ marginTop: "-4px" }}>
                  Please accept all agreements to continue
                </div>
              )}
            </div>

            {errors.submit && (
              <div style={{ padding: "14px", background: "rgba(224,82,82,0.1)", border: "1px solid rgba(224,82,82,0.3)", borderRadius: "6px", fontSize: "13px", color: "#e05252", marginBottom: "20px" }}>
                {errors.submit}
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="ck-sidebar">

            <div className="ck-event-banner">
              <h3 className="ck-event-name">{eventTitle}</h3>
              <div className="ck-event-meta">
                {eventDate && (
                  <span>📅 {new Date(eventDate).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}</span>
                )}
                {venueName && <span>📍 {venueName}</span>}
              </div>
            </div>

            <div className="ck-card" style={{ marginBottom: 0 }}>
              <h2 className="ck-card-title" style={{ marginBottom: "16px" }}>
                <span className="ck-card-title-num" style={{ width: "auto", minWidth: "24px", padding: "0 4px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                  </svg>
                </span>
                Order Summary
              </h2>

              {/* Ticket rows */}
              <div className="ck-ticket-summary">
                {ticketSelections.filter((t) => t.quantity > 0).map((t, i) => (
                  <div key={i} className="ck-ticket-row">
                    <div>
                      <div className="ck-ticket-name">{t.name}</div>
                      <div className="ck-ticket-qty">₹{t.price.toLocaleString("en-IN")} × {t.quantity}</div>
                    </div>
                    <div className="ck-ticket-amount">₹{(t.price * t.quantity).toLocaleString("en-IN")}</div>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="ck-pricing">
                <div className="ck-pricing-row">
                  <span>Order Amount ({totalTickets} ticket{totalTickets !== 1 ? "s" : ""})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {/* TODO: uncomment when fees are enabled
                <div className="ck-pricing-row">
                  <span>Convenience Fee (2%)</span>
                  <span>₹{convenienceFee.toLocaleString("en-IN")}</span>
                </div>
                <div className="ck-pricing-row">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN")}</span>
                </div>
                */}
                <div className="ck-pricing-row total">
                  <span>Grand Total</span>
                  <span className="ck-price-val">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Single payment CTA — gated on form completeness */}
              <button
                className="ck-pay-btn"
                disabled={!formReady || submitting}
                onClick={handleSubmit}
              >
                {submitting ? (
                  "Saving…"
                ) : (
                  <>
                    Proceed to Payment
                    <span className="ck-pay-btn-hint">₹{grandTotal.toLocaleString("en-IN")} · {totalTickets} ticket{totalTickets !== 1 ? "s" : ""}</span>
                  </>
                )}
              </button>

              {!formReady && (
                <div className="ck-incomplete-notice">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Complete all fields to enable payment
                </div>
              )}

              <div className="ck-secure-note">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Secured · Tickets on WhatsApp &amp; Email
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}