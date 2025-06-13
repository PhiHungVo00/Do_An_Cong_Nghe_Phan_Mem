import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Button,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  EmojiEvents as ChallengesIcon,
  Event as EventsIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.clear(); // Xóa tất cả dữ liệu trong localStorage (ví dụ: token đăng nhập)
    navigate('/login'); // Điều hướng về trang đăng nhập
    handleMenuClose();
  };

  const menuItems = [
    {
      title: 'Lịch sử đơn hàng',
      path: '/order-history',
      icon: <HistoryIcon />,
    },
  ];

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          E-Commerce
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Challenges Button */}
          <Button
            color="inherit"
            startIcon={<ChallengesIcon />}
            onClick={() => navigate('/challenges')}
            sx={{ textTransform: 'none' }}
          >
            Thử thách
          </Button>

          {/* Events Button */}
          <Button
            color="inherit"
            startIcon={<EventsIcon />}
            onClick={() => navigate('/events')}
            sx={{ textTransform: 'none' }}
          >
            Sự kiện trực tiếp
          </Button>

          <IconButton 
            color="inherit"
            onClick={() => navigate('/cart')}
          >
            <Badge badgeContent={4} color="error">
              <CartIcon />
            </Badge>
          </IconButton>

          <IconButton
            color="inherit"
            onClick={() => navigate('/settings')}
          >
            <SettingsIcon />
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handleNavigate('/profile')}>
            <PersonIcon sx={{ mr: 1 }} /> Thông tin cá nhân
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/settings')}>
            <SettingsIcon sx={{ mr: 1 }} /> Cài đặt
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Box sx={{ mr: 1 }}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M17 7L15.59 8.41 18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </Box>
            Đăng xuất
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 