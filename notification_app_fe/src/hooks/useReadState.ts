/**
 * Custom hook for managing notification read/unread state.
 * Persists read state in localStorage so it survives page refreshes.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import { Log } from "@/lib/logger";

const STORAGE_KEY = "campus_notify_read_ids";

/**
 * Loads read notification IDs from localStorage.
 */
function loadReadIds(): Set<string> {
  if (typeof window === "undefined") return new Set();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch {
    /* Silently fall back to empty set if storage is corrupted */
  }
  return new Set();
}

/**
 * Saves read notification IDs to localStorage.
 */
function saveReadIds(ids: Set<string>): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    /* Silently fail if localStorage is full */
  }
}

/**
 * Hook for managing read/unread state of notifications.
 *
 * @returns Object with read state utilities
 */
export function useReadState() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  /* Load from localStorage on mount */
  useEffect(() => {
    const ids = loadReadIds();
    setReadIds(ids);
    Log("info", "hook", `Loaded ${ids.size} read notification IDs from storage`);
  }, []);

  /** Check if a notification has been read */
  const isRead = useCallback(
    (id: string): boolean => readIds.has(id),
    [readIds]
  );

  /** Mark a single notification as read */
  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      Log("info", "hook", `Marked notification ${id.slice(0, 8)}... as read`);
      return next;
    });
  }, []);

  /** Mark all provided IDs as read */
  const markAllAsRead = useCallback((ids: string[]) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      saveReadIds(next);
      Log("info", "hook", `Marked ${ids.length} notifications as read`);
      return next;
    });
  }, []);

  /** Count unread notifications from a given list */
  const getUnreadCount = useCallback(
    (ids: string[]): number => ids.filter((id) => !readIds.has(id)).length,
    [readIds]
  );

  return { isRead, markAsRead, markAllAsRead, getUnreadCount };
}
