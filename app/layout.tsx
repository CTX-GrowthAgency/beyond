import type { ReactNode } from "react";
import type { Metadata } from "next";
import "../styles/global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://beyond.ctxgrowthagency.in"),

  title: {
    default: "Beyond | Book Event Tickets Online",
    template: "%s | Beyond",
  },

  description:
    "Beyond is a premium event ticket booking platform powered by CTX Growth Agency. Discover concerts, festivals, nightlife events, and exclusive experiences. Book tickets instantly and securely.",

  keywords: [
    "Beyond events",
    "Book event tickets online",
    "Concert tickets India",
    "Festival tickets Goa",
    "Nightlife events Goa",
    "Online ticket booking platform",
    "Event management platform",
    "CTX Growth Agency",
  ],

  authors: [{ name: "CTX Growth Agency" }],
  creator: "CTX Growth Agency",
  publisher: "CTX Growth Agency",

  openGraph: {
    title: "Beyond | Book Event Tickets Online",
    description:
      "Discover concerts, festivals, nightlife, and premium experiences with Beyond — powered by CTX Growth Agency.",
    url: "https://beyond.ctxgrowthagency.in",
    siteName: "Beyond",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Beyond | Book Event Tickets Online",
    description:
      "Book concerts, festivals & premium experiences instantly with Beyond.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}