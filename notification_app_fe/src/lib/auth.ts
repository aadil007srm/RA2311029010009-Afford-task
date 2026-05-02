/**
 * Authentication module for the Frontend Application.
 * Handles obtaining and caching Bearer tokens from the evaluation server.
 */

import { CONFIG } from "./config";

/** Cached auth state */
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Obtains a Bearer token from the evaluation auth endpoint.
 * Caches the token and auto-refreshes on expiry.
 *
 * @returns Bearer access token
 */
export async function getAuthToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  /* Return cached token if still valid (60s buffer) */
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
    const errorBody = await response.text();
    throw new Error(`Auth failed (HTTP ${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiry = data.expires_in;

  return cachedToken as string;
}
