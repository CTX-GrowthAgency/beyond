"use client";

import { useState } from "react";
import BookTicketsDialog from "./BookTicketsDialog";
import type { TicketType } from "@/type/event";

interface FormattedDate {
  day: string;
  date: string;
  time: string;
}

interface EventSidebarProps {
  eventSlug: string;
  eventTitle: string;
  lowestPrice: number | null;
  ticketTypes: TicketType[];
  formatted: FormattedDate | null;
  venueName?: string;
  venueAddress?: string;
  googleMapsLink?: string;
  artistsCount: number;
  artistsNames: string;
}

export default function EventSidebar({
  eventSlug,
  eventTitle,
  lowestPrice,
  ticketTypes,
  formatted,
  venueName,
  venueAddress,
  googleMapsLink,
  artistsCount,
  artistsNames,
}: EventSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const venueMapsUrl =
    googleMapsLink ||
    (venueName || venueAddress
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [venueName, venueAddress].filter(Boolean).join(", ")
        )}`
      : null);

  return (
    <>
      <aside>
        <div className="ev-sidebar-card">
          {lowestPrice != null && (
            <>
              <div className="ev-price-label">Starting from</div>
              <div className="ev-price">₹{lowestPrice.toLocaleString("en-IN")}</div>
            </>
          )}
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="ev-btn-primary"
          >
            Book Tickets
          </button>

          <div className="ev-sidebar-details">
            {formatted && (
              <div className="ev-detail-row">
                <div className="ev-detail-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.5)" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="ev-detail-text">
                  <strong>{formatted.day}, {formatted.date}</strong>
                </div>
              </div>
            )}
            {formatted && (
              <div className="ev-detail-row">
                <div className="ev-detail-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.5)" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="ev-detail-text">
                  <strong>{formatted.time} onwards</strong>
                </div>
              </div>
            )}

            {venueName && (
              <div className="ev-detail-row">
                <div className="ev-detail-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.5)" strokeWidth="1.8">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div className="ev-detail-text">
                  <strong>{venueName}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <BookTicketsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        eventSlug={eventSlug}
        eventTitle={eventTitle}
        ticketTypes={ticketTypes}
      />
    </>
  );
}
