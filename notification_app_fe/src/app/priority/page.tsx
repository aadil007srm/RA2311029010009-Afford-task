/**
 * Priority Inbox Page — Top N notifications ranked by importance.
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { useNotifications } from "@/hooks/useNotifications";
import { useReadState } from "@/hooks/useReadState";
import { getTopNNotifications } from "@/lib/priorityUtils";
import { Notification, NotificationType } from "@/lib/types";
import { Log } from "@/lib/logger";

export default function PriorityPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType | "All">("All");
  const [topN, setTopN] = useState(10);
  const { isRead, markAsRead } = useReadState();
  const { notifications, isLoading, error, refetch } = useNotifications();

  useEffect(() => {
    Log("info", "page", "Priority page loaded");
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n: Notification) => n.Type === activeFilter);
  }, [notifications, activeFilter]);

  const priorityNotifications = useMemo(() => {
    return getTopNNotifications(filtered, topN);
  }, [filtered, topN]);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4">Priority Inbox</Typography>
        <Typography variant="body2">
          Top {topN} notifications ranked by type weight + recency
        </Typography>
      </Box>

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={(f) => { setActiveFilter(f); Log("info", "page", `Filter: ${f}`); }}
        totalCount={priorityNotifications.length}
        onRefresh={refetch}
        isLoading={isLoading}
        topN={topN}
        onTopNChange={(n) => { setTopN(n); Log("info", "page", `Top N: ${n}`); }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem" }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={60} sx={{ mb: 1, borderRadius: 2 }} />
        ))
      ) : priorityNotifications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "#94A3B8" }}>
          <Typography sx={{ fontSize: "0.875rem" }}>No notifications to display</Typography>
        </Box>
      ) : (
        priorityNotifications.map((n: Notification, i: number) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isRead={isRead(n.ID)}
            onMarkRead={markAsRead}
            rank={i + 1}
          />
        ))
      )}
    </Box>
  );
}
