import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminApp } from "@/lib/firebase/admin";

getAdminApp();

type TicketStatus = "valid" | "already_used" | "invalid";

interface TicketPayload {
  id: string;
  code: string;
  eventTitle: string;
  venueName?: string;
  date?: string;
  holderName?: string;
  tier?: string;
  admitted?: boolean;
}

interface VerifyResponse {
  status: TicketStatus;
  ticket?: TicketPayload;
  message?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { code } = (await req.json().catch(() => ({}))) as { code?: string };

    const trimmed = code?.trim();
    if (!trimmed) {
      return NextResponse.json<VerifyResponse>(
        { status: "invalid", message: "Missing ticket code." },
        { status: 400 }
      );
    }

    const db = getFirestore();
    const bookingRef = db.collection("bookings").doc(trimmed);
    const snap = await bookingRef.get();

    if (!snap.exists) {
      return NextResponse.json<VerifyResponse>(
        { status: "invalid", message: "Ticket not found." },
        { status: 404 }
      );
    }

    const booking = snap.data() as any;
    const bookingId = snap.id;

    // Basic payment / ticket validity checks
    if (booking.paymentStatus !== "completed") {
      return NextResponse.json<VerifyResponse>({
        status: "invalid",
        message: "Payment for this booking is not completed.",
      });
    }

    // Fetch related event + user for display
    const [eventSnap, userSnap] = await Promise.all([
      booking.eventId
        ? db.collection("events").doc(String(booking.eventId)).get()
        : Promise.resolve(null),
      booking.userId
        ? db.collection("users").doc(String(booking.userId)).get()
        : Promise.resolve(null),
    ]);

    const eventData = eventSnap && "exists" in eventSnap && eventSnap.exists
      ? (eventSnap.data() as any)
      : {};
    const userData = userSnap && "exists" in userSnap && userSnap.exists
      ? (userSnap.data() as any)
      : {};

    let formattedDate: string | undefined;
    const ts: Timestamp | undefined = eventData.eventDate;
    if (ts && typeof ts.toDate === "function") {
      const d = ts.toDate();
      const day = d.toLocaleDateString("en-IN", { weekday: "short" });
      const dateStr = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const timeStr = d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      formattedDate = `${day}, ${dateStr} · ${timeStr}`;
    }

    const holderName: string | undefined =
      booking.billing?.legalName ?? userData.name ?? undefined;

    let tier: string | undefined;
    if (Array.isArray(booking.tickets) && booking.tickets.length > 0) {
      const names = Array.from(
        new Set(
          booking.tickets
            .map((t: any) => t.name || t.ticketType)
            .filter(Boolean)
        )
      );
      tier = names.length === 1 ? names[0] : "Multiple";
    }

    const baseTicket: TicketPayload = {
      id: bookingId,
      code: bookingId,
      eventTitle: eventData.title ?? "Event",
      venueName: eventData.venueName,
      date: formattedDate,
      holderName,
      tier,
      admitted: booking.ticketStatus === "used",
    };

    // Already used / cancelled
    if (booking.ticketStatus === "used") {
      return NextResponse.json<VerifyResponse>({
        status: "already_used",
        ticket: baseTicket,
        message: "Ticket has already been used.",
      });
    }

    if (booking.ticketStatus === "cancelled") {
      return NextResponse.json<VerifyResponse>({
        status: "invalid",
        ticket: baseTicket,
        message: "Ticket has been cancelled.",
      });
    }

    // Mark as used atomically
    await bookingRef.update({
      ticketStatus: "used",
      verifiedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    const ticket: TicketPayload = {
      ...baseTicket,
      admitted: true,
    };

    return NextResponse.json<VerifyResponse>({
      status: "valid",
      ticket,
      message: "Ticket verified and marked as used.",
    });
  } catch (err) {
    console.error("[tickets/verify-and-redeem] error:", err);
    return NextResponse.json<VerifyResponse>(
      { status: "invalid", message: "Internal server error while verifying ticket." },
      { status: 500 }
    );
  }
}

