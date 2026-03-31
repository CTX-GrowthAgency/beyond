export default async function SelectTicketsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <div>Select tickets for event: {slug}</div>;
}