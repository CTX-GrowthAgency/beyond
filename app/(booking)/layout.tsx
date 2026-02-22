import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCurrentUser } from "@/lib/auth/getUser";

export default async function BookingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  const headerUser = user
    ? {
        uid: (user as any).uid ?? (user as any).sub ?? "",
        name: (user as any).name ?? "",
        email: (user as any).email ?? "",
      }
    : null;
  return (
    <>
      <Header user={headerUser} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
