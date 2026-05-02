/**
 * Notification type definitions and fetch utilities.
 * Handles communication with the evaluation server's Notification API.
 */

import { BASE_URL } from "./config";
import { getAuthToken } from "./auth";
import { Log } from "logging-middleware";

/** Supported notification types, ordered by priority weight */
export type NotificationType = "Placement" | "Result" | "Event";

/** Shape of a single notification from the API */
export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

/** Shape of the notifications API response */
interface NotificationsResponse {
  notifications: Notification[];
}

/**
 * Priority weight mapping — higher weight = more important.
 *   Placement (weight 3) > Result (weight 2) > Event (weight 1)
 */
export const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Fetches all notifications from the evaluation server.
 *
 * @returns Array of notification objects
 * @throws Error if the API request fails
 */
export async function fetchNotifications(): Promise<Notification[]> {
  await Log("backend", "info", "service", "Fetching notifications from server");

  const token = await getAuthToken();

  const response = await fetch(`${BASE_URL}/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    await Log(
      "backend",
      "error",
      "service",
      `Fetch failed: HTTP ${response.status}`
    );
    throw new Error(`Notifications API failed (HTTP ${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as NotificationsResponse;

  await Log(
    "backend",
    "info",
    "service",
    `Fetched ${data.notifications.length} notifications OK`
  );

  return data.notifications;
}
