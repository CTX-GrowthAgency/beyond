import Link from "next/link";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  return (
    <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Checkout</h1>
        <p style={{ color: "var(--color-muted)", marginBottom: "var(--spacing-8)" }}>
          Event: {slug}
        </p>

        <div
          style={{
            background: "var(--color-surface, #1a1a1a)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "var(--spacing-8)",
            marginBottom: "var(--spacing-8)",
          }}
        >
          <h2 style={{ fontSize: "1.125rem", marginBottom: "var(--spacing-4)" }}>Billing Details</h2>
          <p style={{ color: "var(--color-muted)", fontSize: "0.9rem" }}>
            Billing form will be implemented here. Selected tickets: {Object.keys(query).length > 0 ? Object.entries(query).map(([k, v]) => `${k}=${v}`).join(", ") : "none"}
          </p>
        </div>

        <Link
          href={`/events/${slug}`}
          style={{
            display: "inline-block",
            color: "var(--color-accent-primary, #c9b97a)",
            textDecoration: "none",
            fontSize: "0.9rem",
          }}
        >
          ← Back to event
        </Link>
      </div>
    </div>
  );
}
