// Navbar.jsx
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
  Collapse,
} from "@mui/material";
import { MdKeyboardArrowDown, MdExpandLess, MdExpandMore, MdClose } from "react-icons/md";
import { GiPagoda } from "react-icons/gi";
import { CiBookmark, CiUser } from "react-icons/ci";
import { FaPhoneVolume, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const colors = { bg: "#fffbf0", text: "#4a3c1b", primary: "#fc8019", hover: "#ff6600" };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUserProfile(data.user);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    setUserProfile(null);
    setProfileAnchor(null);
    navigate("/");
    toast.success("Logged out successfully!");
  };

  const links = [
    { icon: <GiPagoda />, name: "Murti", path: "/murti" },
    { icon: <CiBookmark />, name: "Book Now", path: "/book" },
    { icon: <CiUser />, name: "About", path: "/about" },
    { icon: <FaPhoneVolume />, name: "Contact-Us", path: "/contact-us" },
  ];

  const profileLinks = [
    { name: "View Profile", path: "/view-profile" },
    { name: "Edit Profile", path: "/edit-profile" },
    { name: "Social Profile", path: "/social-profile" },
  ];

  const otherLinks = [
    { name: "My Orders", path: "/my-order", icon: <FaShoppingCart /> },
    { name: "Billing", path: "/billing" },
    { name: "My Cart", path: "/cart", icon: <FaShoppingCart /> },
    { name: "Privacy Center", path: "/privacy" },
    { name: "Feedback", path: "/feedback" },
    { name: "History", path: "/history" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: colors.bg, color: colors.text }}>
        <Toolbar>
          {/* Hamburger for Mobile */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { md: "none" } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MdKeyboardArrowDown size={30} color={colors.primary} />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            GaneshMurti
          </Typography>

          {/* Links (Desktop) */}
          <Box sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 3, alignItems: "center" }}>
            {links.map((link, index) => (
              <Button
                key={index}
                startIcon={link.icon}
                onClick={() => navigate(link.path)}
                sx={{ fontWeight: "bold", color: colors.text, "&:hover": { color: colors.hover } }}
              >
                {link.name}
              </Button>
            ))}

            {isLoggedIn && userProfile ? (
              <>
                <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)} sx={{ ml: 2 }}>
                  <Avatar>{userProfile.name[0]}</Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  sx={{ mt: 1 }}
                >
                  <MenuItem disabled><strong>{userProfile.name}</strong></MenuItem>
                  <MenuItem disabled>{userProfile.email}</MenuItem>
                  <Divider />
                  {profileLinks.map((link) => (
                    <MenuItem key={link.name} onClick={() => { navigate(link.path); setProfileAnchor(null); }}>
                      {link.name}
                    </MenuItem>
                  ))}
                  <Divider />
                  {otherLinks.map((link) => (
                    <MenuItem key={link.name} onClick={() => { navigate(link.path); setProfileAnchor(null); }}>
                      {link.icon && <Box sx={{ mr: 1 }}>{link.icon}</Box>}
                      {link.name}
                    </MenuItem>
                  ))}
                  {userProfile?.role === "admin" && (
                    <>
                      <Divider />
                      <MenuItem onClick={() => { navigate("/admin"); setProfileAnchor(null); }}>Admin Dashboard</MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "red" }}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                sx={{ borderColor: "red", color: "red", "&:hover": { backgroundColor: "red", color: "white" } }}
                onClick={() => navigate("/login")}
              >
                Signup / SignIn
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer (Mobile) */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #ccc" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <MdClose size={24} />
            </IconButton>
          </Box>

          <List>
            {links.map((link, i) => (
              <ListItem button key={i} onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.name} />
              </ListItem>
            ))}

            {/* Signup/Login in Mobile Drawer */}
            {!isLoggedIn && (
              <ListItem button onClick={() => { navigate("/login"); setDrawerOpen(false); }}>
                <ListItemIcon><FaUserCircle /></ListItemIcon>
                <ListItemText primary="Signup / Login" />
              </ListItem>
            )}

            {isLoggedIn && userProfile && (
              <>
                <Divider />
                <ListItem button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                  <ListItemIcon><FaUserCircle /></ListItemIcon>
                  <ListItemText primary="Profile" />
                  {profileMenuOpen ? <MdExpandLess /> : <MdExpandMore />}
                </ListItem>
                <Collapse in={profileMenuOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {profileLinks.map((link) => (
                      <ListItem button key={link.name} sx={{ pl: 4 }} onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                        <ListItemText primary={link.name} />
                      </ListItem>
                    ))}
                    {otherLinks.map((link) => (
                      <ListItem button key={link.name} sx={{ pl: 4 }} onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                        {link.icon && <ListItemIcon>{link.icon}</ListItemIcon>}
                        <ListItemText primary={link.name} />
                      </ListItem>
                    ))}
                    {userProfile?.role === "admin" && (
                      <ListItem button sx={{ pl: 4 }} onClick={() => { navigate("/admin"); setDrawerOpen(false); }}>
                        <ListItemText primary="Admin Dashboard" />
                      </ListItem>
                    )}
                    <ListItem button sx={{ pl: 4, color: "red" }} onClick={() => { handleLogout(); setDrawerOpen(false); }}>
                      <ListItemText primary="Logout" />
                    </ListItem>
                  </List>
                </Collapse>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
}
