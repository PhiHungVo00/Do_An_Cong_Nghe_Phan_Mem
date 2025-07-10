import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import Cart from './pages/Cart';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Challenges from './pages/Challenges';
import LiveEvents from './pages/LiveEvents';
import Products from './pages/Products';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ShopReview from './pages/ShopReview';
import Chat from './pages/Chat';
import { CartProvider } from './contexts/CartContext';
import { GoogleMapsProvider } from './components/GoogleMapsProvider';

// Cấu hình future flags cho React Router
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const App: React.FC = () => {
  return (
    <GoogleMapsProvider>
    <CartProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
              <NavBar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/challenges" element={<Challenges />} />
                  <Route path="/events" element={<LiveEvents />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:categoryId" element={<Products />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="/shop-review" element={<ShopReview />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Box>
            </Box>
          </ThemeProvider>
        </Router>
      </SnackbarProvider>
    </CartProvider>
    </GoogleMapsProvider>
  );
};

export default App; 