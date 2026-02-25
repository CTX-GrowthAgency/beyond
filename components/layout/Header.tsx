"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
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
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const isLoggedIn = !!currentUser?.uid;

  // Scroll-aware header border
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;

      setCurrentUser((existingUser) =>
        existingUser ?? {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ?? "",
          email: firebaseUser.email ?? "",
        }
      );

      if (user?.uid) return;

      try {
        const idToken = await firebaseUser.getIdToken(true);
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!loginResponse.ok) throw new Error("Could not create server session");
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
    <>
      <style>{`
        .hdr-root {
          position: sticky;
          top: 0;
          z-index: var(--z-index-sticky, 200);
          width: 100%;
          /* Frosted glass — premium feel as you scroll over content */
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(2, 2, 2, 0.82);
          /* Border starts invisible, fades in on scroll via .hdr-root--scrolled */
          border-bottom: 1px solid transparent;
          transition: border-color 250ms ease, background 250ms ease;
        }
        .hdr-root--scrolled {
          border-bottom-color: var(--color-border-on-dark-subtle, #1F1F1F);
          background: rgba(2, 2, 2, 0.92);
        }

        .hdr-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-4);
          padding-top: var(--spacing-4);
          padding-bottom: var(--spacing-4);
        }

        /* Logo link — no opacity flicker on hover */
        .hdr-logo {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          opacity: 1;
          transition: opacity 150ms ease;
        }
        .hdr-logo:hover { opacity: 0.7; }

        /* ── Login button — ghost outlined, matches the dark system ── */
        .hdr-btn-login {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-2);
          padding: var(--spacing-3) var(--spacing-6);
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border-on-dark-strong, #4D4D4D);
          background: transparent;
          color: var(--color-text-on-dark-primary, #FAFAFA);
          font-family: var(--font-family-avalon);
          font-size: var(--font-button-size);
          font-weight: var(--font-weight-semibold);
          letter-spacing: var(--letter-spacing-wide);
          text-transform: uppercase;
          cursor: pointer;
          white-space: nowrap;
          transition: border-color 150ms ease,
                      background 150ms ease,
                      color 150ms ease,
                      transform 150ms ease;
        }
        .hdr-btn-login:hover:not(:disabled) {
          border-color: var(--color-text-on-dark-primary, #FAFAFA);
          background: rgba(255,255,255,0.05);
          transform: translateY(-1px);
          opacity: 1; /* override global a:hover opacity */
        }
        .hdr-btn-login:active { transform: translateY(0); }
        .hdr-btn-login:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Small Google icon inside login button */
        .hdr-btn-login-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          opacity: 0.7;
        }

        /* ── User chip — tighter, matches pill height ── */
        .hdr-user-chip {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border-on-dark-default, #1D1D1D);
          background: var(--color-surface-on-dark-base, #0A0A0A);
          color: var(--color-text-on-dark-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 150ms ease,
                      background 150ms ease,
                      transform 150ms ease;
        }
        .hdr-user-chip:hover {
          border-color: var(--color-border-on-dark-strong, #4D4D4D);
          background: var(--color-surface-on-dark-hover, #121212);
          transform: translateY(-1px);
          opacity: 1;
        }
        .hdr-user-chip[aria-expanded="true"] {
          border-color: var(--color-border-on-dark-strong, #4D4D4D);
          background: var(--color-surface-on-dark-active, #161616);
        }

        /* ── Dropdown menu ── */
        .hdr-menu {
          position: absolute;
          top: calc(100% + var(--spacing-2));
          right: 0;
          min-width: 200px;
          padding: var(--spacing-1);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-on-dark-subtle, #1F1F1F);
          background: var(--color-surface-on-dark-base, #0A0A0A);
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
          z-index: var(--z-index-dropdown, 100);
          /* Slide-in animation */
          animation: hdr-menu-in 0.16s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes hdr-menu-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .hdr-menu-item {
          width: 100%;
          text-align: left;
          padding: var(--spacing-3) var(--spacing-4);
          border-radius: var(--radius-md);
          background: transparent;
          border: 0;
          color: var(--color-text-on-dark-secondary, #CFCFCF);
          font-family: var(--font-family-avalon);
          font-size: var(--font-button-size);
          font-weight: var(--font-weight-medium);
          letter-spacing: var(--letter-spacing-normal);
          text-transform: none;
          cursor: pointer;
          transition: background 120ms ease, color 120ms ease;
        }
        .hdr-menu-item:hover {
          background: rgba(255,255,255,0.055);
          color: var(--color-text-on-dark-primary, #FAFAFA);
          opacity: 1;
        }
        .hdr-menu-item--danger {
          color: var(--color-error-text, #FFB4B6);
        }
        .hdr-menu-item--danger:hover {
          background: rgba(229,72,77,0.08);
          color: var(--color-error-text, #FFB4B6);
        }

        .hdr-menu-sep {
          height: 1px;
          margin: var(--spacing-1) 0;
          background: var(--color-border-on-dark-subtle, #1F1F1F);
        }

        /* Optional user info row at top of menu */
        .hdr-menu-user {
          padding: var(--spacing-3) var(--spacing-4) var(--spacing-2);
          pointer-events: none;
        }
        .hdr-menu-user-name {
          font-size: 13px;
          font-weight: var(--font-weight-semibold);
          color: var(--color-text-on-dark-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hdr-menu-user-email {
          font-size: 11px;
          color: var(--color-text-on-dark-muted, #6F6F6F);
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      <header className={`hdr-root${scrolled ? " hdr-root--scrolled" : ""}`}>
        <div className="container hdr-inner">

          {/* Logo */}
          <Link href="/" className="hdr-logo" aria-label="Beyond — Home">
            <Image
              src="/logo.svg"
              alt="Beyond"
              width={110}
              height={36}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          {/* Right side */}
          {isLoggedIn ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className="hdr-user-chip"
                title={currentUser?.name || currentUser?.email || "Account"}
              >
                <Image
                  src="/icons/user.svg"
                  alt=""
                  aria-hidden="true"
                  width={16}
                  height={16}
                  style={{ width: "auto", height: "auto" }}
                />
              </button>

              {menuOpen && (
                <div className="hdr-menu" role="menu">
                  {/* User info */}
                  {(currentUser?.name || currentUser?.email) && (
                    <>
                      <div className="hdr-menu-user">
                        {currentUser?.name && (
                          <div className="hdr-menu-user-name">{currentUser.name}</div>
                        )}
                        {currentUser?.email && (
                          <div className="hdr-menu-user-email">{currentUser.email}</div>
                        )}
                      </div>
                      <div className="hdr-menu-sep" />
                    </>
                  )}

                  <button
                    type="button"
                    role="menuitem"
                    className="hdr-menu-item"
                    onClick={() => { setMenuOpen(false); router.push("/bookings"); }}
                  >
                    My Bookings
                  </button>

                  <div className="hdr-menu-sep" />

                  <button
                    type="button"
                    role="menuitem"
                    className="hdr-menu-item hdr-menu-item--danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="hdr-btn-login"
              onClick={handleLogin}
              disabled={isLoggingIn}
              aria-label="Sign in with Google"
            >
              {/* Google G icon */}
              {!isLoggingIn && (
                <svg className="hdr-btn-login-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </button>
          )}

        </div>
      </header>
    </>
  );
}