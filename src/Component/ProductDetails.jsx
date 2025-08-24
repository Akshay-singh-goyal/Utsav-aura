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
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`https://utsav-aura-backend-7.onrender.com/api/products/${id}`);
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

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, { ...product, quantity: 1 }];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("✅ Product added to cart!");
  };

  if (!product) return <Typography>Loading...</Typography>;

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
        {/* Left: Images */}
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

          {/* Thumbnail gallery */}
          {product.images && product.images.length > 1 && (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {product.images.map((img, idx) => (
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
                    border:
                      selectedImage === img
                        ? "2px solid #fc8019"
                        : "1px solid #ddd",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* Right: Details */}
        <Box sx={{ flex: 1.2 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            gutterBottom
            color="#4a3c1b"
          >
            {product.name}
          </Typography>

          {product.featured && (
            <Chip
              icon={<Star sx={{ color: "gold" }} />}
              label="Featured"
              color="warning"
              sx={{ mb: 2, fontWeight: "bold" }}
            />
          )}

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating value={4.5} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1, color: "#555" }}>
              120 ratings
            </Typography>
          </Box>

          {/* Price */}
          <Typography
            variant="h5"
            fontWeight="700"
            sx={{ mb: 1, color: "#fc8019" }}
          >
            ₹{product.price}
          </Typography>

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
              About this product
            </Typography>
            <ul style={{ paddingLeft: 20, color: "#333" }}>
              <li>High quality materials</li>
              <li>Perfect for daily use or gifting</li>
              <li>Category: {product.category}</li>
            </ul>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToCart}
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
              onClick={() => navigate(-1)}
              sx={{
                flex: "1 1 150px",
                borderColor: "#fc8019",
                color: "#4a3c1b",
                "&:hover": { backgroundColor: "#fc8019", color: "white" },
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
