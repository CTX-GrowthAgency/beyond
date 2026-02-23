export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .legal-root {
          min-height: 100vh;
          background: #080808;
          color: #f0ede6;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Header ── */
        .legal-header {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 80px) clamp(32px, 4vw, 56px);
          max-width: 1100px;
          margin: 0 auto;
        }
        .legal-eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-bottom: 14px;
        }
        .legal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(48px, 8vw, 88px);
          line-height: 0.92;
          letter-spacing: 0.02em;
          color: #f0ede6;
          margin: 0 0 20px;
        }
        .legal-meta {
          font-size: 13px;
          color: rgba(240,237,230,0.4);
          display: flex;
          flex-wrap: wrap;
          gap: 8px 20px;
        }
        .legal-meta-dot {
          color: rgba(240,237,230,0.2);
        }

        /* ── Body layout ── */
        .legal-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 80px) 100px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 64px;
          padding-top: 56px;
        }
        @media (max-width: 760px) {
          .legal-body {
            grid-template-columns: 1fr;
            gap: 0;
            padding-top: 36px;
          }
        }

        /* ── TOC sidebar ── */
        .legal-toc {
          position: sticky;
          top: 32px;
          align-self: start;
        }
        @media (max-width: 760px) {
          .legal-toc {
            position: static;
            margin-bottom: 36px;
            padding-bottom: 28px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
          }
        }
        .legal-toc-label {
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.3);
          margin-bottom: 16px;
        }
        .legal-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        @media (max-width: 760px) {
          .legal-toc-list {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 6px 12px;
          }
        }
        .legal-toc-item a {
          display: block;
          font-size: 13px;
          color: rgba(240,237,230,0.45);
          text-decoration: none;
          padding: 6px 0;
          border-left: 2px solid transparent;
          padding-left: 12px;
          transition: color 0.2s, border-color 0.2s;
          line-height: 1.4;
        }
        @media (max-width: 760px) {
          .legal-toc-item a {
            border-left: none;
            border-bottom: 1px solid rgba(201,185,122,0.2);
            padding: 4px 0;
            font-size: 12px;
          }
        }
        .legal-toc-item a:hover {
          color: #c9b97a;
          border-left-color: #c9b97a;
        }

        /* ── Content ── */
        .legal-content {
          min-width: 0;
        }

        /* Section */
        .legal-section {
          margin-bottom: 52px;
          scroll-margin-top: 32px;
        }
        @media (max-width: 640px) {
          .legal-section { margin-bottom: 40px; }
        }

        .legal-section-number {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #c9b97a;
          margin-bottom: 10px;
          opacity: 0.8;
        }
        .legal-section-heading {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(22px, 3vw, 28px);
          letter-spacing: 0.04em;
          color: #f0ede6;
          margin: 0 0 18px;
          line-height: 1.1;
        }
        .legal-section-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(201,185,122,0.3), transparent);
          margin-bottom: 20px;
        }

        /* Text */
        .legal-p {
          font-size: 15px;
          line-height: 1.82;
          color: rgba(240,237,230,0.7);
          font-weight: 300;
          margin: 0 0 16px;
        }
        @media (max-width: 640px) {
          .legal-p { font-size: 14px; }
        }
        .legal-p:last-child { margin-bottom: 0; }

        /* List */
        .legal-ul {
          margin: 8px 0 16px 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .legal-ul li {
          display: flex;
          gap: 10px;
          font-size: 15px;
          line-height: 1.7;
          color: rgba(240,237,230,0.7);
          font-weight: 300;
        }
        @media (max-width: 640px) {
          .legal-ul li { font-size: 14px; }
        }
        .legal-ul li::before {
          content: '—';
          color: #c9b97a;
          flex-shrink: 0;
          margin-top: 1px;
          opacity: 0.7;
        }

        /* Highlight box */
        .legal-highlight {
          background: rgba(201,185,122,0.06);
          border: 1px solid rgba(201,185,122,0.2);
          border-left: 3px solid #c9b97a;
          border-radius: 4px;
          padding: 16px 20px;
          margin: 20px 0;
        }
        .legal-highlight p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(240,237,230,0.75);
          margin: 0;
          font-weight: 400;
        }

        /* Inline link */
        .legal-link {
          color: #c9b97a;
          text-decoration: none;
          border-bottom: 1px solid rgba(201,185,122,0.3);
          transition: border-color 0.2s;
        }
        .legal-link:hover { border-bottom-color: #c9b97a; }

        /* Sub-heading inside section */
        .legal-subheading {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.6);
          margin: 24px 0 10px;
        }

        /* Contact card */
        .legal-contact-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 22px 24px;
          margin-top: 16px;
        }
        .legal-contact-card p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(240,237,230,0.65);
          margin: 0 0 4px;
        }
        .legal-contact-card p:last-child { margin-bottom: 0; }

        /* Footer */
        .legal-footer {
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px clamp(20px, 5vw, 80px) 60px;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .legal-footer-text {
          font-size: 12px;
          color: rgba(240,237,230,0.25);
        }
        .legal-footer-links {
          display: flex;
          gap: 20px;
        }
        .legal-footer-links a {
          font-size: 12px;
          color: rgba(240,237,230,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .legal-footer-links a:hover { color: #c9b97a; }
      `}</style>

      <div className="legal-root">

        {/* ── Header ── */}
        <div className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Effective: [DATE]</span>
            <span className="legal-meta-dot">·</span>
            <span>Last updated: [DATE]</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="legal-body">

          {/* TOC */}
          <nav className="legal-toc">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#overview",         "Overview"],
                ["#information",      "Information We Collect"],
                ["#use",              "How We Use It"],
                ["#sharing",          "Sharing & Disclosure"],
                ["#cookies",          "Cookies"],
                ["#retention",        "Data Retention"],
                ["#rights",           "Your Rights"],
                ["#security",         "Security"],
                ["#children",         "Children"],
                ["#changes",          "Changes"],
                ["#contact",          "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Content */}
          <div className="legal-content">

            <div className="legal-highlight">
              <p>
                This Privacy Policy explains how Beyond ("we", "us", "our") collects, uses, and protects
                your personal information when you use our platform to discover and book event tickets.
                Please read it carefully.
              </p>
            </div>

            {/* 1 */}
            <section id="overview" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Overview</h2>
              <div className="legal-section-divider" />
              {/* ↓ YOUR CONTENT HERE */}
              <p className="legal-p">[Your overview / introduction content goes here.]</p>
            </section>

            {/* 2 */}
            <section id="information" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Information We Collect</h2>
              <div className="legal-section-divider" />

              <div className="legal-subheading">Information you provide</div>
              <p className="legal-p">[Content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Name, email address, phone number]</li>
                <li>[Example: Payment information]</li>
                <li>[Example: Booking and ticket details]</li>
              </ul>

              <div className="legal-subheading">Information collected automatically</div>
              <p className="legal-p">[Content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Device type and browser]</li>
                <li>[Example: IP address and location data]</li>
                <li>[Example: Usage data and analytics]</li>
              </ul>
            </section>

            {/* 3 */}
            <section id="use" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">How We Use Your Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: To process bookings and send confirmations]</li>
                <li>[Example: To send ticket QR codes via email and WhatsApp]</li>
                <li>[Example: To improve our platform and services]</li>
                <li>[Example: To comply with legal obligations]</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="sharing" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Sharing & Disclosure</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Payment processors (Cashfree)]</li>
                <li>[Example: Email and messaging services (Resend, WhatsApp)]</li>
                <li>[Example: Analytics providers]</li>
                <li>[Example: Law enforcement when required by law]</li>
              </ul>
            </section>

            {/* 5 */}
            <section id="cookies" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Cookies & Tracking</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
            </section>

            {/* 6 */}
            <section id="retention" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Data Retention</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
            </section>

            {/* 7 */}
            <section id="rights" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Your Rights</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Right to access your personal data]</li>
                <li>[Example: Right to request correction or deletion]</li>
                <li>[Example: Right to withdraw consent]</li>
                <li>[Example: Right to lodge a complaint]</li>
              </ul>
            </section>

            {/* 8 */}
            <section id="security" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Security</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
            </section>

            {/* 9 */}
            <section id="children" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Children's Privacy</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
            </section>

            {/* 10 */}
            <section id="changes" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">Changes to This Policy</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Content goes here.]</p>
            </section>

            {/* 11 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Contact Us</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:</p>
              <div className="legal-contact-card">
                <p><strong style={{ color: "#f0ede6" }}>Beyond</strong></p>
                <p>[Company address]</p>
                <p>Email: <a href="mailto:privacy@beyondgoa.com" className="legal-link">privacy@beyondgoa.com</a></p>
                <p>WhatsApp: <a href="tel:[number]" className="legal-link">[phone number]</a></p>
              </div>
            </section>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="legal-footer">
          <span className="legal-footer-text">© {new Date().getFullYear()} Beyond. All rights reserved.</span>
          <div className="legal-footer-links">
            <a href="/terms">Terms & Conditions</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </>
  );
}