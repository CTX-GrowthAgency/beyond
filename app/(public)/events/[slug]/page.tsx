import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import type { Event } from "@/type/event";

async function getEvent(slug: string): Promise<Event | null> {
  console.log("Fetching event with slug:", slug);
  
  const query = `*[_type == "event" && eventSlug.current == $slug][0]{
    _id,
    title,
    description,
    eventDate,
    venueName,
    venueAddress,
    googleMapsLink,
    cover{
      asset->
    },
    artists[]{
      name,
      role,
      instagram,
      image{
        asset->
      }
    },
    ticketTypes
  }`;
  
  console.log("Sanity query:", query);
  
  try {
    const result = await sanityClient.fetch(query, { slug });
    console.log("Sanity result:", result);
    return result;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await sanityClient.fetch(`
    *[_type == "event"]{
      "slug": eventSlug.current
    }
  `);

  return slugs.map((item) => ({
    slug: item.slug,
  }));
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div className="container">Invalid slug</div>;
  }

  try {
    const event = await getEvent(slug);

    if (!event) {
      return <div className="container">Event not found for slug: {slug}</div>;
    }

    console.log("Event data:", event);

    return (
      <section className="min-h-screen bg-black text-white">
        <div className="container flex flex-column gap-16">

          {/* Debug: Show what we have for cover */}
          {event.cover && (
            <div style={{ padding: '20px', border: '1px solid red', margin: '20px 0' }}>
              <h3>Debug - cover data:</h3>
              <pre>{JSON.stringify(event.cover, null, 2)}</pre>
            </div>
          )}

          {event.cover?.asset ? (
            <Image
              src={urlFor(event.cover).width(1400).url()}
              alt={event.title}
              width={1400}
              height={800}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "var(--radius-lg)",
              }}
              priority
            />
          ) : (
            <div style={{ 
              width: "100%", 
              height: "400px", 
              backgroundColor: "#333", 
              borderRadius: "var(--radius-lg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666"
            }}>
              No cover image available
            </div>
          )}

          <h1 className="display-sans-serif-2 uppercase">
            {event.title}
          </h1>

          {event.description && (
            <p className="body-1 text-secondary">
              {event.description}
            </p>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading event:", error);
    return (
      <div className="container">
        <h1>Error loading event</h1>
        <p>Slug: {slug}</p>
        <p>Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}