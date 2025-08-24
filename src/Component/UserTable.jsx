import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  LinearProgress,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Email, LocationOn, Payment } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserTable({ rows = [] }) {
  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer position="top-right" autoClose={2500} />

      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: "700",
          color: "#4a3c1b",
          textAlign: "center",
        }}
      >
        User Management
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          overflowX: "auto",
          bgcolor: "#fff8f0",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead sx={{ bgcolor: "#fc8019" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>User</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Country</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Usage</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Payment</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((u) => (
              <TableRow
                key={u._id}
                sx={{
                  "&:hover": { backgroundColor: "#fff2e0", cursor: "pointer" },
                }}
                onClick={() =>
                  toast.info(`Clicked on ${u.name}`, { autoClose: 1500 })
                }
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ bgcolor: "#fc8019", width: 32, height: 32 }}>
                      {u.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: "600", color: "#4a3c1b" }}>
                        {u.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Email fontSize="small" sx={{ color: "#555" }} />
                        <Typography variant="caption" sx={{ color: "#555" }}>
                          {u.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocationOn fontSize="small" sx={{ color: "#555" }} />
                    <Typography sx={{ color: "#555" }}>{u.country}</Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ minWidth: 120 }}>
                  <Tooltip title={`${u.usage}%`} arrow>
                    <LinearProgress
                      variant="determinate"
                      value={u.usage}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "#ffe6cc",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#fc8019",
                        },
                      }}
                    />
                  </Tooltip>
                  <Typography variant="caption" sx={{ color: "#4a3c1b" }}>
                    {u.usage}%
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Payment fontSize="small" sx={{ color: "#555" }} />
                    <Typography sx={{ color: "#555" }}>{u.paymentMethod}</Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ color: "#4a3c1b" }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
