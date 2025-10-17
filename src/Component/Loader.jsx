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
        {/* Logo with rotating ring */}
        <Box
          sx={{
            position: "relative",
            width: "140px",
            height: "140px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Rotating ring */}
          <Box
            sx={{
              position: "absolute",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.6)",
              borderTopColor: "transparent",
              animation: "spin 1.5s linear infinite",
            }}
          />

          {/* Logo */}
          <Box
            component="img"
            src={utsavLogo}
            alt="Utsav Logo"
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </Box>

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

      {/* Keyframes for spin animation */}
      <Box
        component="style"
        children={`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      />
    </Box>
  );
};

export default Loader;
