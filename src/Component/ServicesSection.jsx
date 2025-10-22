// src/Component/ServicesSection.jsx
import React from "react";
import { Container, Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  FaTruckMoving,
  FaBroom,
  FaStore,
  FaPrayingHands,
  FaUtensils,
  FaLightbulb,
  FaGift,
  FaCamera,
  FaPalette,
} from "react-icons/fa";

const services = [
  { title: "Room / Home Shifting", icon: FaTruckMoving, path: "/roomshifting" },
  { title: "Home Decoration", icon: FaPalette, path: "/home-decoration" },
  { title: "Shop Decoration", icon: FaStore, path: "/shop-decoration" },
  { title: "House Cleaning", icon: FaBroom, path: "/house-cleaning" },
  { title: "Shop Cleaning", icon: FaBroom, path: "/shop-cleaning" },
  { title: "Pandit / Pooja Booking", icon: FaPrayingHands, path: "/pandit-pooja" },
  { title: "Catering / Food Services", icon: FaUtensils, path: "/catering" },
  { title: "Lighting / Rangoli Setup", icon: FaLightbulb, path: "/lighting-rangoli" },
  { title: "Event Photography", icon: FaCamera, path: "/photography" },
  { title: "Gift Packs / Hampers", icon: FaGift, path: "/gift-packs" },
];

export default function ServicesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 8 }}>
      <Typography
        variant={isMobile ? "h5" : "h3"}
        fontWeight="bold"
        textAlign="center"
        mb={6}
        sx={{ color: "#f59e0b" }}
      >
        Our Festival Services
      </Typography>

      <Grid
        container
        spacing={4}
        sx={
          isMobile
            ? { overflowX: "auto", flexWrap: "nowrap", pb: 2, mx: -1 }
            : {}
        }
      >
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              key={service.title}
              sx={isMobile ? { minWidth: 180, px: 1 } : {}}
            >
              <Paper
                elevation={4}
                onClick={() => service.path && navigate(service.path)}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "0.3s",
                  cursor: service.path ? "pointer" : "default",
                  "&:hover": service.path
                    ? { transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" }
                    : {},
                  bgcolor: "#fff8e1",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "#ffe0b2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Icon size={36} color="#FF9900" />
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {service.title}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
