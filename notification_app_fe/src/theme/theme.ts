/**
 * Material UI Theme configuration for Campus Notifications.
 * Uses a dark theme with vibrant accent colors for notification types.
 */

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7C4DFF",
      light: "#B47CFF",
      dark: "#3F1DCB",
    },
    secondary: {
      main: "#00E5FF",
      light: "#6EFFFF",
      dark: "#00B2CC",
    },
    background: {
      default: "#0A0E17",
      paper: "#111827",
    },
    success: {
      main: "#4CAF50", /* Placement */
    },
    info: {
      main: "#2196F3", /* Result */
    },
    warning: {
      main: "#FF9800", /* Event */
    },
    text: {
      primary: "#E8EAED",
      secondary: "#9AA0A6",
    },
    divider: "rgba(255,255,255,0.08)",
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.95rem",
    },
    body2: {
      fontSize: "0.85rem",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.06)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            borderColor: "rgba(124, 77, 255, 0.3)",
            boxShadow: "0 8px 32px rgba(124, 77, 255, 0.15)",
            transform: "translateY(-2px)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: "0.02em",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(10, 14, 23, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        },
      },
    },
  },
});

export default theme;
