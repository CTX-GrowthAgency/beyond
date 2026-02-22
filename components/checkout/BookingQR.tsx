"use client";

import { useEffect, useState } from "react";

interface BookingQRProps {
  bookingId: string;
  size?: number;
  className?: string;
}

/** QR code encoding bookingId for venue scan-to-confirm. */
export default function BookingQR({ bookingId, size = 200, className = "" }: BookingQRProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    import("qrcode")
      .then((QRCode) =>
        QRCode.toDataURL(bookingId, {
          width: size,
          margin: 2,
          color: { dark: "#080808", light: "#ffffff" },
        })
      )
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch((err) => {
        if (!cancelled) console.error("QR generate failed:", err);
      });
    return () => {
      cancelled = true;
    };
  }, [bookingId, size]);

  if (!dataUrl) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          background: "rgba(255,255,255,0.05)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "rgba(240,237,230,0.4)",
        }}
      >
        Loading QR…
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`Booking QR: ${bookingId}`}
      width={size}
      height={size}
      className={className}
      style={{ display: "block", borderRadius: 8 }}
    />
  );
}
