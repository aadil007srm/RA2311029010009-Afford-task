// Notification types and API fetch utility

import { BASE_URL } from "./config";
import { getAuthToken } from "./auth";
import { Log } from "logging-middleware";

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

interface NotificationsResponse {
  notifications: Notification[];
}

// priority weights — placement matters most, then results, then events
export const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

// fetches all notifications from the evaluation server
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
    const body = await response.text();
    await Log("backend", "error", "service", `Fetch failed: HTTP ${response.status}`);
    throw new Error(`Notifications API failed (HTTP ${response.status}): ${body}`);
  }

  const data = (await response.json()) as NotificationsResponse;
  await Log("backend", "info", "service", `Fetched ${data.notifications.length} notifications OK`);

  return data.notifications;
}
