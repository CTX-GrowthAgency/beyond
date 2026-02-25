export default function TermsAndConditionsPage() {
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

        .legal-caps { text-transform:uppercase; font-size:13px; letter-spacing:0.02em; color:rgba(240,237,230,0.55); line-height:1.7; font-weight:300; }

        .legal-link { color:#c9b97a; text-decoration:none; border-bottom:1px solid rgba(201,185,122,0.3); transition:border-color 0.2s; }
        .legal-link:hover { border-bottom-color:#c9b97a; }

        .legal-steps { margin:12px 0 16px; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; counter-reset:steps; }
        .legal-steps li { display:flex; gap:14px; font-size:15px; line-height:1.7; color:rgba(240,237,230,0.7); font-weight:300; align-items:flex-start; counter-increment:steps; }
        .legal-steps li::before { content:counter(steps); min-width:22px; height:22px; background:rgba(201,185,122,0.12); border:1px solid rgba(201,185,122,0.25); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; color:#c9b97a; flex-shrink:0; margin-top:2px; font-weight:500; }

        .legal-def-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:8px; }
        @media(max-width:540px){ .legal-def-grid { grid-template-columns:1fr; } }
        .legal-def-item { background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:6px; padding:12px 14px; }
        .legal-def-term { font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:#c9b97a; margin-bottom:4px; opacity:0.8; }
        .legal-def-desc { font-size:13px; line-height:1.6; color:rgba(240,237,230,0.6); font-weight:300; }

        /* Pricing display — Cashfree requires conspicuous price display */
        .legal-price-box { border:1px solid rgba(201,185,122,0.25); background:rgba(201,185,122,0.04); padding:20px 22px; margin:16px 0; }
        .legal-price-box-title { font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#c9b97a; margin-bottom:14px; font-weight:600; }
        .legal-price-row { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:14px; color:rgba(240,237,230,0.7); font-weight:300; }
        .legal-price-row:last-child { border-bottom:none; padding-bottom:0; }
        .legal-price-row strong { color:#f0ede6; font-weight:500; }

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
          <h1 className="legal-title">Terms &amp; Conditions</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Last Updated: February 21, 2026</span>
            <span className="legal-meta-dot">·</span>
            <span>Governing Law: India · Goa</span>
          </div>
        </div>

        <div className="legal-body">

          <nav className="legal-toc">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#platform",      "Platform Status"],
                ["#definitions",   "Definitions"],
                ["#eligibility",   "Eligibility & Account"],
                ["#booking",       "Booking & Payment"],
                ["#pricing",       "Pricing & Fees"],
                ["#cancellations", "Cancellations & Refunds"],
                ["#liability",     "Limitation of Liability"],
                ["#disputes",      "Dispute Resolution"],
                ["#governing",     "Governing Law"],
                ["#conduct",       "User Conduct"],
                ["#ip",            "Intellectual Property"],
                ["#changes",       "Changes to Terms"],
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
              <p>IMPORTANT: Please read these Terms carefully before using BEYOND. By accessing or using the Platform, you confirm that you have read, understood, and agree to be bound by these Terms, our <a href="/privacy_policy" className="legal-link">Privacy Policy</a>, and our <a href="/refund_policy" className="legal-link">Refund &amp; Cancellation Policy</a>. If you do not agree, do not use the Platform.</p>
            </div>

            {/* 1 */}
            <section id="platform" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Platform Status and Nature of Service</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">1.1 Trial / Beta Phase</div>
              <p className="legal-p">BEYOND is currently operating in a trial, beta, and experimental phase (&quot;Trial Phase&quot;) as an academic and experimental project. During this Trial Phase:</p>
              <ul className="legal-ul">
                <li>Services are provided on a best-effort basis</li>
                <li>Features, functionality, and availability may change without prior notice</li>
                <li>The Platform may experience downtime, bugs, or technical issues</li>
                <li>Limited customer support may be available</li>
                <li>The number of events and tickets processed may be limited</li>
              </ul>

              <div className="legal-subsection-heading">1.2 Technology Facilitator</div>
              <p className="legal-p">BEYOND operates as a technology facilitator connecting event organisers with ticket buyers. We provide infrastructure to enable event listings, process ticket bookings and payments via Cashfree Payments, generate digital tickets and QR codes, and facilitate communication between organisers and attendees.</p>
              <div className="legal-highlight">
                <p>BEYOND does not own, organise, manage, or control the events listed on the Platform. Event Organisers are solely responsible for the conduct, quality, safety, and execution of their events. Payments are processed by Cashfree Payments India Private Limited — a licensed payment aggregator.</p>
              </div>
            </section>

            {/* 2 */}
            <section id="definitions" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Definitions</h2>
              <div className="legal-section-divider" />
              <div className="legal-def-grid">
                {[
                  ["User / You", "Any individual or entity accessing or using the Platform"],
                  ["Event Organiser", "Any person or entity listing an event on the Platform"],
                  ["Ticket Buyer / Attendee", "Any person purchasing tickets through the Platform"],
                  ["Event", "Any activity, gathering, performance, or experience listed on the Platform"],
                  ["Ticket", "Digital confirmation of booking, including QR code, granting event entry"],
                  ["Platform", "BEYOND accessible at ctxgrowthagency.in and associated applications"],
                  ["Cashfree / Payment Gateway", "Cashfree Payments India Private Limited — the payment processor used by BEYOND"],
                  ["Service Fee", "BEYOND's platform charge (~3%) added to each ticket transaction, shown at checkout"],
                ].map(([term, desc]) => (
                  <div key={term} className="legal-def-item">
                    <div className="legal-def-term">{term}</div>
                    <div className="legal-def-desc">{desc}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3 */}
            <section id="eligibility" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">User Eligibility and Account</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">You must be at least 18 years of age to use this Platform. You agree to provide accurate information, maintain account security, and accept responsibility for all activities under your account. Notify us immediately of any unauthorised use at <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a>.</p>
            </section>

            {/* 4 */}
            <section id="booking" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Ticket Booking and Payment</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">4.1 Booking Process</div>
              <p className="legal-p">When you purchase a ticket through BEYOND, you enter into a contract directly with the Event Organiser. BEYOND facilitates this transaction but is not a party to the contract between you and the Event Organiser. All payments are processed securely by <strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree Payments India Private Limited</strong>.</p>

              <div className="legal-subsection-heading">4.2 Booking Confirmation</div>
              <p className="legal-p">Upon successful payment, you will receive a booking confirmation via email/SMS and a digital ticket with a unique QR code. Check your spam folder if not received within 15 minutes. Contact us if tickets are not received within 30 minutes.</p>

              <div className="legal-subsection-heading">4.3 Payment Security</div>
              <p className="legal-p">BEYOND does not store your card numbers, CVV, UPI PIN, or net banking credentials. All payment data is handled exclusively by Cashfree&apos;s PCI-DSS compliant infrastructure. By completing a purchase, you also agree to <a href="https://www.cashfree.com/tnc/" className="legal-link" target="_blank" rel="noopener noreferrer">Cashfree&apos;s Terms of Service</a>.</p>
            </section>

            {/* 5 — REQUIRED BY CASHFREE: conspicuous price display */}
            <section id="pricing" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Pricing, Fees, and Charges</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">All prices are displayed in <strong style={{color:"#f0ede6",fontWeight:500}}>Indian Rupees (INR)</strong>. The complete total — including all fees and taxes — is shown clearly on the checkout screen before you confirm any payment. There are no charges applied after payment confirmation.</p>

              <div className="legal-price-box">
                <div className="legal-price-box-title">Fee Structure (Displayed at Checkout)</div>
                <div className="legal-price-row">
                  <span>Ticket Price</span>
                  <strong>Set by Event Organiser — shown on event page</strong>
                </div>
                <div className="legal-price-row">
                  <span>Platform Service Fee</span>
                  <strong>~3% of ticket price (shown at checkout)</strong>
                </div>
                <div className="legal-price-row">
                  <span>Payment Gateway Fee</span>
                  <strong>As applicable — shown at checkout</strong>
                </div>
                <div className="legal-price-row">
                  <span>Taxes (GST)</span>
                  <strong>As applicable under Indian law</strong>
                </div>
                <div className="legal-price-row">
                  <span style={{color:"#f0ede6",fontWeight:500}}>Total Charged</span>
                  <strong style={{color:"#c9b97a"}}>Shown before payment confirmation</strong>
                </div>
              </div>
              <p className="legal-p">You will not be charged any amount beyond what is shown and confirmed at checkout. BEYOND does not issue GST tax invoices during the Trial Phase. Tax obligations arising from event revenue remain the responsibility of the respective Event Organiser.</p>
            </section>

            {/* 6 */}
            <section id="cancellations" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Cancellations, Refunds, and Changes</h2>
              <div className="legal-section-divider" />
              <div className="legal-highlight">
                <p>Our full Refund &amp; Cancellation Policy is available at <a href="/refund_policy" className="legal-link">/refund_policy</a>. The key terms are summarised here. By purchasing a ticket, you accept both these Terms and the Refund Policy.</p>
              </div>

              <div className="legal-subsection-heading">6.1 General Policy</div>
              <p className="legal-p">All ticket sales are generally final. Refund eligibility is governed by the Event Organiser&apos;s specific refund policy displayed on each event page before purchase.</p>

              <div className="legal-subsection-heading">6.2 Event Cancellation by Organiser</div>
              <p className="legal-p">If an Event is cancelled by the Event Organiser, ticket buyers will be notified and a full ticket price refund will be initiated within <strong style={{color:"#f0ede6",fontWeight:500}}>7–14 business days</strong>. Platform service fees are refunded at BEYOND&apos;s discretion. Payment gateway charges may not be refundable.</p>

              <div className="legal-subsection-heading">6.3 Refund Processing</div>
              <p className="legal-p">All approved refunds are processed back to the original payment method through Cashfree Payments within <strong style={{color:"#f0ede6",fontWeight:500}}>7–14 business days</strong> from approval. Cash refunds are not provided. To request a refund, contact <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> with your booking ID.</p>
            </section>

            {/* 7 */}
            <section id="liability" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Limitation of Liability and Disclaimers</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND acts solely as a technology platform. We do not own, operate, or control events. The Platform is provided &quot;as is&quot; without warranties. We are not liable for event cancellations, artist non-appearance, quality of events, injury at events, or force majeure events.</p>
              <div className="legal-warning">
                <p>Our maximum aggregate liability for any claims shall not exceed the total platform fees paid by you in the transaction giving rise to the claim, or INR 1,000, whichever is lower.</p>
              </div>
            </section>

            {/* 8 */}
            <section id="disputes" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Dispute Resolution</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">Before taking any legal action, please contact us directly. We commit to investigating all complaints fairly and responding within 24–48 hours.</p>
              <ul className="legal-ul">
                <li>Email: <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/919699517508" className="legal-link">+91 96995 17508</a></li>
              </ul>
              <p className="legal-p">If unresolved after good-faith attempts, disputes shall be subject to the jurisdiction of courts in Goa, India.</p>
            </section>

            {/* 9 */}
            <section id="governing" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Governing Law and Jurisdiction</h2>
              <div className="legal-section-divider" />
              <div className="legal-highlight">
                <p>These Terms are governed by the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Goa, India.</p>
              </div>
            </section>

            {/* 10 */}
            <section id="conduct" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">User Conduct and Prohibited Activities</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">You agree not to use the Platform for any unlawful purpose; infringe intellectual property rights; transmit harmful code; gain unauthorised access; resell or transfer tickets in violation of event policies; engage in fraud; or scrape or reverse-engineer the Platform. We reserve the right to suspend or terminate access for violations.</p>
              <div className="legal-highlight">
                <p>BEYOND does not support, facilitate, or process payments for any prohibited goods or services as defined by Cashfree Payments&apos; merchant terms, including but not limited to gambling, adult content, alcohol, drugs, or any activities prohibited under Indian law.</p>
              </div>
            </section>

            {/* 11 */}
            <section id="ip" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Intellectual Property</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">All content, features, trademarks, logos, and intellectual property on the Platform are owned by BEYOND or licensed to us. You may not reproduce, distribute, modify, or create derivative works without explicit written permission.</p>
            </section>

            {/* 12 */}
            <section id="changes" className="legal-section">
              <div className="legal-section-number">12</div>
              <h2 className="legal-section-heading">Changes to Terms</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We may modify these Terms at any time. Material changes will be communicated via email or prominent notice on the Platform at least 7 days before they take effect. Continued use after changes constitutes acceptance of the modified Terms.</p>
            </section>

            {/* 13 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">13</div>
              <h2 className="legal-section-heading">Contact Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For questions, concerns, or complaints regarding these Terms:</p>
              <div className="legal-contact-card">
                <p><strong style={{color:"#f0ede6"}}>Beyond Support Team</strong></p>
                <p>Email: <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a></p>
                <p>WhatsApp: <a href="https://wa.me/919699517508" className="legal-link">+91 96995 17508</a></p>
                <p>Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
                <p style={{marginTop:8, fontSize:12, color:"rgba(240,237,230,0.35)"}}>Governing Law: India · Jurisdiction: Goa</p>
              </div>
            </section>

          </div>
        </div>

        <div className="legal-footer">
          <span className="legal-footer-text">© {new Date().getFullYear()} Beyond. All rights reserved.</span>
          <div className="legal-footer-links">
            <a href="/privacy_policy">Privacy Policy</a>
            <a href="/refund_policy">Refund Policy</a>
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </>
  );
}