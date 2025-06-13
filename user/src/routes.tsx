import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import Challenges from './pages/Challenges';
import LiveEvents from './pages/LiveEvents';

// Kiểm tra xem các components có tồn tại không
const AppRoutes: React.FC = () => {
  console.log('Available components:', {
    Home,
    CategoryProducts,
    ProductDetail,
    Cart,
    Login,
    Register,
    AuthLayout,
    MainLayout,
    Challenges,
    LiveEvents
  });

  return (
    <AuthLayout>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* Protected routes - wrapped in MainLayout */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/category/:categoryId"
          element={
            <MainLayout>
              <CategoryProducts />
            </MainLayout>
          }
        />
        <Route
          path="/product/:productId"
          element={
            <MainLayout>
              <ProductDetail />
            </MainLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <MainLayout>
              <Cart />
            </MainLayout>
          }
        />
        <Route
          path="/challenges"
          element={
            <MainLayout>
              <Challenges />
            </MainLayout>
          }
        />
        <Route
          path="/live-events"
          element={
            <MainLayout>
              <LiveEvents />
            </MainLayout>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthLayout>
  );
};

export default AppRoutes; 