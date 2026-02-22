import { sanityClient } from "@/lib/sanity/client";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

interface TicketType {
  name: string;
  price: number;
  description?: string;
}

async function getEventForCheckout(slug: string) {
  const query = `*[_type == "event" && eventSlug.current == $slug][0]{
    _id,
    title,
    eventDate,
    venueName,
    ticketTypes
  }`;
  try {
    return await sanityClient.fetch(query, { slug });
  } catch {
    return null;
  }
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;

  if (!slug) return notFound();

  const event = await getEventForCheckout(slug);
  if (!event) return notFound();

  // Parse ticket selections from URL query params (?t0=2&t1=1 etc.)
  const ticketSelections = (event.ticketTypes ?? []).map((t: TicketType, i: number) => {
    const qty = parseInt(String(query[`t${i}`] ?? "0"), 10);
    return {
      name: t.name,
      price: t.price ?? 0,
      quantity: isNaN(qty) ? 0 : qty,
    };
  });

  const hasTickets = ticketSelections.some((t: { quantity: number }) => t.quantity > 0);
  if (!hasTickets) redirect(`/events/${slug}`);

  return (
    <CheckoutClient
    slug={slug}
    ticketSelections={ticketSelections}
    eventTitle={event.title}
    eventDate={event.eventDate ?? ""}
    venueName={event.venueName ?? ""}
    eventSanityId={event._id}
  />
  );
}