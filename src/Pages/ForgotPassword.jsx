// src/Pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async () => {
    if (!email) return toast.warning("Please enter your email!");
    try {
      const res = await fetch("https://utsav-aura-backend-7.onrender.com/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password reset link sent! Check your email.");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f3f4f6",
        py: 4,
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 3, bgcolor: "#fff8e1" }}>
          <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#f59e0b" }}>
            Forgot Password
          </Typography>
          <TextField
            fullWidth
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button fullWidth variant="contained" sx={{ bgcolor: "#f59e0b" }} onClick={handleForgotPassword}>
            Send Reset Link
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
