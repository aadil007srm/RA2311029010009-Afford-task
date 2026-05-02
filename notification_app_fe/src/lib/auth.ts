// Auth for frontend — gets bearer token and caches it

import { CONFIG } from "./config";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && tokenExpiry > now + 60) {
    return cachedToken;
  }

  const response = await fetch(`${CONFIG.BASE_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: CONFIG.email,
      name: CONFIG.name,
      rollNo: CONFIG.rollNo,
      accessCode: CONFIG.accessCode,
      clientID: CONFIG.clientID,
      clientSecret: CONFIG.clientSecret,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Auth failed (HTTP ${response.status}): ${body}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;

  return cachedToken as string;
}
