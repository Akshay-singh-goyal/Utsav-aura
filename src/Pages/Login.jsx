// src/Pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AccountCircle, Lock } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ setIsAuthenticated, setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      toast.info("You are already logged in!");
      setTimeout(() => navigate("/"), 800);
    }
  }, [navigate]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.warning("Please enter email and password!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", data.user.role);

        setIsAuthenticated?.(true);
        setUser?.({ ...data.user, role: data.user.role });

        toast.success("Login successful!");
        setTimeout(() => {
          if (data.user.role === "admin") navigate("/admin-dashboard");
          else navigate("/");
        }, 800);
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (err) {
      toast.error("Server error: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#f3f4f6",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 3,
            bgcolor: "#fff8e1",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#f59e0b", mb: 4 }}
          >
            Welcome Back!
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{ color: "#fbbf24" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#fbbf24" }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(to right, #facc15, #fb923c)",
                color: "#1e293b",
                "&:hover": {
                  background: "linear-gradient(to right, #fbbf24, #f59e0b)",
                },
              }}
            >
              Login
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              style={{ color: "#fbbf24", fontWeight: 500, textDecoration: "none" }}
            >
              Signup here
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
