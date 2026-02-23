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
                ["#platform",     "Platform Status"],
                ["#definitions",  "Definitions"],
                ["#eligibility",  "Eligibility & Account"],
                ["#booking",      "Booking & Payment"],
                ["#cancellations","Cancellations & Refunds"],
                ["#liability",    "Limitation of Liability"],
                ["#disputes",     "Dispute Resolution"],
                ["#governing",    "Governing Law"],
                ["#conduct",      "User Conduct"],
                ["#ip",           "Intellectual Property"],
                ["#changes",      "Changes to Terms"],
                ["#contact",      "Contact"],
              ].map(([href, label]) => (
                <li key={href} className="legal-toc-item">
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-content">

            <div className="legal-warning">
              <p>IMPORTANT: Please read these Terms carefully before using the BEYOND platform. By accessing or using the Platform at <strong>beyond.ctxgrowthagency.in</strong>, you agree to be bound by these Terms. If you do not agree, please do not use the Platform.</p>
            </div>

            {/* 1 */}
            <section id="platform" className="legal-section">
              <div className="legal-section-number">01</div>
              <h2 className="legal-section-heading">Platform Status and Nature of Service</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">1.1 Trial / Beta Phase</div>
              <p className="legal-p">The Platform is operated as an academic and experimental project by college students for learning, testing, and validation purposes. BEYOND is currently operating in a trial, beta, and experimental phase ("Trial Phase"). The Platform is being tested for technology validation, user experience optimisation, and operational feasibility.</p>
              <p className="legal-p">During this Trial Phase:</p>
              <ul className="legal-ul">
                <li>Services are provided on a best-effort basis</li>
                <li>Features, functionality, and availability may change without prior notice</li>
                <li>The Platform may experience downtime, bugs, or technical issues</li>
                <li>Limited customer support may be available</li>
                <li>The number of events and tickets processed may be limited</li>
                <li>The Platform is operated for academic learning and experimental purposes</li>
              </ul>
              <p className="legal-p">Use of the Platform during Trial Phase involves inherent risks associated with experimental services. We make no guarantees of service availability, reliability, or fitness for any particular purpose.</p>

              <div className="legal-subsection-heading">1.2 Technology Facilitator</div>
              <p className="legal-p">BEYOND operates primarily as a technology facilitator and intermediary platform that connects event organisers with users and ticket buyers. We provide the technological infrastructure to:</p>
              <ul className="legal-ul">
                <li>Enable event organisers to list and manage their events</li>
                <li>Process ticket bookings and payments</li>
                <li>Generate digital tickets and QR codes for event entry</li>
                <li>Facilitate communication between organisers and attendees</li>
              </ul>
              <div className="legal-highlight">
                <p>BEYOND does not own, organise, manage, or control the events listed on the Platform. We are not the event organiser unless explicitly stated otherwise. Event organisers are solely responsible for the conduct, quality, safety, and execution of their events.</p>
              </div>

              <div className="legal-subsection-heading">1.3 Future-Proof Framework</div>
              <p className="legal-p">While BEYOND is currently in Trial Phase, these Terms are designed to remain applicable as the Platform evolves, scales, or transitions to formal registration and commercialisation. Substantive changes to these Terms will be communicated to users through the Platform or via registered email.</p>
            </section>

            {/* 2 */}
            <section id="definitions" className="legal-section">
              <div className="legal-section-number">02</div>
              <h2 className="legal-section-heading">Definitions</h2>
              <div className="legal-section-divider" />
              <div className="legal-def-grid">
                {[
                  ["User / You", "Any individual or entity accessing or using the Platform, including ticket buyers and event organisers"],
                  ["Event Organiser", "Any person or entity listing an event on the Platform"],
                  ["Ticket Buyer / Attendee", "Any person purchasing tickets through the Platform"],
                  ["Event", "Any activity, gathering, performance, conference, or experience listed on the Platform"],
                  ["Ticket", "Digital confirmation of booking, including QR code, granting entry or access to an Event"],
                  ["Platform", "BEYOND accessible at beyond.ctxgrowthagency.in and any associated mobile applications or services"],
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

              <div className="legal-subsection-heading">3.1 Age and Capacity</div>
              <p className="legal-p">You must be at least 18 years of age to use this Platform. By using the Platform, you represent and warrant that you are of legal age to form a binding contract under Indian law and meet all eligibility requirements. If you are under 18, you may use the Platform only with the involvement and supervision of a parent or legal guardian.</p>

              <div className="legal-subsection-heading">3.2 Account Registration</div>
              <p className="legal-p">To access certain features, you may be required to create an account. You agree to:</p>
              <ul className="legal-ul">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Immediately notify us of any unauthorised use or security breach</li>
              </ul>
            </section>

            {/* 4 */}
            <section id="booking" className="legal-section">
              <div className="legal-section-number">04</div>
              <h2 className="legal-section-heading">Ticket Booking and Payment</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">4.1 Booking Process</div>
              <p className="legal-p">When you purchase a ticket through BEYOND, you enter into a contract directly with the Event Organiser. BEYOND facilitates this transaction but is not a party to the contract between you and the Event Organiser.</p>

              <div className="legal-subsection-heading">4.2 Pricing and Fees</div>
              <p className="legal-p">All ticket prices are set by Event Organisers. BEYOND charges a platform service fee (currently <strong style={{color:"#f0ede6",fontWeight:500}}>3% of ticket price</strong> or as displayed at checkout) to facilitate the booking. This fee covers:</p>
              <ul className="legal-ul">
                <li>Technology infrastructure and platform maintenance</li>
                <li>Payment gateway charges</li>
                <li>Ticket generation and delivery</li>
                <li>Customer support services</li>
              </ul>
              <p className="legal-p">All prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. The total amount payable will be clearly shown before payment confirmation.</p>

              <div className="legal-subsection-heading">4.3 Payment Processing and Fund Flow</div>
              <p className="legal-p">Payments are processed through third-party payment gateways (currently <strong style={{color:"#f0ede6",fontWeight:500}}>Cashfree Payments</strong>). By making a payment, you agree to the terms and conditions of the payment gateway provider. BEYOND does not store your complete payment card details.</p>
              <div className="legal-highlight">
                <p>Fund Flow During Trial Phase: During the Trial Phase, funds collected may be temporarily received by the Platform operator solely for facilitation purposes and transferred to the respective Event Organiser as per agreed arrangements. BEYOND acts as a collection and disbursement facilitator, not as the principal beneficiary of event revenues.</p>
              </div>

              <div className="legal-subsection-heading">4.4 Tax and GST Responsibility</div>
              <p className="legal-p">During the Trial Phase, the Platform does not issue tax invoices and does not represent itself as a registered taxable entity. Any tax obligations arising from event revenue remain the responsibility of the respective Event Organiser unless otherwise mandated by law. Users are advised to consult their own tax advisors regarding any tax implications.</p>

              <div className="legal-subsection-heading">4.5 Booking Confirmation</div>
              <p className="legal-p">Upon successful payment, you will receive:</p>
              <ul className="legal-ul">
                <li>Booking confirmation via email / SMS</li>
                <li>Digital ticket with unique QR code</li>
                <li>Event details and important information</li>
              </ul>
              <p className="legal-p">Please check your spam / junk folder if you do not receive confirmation within 15 minutes. Contact our support immediately if tickets are not received.</p>
            </section>

            {/* 5 */}
            <section id="cancellations" className="legal-section">
              <div className="legal-section-number">05</div>
              <h2 className="legal-section-heading">Cancellations, Refunds, and Changes</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">5.1 General Refund Policy</div>
              <p className="legal-p">Refund eligibility and terms are determined by the Event Organiser's specific refund policy, which will be clearly displayed on the event page at the time of booking. BEYOND will facilitate refunds as per the Event Organiser's policy.</p>
              <div className="legal-highlight">
                <p>BEYOND does not independently guarantee refunds and facilitates refunds strictly in accordance with the Event Organiser's policy and applicable payment gateway rules. The Platform acts as a facilitator for refund processing but cannot override Event Organiser decisions regarding refund eligibility.</p>
              </div>

              <div className="legal-subsection-heading">5.2 Event Cancellation by Organiser</div>
              <p className="legal-p">If an Event is cancelled by the Event Organiser:</p>
              <ul className="legal-ul">
                <li>Ticket buyers will be notified via email / SMS as soon as reasonably possible</li>
                <li>Refunds will be processed according to the Event Organiser's cancellation policy</li>
                <li>BEYOND platform fees may be refunded at our discretion on a case-by-case basis</li>
                <li>Payment gateway charges (as applicable) may not be refundable</li>
              </ul>

              <div className="legal-subsection-heading">5.3 Event Postponement or Rescheduling</div>
              <p className="legal-p">If an Event is postponed or rescheduled, your ticket remains valid for the rescheduled date unless otherwise stated. Refund eligibility will be governed by the Event Organiser's policy. BEYOND will communicate updated information promptly.</p>

              <div className="legal-subsection-heading">5.4 Refund Processing Timeline</div>
              <p className="legal-p">Approved refunds will be processed to the original payment method within <strong style={{color:"#f0ede6",fontWeight:500}}>7–14 business days</strong> from the date of approval. Actual credit to your account may take additional time depending on your bank or payment provider.</p>
            </section>

            {/* 6 */}
            <section id="liability" className="legal-section">
              <div className="legal-section-number">06</div>
              <h2 className="legal-section-heading">Limitation of Liability and Disclaimers</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">6.1 Platform as Facilitator</div>
              <p className="legal-p">BEYOND acts solely as a technology platform connecting Event Organisers with ticket buyers. We do not:</p>
              <ul className="legal-ul">
                <li>Own, operate, organise, or control events listed on the Platform</li>
                <li>Verify the accuracy, quality, safety, or legality of events</li>
                <li>Guarantee the performance, appearance, or conduct of artists, speakers, or performers</li>
                <li>Warrant that events will occur as scheduled or at all</li>
                <li>Assume liability for the actions or omissions of Event Organisers</li>
              </ul>

              <div className="legal-subsection-heading">6.2 No Warranty</div>
              <p className="legal-p legal-caps">The Platform and services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, title, or non-infringement.</p>
              <p className="legal-p">Given the Trial Phase nature of the Platform, we specifically disclaim any warranty regarding:</p>
              <ul className="legal-ul">
                <li>Uninterrupted or error-free operation</li>
                <li>Accuracy or completeness of information</li>
                <li>Security of data transmission</li>
                <li>Availability during peak traffic or demand</li>
              </ul>

              <div className="legal-subsection-heading">6.3 Limitation of Liability</div>
              <p className="legal-p legal-caps">To the maximum extent permitted by law, BEYOND, its operators, affiliates, and partners shall not be liable for: event cancellations, postponements, or rescheduling; non-appearance of artists; quality, safety, or conduct of events; loss, injury, or damage occurring at events; force majeure events including natural disasters, pandemics, government actions; technical failures, data loss, or security breaches; indirect, incidental, special, consequential, or punitive damages.</p>
              <div className="legal-warning">
                <p>Our maximum aggregate liability for any claims arising from or related to the Platform shall not exceed the total platform fees paid by you in the transaction giving rise to the claim, or <strong>INR 1,000</strong>, whichever is lower.</p>
              </div>
            </section>

            {/* 7 */}
            <section id="disputes" className="legal-section">
              <div className="legal-section-number">07</div>
              <h2 className="legal-section-heading">Dispute Resolution and Amicable Settlement</h2>
              <div className="legal-section-divider" />

              <div className="legal-subsection-heading">7.1 Contact Us First</div>
              <p className="legal-p">Before taking any legal action, filing complaints with authorities, or pursuing formal dispute resolution, we strongly encourage you to contact us directly. We are committed to resolving issues promptly, fairly, and amicably.</p>
              <p className="legal-p">If you have any complaint, issue, or dispute regarding your booking or tickets, event cancellation, refund processing, or Platform functionality, please contact us at:</p>
              <ul className="legal-ul">
                <li>Email: <a href="mailto:ctxgrowthagency@gmail.com" className="legal-link">ctxgrowthagency@gmail.com</a></li>
                <li>WhatsApp Support: <a href="https://wa.me/919699517508" className="legal-link">+91 96995 17508</a></li>
                <li>Response Time: We aim to respond within 24–48 hours</li>
              </ul>

              <div className="legal-subsection-heading">7.2 Good Faith Resolution</div>
              <p className="legal-p">We commit to investigate all complaints thoroughly and fairly, communicate openly and transparently, work collaboratively with Event Organisers to address issues, and offer refunds, credits, or other remedies where reasonably appropriate.</p>

              <div className="legal-subsection-heading">7.3 Escalation Process</div>
              <ol className="legal-steps">
                <li>Request escalation to a senior team member (within 3 business days)</li>
                <li>We will review the matter comprehensively and propose a resolution</li>
                <li>If agreement cannot be reached, we may suggest mediation or alternative dispute resolution</li>
              </ol>
              <p className="legal-p">Only after exhausting good-faith attempts at resolution should formal legal proceedings be considered.</p>
            </section>

            {/* 8 */}
            <section id="governing" className="legal-section">
              <div className="legal-section-number">08</div>
              <h2 className="legal-section-heading">Governing Law and Jurisdiction</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law provisions.</p>
              <div className="legal-highlight">
                <p>Subject to Section 7 (Dispute Resolution), any disputes arising out of or in connection with these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of Goa, India.</p>
              </div>
            </section>

            {/* 9 */}
            <section id="conduct" className="legal-section">
              <div className="legal-section-number">09</div>
              <h2 className="legal-section-heading">User Conduct and Prohibited Activities</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">You agree not to:</p>
              <ul className="legal-ul">
                <li>Use the Platform for any unlawful purpose or in violation of applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights of others</li>
                <li>Transmit viruses, malware, or other harmful code</li>
                <li>Attempt to gain unauthorised access to the Platform or related systems</li>
                <li>Resell, transfer, or misuse tickets in violation of event policies</li>
                <li>Engage in fraudulent activities or misrepresent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Scrape, data mine, or reverse engineer the Platform</li>
              </ul>
              <p className="legal-p">We reserve the right to suspend or terminate access for any user violating these Terms.</p>
            </section>

            {/* 10 */}
            <section id="ip" className="legal-section">
              <div className="legal-section-number">10</div>
              <h2 className="legal-section-heading">Intellectual Property</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">All content, features, functionality, trademarks, logos, and intellectual property on the Platform are owned by BEYOND or licensed to us. You may not reproduce, distribute, modify, or create derivative works without explicit written permission.</p>
            </section>

            {/* 11 */}
            <section id="changes" className="legal-section">
              <div className="legal-section-number">11</div>
              <h2 className="legal-section-heading">Changes to Terms</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">We may modify these Terms at any time. Material changes will be communicated via email or prominent notice on the Platform. Continued use after changes constitutes acceptance of the modified Terms. The "Last Updated" date at the beginning of this document indicates when Terms were last revised.</p>
              <p className="legal-p">If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
            </section>

            {/* 12 */}
            <section id="contact" className="legal-section">
              <div className="legal-section-number">12</div>
              <h2 className="legal-section-heading">Contact Information</h2>
              <div className="legal-section-divider" />
              <p className="legal-p">For questions, concerns, or complaints regarding these Terms, please contact:</p>
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
            <a href="/disclaimer">Disclaimer</a>
          </div>
        </div>

      </div>
    </>
  );
}