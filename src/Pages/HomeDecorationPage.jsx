import React, { useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const decorationTypes = [
  "Birthday Decoration",
  "Wedding Decoration",
  "Festival Decoration",
  "Anniversary Decoration",
  "Baby Shower",
  "Corporate Event",
  "Custom Theme Decoration",
];

export default function HomeDecorationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    decorationType: "",
    address: "",
    dateTime: dayjs(),
    specialInstructions: "",
  });

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleDateChange = (newValue) =>
    setFormData({ ...formData, dateTime: newValue });

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.decorationType || !formData.address) {
      alert("Please fill all required fields!");
      return;
    }
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    console.log("Decoration Booking:", formData);
    setOpenConfirm(false);
    alert("Your Home Decoration Booking has been submitted successfully!");
    // 👉 You can send `formData` to your backend here using fetch() or axios
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="secondary"
      >
        Home Decoration Booking
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }} elevation={6}>
        <Grid container spacing={3}>
          {/* Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Decoration Type */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Decoration Type"
              name="decorationType"
              value={formData.decorationType}
              onChange={handleChange}
              fullWidth
              required
            >
              {decorationTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Address */}
          <Grid item xs={12}>
            <TextField
              label="Decoration Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              required
            />
          </Grid>

          {/* Date & Time */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Preferred Date & Time"
                value={formData.dateTime}
                onChange={handleDateChange}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Special Instructions */}
          <Grid item xs={12}>
            <TextField
              label="Special Instructions"
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              placeholder="Any special requests or theme details?"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleSubmit}
            >
              Review & Submit
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Booking Details</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>Name:</strong> {formData.name}</Typography>
          <Typography><strong>Email:</strong> {formData.email}</Typography>
          <Typography><strong>Phone:</strong> {formData.phone}</Typography>
          <Typography><strong>Decoration Type:</strong> {formData.decorationType}</Typography>
          <Typography><strong>Address:</strong> {formData.address}</Typography>
          <Typography><strong>Date & Time:</strong> {formData.dateTime.format("DD MMM YYYY, hh:mm A")}</Typography>
          <Typography><strong>Special Instructions:</strong> {formData.specialInstructions}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
          <Button onClick={handleConfirm} color="secondary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
