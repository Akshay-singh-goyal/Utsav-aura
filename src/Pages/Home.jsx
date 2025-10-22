// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Stack,
  TextField,
  IconButton,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FaTruckMoving,
  FaBroom,
  FaCheckCircle,
  FaCalendarAlt,
  FaHeadset,
} from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import LiveDarshan from "../Component/Livedareshan";
import LiveHistory from "./LiveHistory";
import UserPackageViewPage from "../Component/UserPackageViewPage";
import ProductGallery from "../Component/ProductGallery";
import DecorationGallery from "../Component/DecorationGallery";
import Slider from "../Component/Slider";
import { getLoggedInUser } from "../utils/auth";

// Local images
import murtiidol from "../Component/Images/murti-&-Idol.jpg";
import decoration from "../Component/Images/decoration.jpg";
import garbadress from "../Component/Images/garba-dress.jpg";
import event from "../Component/Images/event.jpg";

// Dialog Animation
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const reviews = [
  {
    name: "Ramesh Kumar",
    comment: "Excellent service! My house is sparkling clean.",
    photo: "/images/user1.jpg",
  },
  {
    name: "Priya Sharma",
    comment: "Fast and careful moving service. Highly recommend!",
    photo: "/images/user2.jpg",
  },
  {
    name: "Amit Verma",
    comment: "Affordable prices and professional staff.",
    photo: "/images/user3.jpg",
  },
];

const advantages = [
  {
    title: "Trusted Professionals",
    desc: "Experienced & verified staff for safe handling.",
    icon: FaCheckCircle,
  },
  {
    title: "Affordable Prices",
    desc: "Transparent pricing with no hidden charges.",
    icon: FaCalendarAlt,
  },
  {
    title: "Safe Handling",
    desc: "Your belongings handled with care & safety.",
    icon: FaTruckMoving,
  },
  {
    title: "Flexible Scheduling",
    desc: "Book services anytime, anywhere.",
    icon: FaBroom,
  },
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [helpOpen, setHelpOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) setUser(loggedInUser);
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

  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        bgcolor: "#fafafa",
        minHeight: "100vh",
        fontFamily: "'Mukta', sans-serif",
      }}
    >
      <audio ref={audioRef} src="/diwali-bgm.mp3" loop autoPlay />

    <Slider/>
      {/* 🌟 HERO SECTION */}
      <Box
        sx={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          px: 2,
          py: 6,
          position: "relative",
        }}
      >
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight="bold"
          mb={2}
          sx={{ textShadow: "2px 2px 10px rgba(0,0,0,0.5)" }}
        >
          Celebrate Your Moments with Utsav Aura
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h5"}
          mb={4}
          sx={{ color: "#ffe8a1", fontWeight: 500 }} // 🌟 Changed font color
        >
          From divine décor to live darshans — experience devotion and festivity together.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="secondary" size="large">
            Book Now
          </Button>
          <Button variant="outlined" color="#000000" size="large">
            Explore
          </Button>
        </Stack>
      </Box>

      {/* 🔍 SEARCH BAR */}
      <Container
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={5}
          sx={{
            display: "flex",
            alignItems: "center",
            width: isMobile ? "90%" : "50%",
            borderRadius: 5,
            px: 2,
            py: 1,
            bgcolor: "#fff8e1",
          }}
        >
          <TextField
            variant="standard"
            placeholder="Search for Murti, Event, Decorations..."
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{ disableUnderline: true }}
          />
          <IconButton color="secondary" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>

      {/* 🛍 SHOP BY CATEGORY */}
      <Container sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={4}
          sx={{ textAlign: "center", color: "#f59e0b" }}
        >
          Shop by Category
        </Typography>

        {/* 🌸 Horizontal scroll on mobile */}
        <Box
          sx={{
            display: "flex",
            overflowX: isMobile ? "auto" : "visible",
            gap: 3,
            pb: isMobile ? 2 : 0,
            justifyContent: "center",
            scrollBehavior: "smooth",
          }}
        >
          {[
            { title: "Murti & Idols", img: murtiidol, path: "/murtis" },
            { title: "Decorations", img: decoration, path: "/decorations" },
            { title: "Event Booking", img: event, path: "/events" },
            { title: "Garba Dresses", img: garbadress, path: "/dresses" },
          ].map((cat) => (
            <Box
              key={cat.title}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                transition: "0.3s",
                minWidth: isMobile ? "150px" : "auto",
                "&:hover": { transform: "scale(1.05)" },
              }}
              onClick={() => navigate(cat.path)}
            >
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  overflow: "hidden",
                  mx: "auto",
                  boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
                  border: "4px solid #ffe0b2",
                }}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                mt={2}
                sx={{ color: "#b45309" }}
              >
                {cat.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* 🌟 Featured Products */}
      <Container sx={{ mt: 10 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#ef4444", textAlign: "center" }}
        >
          Featured Products
        </Typography>
        <ProductGallery />
      </Container>

      {/* 🌸 Decorations */}
      <Container sx={{ mt: 8 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#ef4444", textAlign: "center" }}
        >
          Decorations
        </Typography>
        <DecorationGallery />
      </Container>

      {/* 📺 Live Sessions */}
      <Container sx={{ mt: 10 }}>
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
            <Paper elevation={10} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff7ed" }}>
              <LiveDarshan />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={10} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff7ed" }}>
              <LiveHistory />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 💼 User Packages */}
      <Container sx={{ mt: 8 }}>
        <UserPackageViewPage />
      </Container>

      {/* ⚡ Advantages */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={6}
          sx={{ color: "#f59e0b" }}
        >
          Why Choose Us?
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {advantages.map((adv) => (
            <Grid item xs={12} md={3} key={adv.title}>
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)", boxShadow: 6 },
                }}
              >
                <adv.icon
                  style={{
                    fontSize: 40,
                    color: "#FF9900",
                    marginBottom: 16,
                  }}
                />
                <Typography variant="h6" mb={1}>
                  {adv.title}
                </Typography>
                <Typography variant="body2">{adv.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 💬 Customer Testimonials */}
      <Container sx={{ py: 6, bgcolor: "#f9fafb" }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          What Our Customers Say
        </Typography>
        <Grid container spacing={3}>
          {reviews.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r.name}>
              <Paper sx={{ p: 3, borderRadius: 3, textAlign: "center", boxShadow: 2 }}>
                <Avatar
                  src={r.photo}
                  sx={{ width: 56, height: 56, mx: "auto", mb: 2 }}
                />
                <Typography variant="body1" mb={1}>
                  "{r.comment}"
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {r.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🆘 Floating Help Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2000,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FaHeadset />}
          onClick={() => setHelpOpen(true)}
        >
          Help
        </Button>
      </Box>

      {/* Help Dialog */}
      <Dialog
        open={helpOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setHelpOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            width: isMobile ? "90%" : 400,
            position: "fixed",
            bottom: 24,
            right: 24,
            m: 0,
          },
        }}
      >
        <DialogTitle>Help Center</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Hi there! Need assistance? Chat with us or call at 123-456-7890.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
