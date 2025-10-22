import React from "react";
import { Container, Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
  { title: "Room / Home Shifting", icon: FaTruckMoving },
  { title: "Home Decoration", icon: FaPalette },
  { title: "Shop Decoration", icon: FaStore },
  { title: "House Cleaning", icon: FaBroom },
  { title: "Shop Cleaning", icon: FaBroom },
  { title: "Pandit / Pooja Booking", icon: FaPrayingHands },
  { title: "Catering / Food Services", icon: FaUtensils },
  { title: "Lighting / Rangoli Setup", icon: FaLightbulb },
  { title: "Event Photography", icon: FaCamera },
  { title: "Gift Packs / Hampers", icon: FaGift },
];

export default function ServicesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

      <Grid container spacing={4} sx={isMobile ? { overflowX: "auto", flexWrap: "nowrap" } : {}}>
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              key={service.title}
              sx={isMobile ? { minWidth: 180 } : {}}
            >
              <Paper
                elevation={4}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": { transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(0,0,0,0.3)" },
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
