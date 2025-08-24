import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  InputLabel,
  FormControl,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    adminKey: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect logged-in users automatically
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      toast.info("You are already logged in!");
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === "admin") payload.adminKey = form.adminKey.trim();

      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("✅ Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(`❌ ${data.message || "Signup failed"}`);
      }
    } catch (err) {
      toast.error("⚠️ Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f3f4f6"
      px={2}
    >
      <ToastContainer position="top-right" autoClose={2000} />
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          borderRadius: 3,
          bgcolor: "#fff8e1",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          mb={3}
          color="#1e293b"
        >
          🛒 Create Your Account
        </Typography>

        <form onSubmit={handleSignup}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select name="role" value={form.role} onChange={onChange}>
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          {form.role === "admin" && (
            <TextField
              fullWidth
              label="Admin Secret Key"
              type="password"
              name="adminKey"
              value={form.adminKey}
              onChange={onChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="error" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
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
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <Typography
          variant="body2"
          textAlign="center"
          mt={3}
          color="#1e293b"
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#ef4444", fontWeight: 500, textDecoration: "none" }}
          >
            Login here
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
