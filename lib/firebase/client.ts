import { getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "rushin-production.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "rushin-production",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "rushin-production.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "805396892130",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:805396892130:web:7684a39a651c71a6bc91bb",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export async function getAnalyticsIfSupported() {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;

  const { getAnalytics, isSupported } = await import("firebase/analytics");
  const supported = await isSupported();
  if (!supported) return null;

  return getAnalytics(app);
}