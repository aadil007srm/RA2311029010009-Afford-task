/**
 * Home Page — Landing page with overview cards and quick navigation.
 */

"use client";

import React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Grid from "@mui/material/Grid";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Log } from "@/lib/logger";

const features = [
  {
    title: "All Notifications",
    description: "Browse all campus notifications with type filtering and pagination. Track which ones you've already seen.",
    icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />,
    href: "/notifications",
    gradient: "linear-gradient(135deg, #7C4DFF33, #7C4DFF08)",
    color: "#7C4DFF",
  },
  {
    title: "Priority Inbox",
    description: "See the most important notifications first, ranked by type weight and recency. Choose your top N.",
    icon: <PriorityHighIcon sx={{ fontSize: 40 }} />,
    href: "/priority",
    gradient: "linear-gradient(135deg, #00E5FF33, #00E5FF08)",
    color: "#00E5FF",
  },
];

const typeInfo = [
  { type: "Placement", icon: <WorkIcon />, color: "#4CAF50", description: "Job opportunities and hiring updates" },
  { type: "Result", icon: <AssessmentIcon />, color: "#2196F3", description: "Exam results and academic outcomes" },
  { type: "Event", icon: <CelebrationIcon />, color: "#FF9800", description: "Campus events and activities" },
];

export default function HomePage() {
  React.useEffect(() => {
    Log("info", "page", "Home page loaded");
  }, []);

  return (
    <Box sx={{ py: 2 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 50%, #FF9800 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.03em",
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Campus Notifications
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: "auto",
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: "0.95rem", md: "1.1rem" },
          }}
        >
          Real-time updates for Placements, Events, and Results.
          Never miss what matters with the Priority Inbox.
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {features.map((feature) => (
          <Grid size={{ xs: 12, md: 6 }} key={feature.title}>
            <Link href={feature.href} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  background: feature.gradient,
                  borderColor: `${feature.color}33`,
                  height: "100%",
                  "&:hover": {
                    borderColor: `${feature.color}66`,
                    boxShadow: `0 12px 40px ${feature.color}20`,
                  },
                }}
              >
                <CardActionArea sx={{ p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Box sx={{ color: feature.color }}>{feature.icon}</Box>
                      <Typography variant="h5" sx={{ color: "#E8EAED" }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: feature.color }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Go to {feature.title}
                      </Typography>
                      <ArrowForwardIcon fontSize="small" />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Notification Types Info */}
      <Typography
        variant="h5"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center" }}
      >
        Notification Types
      </Typography>
      <Grid container spacing={2}>
        {typeInfo.map((info) => (
          <Grid size={{ xs: 12, sm: 4 }} key={info.type}>
            <Card
              sx={{
                textAlign: "center",
                borderColor: `${info.color}22`,
                backgroundColor: `${info.color}08`,
              }}
            >
              <CardContent>
                <Box sx={{ color: info.color, mb: 1 }}>{info.icon}</Box>
                <Typography variant="h6" sx={{ color: info.color, mb: 0.5 }}>
                  {info.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Priority Algorithm Info */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          borderRadius: 3,
          backgroundColor: "rgba(17, 24, 39, 0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" sx={{ mb: 1.5, color: "#7C4DFF" }}>
          Priority Scoring Algorithm
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "monospace",
            color: "#00E5FF",
            mb: 1,
            fontSize: { xs: "0.85rem", md: "1rem" },
          }}
        >
          score = (type_weight × 10) + recency_score
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Placement (30) &gt; Result (20) &gt; Event (10) + Recency (0-10)
        </Typography>
      </Box>
    </Box>
  );
}
