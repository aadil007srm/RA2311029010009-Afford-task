/**
 * Navbar component — Persistent navigation bar with glassmorphism effect.
 * Provides navigation between All Notifications and Priority Inbox pages.
 */

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import HomeIcon from "@mui/icons-material/Home";

const navItems = [
  { label: "All Notifications", href: "/notifications", icon: <NotificationsActiveIcon fontSize="small" /> },
  { label: "Priority Inbox", href: "/priority", icon: <PriorityHighIcon fontSize="small" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, width: "100%", mx: "auto", px: { xs: 2, md: 3 } }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
            aria-label="open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
            <HomeIcon sx={{ color: "#7C4DFF" }} />
            <Typography
              variant="h6"
              sx={{
                background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              CampusNotify
            </Typography>
          </Link>

          {/* Desktop navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, ml: "auto", gap: 1 }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                <Button
                  startIcon={item.icon}
                  sx={{
                    color: pathname === item.href ? "#7C4DFF" : "#9AA0A6",
                    borderBottom: pathname === item.href ? "2px solid #7C4DFF" : "2px solid transparent",
                    borderRadius: 0,
                    px: 2,
                    py: 1,
                    "&:hover": {
                      color: "#E8EAED",
                      backgroundColor: "rgba(124, 77, 255, 0.08)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 260,
            backgroundColor: "#111827",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              mb: 2,
            }}
          >
            CampusNotify
          </Typography>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.href} disablePadding>
                <Link href={item.href} style={{ textDecoration: "none", width: "100%" }} onClick={handleDrawerToggle}>
                  <ListItemButton
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: pathname === item.href ? "rgba(124, 77, 255, 0.15)" : "transparent",
                      color: pathname === item.href ? "#7C4DFF" : "#9AA0A6",
                    }}
                  >
                    <Box sx={{ mr: 2 }}>{item.icon}</Box>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
