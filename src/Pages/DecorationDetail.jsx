// src/Pages/DecorationDetail.jsx
import React, { useEffect, useState } from "react";
import {
  Container, Typography, CardMedia, Box, Chip,
  Rating, Divider, Button, Paper
} from "@mui/material";
import { Star, ShoppingCart } from "@mui/icons-material";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getLoggedInUser } from "../utils/auth";

export default function DecorationDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.state?.mode || "buy"; // 'buy' or 'rent'
  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) {
      toast.warning("Please login to view product details!");
      navigate("/login");
      return;
    }
    setUser(loggedInUser);
    fetchDecoration();
  }, [navigate]);

  const fetchDecoration = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/decorations/${id}`);
      setItem(res.data);
      setSelectedImage(res.data.image);
    } catch (err) {
      console.error("Failed to fetch decoration", err);
      toast.error("Failed to load product details");
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.warning("Please login first!");
      navigate("/login");
      return;
    }
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, { ...item, rentMode: mode }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("✅ Item added to cart!");
    navigate("/cart");
  };

  if (!item) return <Typography sx={{ textAlign: "center", mt: 5 }}>Loading...</Typography>;

  return (
    <Container sx={{ py: 5, bgcolor: "#f5f5f5" }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
        {/* Left: Main Image + Thumbnails */}
        <Box sx={{ flex: 1, maxWidth: 450 }}>
          <CardMedia
            component="img"
            image={selectedImage}
            alt={item.name}
            sx={{
              width: "100%",
              borderRadius: 2,
              objectFit: "contain",
              mb: 2,
              maxHeight: 450,
              boxShadow: 3,
              backgroundColor: "#fff",
            }}
          />
          {item.images && item.images.length > 1 && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {item.images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  sx={{
                    width: 70,
                    height: 70,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: selectedImage === img ? "2px solid #1976d2" : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Right: Details */}
        <Box sx={{ flex: 1.2 }}>
          <Typography variant="h4" fontWeight="700" gutterBottom color="#0f79af">
            {item.name}
          </Typography>

          {item.featured && (
            <Chip
              icon={<Star sx={{ color: "gold" }} />}
              label="Featured"
              color="warning"
              sx={{ mb: 2, fontWeight: "bold" }}
            />
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={4} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
              390 ratings
            </Typography>
          </Box>

          <Typography variant="h5" fontWeight="700" sx={{ mb: 1 }}>
            {mode === "buy" ? (
              <>
                ₹{item.priceBuy}{" "}
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.disabled",
                    fontWeight: "400",
                    ml: 1,
                    fontSize: "1.1rem",
                  }}
                >
                  ₹{Math.floor(item.priceBuy / 0.26)}
                </Typography>
              </>
            ) : (
              <>₹{item.priceRent}</>
            )}
          </Typography>

          <Typography variant="body2" color="success.main" fontWeight="600" sx={{ mb: 3 }}>
            74% off
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: "#333" }}>
            {item.description}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="600">
              About this item
            </Typography>
            <ul style={{ paddingLeft: 20, color: "#333" }}>
              <li>High quality and durable materials</li>
              <li>Available for buy or rent</li>
              <li>Featured item: {item.featured ? "Yes" : "No"}</li>
              <li>Perfect for decoration & gifting purposes</li>
            </ul>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              sx={{ flex: "1 1 150px" }}
            >
              Add to Cart ({mode === "buy" ? "Buy" : "Rent"})
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={() => navigate(-1)}
              sx={{ flex: "1 1 150px" }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
