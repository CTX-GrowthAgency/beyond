import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function getCurrentUser() {
  const session = (await cookies()).get("session")?.value;

  if (!session) return null;

  try {
    const adminAuth = getAdminAuth();
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return decoded;
  } catch {
    return null;
  }
}
