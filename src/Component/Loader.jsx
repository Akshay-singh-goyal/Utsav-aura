// src/Component/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import Logo from "../assets/logo.png"; // Make sure you have your logo image here

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${Logo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      {/* Overlay for better visibility of loader */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // semi-transparent dark overlay
          zIndex: 1,
        }}
      />

      {/* Loader and text */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress size={70} thickness={5} color="primary" />
        <Typography
          variant="h6"
          mt={2}
          sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
        >
          Loading, please wait...
        </Typography>
      </Box>
    </Box>
  );
};

export default Loader;
