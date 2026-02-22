import PaymentSuccessView from "@/components/checkout/PaymentSuccessView";

type Props = {
  searchParams: Promise<{ bookingId?: string; order_id?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <PaymentSuccessView
      bookingId={params.bookingId ?? undefined}
      orderId={params.order_id ?? undefined}
    />
  );
}
