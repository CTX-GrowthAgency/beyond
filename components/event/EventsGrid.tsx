"use client";

import { useRouter } from "next/navigation";
import EventCard from "@/components/event/EventCard";

interface EventItem {
  _id: string;
  slug: string;
  title: string;
  image: string;
}

interface Props {
  events: EventItem[];
}

export default function EventsGrid({ events }: Props) {
  const router = useRouter();

  if (events.length === 0) {
    return (
      <div className="hp-events-grid">
        <div className="hp-empty">
          No featured events right now — check back soon
        </div>
      </div>
    );
  }

  return (
    <div className="hp-events-grid">
      {events.map((event, index) => (
        <div
          key={event._id}
          className="hp-card-wrap"
          onClick={() => router.push(`/events/${event.slug}`)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              router.push(`/events/${event.slug}`);
            }
          }}
          role="link"
          tabIndex={0}
          aria-label={`Book tickets for ${event.title}`}
        >
          <span className="hp-card-pill" aria-hidden="true">
            Book Now
          </span>
          <EventCard
            title={event.title}
            image={event.image}
            priority={index < 3}
          />
        </div>
      ))}
    </div>
  );
}