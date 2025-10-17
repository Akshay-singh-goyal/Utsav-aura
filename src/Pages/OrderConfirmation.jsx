// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Paper,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Download as DownloadIcon,
} from "@mui/icons-material";
import jsPDF from "jspdf";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Brand colors
const brandColors = {
  primary: "#FF9900",
  secondary: "#2874f0",
};

// INR formatter
const inr = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num
  );

// Helper to calculate total
const getItemTotal = (item) => {
  const unitPrice =
    item.mode === "Rent"
      ? Number(item.priceRent ?? item.price ?? item.discountPrice)
      : Number(item.priceBuy ?? item.price ?? item.discountPrice);
  const quantity = Number(item.quantity ?? 1);
  const rentalDays = item.mode === "Rent" ? Number(item.rentalDays ?? 1) : 1;
  return unitPrice * quantity * rentalDays;
};

// PDF Invoice Generator
const downloadInvoice = (order) => {
  if (!order) return;
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("🛍️ Incredible Fest - Invoice", 14, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Order ID: ${order.orderId || order._id || "N/A"}`, 14, y);
  y += 7;
  doc.text(
    `Customer: ${order.shipping?.firstName || ""} ${order.shipping?.lastName || ""}`,
    14,
    y
  );
  y += 7;
  doc.text(`Email: ${order.shipping?.email || "N/A"}`, 14, y);
  y += 7;
  doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 14, y);
  y += 10;

  doc.setFontSize(14);
  doc.text("Items Purchased:", 14, y);
  y += 8;

  order.items?.forEach((item, idx) => {
    const line = `${idx + 1}. ${item.name || "Unnamed Product"} (${item.mode || "Buy"}) × ${item.quantity || 1} ${
      item.mode === "Rent" ? `[${item.rentalDays} days]` : ""
    } = ${inr(getItemTotal(item))}`;
    doc.text(line, 14, y);
    y += 7;
  });

  y += 5;
  const subtotal = order.items?.reduce((sum, i) => sum + getItemTotal(i), 0) ?? 0;
  const delivery = order.deliveryCharge ?? 0;
  const grandTotal = subtotal + delivery;

  doc.text(`Subtotal: ${inr(subtotal)}`, 14, y);
  y += 7;
  doc.text(`Delivery: ${delivery === 0 ? "FREE" : inr(delivery)}`, 14, y);
  y += 7;
  doc.text(`Grand Total: ${inr(grandTotal)}`, 14, y);
  y += 7;
  doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 14, y);

  doc.save(`Invoice_${order.orderId || order._id || "order"}.pdf`);
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  const order =
    location.state?.order ||
    JSON.parse(localStorage.getItem("lastOrder")) ||
    null;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("⚠️ Please login to view your order!");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <ToastContainer position="top-right" autoClose={2000} />
        <ShoppingCart sx={{ fontSize: 80, color: brandColors.primary }} />
        <Typography variant="h5" sx={{ mt: 2, color: brandColors.secondary }}>
          Please login to see your order
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: brandColors.secondary,
            "&:hover": { bgcolor: "#1c5ed6" },
          }}
          onClick={() => navigate("/login")}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <ToastContainer position="top-right" autoClose={2000} />
        <Typography variant="h5" color="error" gutterBottom>
          ❌ No order found!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: brandColors.secondary,
            "&:hover": { bgcolor: "#1c5ed6" },
          }}
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </Container>
    );
  }

  const items = order.items || [];
  const shipping = order.shipping || {};
  const subtotal = items.reduce((sum, item) => sum + getItemTotal(item), 0);
  const delivery = subtotal > 999 ? 75 : 90;
  const grandTotal = subtotal + delivery;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        align="center"
        sx={{ color: brandColors.secondary, fontWeight: "bold" }}
      >
        <CheckCircle sx={{ mr: 1, color: brandColors.primary }} />
        Order Confirmed!
      </Typography>

      {/* Order Summary */}
      <Card sx={{ mb: 4, p: 2, borderRadius: 3, bgcolor: "#fff", boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: brandColors.primary }}>
            Order Summary
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {items.map((item, idx) => (
              <Grid item xs={12} key={idx}>
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#f9f9f9",
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {item.name || "Unnamed Product"}
                  </Typography>
                  <Typography variant="body2">Mode: {item.mode || "Buy"}</Typography>
                  <Typography variant="body2">
                    Qty: {item.quantity || 1}{" "}
                    {item.mode === "Rent" ? `| Days: ${item.rentalDays}` : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: brandColors.secondary }}
                  >
                    {inr(getItemTotal(item))}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Typography>Subtotal: {inr(subtotal)}</Typography>
          <Typography>Delivery: {delivery === 0 ? "FREE" : inr(delivery)}</Typography>
          <Typography variant="h6" sx={{ mt: 1, color: brandColors.secondary }}>
            Grand Total: {inr(grandTotal)}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              mt: 2,
              borderColor: brandColors.primary,
              color: brandColors.primary,
              "&:hover": {
                borderColor: brandColors.secondary,
                color: brandColors.secondary,
              },
            }}
            onClick={() => downloadInvoice(order)}
          >
            Download Invoice (PDF)
          </Button>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f1f5f9", borderRadius: 3 }}>
        <Typography variant="h6" mb={2} sx={{ color: brandColors.primary }}>
          <LocalShipping sx={{ mr: 1 }} />
          Shipping Information
        </Typography>
        {Object.keys(shipping).length > 0 ? (
          Object.entries(shipping).map(([key, value]) => (
            <Typography key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value || "-"}
            </Typography>
          ))
        ) : (
          <Typography>No shipping info available.</Typography>
        )}
      </Paper>

      {/* Payment Info */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f1f5f9", borderRadius: 3 }}>
        <Typography variant="h6" mb={2} sx={{ color: brandColors.primary }}>
          <Payment sx={{ mr: 1 }} />
          Payment & Other Details
        </Typography>
        <Typography>Payment Method: {order.paymentMethod || "-"}</Typography>
        <Typography>Note: {order.note || "-"}</Typography>
        <Typography>Status: {order.status || "Pending"}</Typography>
        <Typography>Order ID: {order.orderId || order._id || "-"}</Typography>
      </Paper>

      {/* Back to Home */}
      <Box textAlign="center">
        <Button
          variant="contained"
          sx={{
            mt: 3,
            px: 5,
            py: 1.5,
            fontWeight: "bold",
            backgroundColor: brandColors.secondary,
            "&:hover": { bgcolor: "#1c5ed6" },
          }}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
}
