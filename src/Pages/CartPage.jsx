import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import { Delete, ShoppingCartCheckout, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Brand Colors (from Navbar/Footer)
  const brandColors = {
    primary: "#FF9900", // Amazon orange
    secondary: "#2874f0", // Flipkart blue
    dark: "#232F3E",
    lightBg: "#FFF8E1",
  };

  // Load cart on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login to view your cart!");
      navigate("/login");
      return;
    }
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [navigate]);

  // Update state + localStorage
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Remove item
  const handleRemove = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    updateCart(updated);
    toast.info("❌ Item removed from cart");
  };

  // Total price
  const total = cart.reduce(
    (sum, item) => sum + (item.priceBuy || item.discountPrice || item.price) * (item.quantity || 1),
    0
  );

  // Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }
    toast.success("Proceeding to checkout...");
    navigate("/checkout");
  };

  return (
    <Container sx={{ py: 5, minHeight: "80vh" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ color: brandColors.primary }}
      >
        🛒 Your Shopping Cart
      </Typography>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <Box
          textAlign="center"
          sx={{
            py: 10,
            bgcolor: brandColors.lightBg,
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <ShoppingCartCheckout sx={{ fontSize: 80, color: brandColors.secondary }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            Your cart is empty!
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            sx={{
              mt: 3,
              backgroundColor: brandColors.secondary,
              "&:hover": { bgcolor: "#1c5ed6" },
            }}
            onClick={() => navigate("/")}
          >
            Go Shopping
          </Button>
        </Box>
      ) : (
        <>
          {/* Cart Items */}
          {cart.map((item) => (
            <Card
              key={item._id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 1,
                borderRadius: 3,
                boxShadow: 3,
                flexWrap: "wrap",
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography color="primary" fontWeight="bold">
                  ₹{item.priceBuy || item.price ||  item.discountPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Qty: {item.quantity || 1}
                </Typography>
              </CardContent>
              <IconButton
                color="error"
                onClick={() => handleRemove(item._id)}
                sx={{ ml: "auto" }}
              >
                <Delete />
              </IconButton>
            </Card>
          ))}

          {/* Total Section */}
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={3}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color={brandColors.secondary}>
              ₹{total}
            </Typography>
          </Box>

          {/* Checkout Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              backgroundColor: brandColors.primary,
              "&:hover": { bgcolor: "#e68a00" },
              borderRadius: 3,
              fontWeight: "bold",
            }}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
}
