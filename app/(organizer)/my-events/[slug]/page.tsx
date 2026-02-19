export default function OrganizerEventPage({ params }: { params: { slug: string } }) {
  return <div>Organizer Event: {params.slug}</div>;
}