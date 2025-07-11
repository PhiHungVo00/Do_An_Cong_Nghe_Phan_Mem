import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Badge,
  Chip,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  LocalShipping,
  Person,
  Notifications,
  Logout,
  Dashboard,
  Assignment,
  CheckCircle,
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavBarProps {
  user?: any;
}

const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('shipper_token');
    localStorage.removeItem('shipper_user');
    navigate('/login');
    handleClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/orders/available',
      label: 'Đơn chờ nhận',
      icon: <Assignment />,
      badge: 0,
    },
    {
      path: '/orders/assigned',
      label: 'Đơn đang giao',
      icon: <LocalShipping />,
      badge: 0,
    },
    {
      path: '/orders/delivered',
      label: 'Đơn đã giao',
      icon: <CheckCircle />,
      badge: 0,
    },
  ];

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <LocalShipping sx={{ fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FFFFFF 30%, #E3F2FD 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Delivery Pro
          </Typography>
        </Box>

        {/* Navigation Items */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                startIcon={item.icon}
                sx={{
                  color: 'white',
                  backgroundColor: isActive(item.path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {item.label}
                {item.badge > 0 && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                  />
                )}
              </Button>
            ))}
          </Box>
        )}

        {/* User Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user && (
            <>
              <IconButton color="inherit" size="large">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'secondary.main',
                    fontSize: '0.875rem',
                  }}
                >
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'S'}
                </Avatar>
                {!isMobile && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                      {user.name || 'Shipper'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {user.email}
                    </Typography>
                  </Box>
                )}
                <IconButton
                  color="inherit"
                  onClick={handleMenu}
                  sx={{ ml: 1 }}
                >
                  <Person />
                </IconButton>
              </Box>
            </>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              },
            }}
          >
            <MenuItem onClick={() => { navigate('/orders/available'); handleClose(); }}>
              <Dashboard sx={{ mr: 2 }} />
              Dashboard
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Đăng xuất
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar; 