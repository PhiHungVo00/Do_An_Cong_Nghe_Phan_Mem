import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Alert, 
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  LocalShipping,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { shipperApi } from '../api/shipperApi';

interface LoginProps {
  onLoginSuccess?: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await shipperApi.login(email, password);
      console.log('Login response:', res); // Debug log
      
      if (res.user?.role !== 'shipper') {
        console.log('User role:', res.user?.role); // Debug log
        setError('Tài khoản không phải shipper!');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('shipper_token', res.token);
      localStorage.setItem('shipper_user', JSON.stringify(res.user));
      console.log('Stored token:', res.token); // Debug log
      console.log('Stored user:', res.user); // Debug log
      if (onLoginSuccess) onLoginSuccess(res.user);
      navigate('/orders/available');
    } catch (err: any) {
      console.error('Login error:', err); // Debug log
      setError(err.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 3, sm: 4 },
          width: '100%',
          maxWidth: 400,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              mb: 2,
              boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
            }}
          >
            <LocalShipping sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Delivery Pro
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Đăng nhập vào hệ thống giao hàng
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              boxShadow: '0 4px 16px rgba(33, 150, 243, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #BDBDBD 0%, #9E9E9E 100%)',
              },
            }}
            startIcon={loading ? undefined : <LoginIcon />}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }}
                />
                Đang đăng nhập...
              </Box>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>

        {/* Footer */}
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
            Hệ thống quản lý giao hàng
          </Typography>
        </Divider>
        
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
          © 2024 Delivery Pro. Tất cả quyền được bảo lưu.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 