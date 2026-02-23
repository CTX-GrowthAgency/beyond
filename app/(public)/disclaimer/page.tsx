export default function DisclaimerPage() {
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
          <h1 className="legal-title">Disclaimer</h1>
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
                ["#general",       "General Disclaimer"],
                ["#accuracy",      "Accuracy of Information"],
                ["#events",        "Event Disclaimer"],
                ["#thirdparty",    "Third-Party Content"],
                ["#links",         "External Links"],
                ["#liability",     "Liability"],
                ["#venue",         "Venue & Safety"],
                ["#changes",       "Changes"],
                ["#contact",       "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            <div className="legal-warning">
              <p>
                The information provided on this platform is for general informational purposes only.
                Beyond makes no representations or warranties of any kind, express or implied, regarding
                the completeness, accuracy, or reliability of any content. Read this disclaimer carefully
                before using our platform.
              </p>
            </div>

            <section id="general" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">General Disclaimer</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="accuracy" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Accuracy of Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Event details including dates, times, lineups, and venues are subject to change]</li>
                <li>[Example: Beyond endeavours to keep all listings accurate but cannot guarantee completeness]</li>
                <li>[Example: Ticket prices may vary and are set by event organisers]</li>
              </ul>
            </section>

            <section id="events" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">Event Disclaimer</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <div className="legal-highlight">
                <p>[Example: Beyond acts as a ticketing platform only. We are not the event organiser and accept no responsibility for the quality, safety, or conduct of any event listed on our platform.]</p>
              </div>
              <p className="legal-p">[Additional content here.]</p>
              <ul className="legal-ul">
                <li>[Example: Attendance is at your own risk]</li>
                <li>[Example: Age restrictions and entry requirements are set by the event organiser]</li>
                <li>[Example: Event cancellations or changes are the responsibility of the organiser]</li>
              </ul>
            </section>

            <section id="thirdparty" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Third-Party Content</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Artist descriptions and event details are provided by organisers]</li>
                <li>[Example: Beyond is not responsible for inaccuracies in organiser-submitted content]</li>
                <li>[Example: Images and media may be subject to third-party copyright]</li>
              </ul>
            </section>

            <section id="links" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">External Links</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
            </section>

            <section id="liability" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Limitation of Liability</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <div className="legal-warning">
                <p>[Example: Beyond shall not be held liable for any loss, injury, or damage sustained as a result of attending an event booked through our platform, including but not limited to personal injury, property damage, or financial loss.]</p>
              </div>
            </section>

            <section id="venue" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Venue & Safety</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here.]</p>
              <ul className="legal-ul">
                <li>[Example: Venue rules and safety regulations must be followed at all times]</li>
                <li>[Example: Beyond is not responsible for decisions made by venue management]</li>
                <li>[Example: Medical or safety emergencies should be reported to venue staff]</li>
              </ul>
            </section>

            <section id="changes" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Changes to This Disclaimer</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">[Your content goes here. E.g., "Beyond reserves the right to update this disclaimer at any time. Continued use of the platform following any changes constitutes your acceptance of the revised disclaimer."]</p>
            </section>

            <section id="contact" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Contact</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">If you have questions or concerns regarding this disclaimer, please contact us:</p>
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
            <a href="/terms">Terms & Conditions</a>
          </div>
        </div>

      </div>
    </>
  );
}