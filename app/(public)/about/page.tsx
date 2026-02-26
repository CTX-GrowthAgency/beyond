"use client";

import Link from "next/link";

const organisersSteps = [
  { step: "01", title: "List your event", body: "Create your event page in under 30 minutes. Set ticket types, pricing, capacity, and go live instantly." },
  { step: "02", title: "Sell tickets", body: "Share your Beyond link anywhere. Payments go through Cashfree — UPI, cards, netbanking. All of India covered." },
  { step: "03", title: "Track in real time", body: "Monitor sales and revenue from your dashboard. Know exactly who's coming before the day arrives." },
  { step: "04", title: "Scan at the gate", body: "Use our QR scanner at entry. No printing, no lists, no confusion. Works on any phone, even offline." },
];

const attendeesSteps = [
  { step: "01", title: "Discover events", body: "Browse curated events near you — college fests, gigs, comedy nights, cultural shows, and more." },
  { step: "02", title: "Book in seconds", body: "Select your tickets and pay via UPI, cards, or netbanking. Confirmation hits your phone instantly." },
  { step: "03", title: "Get your QR ticket", body: "Your ticket arrives as a QR code on your phone. Screenshot it — you don't even need signal at the venue." },
  { step: "04", title: "Just show up", body: "Flash your QR at the gate. Scan takes under 2 seconds. No printing, no queues, no drama." },
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        /* ─── Base ──────────────────────────────────────────────────── */
        .ab-root {
          min-height: 100vh;
          background: #080808;
          color: #f0ede6;
          font-family: 'DM Sans', sans-serif;
        }
        .ab-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 64px);
        }
        .ab-section-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-bottom: 20px;
        }
        .ab-section-label::before {
          content: '';
          width: 24px;
          height: 1px;
          background: #c9b97a;
          flex-shrink: 0;
        }

        /* ─── HERO ──────────────────────────────────────────────────── */
        .ab-hero {
          padding: clamp(80px, 14vw, 160px) 0 clamp(60px, 10vw, 120px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        .ab-hero-wm {
          position: absolute;
          top: 50%;
          right: -0.04em;
          transform: translateY(-50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px, 22vw, 320px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.025);
          pointer-events: none;
          user-select: none;
        }
        .ab-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 780px;
        }
        .ab-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-bottom: 24px;
        }
        .ab-hero-eyebrow::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #c9b97a;
        }
        .ab-hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 10vw, 120px);
          line-height: 0.88;
          letter-spacing: 0.01em;
          text-transform: uppercase;
          color: #f0ede6;
          margin: 0 0 32px;
        }
        .ab-hero-title span { color: #c9b97a; }
        .ab-hero-body {
          font-size: clamp(15px, 1.8vw, 18px);
          line-height: 1.8;
          color: rgba(240,237,230,0.6);
          font-weight: 300;
          max-width: 560px;
        }

        /* ─── MISSION ───────────────────────────────────────────────── */
        .ab-mission {
          padding: clamp(64px, 10vw, 120px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 6vw, 80px);
          align-items: start;
          margin-top: 48px;
        }
        @media (max-width: 720px) {
          .ab-mission-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        .ab-mission-headline {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          line-height: 0.95;
          letter-spacing: 0.02em;
          color: #f0ede6;
          margin: 0;
        }
        .ab-mission-body {
          font-size: 15px;
          line-height: 1.85;
          color: rgba(240,237,230,0.6);
          font-weight: 300;
          margin: 0;
        }
        .ab-mission-body + .ab-mission-body { margin-top: 16px; }

        /* ─── STATS ─────────────────────────────────────────────────── */
        .ab-stats {
          padding: clamp(56px, 8vw, 96px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-stats-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1px;
          margin-top: 48px;
        }
        .ab-stat-item {
          padding: 32px 36px;
          background: #080808;
          transition: background 0.2s;
          flex: 0 0 auto;
          min-width: 160px;
        }
        .ab-stat-item:hover { background: rgba(201,185,122,0.03); }
        .ab-stat-number {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1;
          color: #c9b97a;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
          white-space: nowrap;
        }
        .ab-stat-label {
          font-size: 11px;
          color: rgba(240,237,230,0.4);
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.5;
          max-width: 160px;
        }

        /* ─── WHY BEYOND ────────────────────────────────────────────── */
        .ab-why {
          padding: clamp(64px, 10vw, 120px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1px;
          margin-top: 48px;
        }
        .ab-why-card {
          padding: 32px 28px;
          background: #080808;
          display: flex;
          flex-direction: column;
          gap: 14px;
          border-left: 2px solid transparent;
          transition: background 0.2s, border-left-color 0.2s;
        }
        .ab-why-card:hover {
          background: rgba(201,185,122,0.025);
          border-left-color: rgba(201,185,122,0.3);
        }
        .ab-why-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 0.14em;
          color: rgba(201,185,122,0.4);
        }
        .ab-why-title {
          font-size: 17px;
          font-weight: 500;
          color: #f0ede6;
          line-height: 1.3;
        }
        .ab-why-body {
          font-size: 13px;
          line-height: 1.75;
          color: rgba(240,237,230,0.5);
          font-weight: 300;
        }

        /* ─── STORY ─────────────────────────────────────────────────── */
        .ab-story {
          padding: clamp(64px, 10vw, 120px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-story-inner {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: clamp(40px, 6vw, 80px);
          margin-top: 48px;
          align-items: start;
        }
        @media (max-width: 720px) {
          .ab-story-inner { grid-template-columns: 1fr; }
        }
        .ab-story-aside { position: sticky; top: 24px; }
        .ab-story-aside-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 0.04em;
          color: #f0ede6;
          margin: 0 0 12px;
          line-height: 1;
        }
        .ab-story-aside-sub {
          font-size: 12px;
          color: rgba(240,237,230,0.35);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          line-height: 1.6;
        }
        .ab-story-content { display: flex; flex-direction: column; gap: 20px; }
        .ab-story-p {
          font-size: 15px;
          line-height: 1.85;
          color: rgba(240,237,230,0.62);
          font-weight: 300;
          margin: 0;
        }
        .ab-story-p strong { color: #f0ede6; font-weight: 500; }

        /* ─── FOUNDERS ──────────────────────────────────────────────── */
        .ab-founders {
          padding: clamp(64px, 10vw, 120px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-founders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 48px;
        }
        .ab-founder-card {
          padding: 32px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid #c9b97a;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ab-founder-avatar {
          width: 52px;
          height: 52px;
          background: rgba(201,185,122,0.1);
          border: 1px solid rgba(201,185,122,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ab-founder-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 0.04em;
          color: #f0ede6;
          margin: 0;
          line-height: 1;
        }
        .ab-founder-role {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-top: 4px;
        }
        .ab-founder-bio {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(240,237,230,0.5);
          font-weight: 300;
        }
        .ab-founder-legal {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: rgba(240,237,230,0.2);
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* ─── HOW IT WORKS — static, two audience sections ─────────── */
        .ab-how {
          padding: clamp(64px, 10vw, 120px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* Audience block — label + grid */
        .ab-how-audience {
          margin-top: 48px;
        }
        .ab-how-audience + .ab-how-audience {
          margin-top: 56px;
          padding-top: 56px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        /* Audience heading row */
        .ab-how-audience-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
        }
        .ab-how-audience-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 3vw, 30px);
          letter-spacing: 0.04em;
          color: #f0ede6;
          line-height: 1;
        }
        .ab-how-audience-pill {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #080808;
          background: #c9b97a;
          padding: 4px 10px;
          flex-shrink: 0;
        }

        /* Steps grid */
        .ab-how-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1px;
          background: rgba(255,255,255,0.05);
        }
        .ab-how-step {
          padding: 28px 24px;
          background: #080808;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: background 0.2s;
        }
        .ab-how-step:hover { background: rgba(201,185,122,0.025); }
        .ab-how-step-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: rgba(201,185,122,0.2);
          line-height: 1;
        }
        .ab-how-step-title {
          font-size: 14px;
          font-weight: 500;
          color: #f0ede6;
        }
        .ab-how-step-body {
          font-size: 12px;
          line-height: 1.7;
          color: rgba(240,237,230,0.45);
          font-weight: 300;
        }

        /* ─── LEGAL ─────────────────────────────────────────────────── */
        .ab-legal {
          padding: clamp(48px, 7vw, 80px) 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ab-legal-card {
          padding: 28px 32px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-left: 3px solid rgba(201,185,122,0.3);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          flex-wrap: wrap;
          margin-top: 32px;
        }
        .ab-legal-block { display: flex; flex-direction: column; gap: 4px; }
        .ab-legal-label {
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.3);
        }
        .ab-legal-value {
          font-size: 14px;
          font-weight: 500;
          color: rgba(240,237,230,0.75);
        }

        /* ─── CTA ───────────────────────────────────────────────────── */
        .ab-cta {
          padding: clamp(80px, 12vw, 140px) 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ab-cta-wm {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(80px, 18vw, 240px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.02);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
        }
        .ab-cta-inner { position: relative; z-index: 1; }
        .ab-cta-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(36px, 7vw, 80px);
          line-height: 0.9;
          letter-spacing: 0.02em;
          color: #f0ede6;
          margin: 0 0 20px;
        }
        .ab-cta-sub {
          font-size: 14px;
          color: rgba(240,237,230,0.45);
          font-weight: 300;
          margin: 0 0 40px;
          letter-spacing: 0.04em;
        }
        .ab-cta-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ab-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #c9b97a;
          color: #080808;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          padding: 16px 32px;
          text-decoration: none;
          transition: opacity 0.18s, transform 0.15s;
        }
        .ab-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .ab-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: rgba(240,237,230,0.6);
          border: 1px solid rgba(255,255,255,0.12);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 15px 28px;
          text-decoration: none;
          transition: border-color 0.18s, color 0.18s, transform 0.15s;
        }
        .ab-btn-ghost:hover {
          border-color: rgba(201,185,122,0.4);
          color: #c9b97a;
          transform: translateY(-1px);
          opacity: 1;
        }
      `}</style>

      <div className="ab-root">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-wm" aria-hidden="true">BEYOND</div>
          <div className="ab-container">
            <div className="ab-hero-inner">
              <div className="ab-hero-eyebrow">Our Story</div>
              <h1 className="ab-hero-title">
                Live experiences<br />
                <span>start here.</span>
              </h1>
              <p className="ab-hero-body">
                Beyond is India&apos;s ticketing platform for the events that matter — college fests,
                underground gigs, intimate comedy nights, cultural shows, and everything in between.
                We exist for the moments that don&apos;t make it onto the big platforms.
              </p>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="ab-mission">
          <div className="ab-container">
            <div className="ab-section-label">What We Believe</div>
            <div className="ab-mission-grid">
              <h2 className="ab-mission-headline">
                India&apos;s live scene deserves better infrastructure.
              </h2>
              <div>
                <p className="ab-mission-body">
                  Every week, thousands of events happen across India — in college auditoriums, rooftop
                  venues, community halls, and open grounds. Most of them manage ticketing through
                  WhatsApp forwards and Google Forms. Organisers lose money to no-shows. Attendees
                  lose tickets in their inbox.
                </p>
                <p className="ab-mission-body">
                  We built Beyond because we&apos;ve been on both sides of that problem. As students who&apos;ve
                  organised fests and attended countless events, we know exactly where the experience
                  breaks down — and we&apos;ve spent the last year building the fix.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="ab-stats">
          <div className="ab-container">
            <div className="ab-section-label">The Opportunity</div>
            <div className="ab-stats-grid">
              {[
                { number: "₹3,500Cr+", label: "India's live events market size" },
                { number: "12,000+",   label: "College fests held annually in India" },
                { number: "95%",       label: "Of small events still use manual ticketing" },
                { number: "48 hrs",    label: "Avg setup time on large platforms" },
                { number: "< 30 min",  label: "Event setup time on Beyond" },
                { number: "3–5%",      label: "Our commission vs 15–20% industry average" },
              ].map((stat, i) => (
                <div key={i} className="ab-stat-item">
                  <div className="ab-stat-number">{stat.number}</div>
                  <div className="ab-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY BEYOND ── */}
        <section className="ab-why">
          <div className="ab-container">
            <div className="ab-section-label">Why Beyond</div>
            <div className="ab-why-grid">
              {[
                { title: "Built for India's indie scene",    body: "College fests, open mics, community events, underground gigs — platforms like BookMyShow are built for multiplexes and stadium tours. We're built for everything else." },
                { title: "Transparent, low commission",      body: "We charge 3–5% per ticket. That's it. No hidden fees, no per-city charges, no premium listing costs. You keep the majority of your revenue." },
                { title: "Instant QR tickets",               body: "Every buyer gets a scannable QR ticket the moment payment is confirmed. No printing, no manual lists, no chaos at the gate. Works offline too." },
                { title: "Real-time dashboard",              body: "Track ticket sales, revenue, and attendance live from any device. Know exactly how your event is doing at every moment — not just at the end." },
                { title: "Direct line to us",                body: "We're students. When you message us, you're not opening a support ticket — you're talking to the people who built the platform. We respond fast." },
                { title: "Zero upfront cost",                body: "List your event for free. We only earn when you sell. If your event doesn't sell, you owe us nothing. Our incentives are perfectly aligned with yours." },
              ].map((item, i) => (
                <div key={i} className="ab-why-card">
                  <div className="ab-why-num">0{i + 1}</div>
                  <div className="ab-why-title">{item.title}</div>
                  <div className="ab-why-body">{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STORY ── */}
        <section className="ab-story">
          <div className="ab-container">
            <div className="ab-section-label">The Story</div>
            <div className="ab-story-inner">
              <aside className="ab-story-aside">
                <p className="ab-story-aside-title">From a college problem to a platform</p>
                <p className="ab-story-aside-sub">India · 2024 → Present</p>
              </aside>
              <div className="ab-story-content">
                <p className="ab-story-p">
                  It started the way most real things do — with frustration. We were organising a college
                  event and couldn&apos;t find a single platform that didn&apos;t feel like it was built for
                  someone else. <strong>BookMyShow</strong> wanted a revenue cut that didn&apos;t make sense
                  for a 400-person college show. <strong>Insider</strong> had minimum commitments.
                  Google Forms gave us zero visibility into who&apos;d actually show up.
                </p>
                <p className="ab-story-p">
                  We started building Beyond as a side project — a simple ticketing tool for our own
                  events. Then friends started using it. Then friends of friends. We realised we&apos;d
                  stumbled onto a gap that nobody was filling: a ticketing platform genuinely built for
                  the smaller, scrappier, often more interesting end of India&apos;s events market.
                </p>
                <p className="ab-story-p">
                  Inspired by what <strong>Dice</strong> did for indie music in the UK, what
                  <strong> District</strong> is doing for nightlife, and what <strong>Swiggy Sences</strong> is
                  exploring for curated experiences — we want to do the same for India&apos;s grassroots
                  events culture. The college fests. The underground gigs. The comedy nights in a
                  60-seat café. The theatre runs that sell out through WhatsApp.
                </p>
                <p className="ab-story-p">
                  We&apos;re early. But we&apos;re building fast, we know the problem intimately, and we&apos;re
                  not going anywhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOUNDERS ── */}
        <section className="ab-founders">
          <div className="ab-container">
            <div className="ab-section-label">The Team</div>
            <div className="ab-founders-grid">
              {[
                {
                  name: "Harsh Pilankar",
                  role: "Co-Founder · Business & Growth",
                  bio: "Leads partnerships, organiser relations, and business development at Beyond. Has personally organised multiple college events and understands what bad ticketing infrastructure costs organisers. Talks to every new organiser on the platform himself — no middlemen.",
                },
                {
                  name: "Anant Sawant",
                  role: "Co-Founder · Product & Technology",
                  bio: "Built Beyond from scratch — the booking engine, Cashfree payment integration, QR ticketing system, organiser dashboard, and the entire platform architecture. An engineering student who turned a frustrating personal problem into production software used by real events.",
                },
              ].map((founder, i) => (
                <div key={i} className="ab-founder-card">
                  <div className="ab-founder-avatar">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="#c9b97a" strokeWidth="1.5">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="ab-founder-name">{founder.name}</h3>
                    <p className="ab-founder-role">{founder.role} · Beyond</p>
                  </div>
                  <p className="ab-founder-bio">{founder.bio}</p>
                  <p className="ab-founder-legal">Legal name: {founder.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS — static two-audience layout, no toggle ── */}
        <section className="ab-how">
          <div className="ab-container">
            <div className="ab-section-label">How It Works</div>

            {/* ── For Organisers ── */}
            <div className="ab-how-audience">
              <div className="ab-how-audience-header">
                <h2 className="ab-how-audience-title">For Organisers</h2>
                <span className="ab-how-audience-pill">List your event</span>
              </div>
              <div className="ab-how-grid">
                {organisersSteps.map((item, i) => (
                  <div key={i} className="ab-how-step">
                    <div className="ab-how-step-num">{item.step}</div>
                    <div className="ab-how-step-title">{item.title}</div>
                    <div className="ab-how-step-body">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── For Attendees ── */}
            <div className="ab-how-audience">
              <div className="ab-how-audience-header">
                <h2 className="ab-how-audience-title">For Attendees</h2>
                <span className="ab-how-audience-pill">Book your spot</span>
              </div>
              <div className="ab-how-grid">
                {attendeesSteps.map((item, i) => (
                  <div key={i} className="ab-how-step">
                    <div className="ab-how-step-num">{item.step}</div>
                    <div className="ab-how-step-title">{item.title}</div>
                    <div className="ab-how-step-body">{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── PLATFORM DETAILS / LEGAL ── */}
        <section className="ab-legal">
          <div className="ab-container">
            <div className="ab-section-label">Platform Details</div>
            <div className="ab-legal-card">
              {[
                { label: "Platform",            value: "Beyond" },
                { label: "Team", value: "Harsh Pilankar & Anant Sawant" },
                { label: "Country",             value: "India" },
                { label: "Owned by",     value: "CTX Growth Agency" },
                { label: "Contact",             value: "contactbeyondteam@gmail.com" },
              ].map((item, i) => (
                <div key={i} className="ab-legal-block">
                  <span className="ab-legal-label">{item.label}</span>
                  <span className="ab-legal-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ab-cta">
          <div className="ab-cta-wm" aria-hidden="true">LIST YOUR EVENT</div>
          <div className="ab-container">
            <div className="ab-cta-inner">
              <h2 className="ab-cta-title">
                Ready to go<br />beyond?
              </h2>
              <p className="ab-cta-sub">
                List your first event free. No commitments. No minimums.
              </p>
              <div className="ab-cta-buttons">
                <Link href="/events" className="ab-btn-primary">
                  Browse Events
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <a href="mailto:contactbeyondteam@gmail.com" className="ab-btn-ghost">
                  List Your Event
                </a>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}