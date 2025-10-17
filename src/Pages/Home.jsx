// src/Pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
  TextField,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // 🤖 robot icon
import { useNavigate } from "react-router-dom";
import Slider from "../Component/Slider";
import LiveDarshan from "../Component/Livedareshan";
import LiveHistory from "./LiveHistory";
import ProductGallery from "../Component/ProductGallery";
import DecorationGallery from "../Component/DecorationGallery";
import UserPackageViewPage from "../Component/UserPackageViewPage";
import { getLoggedInUser } from "../utils/auth";

// ✅ Imported images
import murtiidol from "../Component/Images/murti-&-Idol.jpg";
import decoration from "../Component/Images/decoration.jpg";
import garbadress from "../Component/Images/garba-dress.jpg";
import event from "../Component/Images/event.jpg";

export default function Home() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [openHelp, setOpenHelp] = useState(false); // ✅ dialog state

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const ganeshNames = [
    "गणपति",
    "विनायक",
    "विघ्नहर्ता",
    "सिद्धिविनायक",
    "लम्बोदर",
    "गजानन",
    "वक्रतुंड",
    "धूम्रवर्ण",
    "एकदंत",
    "कपिल",
    "वक्रतुंड महाकाय",
    "मंगलमूर्ति",
  ];

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) console.log("Please login to access full features!");
    else setUser(loggedInUser);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNameIndex((prev) => (prev + 1) % ganeshNames.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);
    try {
      const res = await fetch(
        `https://utsav-aura-backend-7.onrender.com/api/search?q=${searchQuery}`
      );
      const data = await res.json();
      if (data.success) setSearchResults(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", position: "relative" }}>
      <audio ref={audioRef} src="/ganesh-vandana.mp3" loop />

      {/* ✅ Responsive Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: isMobile ? 2 : 3,
          px: 2,
          bgcolor: "#fff",
          borderBottom: isMobile ? "1px solid #e5e7eb" : "none",
          position: "sticky",
          top: isMobile ? 56 : 0,
          zIndex: 10,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search for Murti, Event, Decorations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size={isMobile ? "small" : "medium"}
          sx={{
            width: isMobile ? "85%" : "40%",
            bgcolor: "#f9fafb",
            borderRadius: 2,
          }}
        />
        <IconButton
          color="primary"
          sx={{ ml: 1 }}
          onClick={handleSearch}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ✅ Search Results */}
      {searchResults.length > 0 && (
        <Container sx={{ py: 5 }}>
          <Typography variant="h5" mb={3} sx={{ color: "#b45309" }}>
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
                  onClick={() =>
                    navigate(`/${item.type.toLowerCase()}/${item._id}`)
                  }
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
                    {item.price && (
                      <Typography variant="body1" fontWeight="bold">
                        ₹{item.price}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* ✅ Main Content */}
      <Slider />

      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#b45309" }}
        >
          Shop by Category
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[
            { title: "Murti & Idols", img: murtiidol },
            { title: "Decorations", img: decoration },
            { title: "Event Booking", img: event },
            { title: "Garba Dresses", img: garbadress },
          ].map((cat) => (
            <Grid item xs={6} sm={3} key={cat.title}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    borderRadius: 12,
                    height: 140,
                    objectFit: "cover",
                  }}
                />
                <Typography variant="subtitle1" fontWeight="bold" mt={2}>
                  {cat.title}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ✅ Product Sections */}
        <Box mt={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#ef4444" }}
          >
            Featured Products
          </Typography>
          <ProductGallery />
        </Box>

        <Box mt={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
            sx={{ color: "#ef4444" }}
          >
            Decorations
          </Typography>
          <DecorationGallery />
        </Box>

        {/* ✅ Live Sessions */}
        <Box mt={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{ color: "#ef4444", mb: 4 }}
          >
            Live Sessions
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{ p: 3, borderRadius: 3, bgcolor: "white" }}
              >
                <LiveDarshan />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{ p: 3, borderRadius: 3, bgcolor: "white" }}
              >
                <LiveHistory />
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <UserPackageViewPage />

        {/* ✅ Why Choose Us Section */}
        <Box component="section" py={10}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={6}
            sx={{ color: "#b45309" }}
          >
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Easy Booking",
                desc: "Book events and services in just a few clicks.",
              },
              {
                title: "Best Prices",
                desc: "Get competitive rates and exclusive discounts.",
              },
              {
                title: "24/7 Support",
                desc: "We’re here to help anytime you need us.",
              },
            ].map((item) => (
              <Grid item xs={12} md={4} key={item.title}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    textAlign: "center",
                    bgcolor: "white",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 8,
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    mb={2}
                    sx={{ color: "#ef4444", fontWeight: "bold" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#374151" }}>{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* 🤖 Floating Help Button */}
      <Fab
        color="primary"
        aria-label="help"
        onClick={() => setOpenHelp(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: 6,
          animation: "floatUp 1s ease-in-out",
          "@keyframes floatUp": {
            "0%": { transform: "translateY(30px)", opacity: 0 },
            "100%": { transform: "translateY(0)", opacity: 1 },
          },
        }}
      >
        <SmartToyIcon />
      </Fab>

      {/* 💬 Help Dialog */}
      <Dialog
        open={openHelp}
        onClose={() => setOpenHelp(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            width: isMobile ? "90%" : 400,
            maxWidth: "90%",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          🤖 Get Help
          <IconButton onClick={() => setOpenHelp(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            👋 Namaste! How can we assist you today?  
            You can ask about events, booking help, or decoration info.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHelp(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
