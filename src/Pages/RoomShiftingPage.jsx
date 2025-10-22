import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PersonIcon from "@mui/icons-material/Person";

const steps = ["User Details", "Pickup & Destination", "Room & Items"];

export default function RoomShiftingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupAddress: "",
    destinationAddress: "",
    rooms: "",
    items: "",
    specialInstructions: "",
    dateTime: "",
  });
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = () => setOpenConfirm(true);

  const handleConfirm = () => {
    console.log("Booking Confirmed:", formData);
    setOpenConfirm(false);
    alert("Booking submitted successfully!");
    // Send data to backend API if available
  };

  const calculatePrice = () => {
    const base = 500;
    const roomCharge = (parseInt(formData.rooms) || 0) * 300;
    const itemsCharge = ((formData.items?.split(",").length || 0) * 50);
    return base + roomCharge + itemsCharge;
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Room Shifting Service
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }} elevation={6}>
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Pickup Address"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                required
                InputProps={{ startAdornment: <HomeIcon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Destination Address"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Shifting Date & Time"
                name="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        )}

        {activeStep === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of Rooms"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                fullWidth
                required
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Items Description"
                name="items"
                value={formData.items}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="E.g., Sofa, Bed, TV, etc."
                InputProps={{ startAdornment: <Inventory2Icon sx={{ mr: 1 }} /> }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Special Instructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                placeholder="Anything else we should know?"
              />
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography variant="h6">
                Approximate Price: ₹{calculatePrice()}
              </Typography>
            </Grid>
          </Grid>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
            Back
          </Button>
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext} color="secondary">
              Next
            </Button>
          ) : (
            <Button variant="contained" color="secondary" onClick={handleSubmit}>
              Review & Submit
            </Button>
          )}
        </Box>
      </Paper>

      {/* Confirmation Modal */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography><strong>Name:</strong> {formData.name}</Typography>
          <Typography><strong>Email:</strong> {formData.email}</Typography>
          <Typography><strong>Phone:</strong> {formData.phone}</Typography>
          <Typography><strong>Pickup:</strong> {formData.pickupAddress}</Typography>
          <Typography><strong>Destination:</strong> {formData.destinationAddress}</Typography>
          <Typography><strong>Date & Time:</strong> {formData.dateTime}</Typography>
          <Typography><strong>Rooms:</strong> {formData.rooms}</Typography>
          <Typography><strong>Items:</strong> {formData.items}</Typography>
          <Typography><strong>Special Instructions:</strong> {formData.specialInstructions}</Typography>
          <Typography mt={2}><strong>Total Price:</strong> ₹{calculatePrice()}</Typography>
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
