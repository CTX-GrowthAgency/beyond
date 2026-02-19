"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface Props {
  id: string;
  title: string;
  image: string;
}

export default function EventCard({ id, title, image }: Props) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = imageError || !image;

  return (
    <Link href={`/events/${id}`} className="card-link">
      <div className="card">
        {showPlaceholder ? (
          <div className="card-placeholder" aria-hidden="true" />
        ) : (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
            onError={() => setImageError(true)}
          />
        )}
      </div>
    </Link>
  );
}
