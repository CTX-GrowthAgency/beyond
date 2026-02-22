import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}