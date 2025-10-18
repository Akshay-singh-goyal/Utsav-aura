// src/pages/Home.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
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
import { FaTruckMoving, FaBroom, FaCheckCircle, FaCalendarAlt, FaHeadset } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import MainSlider from "../Component/Slider";
import LiveDarshan from "../Component/Livedareshan";
import LiveHistory from "./LiveHistory";
import ProductGallery from "../Component/UserPackageViewPage";
import DecorationGallery from "../Component/DecorationGallery";
import { getLoggedInUser } from "../utils/auth";

// Images
import murtiidol from "../Component/Images/murti-&-Idol.jpg";
import decoration from "../Component/Images/decoration.jpg";
import garbadress from "../Component/Images/garba-dress.jpg";
import event from "../Component/Images/event.jpg";

// Slide transition for Dialog
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// Sample Data
const services = [
  { title: "Room Shifting", desc: "Local & Intercity moving with care.", img: "/images/room-shifting.jpg" },
  { title: "House Cleaning", desc: "Regular, deep or move-in cleaning services.", img: "/images/house-cleaning.jpg" },
  { title: "Packing & Unpacking", desc: "Professional packing & unpacking services.", img: "/images/packing.jpg" },
  { title: "Furniture Assembly", desc: "Expert furniture installation & assembly.", img: "/images/furniture.jpg" },
];

const reviews = [
  { name: "Ramesh Kumar", comment: "Excellent service! My house is sparkling clean.", photo: "/images/user1.jpg" },
  { name: "Priya Sharma", comment: "Fast and careful moving service. Highly recommend!", photo: "/images/user2.jpg" },
  { name: "Amit Verma", comment: "Affordable prices and professional staff.", photo: "/images/user3.jpg" },
];

const advantages = [
  { title: "Trusted Professionals", desc: "Experienced & verified staff for safe handling.", icon: FaCheckCircle },
  { title: "Affordable Prices", desc: "Transparent pricing with no hidden charges.", icon: FaCalendarAlt },
  { title: "Safe Handling", desc: "Your belongings handled with care & safety.", icon: FaTruckMoving },
  { title: "Flexible Scheduling", desc: "Book services anytime, anywhere.", icon: FaBroom },
];

