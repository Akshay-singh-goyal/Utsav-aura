// src/components/DecorationGallery.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardMedia,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Box,
} from "@mui/material";
import { Star, ShoppingCart, Payment } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DecorationGallery() {
  const [decorations, setDecorations] = useState([]);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filters = ["All", "Featured"];

  useEffect(() => {
    fetchDecorations();
  }, []);

  const fetchDecorations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/decorations");
      setDecorations(res.data);
    } catch (err) {
      console.error("Failed to fetch decorations", err);
      toast.error("Failed to load decorations!");
    }
  };

  const addToCart = (item) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login first!");
      navigate("/login");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("✅ Item added to cart!");
  };

  const handleBuyNow = (itemId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login first!");
      navigate("/login");
      return;
    }

    navigate(`/decorations/${itemId}`, { state: { mode: "buy" } });
  };

  const filteredDecorations =
    filter === "All" ? decorations : decorations.filter((d) => d.featured);

  // Brand colors (Amazon/Flipkart inspired)
  const brandColors = {
    primary: "#FF9900", // accent
    secondary: "#232F3E", // dark background
    cardBg: "#FFF8E1", // card background
    textPrimary: "#111", // main text
    textSecondary: "#555", // secondary text
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: brandColors.primary,
        }}
      >
        🎉 Decoration Items
      </Typography>

      {/* Filter Dropdown */}
      <FormControl sx={{ mb: 3, minWidth: 180 }}>
        <InputLabel>Filter</InputLabel>
        <Select
          value={filter}
          label="Filter"
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map((f) => (
            <MenuItem value={f} key={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Horizontal Scroll Container */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          pb: 2,
          "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar
        }}
      >
        {filteredDecorations.map((item) => (
          <Card
            key={item._id}
            sx={{
              minWidth: 250,
              flex: "0 0 auto",
              transition: "0.3s",
              "&:hover": { boxShadow: 6 },
              backgroundColor: brandColors.cardBg,
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={item.image}
              alt={item.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: brandColors.textPrimary,
                }}
              >
                {item.name}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: brandColors.textSecondary }}
              >
                ₹{item.priceBuy}
              </Typography>

              {item.featured && (
                <Chip
                  icon={<Star sx={{ color: "gold" }} />}
                  label="Featured"
                  color="warning"
                  sx={{ mt: 1, mb: 1 }}
                />
              )}

              {/* Buttons Side by Side */}
              <Box display="flex" gap={1} mt={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShoppingCart />}
                  sx={{
                    color: brandColors.primary,
                    borderColor: brandColors.primary,
                    "&:hover": { backgroundColor: brandColors.primary, color: "#fff" },
                  }}
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Payment />}
                  sx={{
                    backgroundColor: brandColors.primary,
                    "&:hover": { backgroundColor: "#e68a00" },
                  }}
                  onClick={() => handleBuyNow(item._id)}
                >
                  Buy Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
