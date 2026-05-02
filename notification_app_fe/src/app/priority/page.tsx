// Priority Inbox page — top N ranked notifications

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
  const [filter, setFilter] = useState<NotificationType | "All">("All");
  const [topN, setTopN] = useState(10);
  const { isRead, markAsRead } = useReadState();
  const { notifications, isLoading, error, refetch, lastUpdated } = useNotifications();

  useEffect(() => { Log("info", "page", "Priority page loaded"); }, []);

  const filtered = useMemo(() =>
    filter === "All" ? notifications : notifications.filter((n: Notification) => n.Type === filter),
    [notifications, filter]
  );

  const prioritized = useMemo(() => getTopNNotifications(filtered, topN), [filtered, topN]);

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", py: 2 }}>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4">Priority Inbox</Typography>
        <Typography variant="body2">
          Top {topN} by importance
          {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ""} · Auto-refreshes every 30s
        </Typography>
      </Box>

      <FilterBar
        activeFilter={filter}
        onFilterChange={(f) => setFilter(f)}
        totalCount={prioritized.length}
        onRefresh={refetch}
        isLoading={isLoading}
        topN={topN}
        onTopNChange={setTopN}
      />

      {error && <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem" }}>{error}</Alert>}

      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={48} sx={{ mb: 0.75, borderRadius: 2, bgcolor: "#2C2C2E" }} />)
      ) : prioritized.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "#666" }}>
          <Typography sx={{ fontSize: "0.85rem" }}>No notifications to display</Typography>
        </Box>
      ) : (
        prioritized.map((n: Notification, i: number) => (
          <NotificationCard key={n.ID} notification={n} isRead={isRead(n.ID)} onMarkRead={markAsRead} rank={i + 1} />
        ))
      )}
    </Box>
  );
}
