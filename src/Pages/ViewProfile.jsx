// src/Pages/ViewProfile.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Button,
  IconButton,
  Divider,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewProfile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);

  const primaryColor = "#b76e1b"; 
  const secondaryColor = "#d7cfa7"; 

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("https://utsav-aura-backend-7.onrender.com/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setForm({
            firstName: res.data.user.firstName || "",
            lastName: res.data.user.lastName || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            age: res.data.user.age || "",
            address: res.data.user.address || "",
            city: res.data.user.city || "",
            state: res.data.user.state || "",
            zip: res.data.user.zip || "",
            country: res.data.user.country || "India",
          });

          const orderRes = await axios.get("https://utsav-aura-backend-7.onrender.com/api/profile/orders", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (orderRes.data.success) setOrders(orderRes.data.orders);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch profile or orders");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put("https://utsav-aura-backend-7.onrender.com/api/profile/update", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        setEditing(false);
        setOrders((prev) => {
          const updated = [...prev];
          if (updated[0]) updated[0].shipping = { ...form };
          return updated;
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const profileFields = [
    { name: "firstName", label: "First Name", placeholder: "Enter first name" },
    { name: "lastName", label: "Last Name", placeholder: "Enter last name" },
    { name: "email", label: "Email", placeholder: "Enter email" },
    { name: "phone", label: "Phone", placeholder: "Enter phone number" },
    { name: "age", label: "Age", placeholder: "Enter your age" },
    { name: "address", label: "Address", placeholder: "Enter address" },
    { name: "city", label: "City", placeholder: "Enter city" },
    { name: "state", label: "State", placeholder: "Enter state" },
    { name: "zip", label: "ZIP", placeholder: "Enter ZIP code" },
    { name: "country", label: "Country", placeholder: "Enter country" },
  ];

  return (
    <Container sx={{ py: 5 }}>
      <ToastContainer />
      <Typography
        variant={{ xs: "h5", sm: "h4" }}
        mb={3}
        align="center"
        sx={{ fontWeight: "bold", color: primaryColor }}
      >
        My Profile
      </Typography>

      {/* Profile Section */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 5, bgcolor: secondaryColor }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="h6" sx={{ color: primaryColor, mb: { xs: 1, sm: 0 } }}>
            Personal Details
          </Typography>
          <IconButton onClick={() => setEditing(!editing)} sx={{ color: primaryColor }}>
            {editing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>
        <Divider sx={{ my: 2, borderColor: primaryColor }} />

        <Grid container spacing={2}>
          {profileFields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {editing ? (
                <TextField
                  fullWidth
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={form[field.name] || ""}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    sx: {
                      bgcolor: "white",
                      color: primaryColor,
                      borderRadius: 1,
                    },
                  }}
                  InputLabelProps={{ sx: { color: primaryColor } }}
                />
              ) : (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: "capitalize", color: primaryColor }}
                  >
                    {field.label}
                  </Typography>
                  <Typography variant="body1" sx={{ color: primaryColor }}>
                    {form[field.name] || "-"}
                  </Typography>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>

        {editing && (
          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              onClick={handleUpdate}
              sx={{ bgcolor: primaryColor, "&:hover": { bgcolor: "#955e16" } }}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

      {/* Orders Section */}
      <Typography variant="h5" mb={2} sx={{ fontWeight: "bold", color: primaryColor }}>
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Typography>No orders found.</Typography>
      ) : (
        orders.map((order) => (
          <Paper key={order._id} sx={{ p: 2, mb: 2, bgcolor: secondaryColor }}>
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              flexWrap="wrap"
              mb={1}
            >
              <Typography sx={{ color: primaryColor, mb: { xs: 0.5, sm: 0 } }}>
                <strong>Order ID:</strong> {order.orderId || order._id}
              </Typography>
              <Typography sx={{ color: primaryColor, mb: { xs: 0.5, sm: 0 } }}>
                <strong>Status:</strong> {order.status}
              </Typography>
              <Typography sx={{ color: primaryColor, mb: { xs: 0.5, sm: 0 } }}>
                <strong>Total:</strong> ₹{order.total}
              </Typography>
              <Typography sx={{ color: primaryColor }}>
                <strong>Ordered On:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: primaryColor }} />

            {/* Shipping Info */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: primaryColor }}>
              Shipping Info
            </Typography>
            <Grid container spacing={1} mb={1}>
              {order.shipping &&
                Object.keys(order.shipping).map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Typography variant="body2" sx={{ color: primaryColor }}>
                      <strong>{key}:</strong> {order.shipping[key] || "-"}
                    </Typography>
                  </Grid>
                ))}
            </Grid>

            {/* Order Items */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: primaryColor, mt: 1 }}>
              Items
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              {order.items.map((item, idx) => (
                <Box key={idx} sx={{ borderBottom: "1px solid #b76e1b", py: 1, minWidth: 250 }}>
                  <Typography sx={{ color: primaryColor }}>
                    <strong>{item.name}</strong> - ₹{item.price} x {item.quantity} ({item.mode})
                  </Typography>
                  {item.mode === "Rent" && (
                    <Typography variant="body2" sx={{ color: primaryColor }}>
                      Rental: {new Date(item.rentalStart).toLocaleDateString()} -{" "}
                      {new Date(item.rentalEnd).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            <Typography variant="subtitle2" mt={1} sx={{ color: primaryColor }}>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </Typography>
            {order.paymentMethod === "upi" && order.upiDetails && (
              <Typography variant="body2" sx={{ color: primaryColor }}>
                <strong>UPI Txn ID:</strong> {order.upiDetails.txnId}
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Container>
  );
}
