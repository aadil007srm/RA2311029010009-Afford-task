/**
 * All Notifications Page — Displays all campus notifications.
 * Features type filtering, pagination, and read/unread tracking.
 */

"use client";

import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Fade from "@mui/material/Fade";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { useNotifications } from "@/hooks/useNotifications";
import { useReadState } from "@/hooks/useReadState";
import { Notification, NotificationType } from "@/lib/types";
import { Log } from "@/lib/logger";

/** Items per page */
const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<NotificationType | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const { isRead, markAsRead, markAllAsRead, getUnreadCount } = useReadState();

  /* Fetch all notifications */
  const { notifications, isLoading, error, refetch } = useNotifications();

  useEffect(() => {
    Log("info", "page", "All Notifications page loaded");
  }, []);

  /* Apply type filter */
  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") return notifications;
    return notifications.filter((n: Notification) => n.Type === activeFilter);
  }, [notifications, activeFilter]);

  /* Pagination */
  const totalPages = Math.ceil(filteredNotifications.length / PAGE_SIZE);
  const paginatedNotifications = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredNotifications.slice(start, start + PAGE_SIZE);
  }, [filteredNotifications, currentPage]);

  /* Reset page when filter changes */
  const handleFilterChange = (filter: NotificationType | "All") => {
    setActiveFilter(filter);
    setCurrentPage(1);
    Log("info", "page", `Filter changed to: ${filter}`);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkAllRead = () => {
    const ids = filteredNotifications.map((n: Notification) => n.ID);
    markAllAsRead(ids);
    Log("info", "page", `Marked all ${ids.length} visible notifications as read`);
  };

  const unreadCount = getUnreadCount(filteredNotifications.map((n: Notification) => n.ID));

  return (
    <Box>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(135deg, #7C4DFF, #B47CFF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 0.5,
          }}
        >
          All Notifications
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all campus updates. Click a notification to mark it as read.
        </Typography>
      </Box>

      {/* Filter Bar */}
      <FilterBar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        totalCount={filteredNotifications.length}
        onRefresh={refetch}
        isLoading={isLoading}
      />

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="text"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllRead}
            sx={{ color: "#7C4DFF" }}
          >
            Mark all as read ({unreadCount} unread)
          </Button>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: "rgba(211,47,47,0.1)" }}>
          Failed to load notifications: {error}
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={100}
              sx={{ mb: 1.5, backgroundColor: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </Box>
      )}

      {/* Notification List */}
      {!isLoading && !error && (
        <>
          {paginatedNotifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No notifications found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {activeFilter !== "All"
                  ? `No ${activeFilter} notifications available. Try a different filter.`
                  : "Check back later for new updates."}
              </Typography>
            </Box>
          ) : (
            <Box>
              {paginatedNotifications.map((notification: Notification, index: number) => (
                <Fade
                  key={notification.ID}
                  in={true}
                  timeout={300 + index * 50}
                >
                  <div>
                    <NotificationCard
                      notification={notification}
                      isRead={isRead(notification.ID)}
                      onMarkRead={markAsRead}
                    />
                  </div>
                </Fade>
              ))}
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#9AA0A6",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(124, 77, 255, 0.2)",
                      color: "#7C4DFF",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