// Slider settings
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 600,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 960, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

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

  // Loader simulation
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Logged in user
  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) setUser(loggedInUser);
  }, []);

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);
    try {
      const res = await fetch(`https://utsav-aura-backend-7.onrender.com/api/search?q=${searchQuery}`);
      const data = await res.json();
      if (data.success) setSearchResults(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  if (loading) return <Loader />;

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", fontFamily: "'Mukta', sans-serif" }}>
      <audio ref={audioRef} src="/diwali-bgm.mp3" loop autoPlay />

      {/* Navbar */}
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box component="img" src="/images/logo.png" alt="Logo" height={50} />
          <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
            {["Home", "Services", "Pricing", "About Us", "Blog", "Contact"].map((link) => (
              <Button key={link} color="inherit">{link}</Button>
            ))}
            <Button variant="contained" color="secondary">Book Now</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff",
          px: 2,
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h4" : "h2"} fontWeight="bold" mb={2}>
            Stress-Free Moving & Sparkling Clean Homes
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"} mb={4}>
            Reliable, affordable, and safe services for your home or office.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="contained" color="secondary" size="large">Book Now</Button>
            <Button variant="outlined" color="inherit" size="large">Get Free Estimate</Button>
          </Stack>
        </Box>
      </Box>

      {/* Special Offer */}
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Paper sx={{ p: 3, bgcolor: "#FFEBCC", borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            🎉 Special Offer: Get 20% Off on Your First Booking!
          </Typography>
        </Paper>
      </Container>

      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: isMobile ? 2 : 3,
          px: 2,
          bgcolor: "#fff3e0",
          borderBottom: "2px solid #f59e0b",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderRadius: 2,
          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
        }}
      >
        <TextField
          variant="filled"
          placeholder="Search for Murti, Event, Decorations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          size={isMobile ? "small" : "medium"}
          sx={{
            width: isMobile ? "85%" : "40%",
            bgcolor: "#fff8e1",
            borderRadius: 2,
            "& .MuiFilledInput-root": { borderRadius: 2 },
          }}
        />
        <IconButton color="secondary" sx={{ ml: 1 }} onClick={handleSearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Container sx={{ py: 5 }}>
          <Typography variant="h5" mb={3} sx={{ color: "#f59e0b", fontWeight: "bold" }}>
            Search Results for "{searchQuery}"
          </Typography>
          <Grid container spacing={3}>
            {searchResults.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
                  }}
                  onClick={() => navigate(`/${item.type.toLowerCase()}/${item._id}`)}
                >
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    style={{ width: "100%", height: 180, objectFit: "cover" }}
                  />
                  <Box sx={{ p: 2, bgcolor: "#fff8e1" }}>
                    <Typography variant="h6" sx={{ color: "#b45309", fontWeight: "bold" }}>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">Type: {item.type}</Typography>
                    {item.price && <Typography variant="body1" fontWeight="bold">₹{item.price}</Typography>}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Main Slider */}
      <MainSlider />

      {/* Services */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          Our Services
        </Typography>
        <Slider {...sliderSettings}>
          {services.map((service) => (
            <Paper
              key={service.title}
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                mx: 1,
                '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
              }}
            >
              <img
                src={service.img}
                alt={service.title}
                style={{ width: "100%", borderRadius: 12, height: 180, objectFit: "cover" }}
              />
              <Typography variant="h6" mt={2}>{service.title}</Typography>
              <Typography variant="body2">{service.desc}</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Book Now</Button>
            </Paper>
          ))}
        </Slider>
      </Container>

      {/* Categories */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#f59e0b", textAlign: "center", letterSpacing: 1 }}>
          Shop by Category
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {[{ title: "Murti & Idols", img: murtiidol },
            { title: "Decorations", img: decoration },
            { title: "Event Booking", img: event },
            { title: "Garba Dresses", img: garbadress }].map((cat) => (
            <Grid item xs={6} sm={3} key={cat.title}>
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "linear-gradient(145deg, #fff3e0, #ffe0b2)",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.07)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
                }}
              >
                <img src={cat.img} alt={cat.title} style={{ width: "100%", borderRadius: 12, height: 140, objectFit: "cover" }} />
                <Typography variant="subtitle1" fontWeight="bold" mt={2} sx={{ color: "#b45309" }}>{cat.title}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#ef4444", textAlign: "center" }}>
          Featured Products
        </Typography>
        <ProductGallery />
      </Container>

      {/* Decorations */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#ef4444", textAlign: "center" }}>
          Decorations
        </Typography>
        <DecorationGallery />
      </Container>

      {/* Live Sessions */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom sx={{ color: "#ef4444", mb: 4 }}>
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

      {/* User Packages */}
      <Container sx={{ mt: 8 }}>
        <ProductGallery /> {/* Assuming you wanted UserPackageViewPage replaced */}
      </Container>

      {/* Advantages */}
      <Container sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6} sx={{ color: "#f59e0b" }}>
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
                  '&:hover': { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <adv.icon style={{ fontSize: 40, color: "#FF9900", marginBottom: 16 }} />
                <Typography variant="h6" mb={1}>{adv.title}</Typography>
                <Typography variant="body2">{adv.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Customer Testimonials */}
      <Container sx={{ py: 6, bgcolor: "#f9fafb" }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          What Our Customers Say
        </Typography>
        <Slider {...sliderSettings}>
          {reviews.map((r) => (
            <Paper key={r.name} sx={{ p: 3, borderRadius: 3, textAlign: "center", mx: 1, boxShadow: 2 }}>
              <Avatar src={r.photo} sx={{ width: 56, height: 56, mx: "auto", mb: 2 }} />
              <Typography variant="body1" mb={1}>"{r.comment}"</Typography>
              <Typography variant="subtitle2" fontWeight="bold">{r.name}</Typography>
            </Paper>
          ))}
        </Slider>
      </Container>

      {/* Floating Help Center Button */}
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
        sx={{ "& .MuiDialog-paper": { borderRadius: 3, width: isMobile ? "90%" : 400, position: "fixed", bottom: 24, right: 24, m: 0 } }}
      >
        <DialogTitle>Help Center</DialogTitle>
        <DialogContent dividers>
          <Typography>Hi there! Need assistance? Chat with us or call at 123-456-7890.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
