import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import type { Metadata } from "next";
import type { Event, Artist, TicketType } from "@/type/event";
import ExpandableDescription from "@/components/event/ExpandableDescription";
import EventSidebar from "@/components/event/EventSidebar";
import EventMobileStickyBar from "@/components/event/EventMobileStickyBar";

async function getEvent(slug: string): Promise<Event | null> {
  const query = `*[_type == "event" && eventSlug.current == $slug][0]{
    _id,
    title,
    description,
    eventDate,
    venueName,
    venueAddress,
    googleMapsLink,
    cover{
      asset->
    },
    artists[]{
      name,
      role,
      instagram,
      image{
        asset->
      }
    },
    ticketTypes,
    language,
    duration,
    ticketsNeededFor,
    entryAllowedFor,
    layout,
    seatingArrangement,
    kidFriendly,
    petFriendly,
    termsAndConditions
  }`;

  try {
    const result = await sanityClient.fetch(query, { slug });
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(`
    *[_type == "event"]{
      "slug": eventSlug.current
    }
  `);
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event not found | Beyond",
      description: "This event could not be found.",
    };
  }

  const baseTitle = event.title ?? "Event";
  const datePart = event.eventDate ? formatEventDate(event.eventDate).date : null;
  const title = datePart ? `${baseTitle} | ${datePart}` : baseTitle;

  const description =
    event.description?.slice(0, 150).replace(/\s+\S*$/, "")?.replace(/\s+\S*$/, "") ??
    `Book tickets for ${event.title} on Beyond.`;

  const imageUrl = event.cover?.asset
    ? urlFor(event.cover).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/events/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/events/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function getArtistLink(instagram: string | undefined): string | null {
  if (!instagram?.trim()) return null;
  const cleaned = instagram.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) return cleaned;
  return `https://instagram.com/${cleaned.replace(/^@/, "")}`;
}

