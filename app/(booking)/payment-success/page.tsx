import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentSuccessRedirectPage({ searchParams }: Props) {
  const query = await searchParams;

  const pickFirst = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const bookingId = pickFirst(query.bookingId);
  const orderId = pickFirst(query.orderId ?? query.order_id);

  if (!bookingId) {
    redirect("/bookings");
  }

  if (orderId) {
    redirect(`/success/${bookingId}?orderId=${encodeURIComponent(orderId)}`);
  }

  redirect(`/success/${bookingId}`);
}