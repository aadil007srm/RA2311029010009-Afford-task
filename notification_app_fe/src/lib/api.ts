/**
 * API client for the Campus Notifications frontend.
 * Handles all communication with the evaluation server's notification endpoints.
 */

import { CONFIG } from "./config";
import { getAuthToken } from "./auth";
import { Log } from "./logger";
import {
  Notification,
  NotificationsResponse,
  NotificationQueryParams,
} from "./types";

/**
 * Fetches notifications from the evaluation server with optional filters.
 *
 * @param params - Optional query parameters (limit, page, notification_type)
 * @returns Array of notification objects
 */
export async function fetchNotifications(
  params?: NotificationQueryParams
): Promise<Notification[]> {
  await Log("info", "api", `Fetching notifications with params: ${JSON.stringify(params || {})}`);

  try {
    const token = await getAuthToken();

    /* Build query string from parameters */
    const queryParts: string[] = [];
    if (params?.limit) queryParts.push(`limit=${params.limit}`);
    if (params?.page) queryParts.push(`page=${params.page}`);
    if (params?.notification_type) queryParts.push(`notification_type=${params.notification_type}`);

    const queryString = queryParts.length > 0 ? `?${queryParts.join("&")}` : "";

    const response = await fetch(`${CONFIG.BASE_URL}/notifications${queryString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      await Log("error", "api", `Notifications API error (HTTP ${response.status}): ${errorBody}`);
      throw new Error(`API error (HTTP ${response.status}): ${errorBody}`);
    }

    const data: NotificationsResponse = await response.json();

    await Log("info", "api", `Successfully fetched ${data.notifications.length} notifications`);

    return data.notifications;
  } catch (error) {
    await Log("error", "api", `Failed to fetch notifications: ${error}`);
    throw error;
  }
}
