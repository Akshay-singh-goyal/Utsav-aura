import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CircularProgress, Box, Typography } from '@mui/material'

export default function RefreshHandler({ setIsAuthenticated }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      setIsAuthenticated(true)
      if (['/login', '/signup'].includes(location.pathname)) {
        navigate('/', { replace: true })
      }
    }

    setLoading(false)
  }, [location.pathname, navigate, setIsAuthenticated])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking session...
        </Typography>
      </Box>
    )
  }

  return null
}
