// src/pages/ProductGallery.jsx
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
  Button,
  Box,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import axios from "axios";

export default function ProductGallery() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Updated categories including festival products
  const categories = [
    "All",
    "Decorations & Home Essentials",
    "Gifts & Hampers",
    "Clothing & Accessories",
    "Food & Beverages",
    "Spiritual & Religious Items",
    "Toys & Kids’ Products",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://utsav-aura-backend-7.onrender.com/api/products"
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products.");
    }
  };

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  // Add to Cart
  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.warning("Please login to add products to your cart.");
      navigate("/login");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((p) => p._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${product.name} added to cart!`);
  };

  // Buy Now → Navigate to product details page
  const handleBuyNow = (itemId) => {
    if (!isLoggedIn) {
      toast.warning("Please login to buy products.");
      navigate("/login");
      return;
    }
    navigate(`/shop/${itemId}`);
  };

  return (
    <Container sx={{ py: 5, backgroundColor: "#fefcf7", minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 3, textAlign: "center", color: "#4a3c1b" }}
      >
        ✨ Shop Products ✨
      </Typography>

      {/* Category Filter */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={category}
            label="Filter by Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem value={cat} key={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Products Display */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          overflowX: "auto",
          pb: 2,
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          flexWrap: { xs: "nowrap", md: "wrap" },
        }}
      >
        {filteredProducts.map((p) => (
          <Card
            key={p._id}
            sx={{
              minWidth: 280,
              maxWidth: 280,
              flexShrink: 0,
              borderRadius: 3,
              boxShadow: 4,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: 8,
              },
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={p.image}
              alt={p.name}
              sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
            />

            <CardContent>
              <Typography variant="h6" fontWeight="bold" color="#4a3c1b">
                {p.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  ₹{p.originalPrice}
                </Typography>
                <Typography variant="h6" color="#fc8019" fontWeight="bold">
                  ₹{p.discountPrice}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, height: 40, overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {p.description}
              </Typography>

              <Divider sx={{ my: 1 }} />

              <Typography variant="caption" color="text.secondary">
                Category: {p.category}
              </Typography>
              <br />
              {p.color && (
                <Typography variant="caption" color="text.secondary">
                  Color: {p.color}
                </Typography>
              )}
              <br />
              {p.soldBy && (
                <Typography variant="caption" color="text.secondary">
                  Sold By: {p.soldBy}
                </Typography>
              )}
              <br />
              <Chip
                size="small"
                label={p.quantity > 0 ? `In Stock (${p.quantity})` : "Out of Stock"}
                color={p.quantity > 0 ? "success" : "error"}
                sx={{ mt: 1 }}
              />

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handleAddToCart(p)}
                  disabled={p.quantity === 0}
                  sx={{
                    borderRadius: 2,
                    color: "#4a3c1b",
                    borderColor: "#fc8019",
                    "&:hover": { backgroundColor: "#fc8019", color: "white" },
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleBuyNow(p._id)}
                  disabled={p.quantity === 0}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "#fc8019",
                    "&:hover": { backgroundColor: "#ff6600" },
                    fontWeight: "bold",
                  }}
                >
                  Buy Now
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
