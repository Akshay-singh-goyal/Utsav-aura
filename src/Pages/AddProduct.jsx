import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Box,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Stack,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { SketchPicker } from "react-color";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple auth check
const isLoggedIn = () => localStorage.getItem("token");

export default function AdminPanel() {
  const [tab, setTab] = useState(0); // 0 = Decorations, 1 = Products

  // -------------------- Decorations State --------------------
  const [decorationItems, setDecorationItems] = useState([
    { name: "", description: "", priceBuy: "", priceRent: "", image: null },
  ]);
  const [decorations, setDecorations] = useState([]);

  // -------------------- Products State --------------------
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: "",
    originalPrice: "",
    discountPrice: "",
    description: "",
    category: "",
    quantity: "",
    color: "",
    soldBy: "",
  });
  const [productImage, setProductImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // -------------------- Modal --------------------
  const [openModal, setOpenModal] = useState(false);
  const [showAdvancedColor, setShowAdvancedColor] = useState(false);

  const categories = ["Decoration", "Idols", "Clothes", "Accessories"];

  // -------------------- Fetch Data --------------------
  useEffect(() => {
    fetchDecorations();
    fetchProducts();
  }, []);

  const fetchDecorations = async () => {
    try {
      const res = await axios.get(
        "https://utsav-aura-backend-7.onrender.com/api/admin/decorations"
      );
      setDecorations(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch decorations");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://utsav-aura-backend-7.onrender.com/api/products"
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
    }
  };

  // -------------------- Decorations Handlers --------------------
  const handleDecorationChange = (index, field, value) => {
    const updated = [...decorationItems];
    updated[index][field] = value;
    setDecorationItems(updated);
  };

  const addDecorationField = () =>
    setDecorationItems([
      ...decorationItems,
      { name: "", description: "", priceBuy: "", priceRent: "", image: null },
    ]);

  const removeDecorationField = (index) =>
    setDecorationItems(decorationItems.filter((_, i) => i !== index));

  const submitDecorations = async () => {
    if (!isLoggedIn()) {
      toast.warning("Please login to add decorations");
      return;
    }
    try {
      const formData = new FormData();
      decorationItems.forEach((item) => {
        formData.append("names", item.name);
        formData.append("descriptions", item.description);
        formData.append("priceBuys", item.priceBuy);
        formData.append("priceRents", item.priceRent);
        formData.append("images", item.image);
      });

      const res = await axios.post(
        "https://utsav-aura-backend-7.onrender.com/api/admin/decorations/add",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setDecorations([...decorations, ...res.data]);
      setDecorationItems([
        { name: "", description: "", priceBuy: "", priceRent: "", image: null },
      ]);
      toast.success("Decorations added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add decorations");
    }
  };

  const deleteDecoration = async (id) => {
    if (!window.confirm("Delete this decoration?")) return;
    try {
      await axios.delete(
        `https://utsav-aura-backend-7.onrender.com/api/admin/decorations/${id}`
      );
      setDecorations(decorations.filter((d) => d._id !== id));
      toast.info("Decoration deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete decoration");
    }
  };

  // -------------------- Products Handlers --------------------
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) return toast.warning("Please login to add products");

    if (!productForm.name || !productForm.originalPrice || !productForm.category) {
      return toast.error("Please fill all required fields");
    }

    try {
      const formData = new FormData();
      Object.keys(productForm).forEach((key) => {
        formData.append(key, productForm[key] || "");
      });
      if (productImage) formData.append("image", productImage);

      let res;
      if (editId) {
        res = await axios.put(
          `https://utsav-aura-backend-7.onrender.com/api/products/${editId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts(products.map((p) => (p._id === editId ? res.data : p)));
        toast.success("Product updated successfully!");
      } else {
        res = await axios.post(
          "https://utsav-aura-backend-7.onrender.com/api/products/add",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        setProducts([...products, res.data]);
        toast.success("Product added successfully!");
      }

      // Reset form
      setProductForm({
        name: "",
        originalPrice: "",
        discountPrice: "",
        description: "",
        category: "",
        quantity: "",
        color: "",
        soldBy: "",
      });
      setProductImage(null);
      setEditId(null);
      setOpenModal(false);
    } catch (err) {
      console.error(err.response || err);
      toast.error(
        err.response?.data?.error ||
          "Failed to save product. Make sure all required fields are filled and image is uploaded."
      );
    }
  };

  const handleEditProduct = (p) => {
    setEditId(p._id);
    setProductForm({
      name: p.name,
      originalPrice: p.originalPrice,
      discountPrice: p.discountPrice,
      description: p.description,
      category: p.category,
      quantity: p.quantity,
      color: p.color,
      soldBy: p.soldBy,
    });
    setProductImage(null);
    setOpenModal(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `https://utsav-aura-backend-7.onrender.com/api/products/${id}`
      );
      setProducts(products.filter((p) => p._id !== id));
      toast.info("Product deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "95%", sm: 500 },
    bgcolor: "#ffffff",
    borderRadius: 3,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: 5,
  };

  return (
    <Container sx={{ py: 4 }}>
      <ToastContainer position="top-right" autoClose={2000} />
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ color: "#0f79af" }}
      >
        Admin Panel
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, val) => setTab(val)}
        sx={{ mb: 3, borderBottom: "2px solid #0f79af" }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Decorations" sx={{ fontWeight: "bold" }} />
        <Tab label="Products" sx={{ fontWeight: "bold" }} />
      </Tabs>

      {/* -------------------- Decorations Tab -------------------- */}
      {tab === 0 && (
        <Paper elevation={3} sx={{ p: 2, mb: 4, bgcolor: "#f5f5f5" }}>
          {decorationItems.map((item, idx) => (
            <Grid
              container
              spacing={1}
              key={idx}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Name"
                  fullWidth
                  size="small"
                  value={item.name}
                  onChange={(e) =>
                    handleDecorationChange(idx, "name", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Description"
                  fullWidth
                  size="small"
                  value={item.description}
                  onChange={(e) =>
                    handleDecorationChange(idx, "description", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label="Buy Price"
                  type="number"
                  fullWidth
                  size="small"
                  value={item.priceBuy}
                  onChange={(e) =>
                    handleDecorationChange(idx, "priceBuy", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  label="Rent Price"
                  type="number"
                  fullWidth
                  size="small"
                  value={item.priceRent}
                  onChange={(e) =>
                    handleDecorationChange(idx, "priceRent", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  size="small"
                  sx={{ bgcolor: "#0f79af" }}
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleDecorationChange(idx, "image", e.target.files[0])
                    }
                  />
                </Button>
              </Grid>
              <Grid item xs={6} sm={3} md={1}>
                {decorationItems.length > 1 && (
                  <IconButton
                    color="error"
                    onClick={() => removeDecorationField(idx)}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
            <Button startIcon={<Add />} variant="outlined" onClick={addDecorationField}>
              Add Field
            </Button>
            <Button
              variant="contained"
              onClick={submitDecorations}
              sx={{ bgcolor: "#0f79af" }}
            >
              Submit All
            </Button>
          </Stack>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {decorations.map((d) => (
              <Grid item xs={12} sm={6} md={4} key={d._id}>
                <Card>
                  <CardMedia component="img" height="180" image={d.image} alt={d.name} />
                  <CardContent>
                    <Typography variant="h6">{d.name}</Typography>
                    <Typography variant="body2">{d.description}</Typography>
                    <Typography variant="subtitle1">
                      ₹{d.priceBuy} / ₹{d.priceRent}
                    </Typography>
                    <Box mt={1} display="flex" justifyContent="space-between">
                      <IconButton color="error" onClick={() => deleteDecoration(d._id)}>
                        <FiTrash2 />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* -------------------- Products Tab -------------------- */}
      {tab === 1 && (
        <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            startIcon={<Add />}
            sx={{ mb: 2, bgcolor: "#0f79af" }}
            fullWidth
          >
            Add Product
          </Button>
          <Grid container spacing={2}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Card>
                  <CardMedia component="img" height="180" image={p.image} alt={p.name} />
                  <CardContent>
                    <Typography variant="h6">{p.name}</Typography>
                    <Typography variant="body2">{p.description}</Typography>
                    <Typography variant="subtitle1">₹{p.originalPrice}</Typography>
                    <Typography variant="caption">
                      Category: {p.category} | Color: {p.color || "-"}
                    </Typography>
                    <Box mt={1} display="flex" justifyContent="space-between">
                      <IconButton color="primary" onClick={() => handleEditProduct(p)}>
                        <FiEdit />
                      </IconButton>
                      <IconButton color="error" onClick={() => deleteProduct(p._id)}>
                        <FiTrash2 />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* -------------------- Product Modal -------------------- */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom sx={{ color: "#0f79af" }}>
            {editId ? "Edit Product" : "Add Product"}
          </Typography>
          <form onSubmit={handleProductSubmit}>
            {/* Name, Price, Description */}
            <TextField
              fullWidth
              label="Name"
              size="small"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Original Price"
              type="number"
              size="small"
              value={productForm.originalPrice}
              onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Discount Price"
              type="number"
              size="small"
              value={productForm.discountPrice}
              onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              minRows={2}
              size="small"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <MenuItem value={cat} key={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              size="small"
              value={productForm.quantity}
              onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Sold By"
              size="small"
              value={productForm.soldBy}
              onChange={(e) => setProductForm({ ...productForm, soldBy: e.target.value })}
              sx={{ mb: 2 }}
            />

            {/* Color Picker */}
            <Box display="flex" alignItems="center" gap={2} sx={{ mb: 2 }}>
              <input
                type="color"
                value={/^#/.test(productForm.color) ? productForm.color : "#000000"}
                onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
                style={{ width: 60, height: 40, border: "none", cursor: "pointer", borderRadius: 6 }}
              />
              <TextField
                label="Custom Color (Hex/Name)"
                size="small"
                fullWidth
                value={productForm.color}
                onChange={(e) => setProductForm({ ...productForm, color: e.target.value })}
              />
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  border: "1px solid #ccc",
                  bgcolor: productForm.color || "#fff",
                }}
              />
            </Box>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowAdvancedColor(!showAdvancedColor)}
              sx={{ mb: 2 }}
            >
              {showAdvancedColor ? "Hide Advanced Picker" : "Show Advanced Picker"}
            </Button>
            {showAdvancedColor && (
              <Box sx={{ mb: 2 }}>
                <SketchPicker
                  color={productForm.color || "#000000"}
                  onChangeComplete={(color) =>
                    setProductForm({ ...productForm, color: color.hex })
                  }
                />
              </Box>
            )}

            {/* Upload Image */}
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mb: 2, bgcolor: "#0f79af" }}
            >
              Upload Image
              <input type="file" hidden onChange={(e) => setProductImage(e.target.files[0])} />
            </Button>

            <Button type="submit" variant="contained" fullWidth sx={{ bgcolor: "#0f79af" }}>
              {editId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </Box>
      </Modal>
    </Container>
  );
}
