/**
 * Central API configuration.
 * NEXT_PUBLIC_API_URL / NEXT_PUBLIC_WS_URL are set in .env.local (local dev)
 * and in Vercel → Environment Variables for production.
 */

export const API_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export const WS_URL =
  (process.env.NEXT_PUBLIC_WS_URL || "ws://127.0.0.1:8000").replace(/\/$/, "");
