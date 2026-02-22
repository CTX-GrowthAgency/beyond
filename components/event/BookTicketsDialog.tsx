"use client";

import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import type { TicketType } from "@/type/event";

interface BookTicketsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventSlug: string;
  eventTitle: string;
  ticketTypes: TicketType[];
}

export default function BookTicketsDialog({
  isOpen,
  onClose,
  eventSlug,
  eventTitle,
  ticketTypes,
}: BookTicketsDialogProps) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? { uid: firebaseUser.uid } : null);
    });
  }, []);

  useEffect(() => {
    if (isOpen && ticketTypes.length > 0) {
      setQuantities((prev) => {
        const next = { ...prev };
        ticketTypes.forEach((_, i) => {
          if (next[i] === undefined) next[i] = 0;
        });
        return next;
      });
    }
  }, [isOpen, ticketTypes]);

  function increment(index: number) {
    setQuantities((prev) => ({ ...prev, [index]: (prev[index] ?? 0) + 1 }));
  }

  function decrement(index: number) {
    setQuantities((prev) => ({
      ...prev,
      [index]: Math.max(0, (prev[index] ?? 0) - 1),
    }));
  }

  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = ticketTypes.reduce(
    (sum, t, i) => sum + (t.price ?? 0) * (quantities[i] ?? 0),
    0
  );

  function navigateToCheckout() {
    const params = new URLSearchParams();
    ticketTypes.forEach((t, i) => {
      const qty = quantities[i] ?? 0;
      if (qty > 0) params.append(`t${i}`, String(qty));
    });
    const query = params.toString();
    router.push(`/checkout/${eventSlug}${query ? `?${query}` : ""}`);
    onClose();
  }

  async function handleLogin() {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error("Could not create server session");
      router.refresh();
      navigateToCheckout();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleBookTickets() {
    if (totalTickets === 0) return;

    if (!user) {
      handleLogin();
      return;
    }

    navigateToCheckout();
  }

  if (!isOpen) return null;

  return (
    <div className="ev-dialog-overlay" onClick={onClose}>
      <div
        className="ev-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ev-dialog-title"
      >
        <div className="ev-dialog-header">
          <h2 id="ev-dialog-title" className="ev-dialog-title">
            Select Tickets
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ev-dialog-close"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="ev-dialog-body">
          {ticketTypes.length === 0 ? (
            <p className="ev-dialog-empty">No tickets available.</p>
          ) : (
            <div className="ev-dialog-ticket-list">
              {ticketTypes.map((ticket, i) => (
                <div key={i} className="ev-dialog-ticket-row">
                  <div className="ev-dialog-ticket-info">
                    <div className="ev-dialog-ticket-name">{ticket.name}</div>
                    {ticket.description && (
                      <div className="ev-dialog-ticket-desc">{ticket.description}</div>
                    )}
                    <div className="ev-dialog-ticket-price">₹{ticket.price?.toLocaleString("en-IN")}</div>
                  </div>
                  <div className="ev-dialog-ticket-controls">
                    <button
                      type="button"
                      onClick={() => decrement(i)}
                      disabled={(quantities[i] ?? 0) === 0}
                      className="ev-dialog-counter-btn"
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <span className="ev-dialog-counter-value">{quantities[i] ?? 0}</span>
                    <button
                      type="button"
                      onClick={() => increment(i)}
                      className="ev-dialog-counter-btn"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ev-dialog-footer">
          <div className="ev-dialog-summary">
            <span>{totalTickets} ticket{totalTickets !== 1 ? "s" : ""}</span>
            <span className="ev-dialog-total">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
          <button
            type="button"
            onClick={handleBookTickets}
            disabled={totalTickets === 0}
            className="ev-dialog-book-btn"
          >
            {!user && totalTickets > 0
              ? isLoggingIn
                ? "Signing in..."
                : "Login to Book Tickets"
              : "Book Tickets"}
          </button>
        </div>
      </div>
    </div>
  );
}
