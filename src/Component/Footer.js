import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Divider,
  IconButton,
} from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube, MailOutline, Phone, Chat } from '@mui/icons-material';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Define theme colors
  const primaryColor = '#b76e1b'; // main accent color
  const secondaryColor = '#d7cfa7'; // background

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email) return setMessage('Please enter your email.');

    try {
      const res = await fetch('https://utsav-aura-backend-7.onrender.com/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setMessage(data.message || 'Subscription failed.');
      }
    } catch (err) {
      setMessage('Something went wrong.');
    }
  };

  return (
    <Box sx={{ bgcolor: secondaryColor, color: primaryColor, py: 6, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: primaryColor, mb: 2, fontWeight: 'bold' }}>
              About UtsavAura
            </Typography>
            <Typography variant="body2">
              Authentic handcrafted Ganesh idols made with love and devotion.
              Perfect for your pooja, festivals, and home decor.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <IconButton href="#" sx={{ color: primaryColor }}>
                <Facebook />
              </IconButton>
              <IconButton href="#" sx={{ color: primaryColor }}>
                <Instagram />
              </IconButton>
              <IconButton href="#" sx={{ color: primaryColor }}>
                <Twitter />
              </IconButton>
              <IconButton href="#" sx={{ color: primaryColor }}>
                <YouTube />
              </IconButton>
              <IconButton href="/chat" sx={{ color: primaryColor }}>
                <Chat />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: primaryColor, mb: 2, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="/" underline="hover" color="inherit">Home</MuiLink>
              <MuiLink href="/products" underline="hover" color="inherit">Products</MuiLink>
              <MuiLink href="/about" underline="hover" color="inherit">About Us</MuiLink>
              <MuiLink href="/contact-us" underline="hover" color="inherit">Contact</MuiLink>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: primaryColor, mb: 2, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <MailOutline fontSize="small" />
              <MuiLink href="mailto:smgarbaevent@gmail.com" underline="hover" color="inherit">
                smgarbaevent@gmail.com
              </MuiLink>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Phone fontSize="small" />
              <MuiLink href="tel:+916263615262" underline="hover" color="inherit">
                +91 6263615262
              </MuiLink>
            </Box>
            <Typography variant="body2">
              Address: 155 Sant Nagar, Indore, Madhya Pradesh, India
            </Typography>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ color: primaryColor, mb: 2, fontWeight: 'bold' }}>
              Subscribe to our Newsletter
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                fullWidth
                required
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': { borderRadius: 1 },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ bgcolor: primaryColor, '&:hover': { bgcolor: '#955e16' } }}
              >
                Subscribe
              </Button>
            </Box>
            {message && (
              <Typography variant="body2" sx={{ mt: 1, color: primaryColor, fontWeight: 600 }}>
                {message}
              </Typography>
            )}
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: primaryColor }} />

        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} skart. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
