// API client — handles fetching notifications from the server

import { CONFIG } from "./config";
import { getAuthToken } from "./auth";
import { Log } from "./logger";
import { Notification, NotificationsResponse, NotificationQueryParams } from "./types";

export async function fetchNotifications(params?: NotificationQueryParams): Promise<Notification[]> {
  await Log("info", "api", "Fetching notifications");

  try {
    const token = await getAuthToken();

    // build query string
    const parts: string[] = [];
    if (params?.limit) parts.push(`limit=${params.limit}`);
    if (params?.page) parts.push(`page=${params.page}`);
    if (params?.notification_type) parts.push(`notification_type=${params.notification_type}`);
    const qs = parts.length > 0 ? `?${parts.join("&")}` : "";

    const response = await fetch(`${CONFIG.BASE_URL}/notifications${qs}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      await Log("error", "api", `HTTP ${response.status} error`);
      throw new Error(`API error (HTTP ${response.status}): ${body}`);
    }

    const data: NotificationsResponse = await response.json();
    await Log("info", "api", `Got ${data.notifications.length} notifications`);
    return data.notifications;
  } catch (err) {
    await Log("error", "api", "Fetch failed");
    throw err;
  }
}
