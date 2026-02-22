import BookingDetail from "@/components/bookings/BookingDetail";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  return <BookingDetail bookingId={bookingId} />;
}

