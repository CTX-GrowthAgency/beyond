import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Beyond",
  description: "Get in touch with the Beyond team for event listings, partnerships, or booking support.",
};

export default function ContactPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        /* ── Animations ── */
        @keyframes ct-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ct-line {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes ct-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .ct-anim { animation: ct-up 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .ct-d1 { animation-delay: 0.05s; }
        .ct-d2 { animation-delay: 0.15s; }
        .ct-d3 { animation-delay: 0.25s; }
        .ct-d4 { animation-delay: 0.35s; }
        .ct-d5 { animation-delay: 0.45s; }

        /* ── Page root ── */
        .ct-root {
          min-height: 80vh;
          padding: clamp(60px, 10vw, 120px) 0 clamp(80px, 12vw, 140px);
          position: relative;
          overflow: hidden;
        }

        /* Background grid lines */
        .ct-grid {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 100%);
        }

        /* Gold glow blob */
        .ct-glow {
          position: absolute;
          top: -80px; right: -120px;
          width: 520px; height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,185,122,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .ct-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
        }

        /* ── Header ── */
        .ct-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-bottom: 20px;
        }
        .ct-eyebrow::before {
          content: '';
          display: block;
          width: 24px; height: 1px;
          background: #c9b97a;
          animation: ct-line 0.5s ease 0.1s both;
          transform-origin: left;
        }

        .ct-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 10vw, 96px);
          line-height: 0.9;
          letter-spacing: 0.01em;
          color: #FAFAFA;
          margin: 0 0 24px;
        }

        .ct-heading span {
          background: linear-gradient(90deg, #c9b97a 0%, #f0e5b0 40%, #c9b97a 65%, #a89660 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ct-shimmer 4s linear infinite;
        }

        .ct-sub {
          font-size: 14px;
          font-weight: 300;
          line-height: 1.75;
          color: #6F6F6F;
          max-width: 440px;
          margin: 0 0 56px;
        }

        /* ── Contact cards ── */
        .ct-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 48px;
        }

        @media (max-width: 560px) {
          .ct-cards { grid-template-columns: 1fr; }
        }

        .ct-card {
          background: #080808;
          padding: 32px 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: background 0.2s ease;
          group: true;
        }

        .ct-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #c9b97a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1);
        }

        .ct-card:hover { background: rgba(201,185,122,0.03); }
        .ct-card:hover::after { transform: scaleX(1); }

        .ct-card-icon {
          width: 40px; height: 40px;
          border: 1px solid rgba(201,185,122,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: border-color 0.2s, background 0.2s;
        }
        .ct-card:hover .ct-card-icon {
          border-color: rgba(201,185,122,0.5);
          background: rgba(201,185,122,0.06);
        }

        .ct-card-label {
          font-size: 9px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #c9b97a;
          font-weight: 600;
        }

        .ct-card-value {
          font-size: 15px;
          font-weight: 500;
          color: #FAFAFA;
          line-height: 1.4;
          word-break: break-all;
        }

        .ct-card-hint {
          font-size: 11px;
          color: #4D4D4D;
          font-weight: 300;
          margin-top: auto;
          padding-top: 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        /* Arrow on hover */
        .ct-card-arrow {
          position: absolute;
          top: 28px; right: 24px;
          color: rgba(201,185,122,0.3);
          transition: color 0.2s, transform 0.2s;
        }
        .ct-card:hover .ct-card-arrow {
          color: #c9b97a;
          transform: translate(2px, -2px);
        }

        /* ── "For event listings" banner ── */
        .ct-banner {
          border: 1px solid rgba(201,185,122,0.15);
          background: rgba(201,185,122,0.03);
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ct-banner-text {
          font-size: 12px;
          letter-spacing: 0.05em;
          color: #A1A1A1;
          font-weight: 300;
          line-height: 1.6;
        }

        .ct-banner-text strong {
          color: #FAFAFA;
          font-weight: 500;
          display: block;
          font-size: 14px;
          margin-bottom: 4px;
          letter-spacing: 0.02em;
        }

        .ct-banner-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          background: #c9b97a;
          color: #080808;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity 0.18s, transform 0.15s;
        }
        .ct-banner-btn:hover { opacity: 0.85; transform: translateY(-1px); }

        /* ── Back link ── */
        .ct-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.3);
          text-decoration: none;
          margin-top: 48px;
          transition: color 0.18s;
        }
        .ct-back:hover { color: #c9b97a; }
        .ct-back svg { transition: transform 0.18s; }
        .ct-back:hover svg { transform: translateX(-3px); }

        /* ── Watermark ── */
        .ct-wm {
          position: absolute;
          bottom: -0.05em;
          right: -0.02em;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(120px, 22vw, 320px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.025);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        @media (max-width: 640px) {
          .ct-banner { flex-direction: column; align-items: flex-start; }
          .ct-banner-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="ct-root">
        <div className="ct-grid" aria-hidden="true" />
        <div className="ct-glow" aria-hidden="true" />
        <div className="ct-wm" aria-hidden="true">SAY HI</div>

        <div className="container">

            {/* ── Back ── */}
            <Link href="/" className="ct-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to home
            </Link>


          <div className="ct-inner">

            {/* ── Header ── */}
            <p className="ct-eyebrow ct-anim ct-d1">Get in touch</p>

            <h1 className="ct-heading ct-anim ct-d2">
              Let&apos;s<br /><span>Talk.</span>
            </h1>

            <p className="ct-sub ct-anim ct-d3">
              Whether you&apos;re looking to list an event, need help with a booking,
              or just want to say hello — we&apos;re right here.
            </p>

            {/* ── Contact cards ── */}
            <div className="ct-cards ct-anim ct-d4">

              {/* Email */}
              <a href="mailto:contactbeyondteam@gmail.com" className="ct-card">
                <div className="ct-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#c9b97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <p className="ct-card-label">Email us</p>
                  <p className="ct-card-value">contactbeyondteam@gmail.com</p>
                </div>
                <p className="ct-card-hint">We reply within 24 hours</p>
                <span className="ct-card-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>

              {/* Phone */}
              <a href="tel:+919699517508" className="ct-card">
                <div className="ct-card-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#c9b97a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
                  </svg>
                </div>
                <div>
                  <p className="ct-card-label">Call us</p>
                  <p className="ct-card-value">+91 96995 17508</p>
                </div>
                <p className="ct-card-hint">Mon – Sat, 10am – 7pm IST</p>
                <span className="ct-card-arrow" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}