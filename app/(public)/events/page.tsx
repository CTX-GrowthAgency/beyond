import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import EventCard from "@/components/event/EventCard";
import { Event } from '../../../type/event';

async function getAllEvents(): Promise<Event[]> {
    return sanityClient.fetch(`
    *[_type == "event"] 
    | order(eventDate desc) {
      _id,
      title,
      "slug": eventSlug.current,
      displayPoster,
      eventDate
    }
  `);
}

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <section className="min-h-screen">
      <div className="container flex flex-column gap-16">

        <div className="flex flex-column gap-4">
          <h1 className="display-sans-serif-2 uppercase">
            All Events
          </h1>
          <p className="body-2 text-muted">
            Discover what’s happening next.
          </p>
        </div>

        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {events.filter((e) => e.slug).map((event) => (
            <EventCard
              key={event._id}
              id={event.slug!}
              title={event.title}
              image={
                event.displayPoster
                  ? urlFor(event.displayPoster).width(600).url()
                  : "/placeholder.jpg"
              }
            />
          ))}
        </div>

      </div>
    </section>
  );
}