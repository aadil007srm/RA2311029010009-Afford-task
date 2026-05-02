/**
 * MUI ThemeProvider wrapper for Next.js App Router.
 * Provides the dark theme and CssBaseline to all child components.
 */

"use client";

import React from "react";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
