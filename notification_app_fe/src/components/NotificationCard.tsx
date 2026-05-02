// Notification card — clean alignment with yellow accents

"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Notification, NotificationType } from "@/lib/types";

interface Props {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  rank?: number;
}

const typeStyle: Record<NotificationType, { bg: string; color: string; border: string }> = {
  Placement: { bg: "#4ADE8018", color: "#4ADE80", border: "#4ADE8040" },
  Result: { bg: "#60A5FA18", color: "#60A5FA", border: "#60A5FA40" },
  Event: { bg: "#F7DF1E18", color: "#F7DF1E", border: "#F7DF1E40" },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "now";
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function NotificationCard({ notification, isRead, onMarkRead, rank }: Props) {
  const style = typeStyle[notification.Type];

  return (
    <Box
      onClick={() => !isRead && onMarkRead(notification.ID)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
        mb: 0.75,
        borderRadius: 2,
        backgroundColor: isRead ? "#45412E" : "#F7DF1E",
        border: "1px solid",
        borderColor: isRead ? "#5C5740" : "#F7DF1E",
        cursor: !isRead ? "pointer" : "default",
        opacity: 1,
        transition: "all 0.15s ease",
        "&:hover": !isRead ? { backgroundColor: "#e6cf1a", transform: "translateY(-1px)" } : {},
      }}
    >
      {/* rank number */}
      {rank !== undefined && (
        <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", color: isRead ? "#BDB48A" : "#1A1A1D", minWidth: 22, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
          {rank}
        </Typography>
      )}

      {/* unread dot */}
      {!isRead && !rank && (
        <Box sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#1A1A1D", flexShrink: 0 }} />
      )}

      {/* message — takes up available space */}
      <Typography sx={{
        flex: 1,
        fontWeight: isRead ? 400 : 500,
        fontSize: "0.88rem",
        color: isRead ? "#D4C98A" : "#1A1A1D",
        textTransform: "capitalize",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {notification.Message}
      </Typography>

      {/* type badge */}
      <Chip
        label={notification.Type}
        size="small"
        sx={{
          backgroundColor: isRead ? style.bg : "#1A1A1D20",
          color: isRead ? style.color : "#1A1A1D",
          border: `1px solid ${isRead ? style.border : "#1A1A1D30"}`,
          height: 22,
          fontSize: "0.68rem",
          flexShrink: 0,
        }}
      />

      {/* timestamp */}
      <Typography sx={{ fontSize: "0.72rem", color: isRead ? "#B0A670" : "#1A1A1D90", minWidth: 28, textAlign: "right", flexShrink: 0 }}>
        {timeAgo(notification.Timestamp)}
      </Typography>
    </Box>
  );
}
