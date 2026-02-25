export default function PrivacyPolicyPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

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
        .legal-subsection-heading { font-size:13px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:rgba(240,237,230,0.6); margin:24px 0 10px; }

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

        .legal-data-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin:12px 0; }
        @media(max-width:540px){ .legal-data-grid { grid-template-columns:1fr; } }
        .legal-data-card { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:14px 16px; }
        .legal-data-card-title { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#c9b97a; margin-bottom:6px; opacity:0.8; }
        .legal-data-card-body { font-size:13px; line-height:1.6; color:rgba(240,237,230,0.6); font-weight:300; }

        .legal-rights-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:12px 0; }
        @media(max-width:600px){ .legal-rights-grid { grid-template-columns:1fr 1fr; } }
        @media(max-width:380px){ .legal-rights-grid { grid-template-columns:1fr; } }
        .legal-right-item { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:14px 16px; }
        .legal-right-icon { font-size:18px; margin-bottom:6px; }
        .legal-right-title { font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:rgba(240,237,230,0.7); margin-bottom:4px; }
        .legal-right-desc { font-size:12px; line-height:1.55; color:rgba(240,237,230,0.45); font-weight:300; }

        .legal-provider-list { margin:8px 0 16px; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
        .legal-provider-item { display:flex; gap:12px; align-items:flex-start; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:12px 14px; }
        .legal-provider-badge { font-size:10px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#c9b97a; background:rgba(201,185,122,0.1); border:1px solid rgba(201,185,122,0.2); border-radius:4px; padding:2px 8px; white-space:nowrap; align-self:flex-start; margin-top:1px; }
        .legal-provider-text { font-size:14px; line-height:1.6; color:rgba(240,237,230,0.65); font-weight:300; }

        .legal-contact-card { background:rgba(255,255,255,0.025); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:22px 24px; margin-top:16px; }
        .legal-contact-card p { font-size:14px; line-height:1.7; color:rgba(240,237,230,0.65); margin:0 0 4px; }
        .legal-contact-card p:last-child { margin-bottom:0; }

        .legal-footer { max-width:1100px; margin:0 auto; padding:28px clamp(20px,5vw,80px) 60px; border-top:1px solid rgba(255,255,255,0.07); display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:12px; }
        .legal-footer-text { font-size:12px; color:rgba(240,237,230,0.25); }
        .legal-footer-links { display:flex; gap:20px; }
        .legal-footer-links a { font-size:12px; color:rgba(240,237,230,0.35); text-decoration:none; transition:color 0.2s; }
        .legal-footer-links a:hover { color:#c9b97a; }
      `}</style>

      <div className="legal-root">

        <div className="legal-header">
          <div className="legal-eyebrow">Legal</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Last Updated: February 21, 2026</span>
            <span className="legal-meta-dot">·</span>
            <span>Governing Law: India</span>
          </div>
        </div>

        <div className="legal-body">

          <nav className="legal-toc">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#collect",    "Information We Collect"],
                ["#use",        "How We Use It"],
                ["#share",      "How We Share It"],
                ["#payment",    "Payment Data"],
                ["#security",   "Data Security"],
                ["#retention",  "Data Retention"],
                ["#rights",     "Your Rights"],
                ["#cookies",    "Cookies & Tracking"],
                ["#thirdparty", "Third-Party Services"],
                ["#children",   "Children's Privacy"],
                ["#changes",    "Policy Changes"],
                ["#contact",    "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            <div className="legal-highlight">
              <p>At BEYOND, we are committed to protecting your privacy and handling your personal information with care, transparency, and in compliance with applicable data protection laws in India, including the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.</p>
            </div>

            <div className="legal-warning">
              <p>Student Project Notice: The Platform is operated as an academic and experimental project by college students for learning, testing, and validation purposes. Data handling practices reflect the Trial Phase nature of operations.</p>
            </div>

            {/* 1 */}
            <section id="collect" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Information We Collect</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">1.1 Information You Provide Directly</div>
              <div className="legal-data-grid">
                {[
                  ["Account Information", "Name, email address, phone number, date of birth"],
                  ["Payment Information", "Payment method details processed securely through Cashfree Payments India Private Limited. BEYOND does not store, access, or retain complete card numbers, CVV, or UPI PINs."],
                  ["Booking Information", "Event preferences, ticket selections, attendee details"],
                  ["Communication Data", "Messages, support queries, feedback, and correspondence"],
                ].map(([title, body]) => (
                  <div key={title} className="legal-data-card">
                    <div className="legal-data-card-title">{title}</div>
                    <div className="legal-data-card-body">{body}</div>
                  </div>
                ))}
              </div>

              <div className="legal-subsection-heading">1.2 Information Collected Automatically</div>
              <p className="legal-p">When you access the Platform, we automatically collect:</p>
              <ul className="legal-ul">
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Usage Data:</strong> Pages visited, features used, time spent, click patterns, search queries</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Location Data:</strong> Approximate location based on IP address (with your consent for precise location)</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Cookies and Tracking:</strong> We use cookies and similar technologies for authentication, preferences, analytics, and functionality</li>
              </ul>
            </section>

            {/* 2 */}
            <section id="use" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">How We Use Your Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We use your information for the following purposes:</p>
              <ul className="legal-ul">
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Ticketing Services:</strong> Process bookings, generate tickets, facilitate event entry, manage your account</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Payment Processing:</strong> Facilitate secure payments through Cashfree Payments; share only the minimum data required by Cashfree to complete your transaction</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Communication:</strong> Send booking confirmations, event updates, important notifications, customer support responses</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Platform Improvement:</strong> Analyse usage patterns, fix bugs, enhance features, optimise performance</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Security:</strong> Prevent fraud, detect suspicious activity, enforce Terms and Conditions</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Legal Compliance:</strong> Comply with legal obligations, respond to lawful requests, protect rights</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Marketing (with consent):</strong> Send promotional offers, event recommendations, newsletters — you may opt-out at any time</li>
              </ul>
            </section>

            {/* 3 */}
            <section id="share" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">How We Share Your Information</h2>
              <div className="legal-section-divider" />
              <div className="legal-highlight">
                <p>We do not sell your personal information to third parties.</p>
              </div>
              <p className="legal-p">We may share your information with:</p>
              <ul className="legal-provider-list">
                {[
                  ["Event Organisers", "Name, contact details, and booking information necessary for event management and entry"],
                  ["Cashfree Payments", "Payment and transaction data necessary to process your booking securely. Cashfree Payments India Private Limited is a PCI-DSS compliant payment aggregator. Their privacy policy is available at cashfree.com/privacypolicy"],
                  ["Firebase (Google)", "Infrastructure, database, and authentication data for platform operation"],
                  ["Wati", "Phone number and booking details for WhatsApp-based communication and notifications"],
                  ["Legal Requirements", "When required by law, court order, or government authority under applicable Indian law"],
                  ["Business Transfers", "In case of merger, acquisition, or sale of assets (with notice to affected users)"],
                ].map(([badge, text]) => (
                  <li key={badge} className="legal-provider-item">
                    <span className="legal-provider-badge">{badge}</span>
                    <span className="legal-provider-text">{text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 — NEW CASHFREE-SPECIFIC SECTION */}
            <section id="payment" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Payment Data and Cashfree Payments</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">All payment transactions on BEYOND are processed by <strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree Payments India Private Limited</strong> (CIN: U72900KA2015PTC082987), a licensed payment aggregator regulated by the Reserve Bank of India.</p>
              <ul className="legal-ul">
                <li>BEYOND does not store, log, or have access to your complete card number, CVV, UPI PIN, or net banking credentials</li>
                <li>Payment data is transmitted directly to Cashfree&apos;s PCI-DSS certified infrastructure</li>
                <li>By making a payment, you agree to Cashfree&apos;s Terms and Privacy Policy available at <a href="https://www.cashfree.com/privacypolicy/" className="legal-link" target="_blank" rel="noopener noreferrer">cashfree.com/privacypolicy</a></li>
                <li>Transaction records (amount, order ID, status) are retained by BEYOND for accounting and dispute resolution purposes</li>
                <li>Refunds are processed through Cashfree back to your original payment method</li>
              </ul>
              <div className="legal-highlight">
                <p>For payment-related grievances, you may also contact Cashfree directly at support@cashfree.com in addition to reaching BEYOND support.</p>
              </div>
            </section>

            {/* 5 */}
            <section id="security" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Data Security</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We implement reasonable security measures to protect your information, including:</p>
              <ul className="legal-ul">
                <li>Encryption of data in transit (HTTPS / SSL / TLS)</li>
                <li>Secure storage with Firebase&apos;s security infrastructure (Google Cloud)</li>
                <li>Access controls and Firebase Authentication for user accounts</li>
                <li>Payment processing through PCI-DSS compliant gateway (Cashfree Payments)</li>
                <li>Regular security assessments and updates</li>
              </ul>
              <div className="legal-warning">
                <p>No system is completely secure. Given our Trial Phase status, we cannot guarantee absolute security. We encourage you to use strong passwords, never share your OTP with anyone, and protect your account credentials. BEYOND and Cashfree will never ask for your card CVV or OTP over phone or email.</p>
              </div>
            </section>

            {/* 6 */}
            <section id="retention" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Data Retention</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We retain your information for as long as necessary to:</p>
              <ul className="legal-ul">
                <li>Provide services and maintain your account</li>
                <li>Comply with legal, tax, and accounting obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Support legitimate business purposes</li>
              </ul>
              <div className="legal-highlight">
                <p>Transaction records may be retained for up to 5 years for compliance with Indian accounting and tax laws. You may request deletion of your data by contacting us. We will comply unless retention is required by law or legitimate business need.</p>
              </div>
            </section>

            {/* 7 */}
            <section id="rights" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Your Rights and Choices</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">You have the following rights regarding your personal information:</p>
              <div className="legal-rights-grid">
                {[
                  ["📋", "Access", "Request a copy of your personal data"],
                  ["✏️", "Correction", "Update or correct inaccurate information"],
                  ["🗑️", "Deletion", "Request deletion of your data, subject to legal obligations"],
                  ["🔕", "Opt-Out", "Unsubscribe from marketing communications at any time"],
                  ["📦", "Portability", "Receive your data in a structured, machine-readable format"],
                  ["🔒", "Security", "Withdraw consent for non-essential data processing"],
                ].map(([icon, title, desc]) => (
                  <div key={title} className="legal-right-item">
                    <div className="legal-right-icon">{icon}</div>
                    <div className="legal-right-title">{title}</div>
                    <div className="legal-right-desc">{desc}</div>
                  </div>
                ))}
              </div>
              <p className="legal-p" style={{marginTop:12}}>To exercise these rights, contact us at <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> with subject line <strong style={{color:"#f0ede6",fontWeight:500}}>&quot;Privacy Request&quot;</strong>. We will respond within 30 days.</p>
            </section>

            {/* 8 */}
            <section id="cookies" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Cookies and Tracking Technologies</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We use cookies and similar technologies for:</p>
              <ul className="legal-ul">
                <li>Authentication and session management (required for login)</li>
                <li>Remembering preferences and settings</li>
                <li>Analytics and usage measurement (Firebase Analytics)</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="legal-p">You can control cookies through your browser settings. Note that disabling essential cookies may affect Platform functionality including login and checkout.</p>
            </section>

            {/* 9 */}
            <section id="thirdparty" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Third-Party Services and Links</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">Our Platform integrates with the following third-party services:</p>
              <ul className="legal-provider-list">
                {[
                  ["Firebase (Google)", "Hosting, database infrastructure, and authentication — Google's Privacy Policy applies"],
                  ["Cashfree Payments", "Secure payment processing — PCI-DSS compliant. cashfree.com/privacypolicy"],
                  ["Wati", "WhatsApp-based communication and booking notifications"],
                ].map(([badge, text]) => (
                  <li key={badge} className="legal-provider-item">
                    <span className="legal-provider-badge">{badge}</span>
                    <span className="legal-provider-text">{text}</span>
                  </li>
                ))}
              </ul>
              <p className="legal-p">Our Platform may also contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies independently.</p>
            </section>

            {/* 10 */}
            <section id="children" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">Children&apos;s Privacy</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND is not intended for children under 18. We do not knowingly collect information from minors. If you believe we have inadvertently collected such information, please contact us immediately at <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> for deletion.</p>
            </section>

            {/* 11 */}
            <section id="changes" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Changes to This Privacy Policy</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We may update this Privacy Policy periodically. Material changes will be communicated via email or Platform notification at least 7 days before they take effect. Continued use of the Platform after changes indicates your acceptance of the revised Policy.</p>
            </section>

            {/* 12 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">12</div>
              <h2 className="legal-section-heading">Contact Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For privacy-related questions, concerns, or requests:</p>
              <div className="legal-contact-card">
                <p><strong style={{color:"#f0ede6"}}>Beyond Support Team</strong></p>
                <p>Email: <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a></p>
                <p>Subject Line: <span style={{color:"rgba(240,237,230,0.5)"}}>Privacy Inquiry</span></p>
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
            <a href="/terms_and_conditions">Terms &amp; Conditions</a>
            <a href="/refund_policy">Refund Policy</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </>
  );
}