// Hook for fetching notifications with auto-refresh every 30 seconds

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { fetchNotifications } from "@/lib/api";
import { Log } from "@/lib/logger";
import { Notification, NotificationType } from "@/lib/types";

const REFRESH_INTERVAL = 30000; // 30 seconds

interface UseNotificationsOptions {
  limit?: number;
  page?: number;
  notification_type?: NotificationType;
  autoFetch?: boolean;
  autoRefresh?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
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
      const params: Record<string, unknown> = {};
      if (limit) params.limit = limit;
      if (page) params.page = page;
      if (notification_type) params.notification_type = notification_type;

      const data = await fetchNotifications(params as Parameters<typeof fetchNotifications>[0]);
      setNotifications(data);
      setLastUpdated(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      await Log("error", "hook", `Fetch failed: ${msg.slice(0, 30)}`);
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, notification_type]);

  // initial fetch
  useEffect(() => {
    if (autoFetch) refetch();
  }, [autoFetch, refetch]);

  // auto-refresh on a timer
  useEffect(() => {
    if (!autoRefresh) return;
    intervalRef.current = setInterval(refetch, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoRefresh, refetch]);

  return { notifications, isLoading, error, refetch, lastUpdated };
}
