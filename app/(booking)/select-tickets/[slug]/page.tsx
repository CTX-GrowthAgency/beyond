export default function SelectTicketsPage({ params }: { params: { slug: string } }) {
  return <div>Select tickets for event: {params.slug}</div>;
}