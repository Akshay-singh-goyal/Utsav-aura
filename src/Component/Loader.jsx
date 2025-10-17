// src/Component/Loader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f9fafb",
      }}
    >
      <CircularProgress size={70} thickness={5} color="error" />
      <Typography variant="h6" mt={2} sx={{ color: "#ef4444", fontWeight: "bold" }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default Loader;
