// src/Pages/About.jsx
import React from "react";
import { Box, Typography, Grid, Paper, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UtsavLogo from "../Component/Images/Logo2.png"; // ✅ Your uploaded logo
import TeamImage1 from "../Component/Images/founder.jpg"; // ✅ Add real images


export default function About() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#1e293b",
          color: "white",
          py: 8,
          textAlign: "center",
          px: 3,
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={UtsavLogo}
          alt="Ustav Aura Logo"
          sx={{
            height: "120px",
            width: "auto",
            mb: 3,
            objectFit: "contain",
            borderRadius: "50%",
            backgroundColor: "white",
            p: 1,
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
          }}
        />
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About Ustav Aura
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 700, mx: "auto" }}>
          Celebrate culture, festivals, and traditions with immersive experiences,
          curated events, and authentic vibes.
        </Typography>
      </Box>

      {/* Our Story */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#b45309" }}>
          Our Story
        </Typography>
        <Typography variant="body1" sx={{ color: "#374151", mb: 4 }}>
          Ustav Aura was born from a passion to bring India’s vibrant cultural
          spirit to the world. From grand festivals to intimate traditions, we
          connect people with authentic experiences — whether through live
          events, curated tours, or modern celebrations. Our goal is to make
          every cultural moment unforgettable and ensure that every traveler
          feels the warmth of India’s heritage.
        </Typography>

        {/* Mission, Vision, Values */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#ef4444" }}>
                🎯 Our Mission
              </Typography>
              <Typography sx={{ color: "#374151" }}>
                To create seamless, memorable cultural experiences through reliable
                event booking, guided tours, and live celebrations. We aim to
                empower both travelers and locals by fostering connections that go
                beyond just tourism.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#ef4444" }}>
                🌍 Our Vision
              </Typography>
              <Typography sx={{ color: "#374151" }}>
                To be the go-to platform for cultural tourism and festive
                celebrations, connecting travelers with India’s heritage globally.
                We envision a world where every culture is celebrated and shared.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#ef4444" }}>
                💡 Our Values
              </Typography>
              <Typography sx={{ color: "#374151" }}>
                Inclusivity, authenticity, innovation, and happiness are the
                guiding principles behind everything we do. We believe in
                celebrating diversity while staying true to tradition.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ bgcolor: "#fef3c7", py: 10 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={6}
            sx={{ color: "#b45309" }}
          >
            Why Choose Ustav Aura?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                title: "Curated Experiences",
                desc: "Handpicked events and tours that immerse you in real cultural vibes.",
              },
              {
                title: "Expert Guides",
                desc: "Learn and explore with passionate cultural experts and locals.",
              },
              {
                title: "Seamless Booking",
                desc: "Simple online booking, secure payments, and instant confirmations.",
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
        </Container>
      </Box>

      {/* Meet the Team */}
      <Container maxWidth="lg" sx={{ py: 10, flex: 1 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={6}
          sx={{ color: "#b45309" }}
        >
          Meet the Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              name: "Akshay Goyal",
              role: "Founder & CEO",
              img: TeamImage1,
              desc: "Visionary leader with a passion for cultural innovation and community building.",
            },
            
          ].map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 10 },
                }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {member.name}
                  </Typography>
                  <Typography sx={{ color: "#6b7280", mb: 1 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#374151" }}>
                    {member.desc}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
