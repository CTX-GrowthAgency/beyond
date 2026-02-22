"use client";

import Link from "next/link";
import Image from "next/image";import { useEffect, useRef, useState } from "react";
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { app } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export type HeaderUser = {
  uid: string;
  name?: string;
  email?: string;
};

export default function Header({ user }: { user: HeaderUser | null }) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<HeaderUser | null>(user);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const isLoggedIn = !!currentUser?.uid;


  useEffect(() => {
    const auth = getAuth(app);

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        return;
      }

      setCurrentUser((existingUser) =>
        existingUser ?? {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
        },
      );

      if (user?.uid) {
        return;
      }

      try {
        const idToken = await firebaseUser.getIdToken(true);
        await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });
        router.refresh();
      } catch (error) {
        console.error("Session refresh failed:", error);
      }
    });
  }, [router, user?.uid]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!menuOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  async function handleLogin() {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!loginResponse.ok) {
        throw new Error("Could not create server session");
      }

      setCurrentUser({
        uid: result.user.uid,
        name: result.user.displayName ?? "",
        email: result.user.email ?? "",
      });
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setMenuOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <header className="w-full">
      <div className="container flex justify-between items-center" style={{ paddingTop: "var(--spacing-6)", paddingBottom: "var(--spacing-6)" }}>
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.svg"
            alt="Beyond Logo"
            width={120}
            height={40}
            style={{ width: 'auto', height: 'auto' }}
            priority
          />
        </Link>

        {isLoggedIn ? (
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="user-chip"
              title={currentUser?.name || currentUser?.email || "Account"}
            >
              <Image src="/icons/user.svg" alt="User" width={20} height={20} style={{ width: 'auto', height: 'auto' }} />
            </button>

            {menuOpen ? (
              <div className="user-menu" role="menu">
                <button type="button" className="user-menu-item" onClick={() => { setMenuOpen(false); router.push("/profile"); }}>
                  Profile
                </button>
                <button type="button" className="user-menu-item" onClick={() => { setMenuOpen(false); router.push("/bookings"); }}>
                  My Bookings
                </button>
                                <div className="user-menu-sep" />
                <button type="button" className="user-menu-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <button className="btn-pill" onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? "Signing in..." : "Login"}
          </button>
        )}
      </div>
    </header>
  );
}
