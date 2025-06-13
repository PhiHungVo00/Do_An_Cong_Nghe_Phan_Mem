import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...', location.pathname);
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.log('Stored token:', token);
        console.log('Stored user:', user);

        if (token && user) {
          try {
            // Kiểm tra token có hợp lệ không
            const decodedToken = JSON.parse(atob(token));
            console.log('Decoded token:', decodedToken);
            
            // Kiểm tra user có khớp với token không
            const userData = JSON.parse(user);
            console.log('User data:', userData);

            if (decodedToken.userId === userData.id && decodedToken.email === userData.email) {
              console.log('Authentication successful');
              setIsAuthenticated(true);
            } else {
              console.log('Token and user data mismatch');
              setIsAuthenticated(false);
              // Xóa dữ liệu không hợp lệ
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            console.error('Invalid token format:', error);
            setIsAuthenticated(false);
            // Xóa token không hợp lệ
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          console.log('No authentication data found');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname]); // Re-run when pathname changes

  if (isChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Nếu đã đăng nhập và đang ở trang auth, chuyển về trang chủ
  if (isAuthenticated && location.pathname.startsWith('/auth')) {
    console.log('Redirecting to home from auth page');
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập và không ở trang auth, chuyển về trang đăng nhập
  if (!isAuthenticated && !location.pathname.startsWith('/auth')) {
    console.log('Redirecting to login page, current path:', location.pathname);
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthLayout; 