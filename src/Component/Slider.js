import React, { useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Slider() {
  const slides = [
    {
      url: "/Image/banner1.jpg",
      cta: "Learn by Image One",
      link: "/shop",
    },
    {
      url: "/Image/banner2.jpg",
      cta: "Explore Image Two",
      link: "/shop",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Auto Slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigate to specific slide
  const gotoSlide = (index) => {
    setCurrentIndex(index);
  };

  // Handle CTA click
  const handleCTA = (link) => {
    if (!isLoggedIn) {
      toast.warning("Please login to continue!");
      navigate("/login");
      return;
    }
    navigate(link);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", margin: "20px auto", textAlign: "center" }}>
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: 4,
        }}
      >
        {/* Slide Image */}
        <Box
          component="img"
          src={slides[currentIndex].url}
          alt={`Slide ${currentIndex + 1}`}
          sx={{
            width: "100%",
            height: { xs: 180, sm: 250, md: 350, lg: 400 },
            objectFit: "cover",
            transition: "all 0.7s ease-in-out",
          }}
        />

        {/* CTA Button */}
        <Button
          onClick={() => handleCTA(slides[currentIndex].link)}
          variant="contained"
          sx={{
            position: "absolute",
            left: { xs: "10px", md: "20px" },
            bottom: { xs: "20px", md: "40px" },
            bgcolor: "#fc8019",
            "&:hover": { bgcolor: "#ff6600" },
            boxShadow: 3,
            fontWeight: "bold",
            px: 3,
            py: 1,
          }}
        >
          {slides[currentIndex].cta}
        </Button>
      </Box>

      {/* Dots Navigation */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        {slides.map((_, index) => (
          <IconButton key={index} onClick={() => gotoSlide(index)} size="small">
            <FiberManualRecordIcon
              sx={{
                fontSize: currentIndex === index ? 16 : 12,
                color: currentIndex === index ? "#fc8019" : "#ccc",
              }}
            />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

export default Slider;
