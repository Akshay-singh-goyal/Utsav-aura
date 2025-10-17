import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  Collapse,
} from "@mui/material";
import { PlayCircleOutline, Replay } from "@mui/icons-material";

const LiveHistory = () => {
  const [lives, setLives] = useState([]);
  const [expanded, setExpanded] = useState({}); // 👈 track which description is expanded

  useEffect(() => {
    const fetchLives = async () => {
      try {
        const res = await axios.get(
          "https://utsav-aura-backend-7.onrender.com/api/live"
        );
        setLives(res.data);
      } catch (err) {
        console.error("Failed to fetch live sessions:", err);
      }
    };
    fetchLives();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{ padding: "10px 0" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          textAlign: "center",
          marginBottom: 3,
          color: "#ef4444",
          fontWeight: "bold",
        }}
      >
        Live Sessions
      </Typography>

      <Grid container spacing={3}>
        {lives.length === 0 && (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", width: "100%" }}
          >
            No live sessions available.
          </Typography>
        )}

        {lives.map((live) => (
          <Grid item xs={12} sm={6} md={4} key={live._id}>
            <Card
              sx={{
                minWidth: 275,
                boxShadow: 3,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  {live.title}
                </Typography>

                {/* ✨ Description with More/Less */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    WebkitLineClamp: expanded[live._id] ? "unset" : 1,
                    whiteSpace: expanded[live._id] ? "normal" : "initial",
                  }}
                >
                  {live.description}
                </Typography>
                {live.description && live.description.length > 50 && (
                  <Button
                    size="small"
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      marginTop: "4px",
                      color: "#ef4444",
                      fontWeight: 600,
                    }}
                    onClick={() => toggleExpand(live._id)}
                  >
                    {expanded[live._id] ? "Less" : "More"}
                  </Button>
                )}

                <Typography variant="body2" color="text.secondary" mt={1}>
                  Status:{" "}
                  {live.status.charAt(0).toUpperCase() + live.status.slice(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Start: {new Date(live.startTime).toLocaleString()}
                </Typography>
                {live.endTime && (
                  <Typography variant="body2" color="text.secondary">
                    Ended: {new Date(live.endTime).toLocaleString()}
                  </Typography>
                )}
              </CardContent>

              {/* 🎥 Embedded YouTube Video */}
              <div
                style={{
                  position: "relative",
                  paddingTop: "56.25%",
                  margin: "0 16px",
                }}
              >
                <iframe
                  src={live.youtubeLink.replace("watch?v=", "embed/")}
                  title={live.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  allowFullScreen
                />
              </div>

              <CardActions sx={{ justifyContent: "center", pb: 2 }}>
                {live.status === "live" || live.status === "upcoming" ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    href={live.youtubeLink}
                    target="_blank"
                    startIcon={<PlayCircleOutline />}
                  >
                    Watch Now
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    color="secondary"
                    href={live.youtubeLink}
                    target="_blank"
                    startIcon={<Replay />}
                  >
                    Watch Replay
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default LiveHistory;
