import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Chip,
  Divider,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Collapse,
  IconButton
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";
import { io } from "socket.io-client";
import Papa from "papaparse";

const socket = io("http://localhost:5000");

const STATUS_COLORS = {
  Pending: "warning",
  Confirmed: "info",
  Shipped: "primary",
  Delivered: "success",
  Cancelled: "error",
};

export default function AdminOrdersEnhanced() {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/all");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders(prev => {
        const exists = prev.find(o => o._id === updatedOrder._id);
        if (exists) return prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o));
        return [updatedOrder, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    });

    return () => socket.off("orderUpdated");
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/status/${orderId}`, { status: newStatus });
      setOrders(prev =>
        prev.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order. Check console for details.");
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderId = order.orderId || "";
      const userName = order.userId?.name || "";
      const userEmail = order.userId?.email || "";

      const matchesSearch =
        orderId.toLowerCase().includes(search.toLowerCase()) ||
        userName.toLowerCase().includes(search.toLowerCase()) ||
        userEmail.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const matchesPayment = paymentFilter ? order.paymentMethod === paymentFilter : true;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredOrders.slice(start, start + limit);
  }, [filteredOrders, page, limit]);

  const totalPages = Math.ceil(filteredOrders.length / limit);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages || 1);
  }, [totalPages, page]);

  const exportCSV = () => {
    const data = filteredOrders.map(order => ({
      orderId: order.orderId,
      userName: order.userId?.name || "-",
      userEmail: order.userId?.email || "-",
      total: order.total,
      paymentMethod: order.paymentMethod,
      upiTxnId: order.upiDetails?.txnId || "-",
      upiOwner: order.upiDetails?.ownerName || "-",
      upiExtra: order.upiDetails?.extra || "-",
      status: order.status,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Orders Dashboard
      </Typography>

      {/* Search & Filters */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
        flexWrap="wrap"
      >
        <TextField
          label="Search by Order ID / User Name / Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            {Object.keys(STATUS_COLORS).map(status => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Payment</InputLabel>
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            label="Payment"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="cod">Cash on Delivery</MenuItem>
            <MenuItem value="upi">UPI / Wallet</MenuItem>
            <MenuItem value="card">Card</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={exportCSV}
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          Export CSV
        </Button>
      </Stack>

      {/* Orders List */}
      <Stack spacing={3}>
        {paginatedOrders.map(order => (
          <Card
            key={order._id}
            sx={{
              boxShadow: 3,
              transition: "transform 0.3s, box-shadow 0.3s",
              "&:hover": { transform: "translateY(-3px)", boxShadow: 6 },
              borderLeft: `5px solid ${STATUS_COLORS[order.status] || "#000"}`,
              overflow: "hidden",
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={{ xs: 1, sm: 0 }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Order ID: {order.orderId}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip label={order.status} color={STATUS_COLORS[order.status]} />
                  <IconButton onClick={() => toggleExpand(order._id)} size="small">
                    {expandedOrders[order._id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Stack>
              </Stack>

              <Collapse in={expandedOrders[order._id]} timeout="auto" unmountOnExit>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2">
                  <strong>User:</strong> {order.userId?.name || "-"} ({order.userId?.email || "-"})
                </Typography>
                <Typography variant="body2">
                  <strong>Total:</strong> ₹{order.total || 0} | <strong>Payment:</strong> {order.paymentMethod || "-"}
                </Typography>

                {order.paymentMethod === "upi" && order.upiDetails && (
                  <Box sx={{ mt: 1, p: 1, border: "1px dashed #ccc", borderRadius: 1 }}>
                    <Typography variant="body2"><strong>UPI Transaction ID:</strong> {order.upiDetails.txnId || "-"}</Typography>
                    <Typography variant="body2"><strong>UPI Owner Name:</strong> {order.upiDetails.ownerName || "-"}</Typography>
                    <Typography variant="body2"><strong>Extra Info:</strong> {order.upiDetails.extra || "-"}</Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">Items:</Typography>
                <Stack spacing={0.5} sx={{ pl: 1 }}>
                  {order.items?.map((item, idx) => (
                    <Typography key={item._id || item.productId || idx}>
                      {item.name} ({item.mode || "Buy"}) x {item.quantity || 1} | ₹{item.price || 0}
                      {item.mode === "Rent" && item.rentalDays ? ` [${item.rentalDays} days]` : ""}
                    </Typography>
                  ))}
                </Stack>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  flexWrap="wrap"
                  sx={{ mt: 2 }}
                >
                  {Object.keys(STATUS_COLORS).map(status => (
                    <Button
                      key={status}
                      size="small"
                      variant={order.status === status ? "contained" : "outlined"}
                      color={STATUS_COLORS[status]}
                      disabled={order.status === status}
                      onClick={() => updateStatus(order._id, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </Stack>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mt: 3 }}>
        <Button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Previous</Button>
        <Typography variant="body2" sx={{ mt: 1 }}>{page} / {totalPages || 1}</Typography>
        <Button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</Button>
      </Stack>
    </Container>
  );
}
