// src/Pages/MyOrdersPage.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Chip,
  Card,
  CardContent,
  Button,
  Box,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import axios from "axios";
import { ShoppingCart } from "@mui/icons-material";

const socket = io("http://localhost:5000");

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.warning("Please login to view your orders!");
      setLoading(false);
      return;
    }
    setUser(JSON.parse(storedUser));
  }, []);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
      setOrders(res.data || []);
      socket.emit("joinRoom", user.id);
    } catch (err) {
      toast.error("Failed to fetch orders. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) =>
        prev.map((o) => (o._id === updatedOrder._id ? updatedOrder : o))
      );
    });

    return () => socket.off("orderUpdated");
  }, [user]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.patch(
        `http://localhost:5000/api/orders/status/${orderId}`,
        { status: "Cancelled", note: "Cancelled by user" }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.order : o))
      );
      toast.success("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order. Try again.");
    }
  };

  if (loading)
    return (
      <Container>
        <Typography align="center" sx={{ mt: 4, color: "#1e293b" }}>
          Loading orders...
        </Typography>
      </Container>
    );

  if (!user)
    return (
      <Container sx={{ textAlign: "center", py: 10 }}>
        <ShoppingCart sx={{ fontSize: 80, color: "#fbbf24" }} />
        <Typography variant="h5" sx={{ mt: 2, color: "#1e293b" }}>
          Please login to view your orders!
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 4,
            background: "linear-gradient(to right, #facc15, #fb923c)",
            color: "#1e293b",
            "&:hover": {
              background: "linear-gradient(to right, #fbbf24, #f59e0b)",
            },
          }}
          onClick={() => (window.location.href = "/login")}
        >
          Go to Login
        </Button>
        <ToastContainer position="top-right" autoClose={2000} />
      </Container>
    );

  return (
    <Container sx={{ py: 5 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Typography variant="h4" mb={3} sx={{ color: "#ef4444", fontWeight: "bold" }}>
        My Orders
      </Typography>

      <Button
        variant="contained"
        onClick={fetchOrders}
        sx={{
          mb: 3,
          background: "linear-gradient(to right, #facc15, #fb923c)",
          color: "#1e293b",
          "&:hover": { background: "linear-gradient(to right, #fbbf24, #f59e0b)" },
        }}
      >
        Refresh Orders
      </Button>

      <Stack spacing={3}>
        {orders.length === 0 ? (
          <Typography sx={{ color: "#1e293b" }}>No orders found.</Typography>
        ) : (
          orders.map((order) => (
            <Card
              key={order._id}
              sx={{
                bgcolor: "#fff8e1",
                borderRadius: 3,
                boxShadow: 4,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: "#1e293b" }}>
                  Order ID: {order.orderId || order._id}
                </Typography>
                <Typography sx={{ mt: 1 }}>
                  Status:{" "}
                  <Chip
                    label={order.status || "-"}
                    color={
                      order.status === "Pending"
                        ? "warning"
                        : order.status === "Confirmed"
                        ? "info"
                        : order.status === "Shipped"
                        ? "primary"
                        : order.status === "Delivered"
                        ? "success"
                        : "error"
                    }
                  />
                </Typography>
                {order.note && (
                  <Typography sx={{ mt: 1 }}>
                    <strong>Note:</strong> {order.note}
                  </Typography>
                )}
                <Typography sx={{ mt: 1 }}>Total: ₹{order.total || 0}</Typography>
                <Typography sx={{ mt: 1 }}>Items:</Typography>
                <Stack pl={2} spacing={0.5}>
                  {order.items?.length
                    ? order.items.map((item) => (
                        <Typography key={item._id || Math.random()}>
                          {item.name} ({item.mode || "Buy"}) x {item.quantity || 1} | ₹{item.price || 0}
                        </Typography>
                      ))
                    : "-"}
                </Stack>

                {order.status !== "Cancelled" && order.status !== "Delivered" && (
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      background: "linear-gradient(to right, #ef4444, #f59e0b)",
                      color: "#fff",
                      "&:hover": { background: "linear-gradient(to right, #f87171, #fb923c)" },
                    }}
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
}
