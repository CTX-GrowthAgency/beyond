import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ error: "No token" }, { status: 400 });
  }

  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

  const adminAuth = getAdminAuth();
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn,
  });

  (await cookies()).set("session", sessionCookie, {
    httpOnly: true,
    secure: true,
    maxAge: expiresIn / 1000,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
