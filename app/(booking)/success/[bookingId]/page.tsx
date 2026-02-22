import PaymentSuccessView from "@/components/checkout/PaymentSuccessView";

type Props = {
  params: Promise<{ bookingId: string }>;
};

export default async function PaymentSuccessPage({ params }: Props) {
  const { bookingId } = await params;
  return <PaymentSuccessView bookingId={bookingId} />;
}