import React from 'react';
import { Box, Typography, InputBase, IconButton, Avatar, Button } from '@mui/material';
import { Search, Notifications, CloudDownload } from '@mui/icons-material';

const Header: React.FC = () => {
  return (
    <Box sx={{
      bgcolor: '#fff',
      borderRadius: 4,
      boxShadow: '0 2px 12px 0 rgba(44, 39, 56, 0.06)',
      display: 'flex',
      alignItems: 'center',
      px: 5,
      py: 2,
      mb: 4,
      mt: 0,
      gap: 3,
      minHeight: 80,
    }}>
      <Typography variant="h6" sx={{ color: '#6C63FF', fontWeight: 800, mr: 2, letterSpacing: 1 }}>
        H & H
      </Typography>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Box sx={{
          bgcolor: '#F6F8FB',
          borderRadius: 3,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          width: 350,
          boxShadow: 'none',
        }}>
          <Search sx={{ color: '#6C63FF', fontSize: 22, mr: 1 }} />
          <InputBase sx={{ flex: 1, fontSize: 16, color: '#888' }} placeholder="Search" inputProps={{ 'aria-label': 'search' }} />
        </Box>
      </Box>
      <Button
        variant="contained"
        startIcon={<CloudDownload />}
        sx={{ bgcolor: '#6C63FF', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', px: 4, py: 1.2, fontSize: 16 }}
      >
        Export
      </Button>
      <IconButton sx={{ color: '#6C63FF', mx: 2 }}>
        <Notifications sx={{ fontSize: 28 }} />
      </IconButton>
    </Box>
  );
};

export default Header; 