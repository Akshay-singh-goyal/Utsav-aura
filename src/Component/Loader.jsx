import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import utsavLogo from "./Images/utsavlogo.png"; // make sure this path is correct

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff9900, #ff6f00)", // warm gradient background
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.1)", // subtle transparent box
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={utsavLogo}
          alt="Utsav Logo"
          sx={{
            width: "120px",
            height: "120px",
            borderRadius: "50%", // circular logo
            border: "4px solid rgba(255, 255, 255, 0.6)", // border around logo
            marginBottom: "20px",
            objectFit: "cover",
          }}
        />
        {/* Loading Text */}
        <Typography
          sx={{
            color: "#fff",
            fontWeight: "bold",
            marginTop: "20px",
            textAlign: "center",
            fontSize: "1.2rem",
          }}
        >
          Welcome to Ustav-Aura. Loading, please wait...
        </Typography>
      </Box>
    </Box>
  );
};

export default Loader; 
