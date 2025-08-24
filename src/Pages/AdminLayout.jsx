// src/Component/AdminLayout.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  AddBox as AddBoxIcon,
  ShoppingCart as ShoppingCartIcon,
  LiveTv as LiveTvIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const menuItems = [
  { text: "Dashboard", to: "/admin/dashboard", icon: <DashboardIcon /> },
  { text: "Users", to: "/admin/users", icon: <PeopleIcon /> },
  { text: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
  { text: "Add Product", to: "/admin/add-product", icon: <AddBoxIcon /> },
  { text: "Orders", to: "/admin/order", icon: <ShoppingCartIcon /> },
  { text: "Live Status", to: "/admin/live", icon: <LiveTvIcon /> },
  { text: "Categories", to: "/admin/category", icon: <CategoryIcon /> },
  { text: "Packages", to: "/admin/package", icon: <LocalOfferIcon /> },
  { text: "Customer Query", to: "/admin/admin-query", icon: <LocalOfferIcon /> },
];

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <Box
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 999,
            display: { xs: "block", sm: "none" },
          }}
        />
      )}

      {/* Sidebar */}
      <Box
        sx={{
          width: 220,
          height: "100vh",
          bgcolor: "#1e1e1e",
          color: "#ffd700",
          p: 2,
          position: "fixed",
          top: 0,
          left: { xs: isOpen ? 0 : "-250px", sm: 0 },
          transition: "left 0.3s ease",
          zIndex: 1000,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Admin Panel
          <IconButton
            onClick={toggleSidebar}
            sx={{ display: { xs: "inline-flex", sm: "none" }, color: "#ffd700" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Menu Items */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              component={Link}
              to={item.to}
              key={item.text}
              sx={{
                color: "#ffd700",
                borderRadius: 1,
                "&:hover": { bgcolor: "rgba(255,215,0,0.1)" },
                mb: 1,
              }}
              onClick={() => isOpen && toggleSidebar()}
            >
              <ListItemIcon sx={{ color: "#ffd700" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );
}

export function AdminLayout() {
  const [userProfile, setUserProfile] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch admin/user profile
  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("https://utsav-aura-backend-7.onrender.com/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUserProfile(data.user);
      else navigate("/login");
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, refreshKey]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    setUserProfile(null);
    navigate("/login");
  };

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { xs: 0, sm: "220px" },
          p: 3,
          transition: "margin-left 0.3s ease",
        }}
      >
        {/* Mobile Menu Button */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            mb: 2,
            bgcolor: "#1e1e1e",
            color: "#ffd700",
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Header with Logout & Refresh */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {userProfile && (
            <Box sx={{ mb: 1, color: "#ffd700", display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: 10 }}>Hello, {userProfile.name}</span>
              <button
                style={{
                  padding: "6px 12px",
                  background: "#ffd700",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </Box>
          )}
          <Tooltip title="Refresh Page">
            <IconButton onClick={handleRefresh} sx={{ color: "#ffd700" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Render admin pages */}
        <Outlet key={refreshKey} />
      </Box>
    </Box>
  );
}
