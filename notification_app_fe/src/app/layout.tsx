/**
 * Root Layout — Wraps all pages with ThemeProvider and Navbar.
 */

import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/theme/ThemeProvider";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CampusNotify — Campus Notification Platform",
  description:
    "Real-time campus notifications for Placements, Events, and Results. Stay informed with the Priority Inbox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
