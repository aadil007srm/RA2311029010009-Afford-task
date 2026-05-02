// MUI theme — JS official yellow (#F7DF1E) on dark background

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#F7DF1E", light: "#FFF176", dark: "#C9B100" },
    secondary: { main: "#8B8B8B" },
    background: { default: "#1A1A1D", paper: "#2C2C2E" },
    text: { primary: "#E8E6E3", secondary: "#8B8B8B" },
    divider: "#3A3A3C",
    success: { main: "#4ADE80" },
    info: { main: "#60A5FA" },
    warning: { main: "#F7DF1E" },
    error: { main: "#EF4444" },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, sans-serif",
    h4: { fontWeight: 700, fontSize: "1.6rem", color: "#F7DF1E" },
    h5: { fontWeight: 600, fontSize: "1.2rem", color: "#E8E6E3" },
    h6: { fontWeight: 600, fontSize: "1rem", color: "#E8E6E3" },
    body1: { fontSize: "0.9rem", color: "#C4C4C4" },
    body2: { fontSize: "0.8rem", color: "#8B8B8B" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#2C2C2E",
          border: "1px solid #3A3A3C",
          transition: "border-color 0.2s, transform 0.15s",
          "&:hover": {
            borderColor: "#F7DF1E50",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 500, fontSize: "0.72rem" } } },
    MuiButton: { styleOverrides: { root: { textTransform: "none", fontWeight: 500, borderRadius: 6 } } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#1A1A1D",
          boxShadow: "none",
          borderBottom: "1px solid #3A3A3C",
        },
      },
    },
  },
});

export default theme;
