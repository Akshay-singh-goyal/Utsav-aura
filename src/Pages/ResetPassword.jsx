// src/Pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Paper } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = async () => {
    if (!password || !confirmPassword) return toast.warning("Please fill both fields");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const res = await fetch(`https://utsav-aura-backend-7.onrender.com/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(data.message || "Failed to reset password");
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
            Reset Password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button fullWidth variant="contained" sx={{ bgcolor: "#f59e0b" }} onClick={handleReset}>
            Reset Password
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
