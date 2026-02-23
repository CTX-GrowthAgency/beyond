export default function TermsAndConditionsPage() {
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
          font-size: clamp(42px, 8vw, 88px);
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
        .legal-meta-dot { color: rgba(240,237,230,0.2); }

        .legal-body {
          max-width: 1100px;
          margin: 0 auto;
          padding: 56px clamp(20px, 5vw, 80px) 100px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 64px;
        }
        @media (max-width: 760px) {
          .legal-body {
            grid-template-columns: 1fr;
            gap: 0;
            padding-top: 36px;
          }
        }

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
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        @media (max-width: 760px) {
          .legal-toc-list { flex-direction: row; flex-wrap: wrap; gap: 6px 12px; }
        }
        .legal-toc-item a {
          display: block;
          font-size: 13px;
          color: rgba(240,237,230,0.45);
          text-decoration: none;
          padding: 6px 0 6px 12px;
          border-left: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
          line-height: 1.4;
        }
        @media (max-width: 760px) {
          .legal-toc-item a { border-left: none; padding: 4px 0; font-size: 12px; }
        }
        .legal-toc-item a:hover { color: #c9b97a; border-left-color: #c9b97a; }

        .legal-content { min-width: 0; }

        .legal-section {
          margin-bottom: 52px;
          scroll-margin-top: 32px;
        }
        @media (max-width: 640px) { .legal-section { margin-bottom: 40px; } }

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

        .legal-p {
          font-size: 15px;
          line-height: 1.82;
          color: rgba(240,237,230,0.7);
          font-weight: 300;
          margin: 0 0 16px;
        }
        @media (max-width: 640px) { .legal-p { font-size: 14px; } }
        .legal-p:last-child { margin-bottom: 0; }

        .legal-ul {
          margin: 8px 0 16px;
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
        @media (max-width: 640px) { .legal-ul li { font-size: 14px; } }
        .legal-ul li::before {
          content: '—';
          color: #c9b97a;
          flex-shrink: 0;
          margin-top: 1px;
          opacity: 0.7;
        }

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

        .legal-warning {
          background: rgba(224,82,82,0.06);
          border: 1px solid rgba(224,82,82,0.2);
          border-left: 3px solid #e05252;
          border-radius: 4px;
          padding: 16px 20px;
          margin: 20px 0;
        }
        .legal-warning p {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(240,237,230,0.7);
          margin: 0;
        }

        .legal-link {
          color: #c9b97a;
          text-decoration: none;
          border-bottom: 1px solid rgba(201,185,122,0.3);
          transition: border-color 0.2s;
        }
        .legal-link:hover { border-bottom-color: #c9b97a; }

        .legal-subheading {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(240,237,230,0.6);
          margin: 24px 0 10px;
        }

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
        .legal-footer-text { font-size: 12px; color: rgba(240,237,230,0.25); }
        .legal-footer-links { display: flex; gap: 20px; }
        .legal-footer-links a {
          font-size: 12px;
          color: rgba(240,237,230,0.35);
          text-decoration: none;
          transition: color 0.2s;
        }
        .legal-footer-links a:hover { color: #c9b97a; }
      `}</style>

      <div className="legal-root">

        <div className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Terms & Conditions</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Effective: [DATE]</span>
            <span className="legal-meta-dot">·</span>
            <span>Last updated: [DATE]</span>
          </div>
        </div>

        <div className="legal-body">

          <nav className="legal-toc">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#acceptance",    "Acceptance"],
                ["#platform",      "Use of Platform"],
                ["#accounts",      "Accounts"],
                ["#tickets",       "Tickets & Bookings"],
                ["#payments",      "Payments"],
                ["#refunds",       "Refunds & Cancellations"],
                ["#conduct",       "User Conduct"],
                ["#ip",            "Intellectual Property"],
                ["#liability",     "Limitation of Liability"],
                ["#indemnity",     "Indemnification"],
                ["#termination",   "Termination"],
                ["#governing",     "Governing Law"],
                ["#contact",       "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            <div className="legal-highlight">
              <p>
                These Terms and Conditions govern your use of the Beyond platform and any ticket purchases
                made through it. By accessing our platform or completing a booking, you agree to be bound
                by these terms. Please read them carefully before proceeding.
              </p>
            </div>

            <section id="acceptance" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Acceptance of Terms</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="platform" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Use of Platform</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: You must be 18 years or older to purchase tickets]</li>
                <li>[Example: You agree not to misuse or attempt to disrupt the platform]</li>
                <li>[Example: Commercial resale of tickets is strictly prohibited]</li>
              </ul>
            </section>

            <section id="accounts" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">Accounts & Registration</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="tickets" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Tickets & Bookings</h2>
              <div className="legal-section-divider" />

              <div className="legal-subheading">Ticket Validity</div>
              <p className="legal-p">[Your content goes here.]</p>

              <div className="legal-subheading">Entry Requirements</div>
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Valid photo ID may be required at the venue]</li>
                <li>[Example: The QR code on your ticket must be scannable at entry]</li>
                <li>[Example: Each QR code is valid for a single entry only]</li>
              </ul>

              <div className="legal-subheading">Transferability</div>
              <p className="legal-p">[Your content goes here.]</p>
              <div className="legal-warning">
                <p>[Example: Tickets are non-transferable. Any resale or transfer may result in cancellation without refund.]</p>
              </div>
            </section>

            <section id="payments" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Payments</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: All prices are in Indian Rupees (INR) and inclusive of applicable taxes]</li>
                <li>[Example: Payment is processed securely via Cashfree Payment Gateway]</li>
                <li>[Example: Beyond does not store your payment card details]</li>
              </ul>
            </section>

            <section id="refunds" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Refunds & Cancellations</h2>
              <div className="legal-section-divider" />

              <div className="legal-subheading">Cancellations by You</div>
              <p className="legal-p">[Your content goes here.]</p>

              <div className="legal-subheading">Event Cancellation or Postponement</div>
              <p className="legal-p">[Your content goes here.]</p>

              <div className="legal-highlight">
                <p>[Example: In the event of cancellation or significant postponement, ticket holders will be notified and refunds processed within [X] business days.]</p>
              </div>
            </section>

            <section id="conduct" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">User Conduct</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: You agree to comply with all venue rules and applicable laws]</li>
                <li>[Example: Prohibited items and behaviour at venues]</li>
                <li>[Example: Beyond reserves the right to refuse entry for disruptive behaviour]</li>
              </ul>
            </section>

            <section id="ip" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Intellectual Property</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="liability" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Limitation of Liability</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <div className="legal-warning">
                <p>[Example: To the maximum extent permitted by law, Beyond shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform or attendance at any event.]</p>
              </div>
            </section>

            <section id="indemnity" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">Indemnification</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="termination" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Termination</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="governing" className="legal-section">
              <div className="legal-section-number">12</div>
              <h2 className="legal-section-heading">Governing Law & Jurisdiction</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here. E.g., "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of [City], Goa."]</p>
            </section>

            <section id="contact" className="legal-section">
              <div className="legal-section-number">13</div>
              <h2 className="legal-section-heading">Contact Us</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For any queries regarding these Terms, please reach out:</p>
              <div className="legal-contact-card">
                <p><strong style={{ color: "#f0ede6" }}>Beyond</strong></p>
                <p>[Company address]</p>
                <p>Email: <a href="mailto:legal@beyondgoa.com" className="legal-link">legal@beyondgoa.com</a></p>
                <p>WhatsApp: <a href="tel:[number]" className="legal-link">[phone number]</a></p>
              </div>
            </section>

          </div>
        </div>

        <div className="legal-footer">
          <span className="legal-footer-text">© {new Date().getFullYear()} Beyond. All rights reserved.</span>
          <div className="legal-footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </>
  );
}