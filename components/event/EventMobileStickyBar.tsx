"use client";

import { useState } from "react";
import type { TicketType } from "@/type/event";
import BookTicketsDialog from "./BookTicketsDialog";

export default function EventMobileStickyBar({
  eventSlug,
  eventTitle,
  lowestPrice,
  ticketTypes,
}: {
  eventSlug: string;
  eventTitle: string;
  lowestPrice: number | null;
  ticketTypes: TicketType[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="ev-mobile-sticky-bar">
        <div className="ev-mobile-sticky-price">
          From{" "}
          {lowestPrice != null
            ? `₹${lowestPrice.toLocaleString("en-IN")}`
            : "Free"}
        </div>
        <button
          type="button"
          className="ev-btn-primary"
          onClick={() => setOpen(true)}
        >
          Book Tickets
        </button>
      </div>

      <BookTicketsDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        ticketTypes={ticketTypes}
      />
    </>
  );
}