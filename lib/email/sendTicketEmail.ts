import { Resend } from "resend";
import { PDFDocument, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";
import { buildInvoiceHtml, type BookingForEmail } from "./buildInvoiceHtml";

const resend = new Resend(process.env.RESEND_API_KEY ?? undefined);

export async function sendTicketEmail({
  to,
  booking,
}: {
  to: string;
  booking: BookingForEmail & { id?: string; name?: string };
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[sendTicketEmail] RESEND_API_KEY missing, skip");
    return;
  }

  const eventTitle = booking.eventTitle ?? "Event";
  const bookingId = booking.bookingId ?? (booking as any).id ?? "";
  const displayName = booking.billing?.legalName ?? booking.name ?? "Guest";

  // Generate QR Code
  const qrData = `${bookingId}|${eventTitle}`;
  const qrPngBuffer = await QRCode.toBuffer(qrData, {
    type: "png",
    width: 360,
    margin: 1,
    errorCorrectionLevel: "M",
  });
  const qrImageDataUrl = `data:image/png;base64,${qrPngBuffer.toString("base64")}`;

  // Create PDF ticket
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("EVENT TICKET", {
    x: 200,
    y: 360,
    size: 20,
    font,
  });

  page.drawText(`Event: ${eventTitle}`, { x: 50, y: 320, size: 14, font });
  page.drawText(`Name: ${displayName}`, { x: 50, y: 300, size: 14, font });
  page.drawText(`Booking ID: ${bookingId}`, { x: 50, y: 280, size: 14, font });

  const qrEmbedded = await pdfDoc.embedPng(qrPngBuffer);

  page.drawImage(qrEmbedded, {
    x: 400,
    y: 250,
    width: 120,
    height: 120,
  });

  const pdfBytes = await pdfDoc.save();

  // Invoice HTML with embedded QR (data URL so it loads in email clients)
  const html = buildInvoiceHtml(booking as BookingForEmail, { qrImageDataUrl: qrImageDataUrl });

  const from = process.env.EMAIL_FROM ?? "beyond@ctxgrowthagency.in";

  await resend.emails.send({
    from,
    to,
    subject: `Your ticket for ${eventTitle} ✓`,
    html,
    attachments: [
      {
        filename: "ticket.pdf",
        content: Buffer.from(pdfBytes),
      },
    ],
  });
}
