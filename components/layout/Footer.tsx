import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .ftr-root {
          position: relative;
          width: 100%;
          border-top: 1px solid var(--color-border-on-dark-subtle, #1F1F1F);
          overflow: hidden;
        }

        /* Giant watermark behind footer */
        .ftr-wm {
          position: absolute;
          bottom: -0.1em;
          right: -0.03em;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(100px, 18vw, 260px);
          line-height: 1;
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.03);
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .ftr-inner {
          position: relative;
          z-index: 1;
          padding: 80px 80px 48px;
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        /* ── Top row ── */
        .ftr-top {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: start;
          gap: 40px;
        }

        /* Vertical divider */
        .ftr-divider {
          width: 1px;
          background: var(--color-border-on-dark-subtle, #1F1F1F);
          align-self: stretch;
          margin: 0 8px;
          flex-shrink: 0;
        }

        .ftr-logo {
          display: inline-flex;
          align-items: center;
          opacity: 1;
          transition: opacity 150ms ease;
          flex-shrink: 0;
        }
        .ftr-logo:hover { opacity: 0.6; }

        /* Tagline under logo */
        .ftr-tagline {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          margin-top: 10px;
          line-height: 1.6;
        }

        /* Nav links */
        .ftr-nav {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 2px;
        }
        .ftr-nav-link {
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-on-dark-tertiary, #A1A1A1);
          text-decoration: none;
          width: max-content;
          transition: color 150ms ease;
          position: relative;
        }
        .ftr-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 1px;
          background: var(--color-accent-primary, #c9b97a);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 200ms cubic-bezier(0.22,1,0.36,1);
        }
        .ftr-nav-link:hover {
          color: var(--color-text-on-dark-primary, #FAFAFA);
          opacity: 1;
        }
        .ftr-nav-link:hover::after { transform: scaleX(1); }

        /* CTA block */
        .ftr-cta {
          text-align: right;
          flex-shrink: 0;
        }
        .ftr-cta-label {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          margin-bottom: 12px;
        }
        .ftr-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: 1px solid var(--color-border-on-dark-strong, #4D4D4D);
          background: transparent;
          color: var(--color-text-on-dark-primary, #FAFAFA);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          text-decoration: none;
          border-radius: 0;
          transition: border-color 150ms ease, background 150ms ease, transform 150ms ease;
        }
        .ftr-cta-btn:hover {
          border-color: var(--color-accent-primary, #c9b97a);
          background: rgba(201,185,122,0.06);
          color: var(--color-accent-primary, #c9b97a);
          transform: translateY(-1px);
          opacity: 1;
        }

        /* ── Separator ── */
        .ftr-sep {
          height: 1px;
          background: var(--color-border-on-dark-subtle, #1F1F1F);
        }

        /* ── Bottom row ── */
        .ftr-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ftr-legal {
          font-size: 11px;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          line-height: 1.7;
          max-width: 560px;
          font-weight: 300;
        }
        .ftr-copy {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          .ftr-inner {
            padding: 48px 24px 40px;
            gap: 36px;
            align-items: center;
            text-align: center;
          }

          .ftr-wm {
            right: 50%;
            transform: translateX(50%);
          }

          /* Stack logo, divider, nav vertically and center */
          .ftr-top {
            grid-template-columns: 1fr;
            gap: 28px;
            justify-items: center;
            width: 100%;
          }

          /* Logo block */
          .ftr-top > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .ftr-tagline {
            text-align: center;
            margin-top: 8px;
          }

          /* Hide vertical divider on mobile, show horizontal one instead */
          .ftr-divider {
            display: none;
          }

          /* Horizontal divider between logo and nav on mobile */
          .ftr-top > div:first-child::after {
            content: '';
            display: block;
            width: 40px;
            height: 1px;
            background: var(--color-border-on-dark-subtle, #1F1F1F);
            margin-top: 24px;
          }

          /* Center nav links */
          .ftr-nav {
            align-items: center;
            gap: 16px;
          }
          .ftr-nav-link {
            width: auto;
          }
          .ftr-nav-link::after {
            transform-origin: center;
          }

          /* Hide CTA on mobile */
          .ftr-cta {
            display: none;
          }

          /* Bottom row stacked and centered */
          .ftr-bottom {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 12px;
          }
          .ftr-legal {
            text-align: center;
            max-width: 100%;
          }
        }
      `}</style>

      <footer className="ftr-root">

        {/* Ghost watermark */}
        <div className="ftr-wm" aria-hidden="true">BEYOND</div>

        <div className="container ftr-inner">

          {/* ── TOP ROW ── */}
          <div className="ftr-top">

            {/* Logo + tagline */}
            <div>
              <Link href="/" className="ftr-logo" aria-label="Beyond — Home">
                <Image
                  src="/logo.svg"
                  alt="Beyond"
                  width={110}
                  height={36}
                  style={{ width: "auto", height: "auto" }}
                />
              </Link>
              <p className="ftr-tagline">India&apos;s Event Platform</p>
            </div>

            {/* Vertical divider — hidden on mobile */}
            <div className="ftr-divider" aria-hidden="true" />

            {/* Nav links */}
            <nav aria-label="Footer navigation">
              <div className="ftr-nav">
                <Link href="/terms_and_conditions" className="ftr-nav-link">Refund Policy</Link>
                <Link href="/terms_and_conditions" className="ftr-nav-link">Terms & Conditions</Link>
                <Link href="/privacy_policy" className="ftr-nav-link">Privacy Policy</Link>
                <Link href="/disclaimer" className="ftr-nav-link">Disclaimer</Link>
              </div>
            </nav>

          </div>

          {/* ── SEPARATOR ── */}
          <div className="ftr-sep" aria-hidden="true" />

          {/* ── BOTTOM ROW ── */}
          <div className="ftr-bottom">
            <p className="ftr-legal">
              By accessing this page you confirm that you have read, understood
              and agree to our{" "}
              <Link href="/refund_policy" style={{ color: "inherit", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
              Refund Policy
              </Link>
              ,{" "}
              <Link href="/terms_and_conditions" style={{ color: "inherit", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                Terms of Service
              </Link>
              ,{" "}
              <Link href="/privacy_policy" style={{ color: "inherit", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                Privacy Policy
              </Link>{" "}
              and Guidelines. All rights reserved.
            </p>
            <span className="ftr-copy">
              © {new Date().getFullYear()} Beyond
            </span>
          </div>

        </div>
      </footer>
    </>
  );
}