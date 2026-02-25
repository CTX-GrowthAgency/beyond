import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import EventsGrid from "@/components/event/EventsGrid";
import { Event } from "../../../type/event";

// ── SEO ───────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "All Events — Beyond",
  description:
    "Browse all upcoming concerts, nightlife, festivals, art shows and cultural events across India. Find something worth showing up for.",
  openGraph: {
    title: "All Events — Beyond",
    description:
      "Browse concerts, nightlife, festivals and cultural events across India.",
    url: "https://ctxgrowthagency.in/events",
    siteName: "Beyond",
    images: [
      {
        url: "https://ctxgrowthagency.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beyond — All Events",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Events — Beyond",
    images: ["https://ctxgrowthagency.in/og-image.jpg"],
  },
  alternates: { canonical: "https://ctxgrowthagency.in/events" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function EventsPageJsonLd({ count }: { count: number }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "All Events — Beyond",
          description:
            "Browse all upcoming events across India on Beyond.",
          url: "https://ctxgrowthagency.in/events",
          numberOfItems: count,
        }),
      }}
    />
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
async function getAllEvents(): Promise<Event[]> {
  return sanityClient.fetch(`
    *[_type == "event"]
    | order(eventDate desc) {
      _id,
      title,
      "slug": eventSlug.current,
      displayPoster,
      eventDate
    }
  `);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function EventsPage() {
  const events = await getAllEvents();

  const gridEvents = events
    .filter((e) => e.slug)
    .map((e) => ({
      _id: e._id,
      slug: e.slug!,
      title: e.title,
      image: e.displayPoster
        ? urlFor(e.displayPoster).width(600).url()
        : "/placeholder.jpg",
    }));

  return (
    <>
      <EventsPageJsonLd count={gridEvents.length} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        /* ── Animations ── */
        @keyframes ep-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ep-anim { animation: ep-up 0.65s cubic-bezier(0.22,1,0.36,1) both; }
        .ep-d1 { animation-delay: 0.0s; }
        .ep-d2 { animation-delay: 0.1s; }
        .ep-d3 { animation-delay: 0.2s; }

        /* ── Page ── */
        .ep-page {
          position: relative;
          min-height: 100vh;
        }

        /* ── Header block ── */
        .ep-header {
          padding: clamp(48px,7vw,88px) 0 clamp(32px,4vw,52px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .ep-header-inner {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .ep-eyebrow {
          display: block;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--color-accent-primary, #c9b97a);
          margin-bottom: 10px;
        }
        .ep-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 9vw, 100px);
          line-height: 0.9;
          letter-spacing: -0.01em;
          color: var(--color-text-on-dark-primary, #FAFAFA);
          margin: 0;
        }
        .ep-sub {
          font-size: clamp(13px, 1.3vw, 15px);
          color: var(--color-text-on-dark-muted, #6F6F6F);
          font-weight: var(--font-weight-light, 200);
          line-height: 1.6;
          margin-top: 12px;
          max-width: 400px;
        }
        .ep-count {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 5vw, 56px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.15);
          letter-spacing: 0.02em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ep-count em {
          font-style: normal;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          display: block;
          -webkit-text-stroke: 0;
          margin-top: 4px;
          font-family: var(--font-family-avalon);
        }

        /* ── Grid section ── */
        .ep-grid-section {
          padding: clamp(40px,6vw,72px) 0 clamp(64px,9vw,120px);
        }

        /* Reuse hp-* card styles from HomePage — same grid, same hover treatment */
        .hp-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
          gap: 1px;
        }
        .hp-card-wrap {
          position: relative;
          display: block;
          background: var(--color-bg-dark, #020202);
          cursor: pointer;
          overflow: hidden;
          border-radius: 0 !important;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.22s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-card-wrap *,
        .hp-card-wrap .card,
        .hp-card-wrap a,
        .hp-card-wrap img {
          border-radius: 0 !important;
        }
        .hp-card-wrap::after {
          content: '';
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: var(--color-accent-primary, #c9b97a);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.26s cubic-bezier(0.22,1,0.36,1);
        }
        .hp-card-wrap:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.55);
          z-index: 2;
        }
        .hp-card-wrap:hover::after { transform: scaleX(1); }
        .hp-card-wrap:focus-visible {
          outline: 2px solid var(--color-accent-primary, #c9b97a);
          outline-offset: 2px;
        }
        .hp-card-pill {
          position: absolute; top: 12px; right: 12px;
          background: var(--color-accent-primary, #c9b97a);
          color: #020202;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          padding: 5px 10px; border-radius: 0;
          opacity: 0; transform: translateY(-6px);
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none; z-index: 3;
        }
        .hp-card-wrap:hover .hp-card-pill {
          opacity: 1; transform: translateY(0);
        }
        .hp-empty {
          grid-column: 1 / -1; padding: 80px 0;
          text-align: center; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(250,250,250,0.12);
          background: var(--color-bg-dark, #020202);
        }
      `}</style>

      <main className="ep-page">

        {/* ── PAGE HEADER ── */}
        <div className="ep-header ep-anim ep-d1">
          <div className="container">
            <div className="ep-header-inner">
              <div>
                <span className="ep-eyebrow">Happing Now</span>
                {/* h1 is visible and descriptive — good for SEO */}
                <h1 className="ep-title">All Events</h1>
                <p className="ep-sub">
                  Concerts, nightlife, festivals, culture —
                  everything happening across India.
                </p>
              </div>
              {gridEvents.length > 0 && (
                <div className="ep-count" aria-label={`${gridEvents.length} events`}>
                  {String(gridEvents.length).padStart(2, "0")}
                  <em>Events</em>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── EVENTS GRID ── */}
        <div className="ep-grid-section ep-anim ep-d2">
          <div className="container">
            <EventsGrid events={gridEvents} />
          </div>
        </div>

      </main>
    </>
  );
}