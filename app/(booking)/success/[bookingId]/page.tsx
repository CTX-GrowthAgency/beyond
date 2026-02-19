export default function SuccessPage({ params }: { params: { bookingId: string } }) {
  return <div>Booking successful! ID: {params.bookingId}</div>;
}