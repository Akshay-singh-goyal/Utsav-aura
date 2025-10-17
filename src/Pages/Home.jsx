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
  Slide,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Slider from "react-slick";
import { FaTruckMoving, FaBroom, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { useNavigate } from "react-router-dom";
import Loader from "../Component/Loader";
import MainSlider from "../Component/Slider";
import LiveDarshan from "../Component/Livedareshan";
import LiveHistory from "./LiveHistory";
import DecorationGallery from "../Component/DecorationGallery";
import ProductGallery from "../Component/UserPackageViewPage"; // fixed import
import { getLoggedInUser } from "../utils/auth";

// Images
import murtiidol from "../Component/Images/murti-&-Idol.jpg";
import decoration from "../Component/Images/decoration.jpg";
import garbadress from "../Component/Images/garba-dress.jpg";
import event from "../Component/Images/event.jpg";

// Slide transition
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

  // State
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [helpOpen, setHelpOpen] = useState(false);

  // Loader
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

      {/* Hero, Search, Special Offer sections */}
      {/* ... keep your hero, offer, search sections unchanged ... */}

      {/* Main Slider */}
      <MainSlider />

      {/* Services */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">Our Services</Typography>
        <Slider {...sliderSettings}>
          {services.map((service) => (
            <Paper
              key={service.title}
              sx={{ p: 2, borderRadius: 3, textAlign: "center", mx: 1, '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}
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

      {/* Categories, Featured Products, Decorations, Live Sessions, Advantages, Reviews */}
      {/* ... keep all sections unchanged ... */}

      {/* Floating Help Button */}
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 2000,
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": { transform: "scale(1)" },
            "50%": { transform: "scale(1.1)" },
            "100%": { transform: "scale(1)" },
          },
        }}
      >
        <IconButton
          color="secondary"
          sx={{
            bgcolor: "#f59e0b",
            color: "#fff",
            width: 60,
            height: 60,
            "&:hover": { bgcolor: "#fbbf24" },
            boxShadow: 5,
          }}
          onClick={() => setHelpOpen(true)}
        >
          <LocalFireDepartmentIcon fontSize="large" />
        </IconButton>
      </Box>
    </Box>
  );
}