function formatEventDate(dateStr: string) {
  const localStr = dateStr.replace(/Z$/, "").replace(/([+-]\d{2}:\d{2})$/, "");
  const date = new Date(localStr);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const day   = days[date.getDay()];
  const dd    = String(date.getDate()).padStart(2, "0");
  const mon   = months[date.getMonth()];
  const yyyy  = date.getFullYear();

  let hours   = date.getHours();
  const mins  = String(date.getMinutes()).padStart(2, "0");
  const ampm  = hours >= 12 ? "PM" : "AM";
  hours       = hours % 12 || 12;
  const time  = `${String(hours).padStart(2, "0")}:${mins} ${ampm}`;

  return {
    day,
    date: `${dd} ${mon} ${yyyy}`,
    time,
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div className="container">Invalid slug</div>;
  }

  try {
    const event = await getEvent(slug);

    if (!event) {
      return <div className="container">Event not found for slug: {slug}</div>;
    }

    const formatted = event.eventDate ? formatEventDate(event.eventDate) : null;
    const lowestPrice = event.ticketTypes?.length
      ? Math.min(...event.ticketTypes.map((t: TicketType) => t.price))
      : null;

    const mapsHref = event.googleMapsLink
      ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          [event.venueName, event.venueAddress].filter(Boolean).join(", ")
        )}`;

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

          /* ─── Base ─────────────────────────────────────────────────── */
          .ev-root {
            min-height: 100vh;
            background: #080808;
            color: #f0ede6;
            font-family: 'DM Sans', sans-serif;
          }

          /* ─── Hero ─────────────────────────────────────────────────── */
          .ev-hero {
            position: relative;
            width: 100%;
            height: min(92vh, 760px);
            overflow: hidden;
          }
          /* Shorter on mobile so content below the fold is reachable */
          @media (max-width: 640px) {
            .ev-hero { height: min(74vh, 500px); }
          }
          .ev-hero-img {
            object-fit: cover;
            object-position: center top;
          }
          .ev-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to bottom,
              rgba(8,8,8,0.1) 0%,
              rgba(8,8,8,0.15) 40%,
              rgba(8,8,8,0.85) 75%,
              #080808 100%
            );
          }
          .ev-hero-content {
            position: absolute;
            bottom: 0; left: 0; right: 0;
            padding: clamp(18px, 5vw, 64px);
          }
          .ev-tag {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #c9b97a;
            border: 1px solid rgba(201,185,122,0.35);
            padding: 5px 12px;
            border-radius: 2px;
            margin-bottom: 14px;
          }
          .ev-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(36px, 9vw, 108px);
            line-height: 0.92;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: #f0ede6;
            margin: 0 0 18px;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          .ev-meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px 18px;
            align-items: center;
          }
          .ev-meta-item {
            display: flex;
            align-items: center;
            gap: 7px;
            font-size: 13px;
            color: rgba(240,237,230,0.7);
          }
          @media (max-width: 480px) { .ev-meta-item { font-size: 12px; } }
          .ev-meta-item svg { opacity: 0.5; flex-shrink: 0; }

          /* ── Body layout ── */
          .ev-body {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 clamp(20px, 5vw, 64px) 80px;
          }
          .ev-grid {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 48px;
            padding-top: 56px;
          }
          @media (max-width: 840px) {
            .ev-grid { grid-template-columns: 1fr; }
            .ev-sidebar-col { display: none; }
            /* Extra bottom padding so sticky bar doesn't overlap content */
            .ev-body { padding-bottom: 100px; }
          }

          /* ── Section labels ── */
          .ev-section-label {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(240,237,230,0.35);
            margin-bottom: 16px;
          }
          .ev-divider {
            height: 1px;
            background: rgba(240,237,230,0.08);
            margin: 40px 0;
          }

          /* ── About ── */
          .ev-about-wrapper {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: 6px;
          }
          .ev-about-text {
            font-size: 16px;
            line-height: 1.75;
            color: rgba(240,237,230,0.72);
            font-weight: 300;
            margin: 0;
            flex: 1;
            min-width: 0;
          }
          .ev-about-collapsed {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .ev-about-expanded {
            display: block;
          }
          .ev-see-more-btn {
            background: none;
            border: none;
            padding: 0;
            font-size: 14px;
            font-weight: 500;
            color: #c9b97a;
            cursor: pointer;
            flex-shrink: 0;
            text-decoration: none;
            transition: opacity 0.2s;
          }
          .ev-see-more-btn:hover {
            opacity: 0.85;
            text-decoration: underline;
          }

          /* ── Event Guide ── */
          .ev-guide-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 20px 32px;
            margin-top: 4px;
          }
          .ev-guide-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }
          .ev-guide-icon {
            width: 28px;
            height: 28px;
            background: rgba(255,255,255,0.05);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .ev-guide-icon svg {
            opacity: 0.6;
          }
          .ev-guide-content {
            min-width: 0;
          }
          .ev-guide-label {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: rgba(240,237,230,0.4);
            margin-bottom: 2px;
          }
          .ev-guide-value {
            font-size: 14px;
            font-weight: 500;
            color: #f0ede6;
          }

          /* ── Venue ── */
          .ev-venue-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 24px;
          }
          .ev-venue-name {
            font-size: 18px;
            font-weight: 600;
            color: #f0ede6;
            margin: 0 0 8px;
          }
          .ev-venue-address {
            font-size: 14px;
            line-height: 1.6;
            color: rgba(240,237,230,0.65);
            margin-bottom: 16px;
          }
          .ev-directions-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #c9b97a;
            color: #080808;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 12px 20px;
            border-radius: 4px;
            text-decoration: none;
            transition: background 0.2s, transform 0.15s;
          }
          .ev-directions-btn:hover {
            background: #ddd0a0;
            transform: translateY(-1px);
          }

          /* ── Terms & Conditions ── */
          .ev-terms-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 24px;
          }
          .ev-terms-text {
            font-size: 14px;
            line-height: 1.7;
            color: rgba(240,237,230,0.72);
            font-weight: 300;
            white-space: pre-wrap;
            margin: 0;
          }

          /* ── Artists ── */
          .ev-artists-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 20px;
            margin-top: 4px;
          }
          .ev-artist-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 6px;
            overflow: hidden;
            transition: border-color 0.2s, transform 0.2s;
          }
          .ev-artist-card:hover {
            border-color: rgba(201,185,122,0.3);
            transform: translateY(-2px);
          }
          .ev-artist-card.ev-artist-card-link {
            text-decoration: none;
            color: inherit;
            cursor: pointer;
          }
          .ev-artist-img-wrap {
            position: relative;
            aspect-ratio: 1;
            background: #111;
          }
          .ev-artist-info {
            padding: 12px 14px;
          }
          .ev-artist-name {
            font-size: 14px;
            font-weight: 500;
            color: #f0ede6;
            margin: 0 0 2px;
          }
          .ev-artist-role {
            font-size: 11px;
            color: rgba(240,237,230,0.4);
            letter-spacing: 0.06em;
            text-transform: uppercase;
          }

          /* ── Sidebar ── */
          .ev-sidebar-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px;
            padding: 28px;
            position: sticky;
            top: 24px;
          }
          .ev-price-label {
            font-size: 11px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(240,237,230,0.4);
            margin-bottom: 4px;
          }
          .ev-price {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 42px;
            color: #f0ede6;
            letter-spacing: 0.03em;
            margin-bottom: 20px;
          }
          .ev-btn-primary {
            display: block;
            width: 100%;
            text-align: center;
            background: #c9b97a;
            color: #080808;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            padding: 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.2s, transform 0.15s;
          }
          .ev-btn-primary:hover {
            background: #ddd0a0;
            transform: translateY(-1px);
          }
          .ev-sidebar-details {
            margin-top: 28px;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .ev-detail-row {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }
          .ev-detail-icon {
            width: 32px;
            height: 32px;
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .ev-detail-text strong {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: #f0ede6;
            margin-bottom: 1px;
          }
          .ev-detail-text span {
            font-size: 12px;
            color: rgba(240,237,230,0.45);
          }
          .ev-maps-link {
            font-size: 11px;
            color: #c9b97a;
            text-decoration: none;
            letter-spacing: 0.06em;
            display: inline-block;
            margin-top: 4px;
          }
          .ev-maps-link:hover { text-decoration: underline; }

          /* ── Ticket types ── */
          .ev-ticket-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .ev-ticket-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 14px 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 5px;
          }
          .ev-ticket-type {
            font-size: 14px;
            font-weight: 500;
            color: #f0ede6;
          }
          .ev-ticket-desc {
            font-size: 12px;
            color: rgba(240,237,230,0.4);
            margin-top: 2px;
          }
          .ev-ticket-price {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 22px;
            color: #c9b97a;
            letter-spacing: 0.05em;
            white-space: nowrap;
          }

          /* ── Book Tickets Dialog ── */
          .ev-dialog-overlay {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.7);
            display: flex;
            /* bottom sheet on mobile */
            align-items: flex-end;
            justify-content: center;
            z-index: 1000;
          }
          @media (min-width: 480px) {
            .ev-dialog-overlay { align-items: center; padding: 24px; }
          }
          .ev-dialog {
            background: #121212;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            max-width: 440px;
            width: 100%;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
          }
          .ev-dialog-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .ev-dialog-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 24px;
            letter-spacing: 0.05em;
            color: #f0ede6;
            margin: 0;
          }
          .ev-dialog-close {
            background: none;
            border: none;
            color: rgba(240,237,230,0.6);
            cursor: pointer;
            padding: 4px;
          }
          .ev-dialog-close:hover { color: #f0ede6; }
          .ev-dialog-body {
            padding: 24px;
            overflow-y: auto;
            flex: 1;
          }
          .ev-dialog-empty {
            color: rgba(240,237,230,0.5);
            font-size: 14px;
            margin: 0;
          }
          .ev-dialog-ticket-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          .ev-dialog-ticket-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.07);
            border-radius: 8px;
          }
          .ev-dialog-ticket-info { min-width: 0; }
          .ev-dialog-ticket-name {
            font-size: 15px;
            font-weight: 600;
            color: #f0ede6;
          }
          .ev-dialog-ticket-desc {
            font-size: 12px;
            color: rgba(240,237,230,0.45);
            margin-top: 2px;
          }
          .ev-dialog-ticket-price {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 18px;
            color: #c9b97a;
            margin-top: 4px;
          }
          .ev-dialog-ticket-controls {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .ev-dialog-counter-btn {
            width: 36px;
            height: 36px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.15);
            background: rgba(255,255,255,0.05);
            color: #f0ede6;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .ev-dialog-counter-btn:hover:not(:disabled) {
            background: rgba(255,255,255,0.1);
            border-color: rgba(201,185,122,0.4);
          }
          .ev-dialog-counter-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          .ev-dialog-counter-value {
            font-size: 16px;
            font-weight: 600;
            min-width: 24px;
            text-align: center;
          }
          .ev-dialog-footer {
            padding: 20px 24px;
            border-top: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .ev-dialog-summary {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: rgba(240,237,230,0.7);
          }
          .ev-dialog-total {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 22px;
            color: #c9b97a;
          }
          .ev-dialog-book-btn {
            width: 100%;
            padding: 16px;
            background: #c9b97a;
            color: #080808;
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s, transform 0.15s;
          }
          .ev-dialog-book-btn:hover:not(:disabled) {
            background: #ddd0a0;
            transform: translateY(-1px);
          }
          .ev-dialog-book-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }

          /* ── Mobile Sticky Bar (client) ── */
          .ev-mobile-sticky-bar {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 12px clamp(16px, 4vw, 28px);
            background: #121212;
            border-top: 1px solid rgba(255,255,255,0.1);
            /* respect iOS home indicator */
            padding-bottom: max(12px, env(safe-area-inset-bottom));
            z-index: 900;
          }
          @media (min-width: 840px) {
            .ev-mobile-sticky-bar { display: none; }
          }
          .ev-mobile-sticky-price {
            font-family: 'Bebas Neue', sans-serif;
            font-size: 24px;
            color: #f0ede6;
            letter-spacing: 0.03em;
            line-height: 1.1;
          }
        `}</style>

        <div className="ev-root">
          {/* ── HERO ── */}
          <div className="ev-hero">
            {event.cover?.asset ? (
              <Image
                src={urlFor(event.cover).width(1200).url()}
                alt={event.title}
                fill
                sizes="100vw"
                className="ev-hero-img"
                priority
              />
            ) : (
              <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#111,#1a1a1a)" }} />
            )}
            <div className="ev-hero-overlay" />
            <div className="ev-hero-content">
              <div className="ev-tag">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                  <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="5" cy="5" r="1.5" />
                </svg>
                Live Event
              </div>
              <h1 className="ev-title">{event.title}</h1>
              <div className="ev-meta-row">
                {formatted && (
                  <span className="ev-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {formatted.day}, {formatted.date} · {formatted.time}
                  </span>
                )}
                {event.venueName && (
                  <span className="ev-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                    </svg>
                    {event.venueName}
                  </span>
                )}
                {lowestPrice && (
                  <span className="ev-meta-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    From ₹{lowestPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── BODY ── */}
          <div className="ev-body">
            <div className="ev-grid">
              {/* LEFT */}
              <div>
                {/* About */}
                {event.description && (
                  <section>
                    <div className="ev-section-label">About the Event</div>
                    <ExpandableDescription text={event.description} />
                  </section>
                )}

                {/* Event Guide */}
                {(event.language || event.duration || event.ticketsNeededFor || event.entryAllowedFor || event.layout || event.seatingArrangement || event.kidFriendly !== undefined || event.petFriendly !== undefined) && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Event Guide</div>
                      <div className="ev-guide-grid">
                        {event.language && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Language</div>
                              <div className="ev-guide-value">{event.language}</div>
                            </div>
                          </div>
                        )}
                        {event.duration && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Duration</div>
                              <div className="ev-guide-value">{event.duration}</div>
                            </div>
                          </div>
                        )}
                        {event.ticketsNeededFor && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Tickets Needed For</div>
                              <div className="ev-guide-value">{event.ticketsNeededFor}</div>
                            </div>
                          </div>
                        )}
                        {event.entryAllowedFor && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Entry Allowed For</div>
                              <div className="ev-guide-value">{event.entryAllowedFor}</div>
                            </div>
                          </div>
                        )}
                        {event.layout && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Layout</div>
                              <div className="ev-guide-value">{event.layout}</div>
                            </div>
                          </div>
                        )}
                        {event.seatingArrangement && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M4 18v3M4 14v2M4 10v2M4 6v2M20 18v3M20 14v2M20 10v2M20 6v2M4 6h16M4 18h16" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Seating Arrangement</div>
                              <div className="ev-guide-value">{event.seatingArrangement}</div>
                            </div>
                          </div>
                        )}
                        {event.kidFriendly !== undefined && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <path d="M9 12h6M9 16h6M12 2a4 4 0 0 0-4 4v2h8V6a4 4 0 0 0-4-4Z" /><path d="M4 22v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Kid Friendly?</div>
                              <div className="ev-guide-value">{event.kidFriendly ? "Yes" : "No"}</div>
                            </div>
                          </div>
                        )}
                        {event.petFriendly !== undefined && (
                          <div className="ev-guide-item">
                            <div className="ev-guide-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                <circle cx="11" cy="11" r="2.5" /><path d="M7 20c-1.5 0-2.5-1.5-2.5-3S5.5 14 7 14" /><path d="M17 20c1.5 0 2.5-1.5 2.5-3S18.5 14 17 14" /><path d="M4 14c-1 0-1.5-1-1.5-2s.5-2 1.5-2" /><path d="M20 14c1 0 1.5-1 1.5-2s-.5-2-1.5-2" />
                              </svg>
                            </div>
                            <div className="ev-guide-content">
                              <div className="ev-guide-label">Pet Friendly?</div>
                              <div className="ev-guide-value">{event.petFriendly ? "Yes" : "No"}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </section>
                  </>
                )}

                {/* Venue */}
                {(event.venueName || event.venueAddress) && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Venue</div>
                      <div className="ev-venue-card">
                        {event.venueName && (
                          <h3 className="ev-venue-name">{event.venueName}</h3>
                        )}
                        {event.venueAddress && (
                          <p className="ev-venue-address">{event.venueAddress}</p>
                        )}
                        {(event.googleMapsLink || event.venueName || event.venueAddress) && (
                          <a
                            href={
                              event.googleMapsLink
                                ? event.googleMapsLink
                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    [event.venueName, event.venueAddress].filter(Boolean).join(", ")
                                  )}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ev-directions-btn"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                            </svg>
                            Get Directions
                          </a>
                        )}
                      </div>
                    </section>
                  </>
                )}

                {/* Artists */}
                {(event.artists?.length ?? 0) > 0 && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Line-up</div>
                      <div className="ev-artists-grid">
                        {event.artists?.map((artist: Artist, i: number) => {
                          const artistLink = getArtistLink(artist.instagram);
                          const CardWrapper = artistLink ? "a" : "div";
                          const wrapperProps = artistLink
                            ? { href: artistLink, target: "_blank", rel: "noopener noreferrer", className: "ev-artist-card ev-artist-card-link" }
                            : { className: "ev-artist-card" };
                          return (
                            <CardWrapper key={i} {...wrapperProps}>
                              <div className="ev-artist-img-wrap">
                                {artist.image?.asset ? (
                                  <Image
                                    src={urlFor(artist.image).width(320).url()}
                                    alt={artist.name}
                                    fill
                                    sizes="160px"
                                    style={{ objectFit: "cover" }}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#181818,#222)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ev-artist-info">
                                <p className="ev-artist-name">{artist.name}</p>
                                {artist.role && <p className="ev-artist-role">{artist.role}</p>}
                              </div>
                            </CardWrapper>
                          );
                        })}
                      </div>
                    </section>
                  </>
                )}

                {/* Ticket types */}
                {(event.ticketTypes?.length ?? 0) > 0 && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Tickets</div>
                      <div className="ev-ticket-list">
                        {event.ticketTypes?.map((ticket: TicketType, i: number) => (
                          <div key={i} className="ev-ticket-row">
                            <div>
                              <div className="ev-ticket-type">{ticket.name}</div>
                              {ticket.description && (
                                <div className="ev-ticket-desc">{ticket.description}</div>
                              )}
                            </div>
                            <div className="ev-ticket-price">₹{ticket.price?.toLocaleString("en-IN")}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}

                {/* Terms & Conditions */}
                {event.termsAndConditions && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Terms & Conditions</div>
                      <div className="ev-terms-card">
                        <p className="ev-terms-text">{event.termsAndConditions}</p>
                      </div>
                    </section>
                  </>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="ev-sidebar-col">
                <EventSidebar
                  eventSlug={slug}
                  eventTitle={event.title}
                  lowestPrice={lowestPrice}
                  ticketTypes={event.ticketTypes ?? []}
                  formatted={formatted}
                  venueName={event.venueName}
                  venueAddress={event.venueAddress}
                  googleMapsLink={event.googleMapsLink}
                  artistsCount={event.artists?.length ?? 0}
                  artistsNames={event.artists?.map((a: Artist) => a.name).join(", ") ?? ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile sticky bar with tickets dialog */}
        <EventMobileStickyBar
          eventSlug={slug}
          eventTitle={event.title}
          lowestPrice={lowestPrice}
          ticketTypes={event.ticketTypes ?? []}
        />
      </>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    return (
      <div className="container">
        <h1>Error loading event</h1>
        <p>Slug: {slug}</p>
        <p>Error: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }
}