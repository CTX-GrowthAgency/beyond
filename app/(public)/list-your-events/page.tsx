import Link from "next/link";

export default function ListYourEventsPage() {
  return (
    <div className="container" style={{ paddingTop: "var(--spacing-12)", paddingBottom: "var(--spacing-12)" }}>
      <h1 className="heading-1">List Your Events</h1>
      <p className="body-2 text-muted" style={{ marginTop: 8 }}>
        Interested in listing your event? Contact us at{" "}
        <a href="mailto:support@beyondgoa.com" style={{ color: "var(--color-accent-primary)" }}>
          support@beyondgoa.com
        </a>
      </p>
      <Link href="/" className="body-2" style={{ color: "var(--color-accent-primary)", marginTop: 16, display: "inline-block" }}>
        ← Back to home
      </Link>
    </div>
  );
}
