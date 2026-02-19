export default function EventPage({ params }: { params: { slug: string } }) {
  return <div>Event: {params.slug}</div>;
}