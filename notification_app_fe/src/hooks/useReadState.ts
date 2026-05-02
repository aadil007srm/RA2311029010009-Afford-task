// Read/unread tracking — stores which notifications have been seen in localStorage

"use client";

import { useState, useCallback, useEffect } from "react";
import { Log } from "@/lib/logger";

const STORAGE_KEY = "buzzboard_read_ids";

function loadFromStorage(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveToStorage(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* storage full, ignore */ }
}

export function useReadState() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // load saved read state on mount
  useEffect(() => {
    const ids = loadFromStorage();
    setReadIds(ids);
    Log("info", "hook", `Loaded ${ids.size} read IDs`);
  }, []);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  const markAsRead = useCallback((id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback((ids: string[]) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      saveToStorage(next);
      return next;
    });
  }, []);

  const getUnreadCount = useCallback(
    (ids: string[]) => ids.filter((id) => !readIds.has(id)).length,
    [readIds]
  );

  return { isRead, markAsRead, markAllAsRead, getUnreadCount };
}
