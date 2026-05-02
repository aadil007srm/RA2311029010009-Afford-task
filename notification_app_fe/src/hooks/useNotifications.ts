/**
 * Custom hook for fetching notifications with caching and error handling.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchNotifications } from "@/lib/api";
import { Log } from "@/lib/logger";
import { Notification, NotificationType } from "@/lib/types";

interface UseNotificationsOptions {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
  autoFetch?: boolean;
}

interface UseNotificationsResult {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and managing notification data.
 *
 * @param options - Query parameters and configuration
 * @returns Notifications data, loading state, error, and refetch function
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsResult {
  const { limit, page, notification_type, autoFetch = true } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Log("info", "hook", `Fetching notifications — type: ${notification_type || "all"}, limit: ${limit || "none"}, page: ${page || 1}`);

      const params: Record<string, unknown> = {};
      if (limit) params.limit = limit;
      if (page) params.page = page;
      if (notification_type) params.notification_type = notification_type;

      const data = await fetchNotifications(params as Parameters<typeof fetchNotifications>[0]);
      setNotifications(data);

      await Log("info", "hook", `Fetched ${data.length} notifications successfully`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      await Log("error", "hook", `Failed to fetch notifications: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, notification_type]);

  /* Auto-fetch on mount and when parameters change */
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  return { notifications, isLoading, error, refetch };
}
