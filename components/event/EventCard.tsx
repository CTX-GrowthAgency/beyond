"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  title: string;
  image: string;
  priority?: boolean;
}

export default function EventCard({ title, image, priority = false }: Props) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = imageError || !image;

  return (
    <div className="card">
      {showPlaceholder ? (
        <div className="card-placeholder" aria-hidden="true" />
      ) : (
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: "cover", borderRadius: 0 }}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}