// src/Component/Navbar.jsx
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
  TextField,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import {
  MdExpandLess,
  MdExpandMore,
  MdClose,
  MdMenu,
} from "react-icons/md";
import {
  FaPhoneVolume,
  FaUserCircle,
  FaShoppingCart,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { AccountCircle, ShoppingCart, Home, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import utsavLogo from "./Images/utsavlogo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [drawerSearchOpen, setDrawerSearchOpen] = useState(false);

  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio("/ganesh-vandana.mp3"));

  const colors = {
    bg: "#1e293b",
    text: "#fff",
    primary: "#facc15",
    hover: "#fbbf24",
  };

  const ganeshNames = [
    "गणपति", "विनायक", "विघ्नहर्ता", "सिद्धिविनायक", "लम्बोदर",
    "गजानन", "वक्रतुंड", "धूम्रवर्ण", "एकदंत", "कपिल",
    "वक्रतुंड महाकाय", "मंगलमूर्ति",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % ganeshNames.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch("https://utsav-aura-backend-7.onrender.com/auth/me", {
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://utsav-aura-backend-7.onrender.com/search?query=${searchQuery}`
      );
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.results);
        setDrawerOpen(false);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  const links = [
    { icon: <CiUser />, name: "About", path: "/about" },
    { icon: <FaPhoneVolume />, name: "Contact Us", path: "/contact-us" },
  ];

  const profileLinks = [
    { name: "View Profile", path: "/view-profile" },
    { name: "Edit Profile", path: "/edit-profile" },
    { name: "Social Profile", path: "/social-profile" },
  ];

  const otherLinks = [
    { name: "My Orders", path: "/my-order", icon: <FaShoppingCart /> },
    { name: "My Cart", path: "/cart", icon: <FaShoppingCart /> },
  ];

  return (
    <>
      {/* 🌟 NAVBAR */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: colors.bg,
          color: colors.text,
          height: 80,
          justifyContent: "center",
          boxShadow: 3,
        }}
      >
        <Toolbar
          sx={{
            minHeight: "80px !important",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={utsavLogo}
            alt="UtsavAura Logo"
            sx={{
              position: "absolute",
              top: "10px",
              left: "20px",
              height: "120px",
              width: "120px",
              borderRadius: "50%",
              objectFit: "cover",
              cursor: "pointer",
              zIndex: 10,
            }}
            onClick={() => navigate("/")}
          />

          {/* Rotating Names */}
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ flex: 1, textAlign: "center", mx: 2 }}
          >
            {ganeshNames[currentNameIndex]}
          </Typography>

          {/* Right Icons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              sx={{ color: colors.text, display: { xs: "none", md: "flex" } }}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart />
            </IconButton>
            <IconButton
              edge="end"
              sx={{ color: colors.primary, display: { xs: "flex", md: "none" } }}
              onClick={() => setDrawerOpen(true)}
            >
              <MdMenu size={30} />
            </IconButton>
          </Box>

          {/* Desktop Only */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
              ml: 2,
            }}
          >
            <Button
              startIcon={<Home />}
              sx={{ color: colors.text }}
              onClick={() => navigate("/")}
            >
              Home
            </Button>

            <TextField
              placeholder="Search..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              sx={{
                bgcolor: "#fff",
                borderRadius: 1,
                input: { color: "#000" },
                width: 250,
              }}
            />

            {!isLoggedIn ? (
              <Button
                variant="outlined"
                sx={{
                  borderColor: "red",
                  color: "red",
                  "&:hover": { backgroundColor: "red", color: "white" },
                  ml: 1,
                }}
                onClick={() => navigate("/login")}
              >
                Signup / SignIn
              </Button>
            ) : (
              <>
                <IconButton onClick={(e) => setProfileAnchor(e.currentTarget)}>
                  <Avatar>
                    {userProfile?.name
                      ? userProfile.name.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem disabled>
                    <strong>{userProfile?.name || "User"}</strong>
                  </MenuItem>
                  <MenuItem disabled>
                    {userProfile?.email || "No Email"}
                  </MenuItem>
                  <Divider />
                  {profileLinks.map((link) => (
                    <MenuItem
                      key={link.name}
                      onClick={() => navigate(link.path)}
                    >
                      {link.name}
                    </MenuItem>
                  ))}
                  <Divider />
                  {otherLinks.map((link) => (
                    <MenuItem
                      key={link.name}
                      onClick={() => navigate(link.path)}
                    >
                      {link.icon && <Box sx={{ mr: 1 }}>{link.icon}</Box>}
                      {link.name}
                    </MenuItem>
                  ))}
                  {userProfile?.role === "admin" && (
                    <>
                      <Divider />
                      <MenuItem onClick={() => navigate("/admin")}>
                        Admin Dashboard
                      </MenuItem>
                    </>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}

            <Button
              onClick={toggleAudio}
              startIcon={isPlaying ? <FaPause /> : <FaPlay />}
              sx={{
                background: "linear-gradient(to right, #facc15, #fb923c)",
                color: "#1e293b",
                fontWeight: "bold",
                px: 2,
                borderRadius: 2,
                "&:hover": {
                  background: "linear-gradient(to right, #fbbf24, #ef4444)",
                },
              }}
            >
              {isPlaying ? "Pause Vandana" : "Play Vandana"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: "1px solid #ccc",
            }}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <MdClose size={24} />
            </IconButton>
          </Box>

          <List>
            {/* Home */}
            <ListItem button onClick={() => { navigate("/"); setDrawerOpen(false); }}>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>

            {/* Search */}
            <ListItem button onClick={() => setDrawerSearchOpen(!drawerSearchOpen)}>
              <ListItemIcon><Search /></ListItemIcon>
              <ListItemText primary="Search" />
              {drawerSearchOpen ? <MdExpandLess /> : <MdExpandMore />}
            </ListItem>
            <Collapse in={drawerSearchOpen}>
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  sx={{ bgcolor: "#fff", borderRadius: 1 }}
                />
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 1, bgcolor: colors.primary }}
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </Box>
            </Collapse>

            {/* Cart */}
            <ListItem button onClick={() => { navigate("/cart"); setDrawerOpen(false); }}>
              <ListItemIcon><ShoppingCart /></ListItemIcon>
              <ListItemText primary="My Cart" />
            </ListItem>

            {/* Links */}
            {links.map((link, i) => (
              <ListItem button key={i} onClick={() => { navigate(link.path); setDrawerOpen(false); }}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.name} />
              </ListItem>
            ))}

            {/* Login */}
            {!isLoggedIn && (
              <ListItem button onClick={() => { navigate("/login"); setDrawerOpen(false); }}>
                <ListItemIcon><FaUserCircle /></ListItemIcon>
                <ListItemText primary="Signup / Login" />
              </ListItem>
            )}

            {/* Audio */}
            <ListItem button onClick={() => { toggleAudio(); setDrawerOpen(false); }}>
              <ListItemIcon>{isPlaying ? <FaPause /> : <FaPlay />}</ListItemIcon>
              <ListItemText primary={isPlaying ? "Pause Vandana" : "Play Vandana"} />
            </ListItem>

            {/* Profile Links */}
            {isLoggedIn && userProfile && (
              <>
                <Divider />
                <ListItem button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                  <ListItemIcon><FaUserCircle /></ListItemIcon>
                  <ListItemText primary={userProfile?.name || "Profile"} />
                  {profileMenuOpen ? <MdExpandLess /> : <MdExpandMore />}
                </ListItem>
                <Collapse in={profileMenuOpen}>
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Container sx={{ py: 5 }}>
          <Typography variant="h5" mb={3} sx={{ color: "#fbbf24" }}>
            Search Results for "{searchQuery}"
          </Typography>
          <Grid container spacing={3}>
            {searchResults.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": { boxShadow: 6 },
                  }}
                  onClick={() => navigate(`/${item.type.toLowerCase()}/${item._id}`)}
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {item.type}
                    </Typography>
                    {item.price && <Typography fontWeight="bold">₹{item.price}</Typography>}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      <ToastContainer position="top-right" autoClose={2500} theme="colored" />
    </>
  );
}
