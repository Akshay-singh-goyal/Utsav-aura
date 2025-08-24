import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://utsav-aura-backend-7.onrender.com/api";

export default function UserPackageView() {
  const [packages, setPackages] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    fetchPackages();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(cart.length);
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/packages`);
      setPackages(data);
    } catch (err) {
      console.error("❌ Error fetching packages", err?.response?.data || err);
      toast.error("Failed to fetch packages!");
    }
  };

  const handleExpand = (pkgId) => setExpanded((cur) => (cur === pkgId ? null : pkgId));

  const handleBook = (pkg) => {
    if (!isLoggedIn) {
      toast.warning("Please login to add packages to your cart.");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(pkg);
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);
    toast.success(`${pkg.name} added to cart!`);
  };

  return (
    <Container sx={{ mt: 6, mb: 8 }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#4a3c1b" }}
      >
        Available Ganesh Pooja Packages
      </Typography>

      {/* CART INFO */}
      <Typography align="right" sx={{ mb: 3, fontWeight: 600, color: "#fc8019" }}>
        🛒 Cart Items: {cartCount}
      </Typography>

      {packages.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No packages available yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {packages.map((pkg) => (
            <Grid item xs={12} sm={6} md={4} key={pkg._id}>
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  boxShadow: 4,
                  bgcolor: "#fff8f0",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                {pkg.image ? (
                  <Box
                    component="img"
                    src={pkg.image}
                    alt={pkg.name}
                    sx={{
                      width: "100%",
                      height: { xs: 150, sm: 180 },
                      borderRadius: 2,
                      objectFit: "cover",
                      mb: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 180,
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">No Image</Typography>
                  </Box>
                )}

                <Typography variant="h6" fontWeight="bold" sx={{ color: "#4a3c1b" }}>
                  {pkg.name} ({pkg.type})
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 0.5, height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {pkg.description || "No description available"}
                </Typography>
                <Typography sx={{ mb: 1, fontWeight: 600, color: "#fc8019" }}>
                  ₹{pkg.price} • {pkg.duration} day(s)
                </Typography>

                <Button
                  size="small"
                  onClick={() => handleExpand(pkg._id)}
                  endIcon={expanded === pkg._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ mb: 1, color: "#4a3c1b" }}
                >
                  {expanded === pkg._id ? "Hide Day-wise Items" : "View Day-wise Items"}
                </Button>

                <Collapse in={expanded === pkg._id} timeout="auto" unmountOnExit>
                  <Divider sx={{ my: 1 }} />
                  {pkg.days?.map((day) => (
                    <List key={day.dayNumber} dense sx={{ mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: "#4a3c1b" }}>
                        Day {day.dayNumber}
                      </Typography>
                      {day.items?.map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0 }}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  ))}
                </Collapse>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleBook(pkg)}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    bgcolor: "#fc8019",
                    "&:hover": { bgcolor: "#ff6600" },
                  }}
                >
                  🛒 Add to Cart
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
