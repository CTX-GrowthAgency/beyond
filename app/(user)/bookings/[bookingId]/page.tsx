
export default function BookingDetailsPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return <div>Booking: {params.bookingId}</div>;
}

