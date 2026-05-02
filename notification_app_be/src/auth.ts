// Gets a bearer token from the evaluation server
// Caches it until it's about to expire

import { CONFIG, BASE_URL } from "./config";

let accessToken: string | null = null;
let tokenExpiry = 0;

export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // return cached token if still valid
  if (accessToken && tokenExpiry > now + 60) {
    return accessToken;
  }

  const response = await fetch(`${BASE_URL}/auth`, {
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

  const data = (await response.json()) as { access_token: string; expires_in: number };
  accessToken = data.access_token;
  tokenExpiry = data.expires_in;

  return accessToken as string;
}
