/**
 * Custom hook for fetching notifications with auto-refresh.
 */

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { fetchNotifications } from "@/lib/api";
import { Log } from "@/lib/logger";
import { Notification, NotificationType } from "@/lib/types";

/** Auto-refresh interval in milliseconds (30 seconds) */
const REFRESH_INTERVAL = 30000;

interface UseNotificationsOptions {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
  autoFetch?: boolean;
  autoRefresh?: boolean;
}

interface UseNotificationsResult {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook for fetching and managing notification data.
 * Supports auto-refresh to poll for new notifications.
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsResult {
  const { limit, page, notification_type, autoFetch = true, autoRefresh = true } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Log("info", "hook", `Fetching notifications`);

      const params: Record<string, unknown> = {};
      if (limit) params.limit = limit;
      if (page) params.page = page;
      if (notification_type) params.notification_type = notification_type;

      const data = await fetchNotifications(params as Parameters<typeof fetchNotifications>[0]);
      setNotifications(data);
      setLastUpdated(new Date());

      await Log("info", "hook", `Fetched ${data.length} notifications`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      await Log("error", "hook", `Fetch failed: ${message.slice(0, 30)}`);
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, notification_type]);

  /* Initial fetch */
  useEffect(() => {
    if (autoFetch) {
      refetch();
    }
  }, [autoFetch, refetch]);

  /* Auto-refresh every 30 seconds */
  useEffect(() => {
    if (!autoRefresh) return;

    intervalRef.current = setInterval(() => {
      refetch();
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh, refetch]);

  return { notifications, isLoading, error, refetch, lastUpdated };
}
