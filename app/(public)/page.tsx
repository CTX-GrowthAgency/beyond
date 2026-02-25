import type { Metadata } from "next";
import Link from "next/link";
import { Bebas_Neue } from "next/font/google";
import EventsGrid from "@/components/event/EventsGrid";
import { sanityClient } from "@/lib/sanity/client";

// ── Font (self-hosted by Next.js — no render-blocking Google request) ─────────
const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
});

// ── Revalidate every 60 seconds (ISR — no full re-fetch on every request) ─────
export const revalidate = 60;

interface FeaturedEvent {
  _id: string;
  title: string;
  slug: string;
  image: string | null;
}
// ── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Beyond — Discover & Book Events Across India",
  description:
    "Find and book concerts, nightlife, festivals, art shows and cultural events across India. Beyond is India's event ticketing platform — book your spot before it's gone.",
  keywords: [
    "events in India",
    "buy event tickets India",
    "concerts India",
    "nightlife events India",
    "book tickets online",
    "festivals India",
    "Beyond events",
  ],
  openGraph: {
    title: "Beyond — Discover & Book Events Across India",
    description:
      "Find and book concerts, nightlife, festivals and cultural events across India.",
    url: "https://ctxgrowthagency.in",
    siteName: "Beyond",
    images: [
      {
        url: "https://ctxgrowthagency.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beyond — Events Across India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond — Discover & Book Events Across India",
    images: ["https://ctxgrowthagency.in/og-image.jpg"],
  },
  alternates: { canonical: "https://ctxgrowthagency.in" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function HomePageJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Beyond",
          url: "https://ctxgrowthagency.in",
          description:
            "Find and book concerts, nightlife, festivals and cultural events across India.",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate:
                "https://ctxgrowthagency.in/events?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      }}
    />
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
// URL resolved inside GROQ — no urlFor() JS call needed
async function getFeaturedEvents(): Promise<FeaturedEvent[]> {
  return sanityClient.fetch<FeaturedEvent[]>(`
    *[_type == "event" && featured == true]
    | order(eventDate asc) {
      _id,
      title,
      "slug": eventSlug.current,
      "image": displayPoster.asset->url
    }
  `);
}

// ── Grain SVG — defined outside component so it's never recreated ─────────────
const GRAIN_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const MARQUEE_ITEMS = [
  "Concerts", "Nightlife", "Cultural Events", "Art Shows",
  "Music Festivals", "Live Performances", "Outdoor Events", "Experiences",
  "Festivals", "Club Nights", "Gigs", "Pop-ups",
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const events = await getFeaturedEvents();

  const gridEvents = events
    .filter((e: FeaturedEvent) => e.slug)
    .map((e: FeaturedEvent) => ({
      _id: e._id,
      slug: e.slug,
      title: e.title,
      image: e.image ? `${e.image}?w=600&auto=format` : "/placeholder.jpg",
  }));

  return (
    // Apply Bebas Neue CSS variable to the whole page tree
    <div className={bebasNeue.variable}>
      <HomePageJsonLd />

      <style>{`
        /* ── Visually hidden — readable by Google, invisible to users ── */
        .hp-sr-only {
          position: absolute;
          width: 1px; height: 1px;
          padding: 0; margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }

        /* ── Grain overlay ── */
        .hp-grain {
          position: fixed; inset: 0;
          pointer-events: none; z-index: 0; opacity: 0.028;
          background-image: ${GRAIN_BG};
          background-size: 180px;
        }

        /* ── Animations ── */
        @keyframes hp-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hp-anim { animation: hp-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .hp-d1 { animation-delay: 0.0s; }
        .hp-d2 { animation-delay: 0.12s; }
        .hp-d3 { animation-delay: 0.24s; }

        /* ── Marquee ── */
        .hp-marquee {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          padding: 13px 0;
        }
        @keyframes hp-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .hp-marquee-track {
          display: flex; width: max-content;
          animation: hp-scroll 34s linear infinite;
        }
        .hp-marquee:hover .hp-marquee-track { animation-play-state: paused; }
        .hp-marquee-item {
          display: flex; align-items: center; gap: 16px;
          padding: 0 20px;
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(240,237,230,0.22); white-space: nowrap; flex-shrink: 0;
        }
        .hp-marquee-dot {
          width: 3px; height: 3px; border-radius: 50%;
          background: var(--color-accent-primary, #c9b97a);
          opacity: 0.5; flex-shrink: 0;
        }

        /* ── Events section ── */
        .hp-events {
          position: relative; z-index: 1;
          padding: clamp(48px,7vw,88px) 0 clamp(64px,9vw,120px);
        }
        .hp-events-header {
          display: flex; justify-content: space-between;
          align-items: flex-end;
          margin-bottom: clamp(24px,4vw,40px);
          gap: 16px; flex-wrap: wrap;
        }
        .hp-eyebrow {
          display: block; font-size: 10px;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--color-accent-primary, #c9b97a);
          margin-bottom: 8px;
        }
        .hp-section-title {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(28px,4.5vw,48px);
          letter-spacing: 0.03em;
          color: var(--color-text-primary, #f0ede6);
          margin: 0; line-height: 1;
        }
        .hp-view-all {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: rgba(240,237,230,0.35); text-decoration: none;
          border-bottom: 1px solid rgba(240,237,230,0.1);
          padding-bottom: 2px;
          transition: color 0.18s, border-color 0.18s; white-space: nowrap;
        }
        .hp-view-all:hover {
          color: var(--color-accent-primary, #c9b97a);
          border-color: var(--color-accent-primary, #c9b97a);
        }
        .hp-view-all svg { transition: transform 0.18s; }
        .hp-view-all:hover svg { transform: translateX(3px); }

        /* ── Events grid ── */
        .hp-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px,1fr));
          gap: 1px;
        }

        /* Card wrapper */
        .hp-card-wrap {
          position: relative;
          display: block;
          background: var(--color-bg, #080808);
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

        /* Book Now pill */
        .hp-card-pill {
          position: absolute; top: 12px; right: 12px;
          background: var(--color-accent-primary, #c9b97a);
          color: #080808;
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
          grid-column: 1 / -1; padding: 72px 0;
          text-align: center; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(240,237,230,0.15);
          background: var(--color-bg, #080808);
        }

        /* ── Organiser CTA banner ── */
        .hp-cta-banner {
          position: relative; z-index: 1;
          border-top: 1px solid rgba(255,255,255,0.07);
          background: var(--color-accent-primary, #c9b97a);
          overflow: hidden;
        }
        .hp-cta-banner::before {
          content: 'LIST';
          position: absolute; right: -0.04em; bottom: -0.14em;
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(100px,18vw,260px);
          line-height: 1; color: transparent;
          -webkit-text-stroke: 1px rgba(8,8,8,0.07);
          pointer-events: none; user-select: none;
        }
        .hp-cta-banner-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center;
          justify-content: space-between; gap: 28px;
          padding: clamp(40px,6vw,68px) clamp(20px,5vw,80px);
          flex-wrap: wrap;
        }
        .hp-banner-h2 {
          font-family: var(--font-bebas), sans-serif;
          font-size: clamp(28px,4.5vw,50px);
          letter-spacing: 0.02em; color: #080808;
          margin: 0; line-height: 1;
        }
        .hp-banner-sub {
          font-size: 13px; color: rgba(8,8,8,0.52);
          margin-top: 7px; font-weight: 300; line-height: 1.5;
          font-weight:700
        }
        .hp-btn-dark {
          display: inline-flex; align-items: center; gap: 10px;
          background: #080808; color: var(--color-accent-primary, #c9b97a);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          text-decoration: none; padding: 16px 32px;
          border-radius: 0; flex-shrink: 0;
          transition: opacity 0.18s;
        }
        .hp-btn-dark:hover { opacity: 0.8; }
      `}</style>

      {/* Grain */}
      <div className="hp-grain" aria-hidden="true" />

      {/* ── VISUALLY HIDDEN SEO TEXT ── */}
      <h1 className="hp-sr-only">
        Discover and Book Events Across India — Concerts, Nightlife, Festivals &amp; More
      </h1>
      <p className="hp-sr-only">
        Beyond is India&apos;s event ticketing platform. Find concerts, nightlife,
        festivals, art shows and cultural events happening near you. Book
        tickets instantly — no hassle, no queues.
      </p>

      {/* ── MARQUEE ── */}
      <div className="hp-marquee" aria-hidden="true">
        <div className="hp-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="hp-marquee-item">
              <span className="hp-marquee-dot" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURED EVENTS ── */}
      <section
        className="hp-events hp-anim hp-d1"
        aria-labelledby="hp-events-heading"
      >
        <div className="container">
          <div className="hp-events-header hp-anim hp-d2">
            <div>
              <span className="hp-eyebrow">Happening Now</span>
              <h2 className="hp-section-title" id="hp-events-heading">
                Featured Events Across India
              </h2>
            </div>
            <Link href="/events" className="hp-view-all">
              View All Events
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          <div className="hp-anim hp-d3">
            <EventsGrid events={gridEvents} />
          </div>
        </div>
      </section>

      {/* ── ORGANISER CTA BANNER ── */}
      <div className="hp-cta-banner">
        <div className="hp-cta-banner-inner">
          <div>
            <h2 className="hp-banner-h2">Organising an Event?</h2>
            <p className="hp-banner-sub">
              List on Beyond and reach people who actually show up.
            </p>
          </div>
          <Link href="/contact" className="hp-btn-dark">
            Get in Touch
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}