import PaymentSuccessView from "@/components/checkout/PaymentSuccessView";

type Props = {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentSuccessPage({ params, searchParams }: Props) {
  const { bookingId } = await params;
  const query = await searchParams;
  const orderId = (query.orderId ?? query.order_id) as string | undefined;
  
  return <PaymentSuccessView bookingId={bookingId} orderId={orderId} />;
}