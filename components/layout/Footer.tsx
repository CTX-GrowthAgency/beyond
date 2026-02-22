import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full" style={{ paddingTop: "var(--spacing-16)", paddingBottom: "var(--spacing-10)" }}>
      <div className="container flex flex-column gap-10">

        {/* Top Section */}
        <div className="flex justify-between items-start sm:items-center flex-wrap gap-6">

          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.svg"
              alt="Beyond Logo"
              width={120}
              height={40}
            />
          </Link>

          <nav className="flex gap-6 flex-wrap body-2 text-secondary">
            <Link href="/terms_and_conditions">Terms & Conditions</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </nav>

        </div>

        {/* Bottom Section */}
        <div className="body-2 text-muted">
          By accessing this page you confirm that you have read, understood and
          agree to our Terms of Service, Privacy Policy and Guideline. All
          rights reserved.
        </div>

      </div>
    </footer>
  );
}
