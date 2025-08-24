import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";

const API_BASE = "http://localhost:5000/api";
const NAME_OPTIONS = ["Basic", "Standard", "Premium"];
const TYPE_OPTIONS = ["1-day", "10-day", "Full"];

export default function AdminPackage() {
  const [packages, setPackages] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm] = useState({
    name: "Basic",
    type: "1-day",
    description: "",
    price: "",
    duration: "",
    days: [{ dayNumber: 1, items: [""] }],
  });
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const imagePreview = useMemo(() => (image ? URL.createObjectURL(image) : null), [image]);

  useEffect(() => {
    fetchPackages();
    return () => imagePreview && URL.revokeObjectURL(imagePreview);
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/packages`);
      setPackages(data);
    } catch (err) {
      console.error("❌ Error fetching packages", err?.response?.data || err);
    }
  };

  // ---------- HELPERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const handleDayChange = (dayIdx, itemIdx, value) => {
    const daysCopy = [...form.days];
    daysCopy[dayIdx].items[itemIdx] = value;
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  const addItem = (dayIdx) => {
    const daysCopy = [...form.days];
    daysCopy[dayIdx].items.push("");
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  const removeItem = (dayIdx, itemIdx) => {
    const daysCopy = [...form.days];
    daysCopy[dayIdx].items.splice(itemIdx, 1);
    if (!daysCopy[dayIdx].items.length) daysCopy[dayIdx].items.push("");
    setForm((prev) => ({ ...prev, days: daysCopy }));
  };

  const addDay = () => {
    setForm((prev) => ({
      ...prev,
      days: [...prev.days, { dayNumber: prev.days.length + 1, items: [""] }],
    }));
  };

  const removeDay = (dayIdx) => {
    const daysCopy = form.days.filter((_, i) => i !== dayIdx).map((d, i) => ({ ...d, dayNumber: i + 1 }));
    setForm((prev) => ({ ...prev, days: daysCopy.length ? daysCopy : [{ dayNumber: 1, items: [""] }] }));
  };

  const sanitizedDays = (days) =>
    days.map((d, i) => ({ dayNumber: i + 1, items: d.items.map((x) => x.trim()).filter(Boolean) }));

  const validateCreate = () => {
    if (!form.name || !NAME_OPTIONS.includes(form.name)) return "Please select a valid package name.";
    if (!form.type || !TYPE_OPTIONS.includes(form.type)) return "Please select a valid package type.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.price || Number.isNaN(Number(form.price))) return "Price must be a number.";
    if (!form.duration || Number.isNaN(Number(form.duration))) return "Duration must be a number.";
    if (!image) return "Please upload an image.";
    const days = sanitizedDays(form.days);
    if (!days.length || days.some((d) => d.items.length === 0)) return "Please add at least one item for each day.";
    return null;
  };

  // ---------- CREATE ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errMsg = validateCreate();
    if (errMsg) return alert(errMsg);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    fd.append("description", form.description);
    fd.append("price", String(Number(form.price)));
    fd.append("duration", String(Number(form.duration)));
    fd.append("days", JSON.stringify(sanitizedDays(form.days)));
    if (image) fd.append("image", image);

    try {
      const { data } = await axios.post(`${API_BASE}/packages`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPackages((prev) => [data, ...prev]);
      setForm({ name: "Basic", type: "1-day", description: "", price: "", duration: "", days: [{ dayNumber: 1, items: [""] }] });
      setImage(null);
      alert("✅ Package created successfully");
    } catch (err) {
      console.error("❌ Error creating package", err?.response?.data || err);
      alert(err?.response?.data?.error || "Failed to create package");
    }
  };

  // ---------- EDIT ----------
  const handleEdit = (pkg) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      type: pkg.type,
      description: pkg.description,
      price: String(pkg.price),
      duration: String(pkg.duration),
      days: pkg.days?.length ? pkg.days : [{ dayNumber: 1, items: [""] }],
    });
    setImage(null);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    if (!editing?._id) return;
    const daysForUpdate = sanitizedDays(form.days);
    if (!daysForUpdate.length || daysForUpdate.some((d) => d.items.length === 0))
      return alert("Please add at least one item for each day.");

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("type", form.type);
    fd.append("description", form.description);
    fd.append("price", String(Number(form.price)));
    fd.append("duration", String(Number(form.duration)));
    fd.append("days", JSON.stringify(daysForUpdate));
    if (image) fd.append("image", image);

    try {
      await axios.put(`${API_BASE}/packages/${editing._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await fetchPackages();
      setOpenEdit(false);
      setEditing(null);
      setImage(null);
      alert("✅ Package updated");
    } catch (err) {
      console.error("❌ Error updating package", err?.response?.data || err);
      alert(err?.response?.data?.error || "Failed to update package");
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await axios.delete(`${API_BASE}/packages/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Error deleting package", err?.response?.data || err);
      alert(err?.response?.data?.error || "Failed to delete package");
    }
  };

  const handleExpand = (pkgId) => setExpanded((cur) => (cur === pkgId ? null : pkgId));

  return (
    <Container sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, color: "text.primary" }}>
        🛠️ Admin Package Management
      </Typography>

      {/* ---------- CREATE FORM ---------- */}
      <Paper sx={{ p: 3, mb: 5, borderRadius: 3, boxShadow: 6 }}>
        <Typography variant="h6" gutterBottom color="text.primary">
          Create New Package
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Package Name" name="name" value={form.name} onChange={handleChange}>
                {NAME_OPTIONS.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Package Type" name="type" value={form.type} onChange={handleChange}>
                {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline minRows={2} label="Description" name="description" value={form.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Price (₹)" name="price" value={form.price} onChange={handleChange} inputProps={{ min: 0, step: "0.01" }} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField fullWidth type="number" label="Duration (days)" name="duration" value={form.duration} onChange={handleChange} inputProps={{ min: 1, step: 1 }} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                Upload Image
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              {imagePreview && <img src={imagePreview} alt="preview" style={{ height: 48, width: 72, objectFit: "cover", borderRadius: 6 }} />}
            </Grid>
          </Grid>

          <Divider sx={{ mt: 3, mb: 2 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip label="Days & Items" color="primary" variant="outlined" />
            <Tooltip title="Add another day">
              <IconButton onClick={addDay} size="small"><AddIcon fontSize="inherit" /></IconButton>
            </Tooltip>
          </Box>

          {form.days.map((day, dIdx) => (
            <Paper key={dIdx} variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, borderStyle: "dashed", borderColor: "divider" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">{`Day ${day.dayNumber}`}</Typography>
                <Tooltip title="Remove day">
                  <IconButton onClick={() => removeDay(dIdx)} size="small" color="error"><DeleteIcon fontSize="inherit" /></IconButton>
                </Tooltip>
              </Box>

              {day.items.map((item, iIdx) => (
                <Box key={iIdx} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <TextField fullWidth label={`Item ${iIdx + 1}`} value={item} onChange={(e) => handleDayChange(dIdx, iIdx, e.target.value)} />
                  <Tooltip title="Remove item">
                    <IconButton onClick={() => removeItem(dIdx, iIdx)} size="small"><DeleteIcon fontSize="inherit" /></IconButton>
                  </Tooltip>
                </Box>
              ))}

              <Button size="small" onClick={() => addItem(dIdx)} startIcon={<AddIcon />}>Add Item</Button>
            </Paper>
          ))}

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button type="submit" variant="contained" color="success">Create Package</Button>
            <Button type="button" onClick={() => setForm({ name: "Basic", type: "1-day", description: "", price: "", duration: "", days: [{ dayNumber: 1, items: [""] }] })}>Reset</Button>
          </Box>
        </form>
      </Paper>

      {/* ---------- PACKAGE LIST ---------- */}
      <Typography variant="h5" gutterBottom color="text.primary">📦 All Packages</Typography>
      <Grid container spacing={2}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg._id}>
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
              {pkg.image && <img src={pkg.image} alt={pkg.name} style={{ width: "100%", maxHeight: 180, borderRadius: 8, marginBottom: 10, objectFit: "cover" }} />}
              <Typography variant="h6" fontWeight="bold" color="text.primary">{pkg.name} ({pkg.type})</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{pkg.description}</Typography>
              <Typography color="primary">₹{pkg.price} • {pkg.duration} day(s)</Typography>

              <Box sx={{ mt: 1 }}>
                <Button size="small" onClick={() => handleExpand(pkg._id)}>{expanded === pkg._id ? "Hide Details" : "View Day-wise Items"}</Button>
                <Collapse in={expanded === pkg._id} timeout="auto" unmountOnExit>
                  {pkg.days?.map((day) => (
                    <List key={day.dayNumber} dense sx={{ mt: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">Day {day.dayNumber}</Typography>
                      {day.items?.map((item, idx) => <ListItem key={idx} sx={{ py: 0 }}><ListItemText primary={item} /></ListItem>)}
                    </List>
                  ))}
                </Collapse>
              </Box>

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => handleEdit(pkg)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(pkg._id)}>Delete</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ---------- EDIT DIALOG ---------- */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Package</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Package Name" name="name" value={form.name} onChange={handleChange}>
                {NAME_OPTIONS.map((n) => <MenuItem key={n} value={n}>{n}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField select fullWidth label="Package Type" name="type" value={form.type} onChange={handleChange}>
                {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={form.description} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Duration (days)" name="duration" type="number" value={form.duration} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label" startIcon={<ImageIcon />}>
                Change Image
                <input hidden type="file" onChange={handleImageChange} />
              </Button>
              {image && <Typography variant="caption" sx={{ ml: 1 }}>{image.name}</Typography>}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
