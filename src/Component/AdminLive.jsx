// src/Component/AdminLive.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { PlayCircleOutline, StopCircle, Add, Image } from "@mui/icons-material";

const AdminLive = () => {
  const [lives, setLives] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeLink: "",
    poster: null,
    startTime: "",
  });

  const fetchLives = async () => {
    try {
      const res = await axios.get("https://utsav-aura-backend-7.onrender.com/api/live");
      setLives(res.data);
    } catch (err) {
      console.error("Error fetching lives:", err);
    }
  };

  useEffect(() => {
    fetchLives();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "poster") {
      setForm({ ...form, poster: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("youtubeLink", form.youtubeLink);
      formData.append("startTime", form.startTime);
      if (form.poster) formData.append("poster", form.poster);

      await axios.post("https://utsav-aura-backend-7.onrender.com/api/live", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ title: "", description: "", youtubeLink: "", poster: null, startTime: "" });
      fetchLives();
    } catch (err) {
      console.error("Error adding live session:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://utsav-aura-backend-7.onrender.com/api/live/${id}/status`, { status });
      fetchLives();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: "#1e1e1e" }}>
        Admin Live Management
      </Typography>

      {/* Add Live Form */}
      <Card sx={{ p: 2, mb: 3, boxShadow: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="YouTube Link"
              name="youtubeLink"
              value={form.youtubeLink}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button variant="outlined" component="label" fullWidth startIcon={<Image />}>
              {form.poster ? "Change Poster" : "Upload Poster"}
              <input
                type="file"
                name="poster"
                accept="image/*"
                hidden
                onChange={handleChange}
              />
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              value={form.startTime}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleAdd}
              fullWidth
              sx={{ height: "100%" }}
            >
              Add Live
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Live Sessions */}
      <Grid container spacing={3}>
        {lives.map((live) => (
          <Grid item xs={12} sm={6} md={4} key={live._id}>
            <Card sx={{ boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6">{live.title}</Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {live.description}
                </Typography>
                <Typography variant="body2">
                  Status: {live.status} <br />
                  Start: {new Date(live.startTime).toLocaleString()}
                </Typography>

                {/* Poster Preview */}
                {live.poster && (
                  <Box
                    component="img"
                    src={live.poster}
                    alt={live.title}
                    sx={{
                      width: "100%",
                      mt: 1,
                      borderRadius: 2,
                      maxHeight: 180,
                      objectFit: "cover",
                    }}
                  />
                )}
              </CardContent>
              <CardActions>
                <IconButton color="success" onClick={() => updateStatus(live._id, "live")}>
                  <PlayCircleOutline />
                </IconButton>
                <IconButton color="error" onClick={() => updateStatus(live._id, "ended")}>
                  <StopCircle />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminLive;
