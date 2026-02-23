export default function DisclaimerPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        .legal-root { min-height:100vh; background:#080808; color:#f0ede6; font-family:'DM Sans',sans-serif; }
        .legal-header { border-bottom:1px solid rgba(255,255,255,0.07); padding:clamp(40px,6vw,80px) clamp(20px,5vw,80px) clamp(32px,4vw,56px); max-width:1100px; margin:0 auto; }
        .legal-eyebrow { font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#c9b97a; margin-bottom:14px; }
        .legal-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(48px,8vw,88px); line-height:0.92; letter-spacing:0.02em; color:#f0ede6; margin:0 0 20px; }
        .legal-meta { font-size:13px; color:rgba(240,237,230,0.4); display:flex; flex-wrap:wrap; gap:8px 20px; }
        .legal-meta-dot { color:rgba(240,237,230,0.2); }
        .legal-body { max-width:1100px; margin:0 auto; padding:56px clamp(20px,5vw,80px) 100px; display:grid; grid-template-columns:220px 1fr; gap:64px; }
        @media(max-width:760px){ .legal-body { grid-template-columns:1fr; gap:0; padding-top:36px; } }
        .legal-toc { position:sticky; top:32px; align-self:start; }
        @media(max-width:760px){ .legal-toc { position:static; margin-bottom:36px; padding-bottom:28px; border-bottom:1px solid rgba(255,255,255,0.07); } }
        .legal-toc-label { font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:rgba(240,237,230,0.3); margin-bottom:16px; }
        .legal-toc-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:2px; }
        @media(max-width:760px){ .legal-toc-list { flex-direction:row; flex-wrap:wrap; gap:6px 12px; } }
        .legal-toc-item a { display:block; font-size:13px; color:rgba(240,237,230,0.45); text-decoration:none; padding:6px 0 6px 12px; border-left:2px solid transparent; transition:color 0.2s,border-color 0.2s; line-height:1.4; }
        @media(max-width:760px){ .legal-toc-item a { border-left:none; padding:4px 0; font-size:12px; } }
        .legal-toc-item a:hover { color:#c9b97a; border-left-color:#c9b97a; }
        .legal-content { min-width:0; }
        .legal-section { margin-bottom:52px; scroll-margin-top:32px; }
        @media(max-width:640px){ .legal-section { margin-bottom:40px; } }
        .legal-section-number { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#c9b97a; margin-bottom:10px; opacity:0.8; }
        .legal-section-heading { font-family:'Bebas Neue',sans-serif; font-size:clamp(22px,3vw,28px); letter-spacing:0.04em; color:#f0ede6; margin:0 0 18px; line-height:1.1; }
        .legal-section-divider { height:1px; background:linear-gradient(to right,rgba(201,185,122,0.3),transparent); margin-bottom:20px; }
        .legal-p { font-size:15px; line-height:1.82; color:rgba(240,237,230,0.7); font-weight:300; margin:0 0 16px; }
        @media(max-width:640px){ .legal-p { font-size:14px; } }
        .legal-p:last-child { margin-bottom:0; }
        .legal-ul { margin:8px 0 16px; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
        .legal-ul li { display:flex; gap:10px; font-size:15px; line-height:1.7; color:rgba(240,237,230,0.7); font-weight:300; }
        @media(max-width:640px){ .legal-ul li { font-size:14px; } }
        .legal-ul li::before { content:'—'; color:#c9b97a; flex-shrink:0; margin-top:1px; opacity:0.7; }
        .legal-highlight { background:rgba(201,185,122,0.06); border:1px solid rgba(201,185,122,0.2); border-left:3px solid #c9b97a; border-radius:4px; padding:16px 20px; margin:20px 0; }
        .legal-highlight p { font-size:14px; line-height:1.7; color:rgba(240,237,230,0.75); margin:0; font-weight:400; }
        .legal-warning { background:rgba(224,82,82,0.06); border:1px solid rgba(224,82,82,0.2); border-left:3px solid #e05252; border-radius:4px; padding:16px 20px; margin:20px 0; }
        .legal-warning p { font-size:14px; line-height:1.7; color:rgba(240,237,230,0.7); margin:0; }
        .legal-link { color:#c9b97a; text-decoration:none; border-bottom:1px solid rgba(201,185,122,0.3); transition:border-color 0.2s; }
        .legal-link:hover { border-bottom-color:#c9b97a; }
        .legal-subheading { font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:rgba(240,237,230,0.6); margin:24px 0 10px; }
        .legal-contact-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:22px 24px; margin-top:16px; }
        .legal-contact-card p { font-size:14px; line-height:1.7; color:rgba(240,237,230,0.65); margin:0 0 4px; }
        .legal-contact-card p:last-child { margin-bottom:0; }
        .legal-ack-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:4px; }
        @media(max-width:480px){ .legal-ack-grid { grid-template-columns:1fr; } }
        .legal-ack-item { display:flex; gap:10px; align-items:flex-start; background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:12px 14px; }
        .legal-ack-item svg { flex-shrink:0; margin-top:1px; }
        .legal-ack-item span { font-size:13px; color:rgba(240,237,230,0.65); line-height:1.5; font-weight:300; }
        .legal-footer { max-width:1100px; margin:0 auto; padding:28px clamp(20px,5vw,80px) 60px; border-top:1px solid rgba(255,255,255,0.07); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; }
        .legal-footer-text { font-size:12px; color:rgba(240,237,230,0.25); }
        .legal-footer-links { display:flex; gap:20px; }
        .legal-footer-links a { font-size:12px; color:rgba(240,237,230,0.35); text-decoration:none; transition:color 0.2s; }
        .legal-footer-links a:hover { color:#c9b97a; }
      `}</style>

      <div className="legal-root">

        {/* ── Header ── */}
        <div className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Disclaimer</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Last Updated: February 21, 2026</span>
          </div>
        </div>

        <div className="legal-body">

          {/* TOC */}
          <nav className="legal-toc">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#trial",          "Trial Platform"],
                ["#facilitator",    "Technology Facilitator"],
                ["#warranties",     "No Warranties"],
                ["#forcemajeure",   "Force Majeure"],
                ["#thirdparty",     "Third-Party Services"],
                ["#userresp",       "User Responsibility"],
                ["#damages",        "Limitation of Damages"],
                ["#advice",         "No Professional Advice"],
                ["#changes",        "Changes to Disclaimer"],
                ["#acknowledgment", "User Acknowledgment"],
                ["#contact",        "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            {/* 1 */}
            <section id="trial" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Trial and Experimental Platform</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND is currently operating in a trial, beta, and experimental phase ("Trial Phase"). The Platform is being tested for technical feasibility, user experience validation, and operational assessment.</p>
              <p className="legal-p">During this Trial Phase:</p>
              <ul className="legal-ul">
                <li>Services may be modified, suspended, or discontinued without notice</li>
                <li>Technical issues, bugs, or errors may occur</li>
                <li>Support may be limited or delayed</li>
                <li>The Platform may not be available 24/7</li>
              </ul>
              <p className="legal-p">Use of the Platform during Trial Phase involves inherent risks associated with experimental services. We make no guarantees of service availability, reliability, or fitness for any particular purpose.</p>
            </section>

            {/* 2 */}
            <section id="facilitator" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Platform as Technology Facilitator Only</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND provides technology infrastructure to connect Event Organisers with ticket buyers. We are NOT:</p>
              <ul className="legal-ul">
                <li>Event organisers, owners, or operators</li>
                <li>Responsible for event quality, safety, or execution</li>
                <li>Guarantors of artist appearance or performance quality</li>
                <li>Liable for event cancellations, postponements, or changes</li>
                <li>Responsible for verifying event authenticity or legality</li>
              </ul>
              <div className="legal-highlight">
                <p>Event Organisers are independent third parties. Any contract for event attendance is between you and the Event Organiser, not BEYOND.</p>
              </div>
            </section>

            {/* 3 */}
            <section id="warranties" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">No Guarantees or Warranties</h2>
              <div className="legal-section-divider" />
              <p className="legal-p" style={{textTransform:"uppercase", fontSize:13, letterSpacing:"0.02em", color:"rgba(240,237,230,0.55)", lineHeight:1.7}}>The platform and all services are provided "as is" and "as available" without any warranties, express or implied.</p>
              <p className="legal-p">We specifically disclaim:</p>
              <ul className="legal-ul">
                <li>Warranties of merchantability, fitness for particular purpose</li>
                <li>Warranties of uninterrupted, error-free operation</li>
                <li>Any warranties regarding event occurrence or quality</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="forcemajeure" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Force Majeure and External Factors</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND shall not be liable for failures or delays caused by circumstances beyond our reasonable control, including but not limited to:</p>
              <ul className="legal-ul">
                <li>Natural disasters (earthquakes, floods, storms)</li>
                <li>Pandemics, epidemics, or health emergencies</li>
                <li>Government actions, regulations, or lockdowns</li>
                <li>Wars, terrorism, or civil unrest</li>
                <li>Internet outages or infrastructure failures</li>
                <li>Third-party service provider failures</li>
                <li>Power failures or network disruptions</li>
              </ul>
            </section>

            {/* 5 */}
            <section id="thirdparty" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Third-Party Service Dependencies</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND relies on third-party services to operate. We are not responsible for failures, outages, security breaches, or policy changes of these providers. Users are subject to these providers' own terms and policies.</p>
              <ul className="legal-ul">
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Firebase (Google)</strong> — Hosting and database infrastructure</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree</strong> — Payment processing</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Resend</strong> — Email communication</li>
              </ul>
            </section>

            {/* 6 */}
            <section id="userresp" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">User Responsibility</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">Users are responsible for:</p>
              <ul className="legal-ul">
                <li>Verifying event details independently before purchase</li>
                <li>Reading event-specific terms, conditions, and refund policies</li>
                <li>Ensuring compatibility of devices and internet connectivity</li>
                <li>Maintaining security of account credentials</li>
                <li>Complying with event venue rules and regulations</li>
                <li>Understanding risks associated with Trial Phase usage</li>
              </ul>
            </section>

            {/* 7 */}
            <section id="damages" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Limitation of Damages</h2>
              <div className="legal-section-divider" />
              <p className="legal-p" style={{textTransform:"uppercase", fontSize:13, letterSpacing:"0.02em", color:"rgba(240,237,230,0.55)", lineHeight:1.7}}>To the maximum extent permitted by law, in no event shall Beyond be liable for indirect, incidental, special, consequential, or punitive damages; loss of profits, revenue, data, or business opportunities; personal injury or property damage at events; emotional distress or disappointment; or travel or accommodation costs related to cancelled events.</p>
              <div className="legal-warning">
                <p>Our total liability for any claims shall not exceed the lesser of (a) platform fees paid by you in the transaction giving rise to the claim, or (b) INR 1,000.</p>
              </div>
            </section>

            {/* 8 */}
            <section id="advice" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">No Professional Advice</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">Information on BEYOND is for general guidance only and does not constitute legal, financial, tax, or professional advice. Consult qualified professionals for specific advice related to your circumstances.</p>
            </section>

            {/* 9 */}
            <section id="changes" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Changes to Services and Disclaimer</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We reserve the right to modify, suspend, or discontinue any aspect of the Platform at any time without liability. This Disclaimer may be updated periodically. Continued use of the Platform after any changes constitutes your acceptance of the revised Disclaimer.</p>
            </section>

            {/* 10 */}
            <section id="acknowledgment" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">User Acknowledgment</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">By using BEYOND, you acknowledge that:</p>
              <div className="legal-ack-grid">
                {[
                  "You have read and understood this Disclaimer",
                  "You accept the Trial Phase nature of the Platform",
                  "You understand this is a student-operated academic project",
                  "You understand BEYOND is a technology facilitator, not an event organiser",
                  "You assume all risks associated with Platform use and event attendance",
                  "You agree to contact BEYOND directly for dispute resolution before legal action",
                ].map((text, i) => (
                  <div key={i} className="legal-ack-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9b97a" strokeWidth="2.5" style={{marginTop:2}}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 11 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Contact</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For questions or concerns regarding this Disclaimer, please contact:</p>
              <div className="legal-contact-card">
                <p><strong style={{color:"#f0ede6"}}>Beyond Support Team</strong></p>
                <p>Email: <a href="mailto:ctxgrowthagency@gmail.com" className="legal-link">ctxgrowthagency@gmail.com</a></p>
                <p>WhatsApp: <a href="https://wa.me/919699517508" className="legal-link">+91 96995 17508</a></p>
                <p>Website: <a href="https://ctxgrowthagency.in" className="legal-link">ctxgrowthagency.in</a></p>
                <p style={{marginTop:8, fontSize:12, color:"rgba(240,237,230,0.35)"}}>Governing Law: India · Jurisdiction: Goa</p>
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