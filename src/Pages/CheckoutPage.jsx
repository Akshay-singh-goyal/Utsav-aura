// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
} from "@mui/material";
import { Info, Payment, ShoppingCart } from "@mui/icons-material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {jwtDecode} from "jwt-decode";
import QRimage from "../Component/Images/QR.jpg";

// Helpers
const priceForItem = (item) =>
  item.mode === "Rent"
    ? item.priceRent ?? item.price ?? item.discountPrice
    : item.priceBuy ?? item.price ?? item.discountPrice;

const inr = (num) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    num
  );

const brandColors = {
  primary: "#FF9900",
  secondary: "#2874f0",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Shipping
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);

  // UPI details
  const [upiDetails, setUpiDetails] = useState({
    txnId: "",
    ownerName: "",
    extra: "",
  });

  // Load cart + user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser && !token) {
      toast.info("Please login first!");
      navigate("/login");
      return;
    }

    let finalUser = storedUser;

    if (token && (!storedUser || !storedUser._id)) {
      try {
        const decoded = jwtDecode(token);
        finalUser = {
          ...storedUser,
          _id: decoded.id || decoded.userId || decoded._id,
        };
      } catch (err) {
        console.error("Token decode failed", err);
      }
    }

    setUser(finalUser);

    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (!storedCart.length) {
      toast.warning("Your cart is empty!");
      navigate("/cart");
      return;
    }
    setCart(storedCart);
  }, [navigate]);

  const handleShippingChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const handleUpiChange = (e) =>
    setUpiDetails({ ...upiDetails, [e.target.name]: e.target.value });

  // Subtotal + delivery
  const subTotal = useMemo(
    () =>
      cart.reduce((sum, i) => {
        const unit = priceForItem(i);
        return i.mode === "Rent"
          ? sum + unit * (i.quantity || 1) * (i.rentalDays || 1)
          : sum + unit * (i.quantity || 1);
      }, 0),
    [cart]
  );

  const delivery = subTotal > 999 ? 0 : 49;
  const grandTotal = subTotal + delivery;

  // Place order
  const placeOrder = async () => {
    if (!user?._id) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    if (!cart.length) {
      toast.warning("Cart is empty!");
      return;
    }
    if (Object.values(shipping).some((v) => !v)) {
      toast.warning("Please fill all shipping fields!");
      return;
    }

    if (paymentMethod === "cod") {
      await confirmOrder();
    } else {
      setOpenPaymentDialog(true);
    }
  };

  // Confirm order after payment
  const confirmOrder = async () => {
    const token = localStorage.getItem("token");

    // Map frontend UPI fields to backend
    const mappedUpiDetails =
      paymentMethod === "upi"
        ? {
            txnId: upiDetails.txnId,
            ownerName: upiDetails.ownerName,
            extra: upiDetails.extra || "",
          }
        : null;

    const payload = {
      userId: user._id,
      items: cart.map((i) => ({
        productId: i.productId || i._id,
        name: i.name,
        quantity: i.quantity || 1,
        price: priceForItem(i),
        mode: i.mode || "Buy",
        rentalDays: i.mode === "Rent" ? i.rentalDays : null,
      })),
      shipping,
      paymentMethod,
      total: grandTotal,
      note,
      upiDetails: mappedUpiDetails,
    };

    try {
      const res = await axios.post(
        "https://utsav-aura-backend-7.onrender.com/api/orders/create",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("cart");
      toast.success("🎉 Order placed successfully!");
      navigate("/order-confirmation", { state: { order: res.data } });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order. Try again!");
    } finally {
      setOpenPaymentDialog(false);
    }
  };

  return (
    <Box p={{ xs: 2, md: 4 }} sx={{ bgcolor: "#f9f9f9", minHeight: "80vh" }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: brandColors.secondary, fontWeight: "bold", mb: 3 }}
      >
        <ShoppingCart sx={{ mr: 1 }} />
        Checkout
      </Typography>

      <Grid container spacing={3}>
        {/* Left: Shipping & Payment */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: brandColors.primary, fontWeight: "bold" }}
            >
              <Info sx={{ mr: 1 }} /> Shipping Information
            </Typography>

            <Grid container spacing={2}>
              {[
                ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["address", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["zip", "Zip Code"],
                ["country", "Country"],
              ].map(([field, label]) => (
                <Grid
                  item
                  xs={12}
                  sm={field === "firstName" || field === "lastName" ? 6 : 12}
                  key={field}
                >
                  <TextField
                    label={label}
                    name={field}
                    value={shipping[field]}
                    onChange={handleShippingChange}
                    fullWidth
                    size="small"
                    margin="dense"
                  />
                </Grid>
              ))}
            </Grid>

            {/* Payment method */}
            <Typography
              variant="h6"
              sx={{ mt: 3, color: brandColors.primary, fontWeight: "bold" }}
            >
              <Payment sx={{ mr: 1 }} /> Payment Method
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
              <FormControlLabel value="upi" control={<Radio />} label="UPI / Wallet" />
              <FormControlLabel value="card" control={<Radio />} label="Credit / Debit Card" />
            </RadioGroup>

            <TextField
              label="Additional Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              size="small"
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: brandColors.secondary,
                "&:hover": { bgcolor: "#1c5ed6" },
                borderRadius: 3,
                fontWeight: "bold",
              }}
              onClick={placeOrder}
            >
              {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"}
            </Button>
          </Paper>
        </Grid>

        {/* Right: Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, position: "sticky", top: 24 }}>
            <Typography variant="h6" sx={{ mb: 2, color: brandColors.primary, fontWeight: "bold" }}>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {cart.map((i) => {
              const unit = priceForItem(i);
              const lineTotal = unit * (i.quantity || 1) * (i.mode === "Rent" ? i.rentalDays || 1 : 1);
              return (
                <Box key={i._id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <CardMedia
                      component="img"
                      sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
                      image={i.image || "/placeholder.png"}
                      alt={i.name}
                    />
                    <Typography variant="body2">
                      {i.name} ({i.mode || "Buy"}) x {i.quantity || 1} {i.mode === "Rent" ? `[${i.rentalDays} days]` : ""}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{inr(lineTotal)}</Typography>
                </Box>
              );
            })}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography>Subtotal</Typography>
              <Typography>{inr(subTotal)}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography>Delivery</Typography>
              <Typography>{delivery === 0 ? "FREE" : inr(delivery)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" color="error">{inr(grandTotal)}</Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} fullWidth>
        <DialogTitle>{paymentMethod === "upi" ? "UPI / Wallet Payment" : "Complete Payment"}</DialogTitle>
        <DialogContent>
          {paymentMethod === "upi" ? (
            <>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
                Total Payable: <span style={{ color: "green" }}>{inr(grandTotal)}</span>
              </Typography>

              <Typography>Scan the QR below to pay:</Typography>
              <Box display="flex" justifyContent="center" my={2}>
                <img src={QRimage} alt="UPI QR" style={{ width: 200, height: 200 }} />
              </Box>

              <TextField
                label="UTR Number"
                name="txnId"
                placeholder="Enter UTR / Transaction Number"
                value={upiDetails.txnId}
                onChange={handleUpiChange}
                fullWidth
                margin="dense"
              />
              <TextField
                label="Your UPI ID"
                name="ownerName"
                placeholder="e.g. yourname@upi"
                value={upiDetails.ownerName}
                onChange={handleUpiChange}
                fullWidth
                margin="dense"
              />
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                ⚠️If the UTR number or UPI ID you provide is invalid, we will not consider your transaction as successful. You will need to initiate the payment again with correct details to complete your order.
              </Typography>
            </>
          ) : (
            <Typography>You selected <b>{paymentMethod.toUpperCase()}</b>. Please confirm your payment to place the order.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ bgcolor: brandColors.primary, fontWeight: "bold" }}
            disabled={paymentMethod === "upi" && (!upiDetails.txnId || !upiDetails.ownerName)}
            onClick={confirmOrder}
          >
            Confirm Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
