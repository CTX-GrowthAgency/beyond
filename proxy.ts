import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function proxy(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  if (!session) {
    if (req.nextUrl.pathname.startsWith("/organizer")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  try {
    const adminAuth = getAdminAuth();
    await adminAuth.verifySessionCookie(session, true);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/organizer/:path*", "/profile/:path*", "/booking/:path*"],
};