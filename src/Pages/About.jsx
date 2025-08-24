// src/Pages/About.jsx
import React from "react";
import { Box, Typography, Grid, Paper, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/Navbar"; // Assuming you have a Navbar component
import Footer from "../Component/Footer"; // Assuming you have a Footer component

export default function About() {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#f3f4f6", minHeight: "100vh" }}>
      {/* Navbar */}
     

      {/* Hero Section */}
      <Box sx={{
        bgcolor: "#1e293b",
        color: "white",
        py: 8,
        textAlign: "center",
        px: 3
      }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          About IncredibleFest
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mx: "auto" }}>
          Connecting tourists with India’s rich cultural heritage through curated events, live sessions, and immersive experiences.
        </Typography>
      </Box>

      {/* Our Story */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight="bold" mb={3} sx={{ color: "#b45309" }}>
          Our Story
        </Typography>
        <Typography variant="body1" sx={{ color: "#374151", mb: 4 }}>
          IncredibleFest started with a mission to bring the vibrant culture of India closer to travelers. From festivals to live workshops, we help you explore traditions, rituals, and celebrations like never before.
        </Typography>

        {/* Mission & Vision */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#ef4444" }}>Our Mission</Typography>
              <Typography sx={{ color: "#374151" }}>
                To make every cultural experience seamless and memorable for tourists by providing reliable event booking, live cultural sessions, and guided tours.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white" }}>
              <Typography variant="h5" fontWeight="bold" mb={2} sx={{ color: "#ef4444" }}>Our Vision</Typography>
              <Typography sx={{ color: "#374151" }}>
                To be the go-to platform for cultural tourism in India, connecting travelers with authentic local experiences, festivals, and traditions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Why Choose Us */}
      <Box sx={{ bgcolor: "#fef3c7", py: 10 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6} sx={{ color: "#b45309" }}>
            Why Choose Us?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[
              { title: "Curated Experiences", desc: "Handpicked events and tours to ensure authentic cultural exposure." },
              { title: "Expert Guides", desc: "Learn from experienced local guides and cultural experts." },
              { title: "Seamless Booking", desc: "Easy online booking, secure payments, and instant confirmations." }
            ].map(item => (
              <Grid item xs={12} md={4} key={item.title}>
                <Paper elevation={6} sx={{
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "white",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 8 }
                }}>
                  <Typography variant="h6" mb={2} sx={{ color: "#ef4444", fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#374151" }}>{item.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Team Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={6} sx={{ color: "#b45309" }}>
          Meet the Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { name: "Akshay Goyal", role: "Founder & CEO", img: "/team1.jpg" },
            { name: "Priya Sharma", role: "Head of Events", img: "/team2.jpg" },
            { name: "Rohan Mehta", role: "Tech Lead", img: "/team3.jpg" }
          ].map(member => (
            <Grid item xs={12} sm={6} md={4} key={member.name}>
              <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden", textAlign: "center", cursor: "pointer" }}>
                <img src={member.img} alt={member.name} style={{ width: "100%", height: 250, objectFit: "cover" }} />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold">{member.name}</Typography>
                  <Typography sx={{ color: "#6b7280" }}>{member.role}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      
    </Box>
  );
}
