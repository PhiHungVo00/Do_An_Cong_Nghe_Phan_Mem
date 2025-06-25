import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  InputBase,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart as ProductsIcon,
  Receipt as OrdersIcon,
  People as CustomersIcon,
  Assessment as ReportsIcon,
  AccountCircle,
  Badge as EmployeesIcon,
  Inventory2 as ProductsIcon2,
  CalendarMonth as CalendarIcon,
  Reviews as ReviewsIcon,
  Settings as SettingsIcon,
  HelpCenter as HelpCenterIcon,
  Search as SearchIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 260;

const mainMenu = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Products', icon: <ProductsIcon2 />, path: '/products' },
  { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
  { text: 'Customers', icon: <CustomersIcon />, path: '/customers' },
  { text: 'Sales Calendar', icon: <CalendarIcon />, path: '/calendar' },
  { text: 'Reviews', icon: <ReviewsIcon />, path: '/reviews' },
  { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
];
const bottomMenu = [
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Help Center', icon: <HelpCenterIcon />, path: '/help' },
];

const DashboardLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [active, setActive] = useState('Dashboard');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ minHeight: 40, px: 0 }} />
      <Box sx={{ mt: 1, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ bgcolor: '#6C63FF', color: '#fff', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20 }}>
          H
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>H & H</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ bgcolor: '#F6F8FB', borderRadius: 2, px: 1, py: 0.5, display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ color: '#A0A0A0', fontSize: 20, mr: 1 }} />
          <InputBase placeholder="Search" sx={{ fontSize: 15, flex: 1 }} />
          <Box sx={{ bgcolor: '#F0F0F0', borderRadius: 1, px: 0.5, ml: 1, fontSize: 12, color: '#888', fontWeight: 600 }}>⌘</Box>
          <Box sx={{ bgcolor: '#F0F0F0', borderRadius: 1, px: 0.5, ml: 0.5, fontSize: 12, color: '#888', fontWeight: 600 }}>K</Box>
        </Box>
      </Box>
      <Typography variant="caption" sx={{ color: '#888', fontWeight: 600, pl: 1, mb: 1 }}>Main Menu</Typography>
      <List sx={{ mb: 2 }}>
        {mainMenu.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => { setActive(item.text); navigate(item.path); }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              bgcolor: active === item.text ? '#F3F0FF' : 'transparent',
              color: active === item.text ? '#6C63FF' : '#222',
              fontWeight: active === item.text ? 700 : 500,
              '&:hover': { bgcolor: '#F3F0FF' },
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: active === item.text ? '#6C63FF' : '#A0A0A0', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ my: 1 }} />
      <List>
        {bottomMenu.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => { setActive(item.text); navigate(item.path); }}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: active === item.text ? '#6C63FF' : '#888',
              fontWeight: active === item.text ? 700 : 500,
              px: 2,
            }}
          >
            <ListItemIcon sx={{ color: active === item.text ? '#6C63FF' : '#A0A0A0', minWidth: 36 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #F0F0F0',
              bgcolor: '#fff',
              px: 2,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#F6F8FB',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 