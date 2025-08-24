import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
} from '@mui/material';

const AdminCategoryForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/admin/categories', {
        name,
      });

      setMessage(`✅ Category "${res.data.name}" created successfully!`);
      setError('');
      setName('');
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || '❌ Error creating category');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Create Category
        </Typography>

        <Stack spacing={3}>
          <TextField
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Garba, Pooja Items"
            required
            fullWidth
          />

          <Button type="submit" variant="contained" fullWidth>
            Create Category
          </Button>

          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </Box>
    </Container>
  );
};

export default AdminCategoryForm;
