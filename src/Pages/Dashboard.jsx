// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Box, Grid, Card, Typography, IconButton } from "@mui/material";
import { ShoppingCart, People, TrendingUp, Facebook, Twitter, LinkedIn } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import StatCard from "../Component/StatCard";
import { TrafficAreaLine } from "../Component/AreaLineChart";
import { getLoggedInUser } from "../utils/auth";

export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const [traffic, setTraffic] = useState(null);

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      toast.warning("Please login first!");
      return;
    }

    (async () => {
      try {
        const s = await api.get("/dashboard/stats");
        const t = await api.get("/dashboard/traffic");
        setStats(s.data);
        setTraffic(t.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to fetch dashboard data.");
      }
    })();
  }, []);

  const iconMap = {
    "Sales": <ShoppingCart sx={{ color: "#0f79af" }} />,
    "Users": <People sx={{ color: "#ffce00" }} />,
    "Revenue": <TrendingUp sx={{ color: "#f96332" }} />,
  };

  const socialData = [
    { platform: "Facebook", icon: <Facebook sx={{ color: "#1877F2", fontSize: 30 }} />, friends: "89k", feeds: "459" },
    { platform: "Twitter", icon: <Twitter sx={{ color: "#1DA1F2", fontSize: 30 }} />, followers: "973k", tweets: "1,792" },
    { platform: "LinkedIn", icon: <LinkedIn sx={{ color: "#0A66C2", fontSize: 30 }} />, contacts: "500+", feeds: "292" },
  ];

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: "#f3f3f3", minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Typography variant="h4" mb={3} color="#0f79af">Dashboard</Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={4} key={s._id}>
            <StatCard title={s.label} value={Intl.NumberFormat().format(s.value)} change={s.changePct}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {iconMap[s.label] || <TrendingUp sx={{ color: "#0f79af" }} />}
                <Typography variant="subtitle2" color={s.changePct >= 0 ? "success.main" : "error.main"}>
                  {s.changePct >= 0 ? `+${s.changePct}%` : `${s.changePct}%`}
                </Typography>
              </Box>
              <Box className="spark" display="flex" gap={0.5}>
                {s.series.map((n, i) => (
                  <Box key={i} sx={{ width: 4, height: 10 + n * 6, bgcolor: "#0f79af", borderRadius: 1 }} />
                ))}
              </Box>
            </StatCard>
          </Grid>
        ))}
      </Grid>

      {/* Traffic Chart */}
      {traffic && (
        <Box mb={4}>
          <TrafficAreaLine {...traffic} />
        </Box>
      )}

      {/* Social Cards */}
      <Grid container spacing={3}>
        {socialData.map((s, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card sx={{ p: 3, bgcolor: "#ffffff", boxShadow: 3 }}>
              <Box display="flex" alignItems="center" mb={2} gap={1}>
                {s.icon}
                <Typography variant="h6">{s.platform}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="subtitle2" color="#0f79af">Main</Typography>
                  <Typography variant="h6">{s.friends || s.followers || s.contacts}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="#ffce00">Sub</Typography>
                  <Typography variant="h6">{s.feeds || s.tweets}</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
