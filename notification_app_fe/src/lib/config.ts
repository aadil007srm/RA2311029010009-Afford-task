/**
 * Frontend configuration.
 * Uses the Next.js rewrite proxy to avoid browser CORS issues.
 * All API calls go through /api/proxy/* which forwards to the evaluation server.
 */

export const CONFIG = {
  /** Proxied base URL — Next.js rewrites this to the evaluation server */
  BASE_URL: "/api/proxy",

  /** Registered credentials from .env */
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  name: process.env.NEXT_PUBLIC_NAME || "",
  rollNo: process.env.NEXT_PUBLIC_ROLL_NO || "",
  accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE || "",
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
};
