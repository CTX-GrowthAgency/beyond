export default function CheckoutPage({ params }: { params: { slug: string } }) {
  return <div>Checkout for event: {params.slug}</div>;
}