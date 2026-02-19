import EventCard from "@/components/event/EventCard";
import SearchBar from "@/components/ui/SearchBar";

const events = [
  {
    id: "gigi",
    title: "Gigi",
    image: "",
  },
  {
    id: "artbat",
    title: "Artbat",
    image: "",
  },
  {
    id: "masha-vincent",
    title: "Masha Vincent",
    image: "",
  },
];

export default function HomePage() {
  return (
    <section className="min-h-screen">
      <div className="container flex flex-column gap-20">

        {/* HERO SECTION */}
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

        {/* FEATURED SECTION */}
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
            {events.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}