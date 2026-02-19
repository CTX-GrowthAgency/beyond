"use client";

import Image from "next/image";

export default function SearchBar() {
  return (
    <div
      className="flex items-center justify-between w-full"
      style={{
        maxWidth: "520px",
        padding: "var(--spacing-4) var(--spacing-6)",
        borderRadius: "var(--radius-full)",
        background: "linear-gradient(180deg, #1a1a1a 0%, #141414 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <input
        type="text"
        placeholder="Search events"
        className="body-1"
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          width: "100%",
          color: "var(--color-text-on-dark-primary)",
        }}
      />

      <Image
        src="/icons/search.svg"
        alt="Search"
        width={18}
        height={18}
        style={{ opacity: 0.6 }}
      />
    </div>
  );
}
