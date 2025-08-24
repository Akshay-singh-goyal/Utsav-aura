import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);

  const fetchQueries = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/queries/all");
      setQueries(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch queries");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/queries/status/${id}`, { status });
      toast.success("Status updated");
      fetchQueries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => { fetchQueries(); }, []);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" mb={3}>Customer Queries</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Subject</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {queries.map(q => (
            <TableRow key={q._id}>
              <TableCell>{q.name}</TableCell>
              <TableCell>{q.email}</TableCell>
              <TableCell>{q.subject}</TableCell>
              <TableCell>{q.message}</TableCell>
              <TableCell>{q.status}</TableCell>
              <TableCell>
                <Select value={q.status} onChange={(e) => handleStatusChange(q._id, e.target.value)}>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
