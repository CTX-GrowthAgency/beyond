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
      <div className="ev-sticky-bar">
        <div>
          <div className="ev-sticky-price-label">From</div>
          <div className="ev-sticky-price">
            {lowestPrice != null ? `₹${lowestPrice.toLocaleString("en-IN")}` : "Free"}
          </div>
        </div>
        <button type="button" className="ev-sticky-cta" onClick={() => setOpen(true)}>
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
