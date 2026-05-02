/**
 * Authentication helper for the Backend Application.
 * Obtains a Bearer token to access protected evaluation server APIs.
 */

import { CONFIG, BASE_URL } from "./config";

/** Cached access token */
let accessToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtains and caches a Bearer token from the evaluation auth endpoint.
 * Automatically refreshes the token when it nears expiry.
 *
 * @returns Bearer access token
 * @throws Error if authentication request fails
 */
export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  /* Return cached token if still valid (60s buffer) */
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
    const errorBody = await response.text();
    throw new Error(`Auth failed (HTTP ${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  accessToken = data.access_token;
  tokenExpiry = data.expires_in;

  return accessToken as string;
}
