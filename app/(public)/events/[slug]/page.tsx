import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import type { Event } from "@/type/event";

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
    ticketTypes
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

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.toLocaleDateString("en-IN", { weekday: "short" }),
    date: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    time: date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
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
      ? Math.min(...event.ticketTypes.map((t: any) => t.price))
      : null;

    return (
      <>
        {/* Inject fonts and base styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

          .ev-root {
            min-height: 100vh;
            background: #080808;
            color: #f0ede6;
            font-family: 'DM Sans', sans-serif;
          }

          /* ── Hero ── */
          .ev-hero {
            position: relative;
            width: 100%;
            height: min(92vh, 760px);
            overflow: hidden;
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
            bottom: 0;
            left: 0;
            right: 0;
            padding: clamp(24px, 5vw, 64px);
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
            margin-bottom: 18px;
          }
          .ev-title {
            font-family: 'Bebas Neue', sans-serif;
            font-size: clamp(48px, 9vw, 108px);
            line-height: 0.92;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: #f0ede6;
            margin: 0 0 28px;
          }
          .ev-meta-row {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            align-items: center;
          }
          .ev-meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: rgba(240,237,230,0.7);
          }
          .ev-meta-item svg {
            opacity: 0.5;
            flex-shrink: 0;
          }

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
          .ev-about-text {
            font-size: 16px;
            line-height: 1.75;
            color: rgba(240,237,230,0.72);
            font-weight: 300;
            white-space: pre-wrap;
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
          .ev-artist-ig {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: #c9b97a;
            text-decoration: none;
            margin-top: 8px;
            opacity: 0.8;
          }
          .ev-artist-ig:hover { opacity: 1; }

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
        `}</style>

        <div className="ev-root">
          {/* ── HERO ── */}
          <div className="ev-hero">
            {event.cover?.asset ? (
              <Image
                src={urlFor(event.cover).width(1600).url()}
                alt={event.title}
                fill
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
                    <p className="ev-about-text">{event.description}</p>
                  </section>
                )}

                {/* Artists */}
                {(event.artists?.length ?? 0) > 0 && (
                  <>
                    <div className="ev-divider" />
                    <section>
                      <div className="ev-section-label">Line-up</div>
                      <div className="ev-artists-grid">
                        {event.artists?.map((artist: any, i: number) => (
                          <div key={i} className="ev-artist-card">
                            <div className="ev-artist-img-wrap">
                              {artist.image?.asset ? (
                                <Image
                                  src={urlFor(artist.image).width(320).url()}
                                  alt={artist.name}
                                  fill
                                  style={{ objectFit: "cover" }}
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
                              {artist.instagram && (
                                <a
                                  href={`https://instagram.com/${artist.instagram.replace("@", "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ev-artist-ig"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                                  </svg>
                                  @{artist.instagram.replace("@", "")}
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
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
                        {event.ticketTypes?.map((ticket: any, i: number) => (
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
              </div>

              {/* SIDEBAR */}
              <aside>
                <div className="ev-sidebar-card">
                  {lowestPrice && (
                    <>
                      <div className="ev-price-label">Starting from</div>
                      <div className="ev-price">₹{lowestPrice.toLocaleString("en-IN")}</div>
                    </>
                  )}
                  <a href="#tickets" className="ev-btn-primary">
                    Book Tickets
                  </a>

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
                          <span>{formatted.time} onwards</span>
                        </div>
                      </div>
                    )}

                    {event.venueName && (
                      <div className="ev-detail-row">
                        <div className="ev-detail-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.5)" strokeWidth="1.8">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
                          </svg>
                        </div>
                        <div className="ev-detail-text">
                          <strong>{event.venueName}</strong>
                          {event.venueAddress && <span>{event.venueAddress}</span>}
                          {event.googleMapsLink && (
                            <a
                              href={event.googleMapsLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ev-maps-link"
                            >
                              View on Maps →
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {(event.artists?.length ?? 0) > 0 && (
                      <div className="ev-detail-row">
                        <div className="ev-detail-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(240,237,230,0.5)" strokeWidth="1.8">
                            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                          </svg>
                        </div>
                        <div className="ev-detail-text">
                          <strong>{event.artists?.length ?? 0} Artist{(event.artists?.length ?? 0) > 1 ? "s" : ""}</strong>
                          <span>{event.artists?.map((a: any) => a.name).join(", ")}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
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