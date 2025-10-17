import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Paper,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get(
        "https://utsav-aura-backend-7.onrender.com/api/queries/all"
      );
      setQueries(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch queries");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(
        `https://utsav-aura-backend-7.onrender.com/api/queries/status/${id}`,
        { status }
      );
      toast.success("Status updated");
      fetchQueries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography
        variant="h4"
        mb={3}
        sx={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
      >
        Customer Queries
      </Typography>

      <Paper
        sx={{
          width: "100%",
          overflowX: "auto",
          backgroundColor: "#1e1e2f",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Subject</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queries.map((q) => (
              <TableRow key={q._id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell sx={{ color: "#fff" }}>{q.name}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{q.email}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{q.subject}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{q.message}</TableCell>
                <TableCell sx={{ color: "#fff" }}>{q.status}</TableCell>
                <TableCell>
                  <Select
                    value={q.status}
                    onChange={(e) => handleStatusChange(q._id, e.target.value)}
                    sx={{
                      backgroundColor: "#2c2c3e",
                      color: "#fff",
                      borderRadius: 1,
                      "& .MuiSvgIcon-root": { color: "#fff" },
                    }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Resolved">Resolved</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
