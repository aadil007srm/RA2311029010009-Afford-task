/**
 * All Notifications Page — Clean list with filters and pagination.
 */

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
  const [activeFilter, setActiveFilter] = useState<NotificationType | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { isRead, markAsRead, markAllAsRead, getUnreadCount } = useReadState();
  const { notifications, isLoading, error, refetch } = useNotifications();

  useEffect(() => {
    Log("info", "page", "Notifications page loaded");
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n: Notification) => n.Type === activeFilter);
  }, [notifications, activeFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleFilterChange = (filter: NotificationType | "All") => {
    setActiveFilter(filter);
    setCurrentPage(1);
    Log("info", "page", `Filter: ${filter}`);
  };

  const unreadCount = getUnreadCount(filtered.map((n: Notification) => n.ID));

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", py: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2">All campus updates</Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={() => markAllAsRead(filtered.map((n: Notification) => n.ID))}
            sx={{ color: "#2563EB", fontSize: "0.75rem" }}
          >
            Mark all read ({unreadCount})
          </Button>
        )}
      </Box>

      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        totalCount={filtered.length}
        onRefresh={refetch}
        isLoading={isLoading}
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
      ) : paginated.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "#94A3B8" }}>
          <Typography sx={{ fontSize: "0.875rem" }}>No notifications found</Typography>
        </Box>
      ) : (
        paginated.map((n: Notification) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isRead={isRead(n.ID)}
            onMarkRead={markAsRead}
          />
        ))
      )}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: "0.8rem",
                "&.Mui-selected": { backgroundColor: "#1E293B", color: "#FFF" },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
