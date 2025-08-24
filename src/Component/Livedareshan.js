import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { Visibility, ThumbUp, Chat } from "@mui/icons-material";

const VIDEO_ID = process.env.REACT_APP_YT_LIVE_VIDEO_ID || "dcPKvaHB0-4";
const DOMAIN = process.env.REACT_APP_SERVER || "localhost:3000"; // ensure correct domain

export default function Livedarshan() {
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0 });

  // Brand color scheme (Amazon/Flipkart inspired)
  const brandColors = {
    primary: "#FF9900", // orange accent
    secondary: "#232F3E", // dark
    bgGradient: "linear-gradient(135deg, #fff3e0, #ffe0b2)", // card bg
    textPrimary: "#111",
    textSecondary: "#555",
    iconColors: ["#f57c00", "#ef6c00", "#fb8c00"],
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          "https://utsav-aura-backend-7.onrender.com/api/misc/youtube-stats"
        );
        const data = await res.json();
        setStats({
          views: data.views || 0,
          likes: data.likes || 0,
          comments: data.comments || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ textAlign: "center", py: 4 }}>
      {/* Title */}
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ color: brandColors.primary, mb: 3 }}
      >
        🙏 Ganesh Murti Live Darshan
      </Typography>

      {/* Live Video */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 3,
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <iframe
          width="100%"
          height="400"
          max-width="800"
          src={`https://www.youtube.com/embed/${VIDEO_ID}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ border: "none", borderRadius: "12px" }}
        />
      </Box>

      {/* Stats Card */}
      <Card
        sx={{
          mb: 4,
          background: brandColors.bgGradient,
          borderRadius: 3,
          boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <CardContent>
          <Grid container spacing={3} justifyContent="center">
            {["Views", "Likes", "Comments"].map((label, idx) => {
              const Icon = [Visibility, ThumbUp, Chat][idx];
              const value = [stats.views, stats.likes, stats.comments][idx];
              return (
                <Grid item xs={12} sm={4} key={label}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon sx={{ color: brandColors.iconColors[idx], mr: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: brandColors.textPrimary }}
                    >
                      {label}: {value}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      <Divider sx={{ mb: 4, borderColor: brandColors.primary }} />

      {/* Live Chat */}
      <Box
        sx={{
          mb: 4,
          borderRadius: 3,
          boxShadow: "0px 6px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          gutterBottom
          sx={{ mb: 2, color: brandColors.secondary }}
        >
          💬 Live Chat
        </Typography>
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/live_chat?v=${VIDEO_ID}&embed_domain=${DOMAIN}`}
          title="YouTube Live Chat"
          style={{ border: "none" }}
        />
      </Box>
    </Container>
  );
}
