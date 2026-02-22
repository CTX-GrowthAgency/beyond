import EventCard from "@/components/event/EventCard";
import SearchBar from "@/components/ui/SearchBar";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { Event } from '../../type/event';

async function getFeaturedEvents(): Promise<Event[]> {
  return sanityClient.fetch(`
    *[_type == "event" && featured == true] 
    | order(eventDate asc) {
      _id,
      title,
      "slug": eventSlug.current,
      displayPoster
    }
  `);
}

export default async function HomePage() {
  const events = await getFeaturedEvents();

  return (
    <section className="min-h-screen">
      <div className="container flex flex-column gap-20">

        <div className="flex flex-column gap-8" style={{ maxWidth: "700px" }}>
          <h1 className="display-sans-serif-1 uppercase">
            Discover <br />
            Book <br />
            Experience
          </h1>

          <div style={{ maxWidth: "500px" }}>
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-column gap-8">
          <div className="flex flex-column gap-2">
            <span
              className="label uppercase"
              style={{ color: "var(--color-accent-primary)" }}
            >
              Upcoming
            </span>

            <h2 className="heading-2 uppercase">
              Featured Events
            </h2>
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

      </div>
    </section>
  );
}