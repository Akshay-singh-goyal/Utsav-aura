// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CardMedia,
  Button,
  Box,
  Chip,
  Rating,
  Divider,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star, InfoOutlined } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://utsav-aura-backend-7.onrender.com/api/products/${id}`
      );
      setProduct(res.data);
      setSelectedImage(res.data.image);
    } catch (err) {
      console.error("❌ Failed to fetch product", err);
      toast.error("Failed to load product.");
    }
  };

  const handleAddToCart = () => {
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
    toast.success("✅ Product added to cart!");
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      toast.warning("Please login to continue purchase.");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${product._id}`);
  };

  if (!product) return <Typography>Loading...</Typography>;

  // 🔹 Discount Calculation
  const discountPercent = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  );

  return (
    <Container sx={{ py: 5, backgroundColor: "#fefcf7", minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* LEFT: Product Image */}
        <Box sx={{ flex: 1, maxWidth: 450 }}>
          <CardMedia
            component="img"
            image={selectedImage}
            alt={product.name}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "contain",
              mb: 2,
              maxHeight: 450,
              boxShadow: 3,
              backgroundColor: "#fff8f0",
            }}
          />
        </Box>

        {/* RIGHT: Product Details */}
        <Box sx={{ flex: 1.2 }}>
          {/* Name */}
          <Typography
            variant="h4"
            fontWeight="700"
            gutterBottom
            color="#4a3c1b"
          >
            {product.name}
          </Typography>

          {/* Featured Badge */}
          {product.featured && (
            <Chip
              icon={<Star sx={{ color: "gold" }} />}
              label="Featured"
              color="warning"
              sx={{ mb: 2, fontWeight: "bold" }}
            />
          )}

          {/* Rating (static for now) */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: "#555" }}>
              120 ratings
            </Typography>
          </Box>

          {/* Price Section */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              fontWeight="700"
              sx={{ color: "#fc8019" }}
            >
              ₹{product.discountPrice}
            </Typography>
            <Typography
              variant="body1"
              sx={{ textDecoration: "line-through", color: "gray" }}
            >
              ₹{product.originalPrice}
            </Typography>
            <Chip
              label={`${discountPercent}% Off`}
              color="success"
              size="small"
            />
          </Stack>

          {/* Stock Availability */}
          <Chip
            label={
              product.quantity > 0
                ? `In Stock (${product.quantity})`
                : "Out of Stock"
            }
            color={product.quantity > 0 ? "success" : "error"}
            sx={{ mb: 3 }}
          />

          {/* Description */}
          <Typography variant="body1" sx={{ mb: 4, color: "#555" }}>
            {product.description}
          </Typography>

          {/* About Product */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight="600"
              color="#4a3c1b"
            >
              <InfoOutlined sx={{ fontSize: 18, mr: 1 }} />
              About this Product
            </Typography>
            <ul style={{ paddingLeft: 20, color: "#333" }}>
              <li>Category: {product.category}</li>
              {product.color && <li>Color: {product.color}</li>}
              {product.soldBy && <li>Sold By: {product.soldBy}</li>}
              <li>Quality assured and crafted with care</li>
            </ul>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              sx={{
                flex: "1 1 150px",
                backgroundColor: "#fc8019",
                "&:hover": { backgroundColor: "#ff6600" },
                fontWeight: 700,
              }}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
              sx={{
                flex: "1 1 150px",
                borderColor: "#fc8019",
                color: "#4a3c1b",
                "&:hover": { backgroundColor: "#fc8019", color: "white" },
                fontWeight: 700,
              }}
            >
              Buy Now
            </Button>
            <Button
              variant="text"
              size="large"
              onClick={() => navigate(-1)}
              sx={{
                flex: "1 1 150px",
                color: "#fc8019",
                fontWeight: 700,
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
