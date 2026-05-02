// Frontend config — reads from env vars set in .env file
// Next.js auto-loads .env, but client-side vars need the NEXT_PUBLIC_ prefix

export const CONFIG = {
  BASE_URL: "/api/proxy", // proxied through next.config.ts to avoid CORS
  email: process.env.NEXT_PUBLIC_EMAIL || "",
  name: process.env.NEXT_PUBLIC_NAME || "",
  rollNo: process.env.NEXT_PUBLIC_ROLL_NO || "",
  accessCode: process.env.NEXT_PUBLIC_ACCESS_CODE || "",
  clientID: process.env.NEXT_PUBLIC_CLIENT_ID || "",
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET || "",
};
