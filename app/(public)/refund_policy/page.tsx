import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Beyond",
  description: "Beyond's refund and cancellation policy for event ticket purchases.",
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
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

        /* Timeline table */
        .legal-timeline { width:100%; border-collapse:collapse; margin:16px 0; }
        .legal-timeline th { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#c9b97a; font-weight:600; text-align:left; padding:10px 16px; background:rgba(201,185,122,0.06); border:1px solid rgba(255,255,255,0.06); }
        .legal-timeline td { font-size:14px; color:rgba(240,237,230,0.65); font-weight:300; padding:12px 16px; border:1px solid rgba(255,255,255,0.06); line-height:1.5; vertical-align:top; }
        .legal-timeline tr:nth-child(even) td { background:rgba(255,255,255,0.015); }

        /* Fee box */
        .legal-fee-box { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,0.06); margin:16px 0; }
        @media(max-width:480px){ .legal-fee-box { grid-template-columns:1fr; } }
        .legal-fee-cell { background:#080808; padding:16px 18px; }
        .legal-fee-cell-label { font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:#c9b97a; margin-bottom:6px; opacity:0.8; }
        .legal-fee-cell-value { font-size:15px; color:#f0ede6; font-weight:500; }
        .legal-fee-cell-note { font-size:12px; color:rgba(240,237,230,0.4); margin-top:4px; font-weight:300; }

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
          <h1 className="legal-title">Refund &amp; Cancellation Policy</h1>
          <div className="legal-meta">
            <span>Beyond</span>
            <span className="legal-meta-dot">·</span>
            <span>Last Updated: February 21, 2026</span>
            <span className="legal-meta-dot">·</span>
            <span>Governing Law: India</span>
          </div>
        </div>

        <div className="legal-body">

          <nav className="legal-toc" aria-label="Page contents">
            <div className="legal-toc-label">Contents</div>
            <ol className="legal-toc-list">
              {[
                ["#overview",       "Overview"],
                ["#fees",           "Platform Fees"],
                ["#buyer-cancel",   "Buyer Cancellation"],
                ["#organiser-cancel","Organiser Cancellation"],
                ["#postponement",   "Postponement"],
                ["#eligibility",    "Refund Eligibility"],
                ["#process",        "Refund Process"],
                ["#timeline",       "Refund Timeline"],
                ["#non-refundable", "Non-Refundable Items"],
                ["#disputes",       "Disputes"],
                ["#contact",        "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            <div className="legal-highlight">
              <p>This policy governs all ticket purchases made through the BEYOND platform. Please read this carefully before completing any purchase. By purchasing a ticket, you agree to this Refund &amp; Cancellation Policy.</p>
            </div>

            {/* 1 */}
            <section id="overview" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Overview</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">BEYOND operates as a technology platform that facilitates ticket sales between Event Organisers and ticket buyers. The contract for event attendance is between you (the buyer) and the Event Organiser. Refund eligibility is primarily governed by the Event Organiser&apos;s specific refund policy, which is displayed on each event listing page at the time of purchase.</p>
              <p className="legal-p">BEYOND will process and facilitate refunds strictly in accordance with the applicable Event Organiser policy and the terms outlined in this document. Payments are processed through <strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree Payments</strong>, a PCI-DSS compliant payment gateway.</p>
            </section>

            {/* 2 */}
            <section id="fees" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Platform Fees and Pricing</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">All prices are displayed in <strong style={{color:"#f0ede6",fontWeight:500}}>Indian Rupees (INR)</strong> and the total amount payable — including all applicable fees and taxes — will be clearly shown on the checkout screen before you confirm payment.</p>
              <div className="legal-fee-box">
                <div className="legal-fee-cell">
                  <div className="legal-fee-cell-label">Ticket Price</div>
                  <div className="legal-fee-cell-value">Set by Event Organiser</div>
                  <div className="legal-fee-cell-note">Displayed on the event listing page</div>
                </div>
                <div className="legal-fee-cell">
                  <div className="legal-fee-cell-label">Platform Service Fee</div>
                  <div className="legal-fee-cell-value">~3% of ticket price</div>
                  <div className="legal-fee-cell-note">Shown at checkout before payment</div>
                </div>
                <div className="legal-fee-cell">
                  <div className="legal-fee-cell-label">Payment Gateway Charges</div>
                  <div className="legal-fee-cell-value">As applicable</div>
                  <div className="legal-fee-cell-note">Processed by Cashfree Payments</div>
                </div>
                <div className="legal-fee-cell">
                  <div className="legal-fee-cell-label">Total Charged</div>
                  <div className="legal-fee-cell-value">Shown at checkout</div>
                  <div className="legal-fee-cell-note">No hidden charges after confirmation</div>
                </div>
              </div>
            </section>

            {/* 3 */}
            <section id="buyer-cancel" className="legal-section">
              <div className="legal-section-number">03</div>
              <h2 className="legal-section-heading">Buyer-Initiated Cancellation</h2>
              <div className="legal-section-divider" />
              <div className="legal-warning">
                <p>All ticket sales are generally final. Refunds for buyer-initiated cancellations are only available if the Event Organiser&apos;s policy explicitly permits them. The Event Organiser&apos;s refund policy is displayed on the event page before purchase.</p>
              </div>
              <p className="legal-p">If the Event Organiser allows buyer cancellations, the following applies:</p>
              <ul className="legal-ul">
                <li>Cancellation requests must be submitted to <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> with your booking ID and reason</li>
                <li>Requests will be reviewed within <strong style={{color:"#f0ede6",fontWeight:500}}>2 business days</strong></li>
                <li>Platform service fees and payment gateway charges may be non-refundable even if the ticket price is refunded</li>
                <li>Refunds are processed to the original payment method only</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="organiser-cancel" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Event Cancellation by Organiser</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">If an Event is cancelled by the Event Organiser before it takes place:</p>
              <ul className="legal-ul">
                <li>All ticket buyers will be notified via email and/or SMS as soon as reasonably possible</li>
                <li>A <strong style={{color:"#f0ede6",fontWeight:500}}>full refund of the ticket price</strong> will be initiated to all buyers</li>
                <li>Platform service fees will be refunded at BEYOND&apos;s discretion on a case-by-case basis</li>
                <li>Payment gateway processing charges (as levied by Cashfree Payments) may not be refundable</li>
                <li>Refunds will be processed within <strong style={{color:"#f0ede6",fontWeight:500}}>7–14 business days</strong> from the date of cancellation confirmation</li>
              </ul>
              <div className="legal-highlight">
                <p>BEYOND is not responsible for an Event Organiser&apos;s decision to cancel an event. Our obligation in such cases is to facilitate the refund process promptly and communicate transparently with affected buyers.</p>
              </div>
            </section>

            {/* 5 */}
            <section id="postponement" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Event Postponement or Rescheduling</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">If an Event is postponed or rescheduled by the organiser:</p>
              <ul className="legal-ul">
                <li>Your existing ticket remains valid for the rescheduled date unless otherwise communicated</li>
                <li>Buyers will be notified of the new date promptly via email and/or SMS</li>
                <li>If you cannot attend the rescheduled date, refund eligibility will be governed by the Event Organiser&apos;s specific policy</li>
                <li>To request a refund due to rescheduling, contact us at <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> within <strong style={{color:"#f0ede6",fontWeight:500}}>7 days</strong> of the rescheduling announcement</li>
              </ul>
            </section>

            {/* 6 */}
            <section id="eligibility" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Refund Eligibility Summary</h2>
              <div className="legal-section-divider" />
              <table className="legal-timeline">
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Refund Eligibility</th>
                    <th>Platform Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Event cancelled by organiser</td>
                    <td style={{color:"#a8d4a8"}}>Full ticket refund</td>
                    <td>Case-by-case</td>
                  </tr>
                  <tr>
                    <td>Event postponed — buyer cannot attend</td>
                    <td style={{color:"#a8d4a8"}}>As per organiser policy</td>
                    <td>Case-by-case</td>
                  </tr>
                  <tr>
                    <td>Buyer cancels (organiser allows)</td>
                    <td style={{color:"#c9b97a"}}>As per organiser policy</td>
                    <td>Non-refundable</td>
                  </tr>
                  <tr>
                    <td>Buyer cancels (organiser disallows)</td>
                    <td style={{color:"#e05252"}}>Not eligible</td>
                    <td>Non-refundable</td>
                  </tr>
                  <tr>
                    <td>No-show at event</td>
                    <td style={{color:"#e05252"}}>Not eligible</td>
                    <td>Non-refundable</td>
                  </tr>
                  <tr>
                    <td>Technical error / duplicate payment</td>
                    <td style={{color:"#a8d4a8"}}>Full refund</td>
                    <td>Fully refunded</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* 7 */}
            <section id="process" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">How to Request a Refund</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">To initiate a refund request, contact us with the following details:</p>
              <ul className="legal-ul">
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Email:</strong> <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a></li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Subject line:</strong> Refund Request — [Your Booking ID]</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>Include:</strong> Full name, registered email, booking ID, event name, and reason for refund request</li>
                <li><strong style={{color:"#f0ede6",fontWeight:500}}>WhatsApp:</strong> <a href="https://wa.me/919699517508" className="legal-link">+91 96995 17508</a></li>
              </ul>
              <p className="legal-p">Our team will acknowledge your request within <strong style={{color:"#f0ede6",fontWeight:500}}>24–48 hours</strong> and provide a resolution update within <strong style={{color:"#f0ede6",fontWeight:500}}>2–3 business days</strong>.</p>
            </section>

            {/* 8 */}
            <section id="timeline" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Refund Processing Timeline</h2>
              <div className="legal-section-divider" />
              <div className="legal-highlight">
                <p>Approved refunds will be processed to the original payment method within <strong>7–14 business days</strong> from the date of approval. Additional time may be required depending on your bank or payment provider.</p>
              </div>
              <table className="legal-timeline">
                <thead>
                  <tr>
                    <th>Payment Method</th>
                    <th>Expected Credit Timeline</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>UPI / Wallet</td>
                    <td>3–5 business days from approval</td>
                  </tr>
                  <tr>
                    <td>Debit / Credit Card</td>
                    <td>5–10 business days from approval</td>
                  </tr>
                  <tr>
                    <td>Net Banking</td>
                    <td>5–7 business days from approval</td>
                  </tr>
                </tbody>
              </table>
              <p className="legal-p">Refunds are processed through <strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree Payments</strong>. Once initiated from our end, the actual credit depends on your bank&apos;s processing timeline, which is outside our control.</p>
            </section>

            {/* 9 */}
            <section id="non-refundable" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">Non-Refundable Items</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">The following are non-refundable under all circumstances:</p>
              <ul className="legal-ul">
                <li>Payment gateway / transaction charges levied by Cashfree Payments</li>
                <li>Platform service fees where the refund is buyer-initiated and organiser policy disallows refunds</li>
                <li>Tickets for events that have already taken place (post-event)</li>
                <li>No-show at the event without prior cancellation</li>
                <li>Tickets marked as &quot;Non-Refundable&quot; on the event listing page</li>
              </ul>
            </section>

            {/* 10 */}
            <section id="disputes" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">Disputes and Chargebacks</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We strongly encourage you to contact us directly before initiating a chargeback with your bank or card issuer. Most issues can be resolved quickly and amicably.</p>
              <div className="legal-warning">
                <p>Initiating a chargeback without first attempting resolution through BEYOND may result in suspension of your account and may complicate or delay any legitimate refund you are entitled to.</p>
              </div>
              <p className="legal-p">For any unresolved disputes, please escalate to <a href="mailto:contactbeyondteam@gmail.com" className="legal-link">contactbeyondteam@gmail.com</a> with subject line <strong style={{color:"#f0ede6",fontWeight:500}}>&quot;Dispute — [Booking ID]&quot;</strong>. We commit to responding within 48 hours.</p>
            </section>

            {/* 11 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Contact Us</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For all refund and cancellation-related queries:</p>
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
      </div>
    </>
  );
}