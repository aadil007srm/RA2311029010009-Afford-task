// All Notifications page

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { useNotifications } from "@/hooks/useNotifications";
import { useReadState } from "@/hooks/useReadState";
import { Notification, NotificationType } from "@/lib/types";
import { Log } from "@/lib/logger";

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationType | "All">("All");
  const [page, setPage] = useState(1);
  const { isRead, markAsRead, markAllAsRead, getUnreadCount } = useReadState();
  const { notifications, isLoading, error, refetch, lastUpdated } = useNotifications();

  useEffect(() => { Log("info", "page", "Notifications page loaded"); }, []);

  const filtered = useMemo(() =>
    filter === "All" ? notifications : notifications.filter((n: Notification) => n.Type === filter),
    [notifications, filter]
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const unread = getUnreadCount(filtered.map((n: Notification) => n.ID));

  return (
    <Box sx={{ maxWidth: 680, mx: "auto", py: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2.5 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2">
            {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()} · ` : ""}Auto-refreshes every 30s
          </Typography>
        </Box>
        {unread > 0 && (
          <Button size="small" startIcon={<DoneAllIcon sx={{ fontSize: 14 }} />}
            onClick={() => markAllAsRead(filtered.map((n: Notification) => n.ID))}
            sx={{ color: "#F7DF1E", fontSize: "0.72rem", mt: 0.5 }}>
            Mark all read ({unread})
          </Button>
        )}
      </Box>

      <FilterBar activeFilter={filter} onFilterChange={(f) => { setFilter(f); setPage(1); }} totalCount={filtered.length} onRefresh={refetch} isLoading={isLoading} />

      {error && <Alert severity="error" sx={{ mb: 2, fontSize: "0.8rem" }}>{error}</Alert>}

      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="rounded" height={48} sx={{ mb: 0.75, borderRadius: 2, bgcolor: "#2C2C2E" }} />)
      ) : pageData.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8, color: "#666" }}>
          <Typography sx={{ fontSize: "0.85rem" }}>No notifications found</Typography>
        </Box>
      ) : (
        pageData.map((n: Notification) => (
          <NotificationCard key={n.ID} notification={n} isRead={isRead(n.ID)} onMarkRead={markAsRead} />
        ))
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination count={totalPages} page={page}
            onChange={(_, p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            size="small"
            sx={{ "& .MuiPaginationItem-root": { color: "#8B8B8B", fontSize: "0.78rem", "&.Mui-selected": { backgroundColor: "#F7DF1E", color: "#1A1A1D" } } }}
          />
        </Box>
      )}
    </Box>
  );
}
