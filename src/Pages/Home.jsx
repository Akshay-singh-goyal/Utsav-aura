// src/Pages/Home.jsx
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
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FaTruckMoving, FaBroom, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import LiveDarshan from "../Component/Livedareshan";
import LiveHistory from "./LiveHistory";
import DecorationGallery from "../Component/DecorationGallery";
import { getLoggedInUser } from "../utils/auth";
import Slider from "../Component/Slider";
import ProductGallery from "../Component/ProductGallery";

// Images
import murtiidol from "../Component/Images/murti-&-Idol.jpg";
import decoration from "../Component/Images/decoration.jpg";
import garbadress from "../Component/Images/garba-dress.jpg";
import event from "../Component/Images/event.jpg";

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) setUser(loggedInUser);
  }, []);

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

  const categories = [
    { title: "Murti & Idols", img: murtiidol },
    { title: "Decorations", img: decoration },
    { title: "Event Booking", img: event },
    { title: "Garba Dresses", img: garbadress },
  ];

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", fontFamily: "'Mukta', sans-serif" }}>
      <audio ref={audioRef} src="/diwali-bgm.mp3" loop autoPlay />

      {/* ===================== NAVBAR ===================== */}
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
            {["Home", "Services", "Pricing", "About Us", "Blog", "Contact"].map((link) => (
              <Button key={link} color="inherit">{link}</Button>
            ))}
            <Button variant="contained" color="secondary">Book Now</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* ===================== SEARCH BAR ===================== */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: isMobile ? 2 : 3,
          px: 2,
          bgcolor: "#000000",
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

      {/* ===================== SLIDER / HERO SECTION ===================== */}
      <Slider />

      {/* ===================== SHOP BY CATEGORY ===================== */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{ color: "#f59e0b", textAlign: "center", letterSpacing: 1 }}
        >
          Shop by Category
        </Typography>
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            py: 2,
            px: 1,
            gap: 3,
            "&::-webkit-scrollbar": { display: "none" },
            scrollbarWidth: "none",
          }}
        >
          {categories.map((cat) => (
            <Box
              key={cat.title}
              sx={{ flex: "0 0 auto", textAlign: "center", cursor: "pointer" }}
              onClick={() => navigate(`/all`)}
            >
              <Box
                component="img"
                src={cat.img}
                alt={cat.title}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  mb: 1,
                  border: "3px solid #f59e0b",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#b45309" }}>
                {cat.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      {/* ===================== CATEGORY OF SERVICES (REPLACED OUR SERVICES) ===================== */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center" sx={{ color: "#ef4444" }}>
          Category of Services
        </Typography>
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.title}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{ width: "100%", borderRadius: 12, height: 180, objectFit: "cover" }}
                />
                <Typography variant="h6" mt={2}>{service.title}</Typography>
                <Typography variant="body2" color="text.secondary">{service.desc}</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Book Now
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===================== FEATURED PRODUCTS ===================== */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#ef4444", textAlign: "center" }}>
          Featured Products
        </Typography>
        <ProductGallery />
      </Container>

      {/* ===================== DECORATION GALLERY ===================== */}
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#ef4444", textAlign: "center" }}>
          Decorations
        </Typography>
        <DecorationGallery />
      </Container>

      {/* ===================== LIVE SESSIONS ===================== */}
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

      {/* ===================== ADVANTAGES ===================== */}
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
                  '&:hover': { transform: "translateY(-5px)", boxShadow: 6 }
                }}
              >
                {React.createElement(adv.icon, { style: { fontSize: 40, color: "#FF9900", marginBottom: 16 } })}
                <Typography variant="h6" mb={1}>{adv.title}</Typography>
                <Typography variant="body2">{adv.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ===================== TESTIMONIALS ===================== */}
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
    </Box>
  );
}
