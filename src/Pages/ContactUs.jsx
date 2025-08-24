// src/Pages/ContactUs.jsx
import React, { useState } from "react";
import { Container, Typography, TextField, Button, Box, Grid, Paper, InputAdornment } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { AccountCircle, Email, Subject, Message } from "@mui/icons-material";
import { Phone, LocationOn } from "@mui/icons-material";

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      return toast.error("Please fill all fields");
    }
    try {
      await axios.post("http://localhost:5000/api/queries/create", form);
      toast.success("Query submitted successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit query");
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <ToastContainer />
      <Typography variant="h4" align="center" mb={4} sx={{ fontWeight: "bold", color: "#0f1111" }}>
        Contact Us
      </Typography>

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Subject"
              name="subject"
              fullWidth
              margin="normal"
              value={form.subject}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Subject />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Message"
              name="message"
              fullWidth
              margin="normal"
              multiline
              rows={6}
              value={form.message}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Message />
                  </InputAdornment>
                ),
              }}
            />
            <Box textAlign="center" mt={3}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#ff9900",
                  color: "#fff",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": { backgroundColor: "#e68a00" },
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Aside Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2, bgcolor: "#f1f3f6" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Contact Information
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ mr: 1, color: "#ff9900" }} /> <Typography>+91 6263615262</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ mr: 1, color: "#ff9900" }} /> <Typography>Smgarbaevent@gmail.com</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn sx={{ mr: 1, color: "#ff9900" }} /> <Typography>Indore, Madhya Pradesh, India</Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: "bold", mt: 3, mb: 1 }}>
              FAQs
            </Typography>
            <Typography sx={{ mb: 1 }}>• How long will my order take?</Typography>
            <Typography sx={{ mb: 1 }}>• Can I return the product?</Typography>
            <Typography sx={{ mb: 1 }}>• Payment options available?</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
