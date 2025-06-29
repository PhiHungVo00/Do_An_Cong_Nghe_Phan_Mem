import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Google,
  Facebook,
  Blender,
  Kitchen,
  Chair,
  Weekend,
  ElectricalServices,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';

interface User {
  email: string;
  password: string;
  name: string;
}

const Login: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);

      // Gọi API đăng nhập thật sự, gửi cả username và email
      const payload: any = {};
      if (identifier.includes('@')) {
        payload.email = identifier;
      } else {
        payload.username = identifier;
      }
      payload.password = password;
      const { token, user } = await authAPI.login(payload);
      if (!token || !user) {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại.');
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setError('Chức năng đăng nhập bằng OTP hiện chưa hỗ trợ. Vui lòng sử dụng email và mật khẩu.');
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('Chức năng đăng nhập bằng OTP hiện chưa hỗ trợ. Vui lòng sử dụng email và mật khẩu.');
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement actual Google login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Giả lập response từ server
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@gmail.com',
          name: 'Google User',
        },
      };

      // Lưu token vào localStorage
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      // Chuyển hướng về trang trước đó hoặc trang chủ
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập bằng Google thất bại. Vui lòng thử lại.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // TODO: Implement actual Facebook login
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Giả lập response từ server
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@facebook.com',
          name: 'Facebook User',
        },
      };

      // Lưu token vào localStorage
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));

      // Chuyển hướng về trang trước đó hoặc trang chủ
      navigate(from, { replace: true });
    } catch (err) {
      setError('Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={4} alignItems="center">
        {/* Phần giới thiệu bên trái */}
        {!isMobile && (
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" gutterBottom color="primary" 
                sx={{ fontWeight: 'bold', mb: 4 }}>
                H & H 
              </Typography>
              <Typography variant="h5" gutterBottom color="text.secondary" sx={{ mb: 4 }}>
                Nơi mua sắm thiết bị gia dụng thông minh hàng đầu
              </Typography>
              <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                <Grid item>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'primary.light',
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <Kitchen sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Nhà Bếp</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'secondary.light',
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <Weekend sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Phòng Khách</Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: 'error.light',
                    borderRadius: 2,
                    color: 'white'
                  }}>
                    <ElectricalServices sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Điện Gia Dụng</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Khám phá hàng ngàn sản phẩm gia dụng chất lượng cao
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Miễn phí vận chuyển cho đơn hàng từ 1 triệu đồng
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Form đăng nhập bên phải */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ 
            p: 4, 
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h4" component="h1" align="center" gutterBottom 
              sx={{ color: 'primary.main', fontWeight: 'bold', mb: 4 }}>
              {isMobile ? 'SmartHome Hub' : 'Đăng Nhập'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
              <Button
                fullWidth
                variant={loginMethod === 'email' ? 'contained' : 'outlined'}
                onClick={() => setLoginMethod('email')}
                sx={{ borderRadius: 2, py: 1 }}
              >
                Email & Mật khẩu
              </Button>
              <Button
                fullWidth
                variant={loginMethod === 'otp' ? 'contained' : 'outlined'}
                onClick={() => setLoginMethod('otp')}
                sx={{ borderRadius: 2, py: 1 }}
              >
                OTP
              </Button>
            </Stack>

            {loginMethod === 'email' ? (
              <form onSubmit={handleEmailLogin}>
                <TextField
                  fullWidth
                  label="Email hoặc Tên đăng nhập"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
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
                />
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{ 
                    mb: 3, 
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem'
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : 'Đăng nhập'}
                </Button>

                <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                  <Typography variant="body2">
                    Tài khoản demo:<br />
                    Email: admin@example.com<br />
                    Mật khẩu: admin123
                  </Typography>
                </Alert>
              </form>
            ) : (
              <form onSubmit={handleOtpLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                {!otpSent ? (
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSendOtp}
                    disabled={isLoading || !identifier}
                    sx={{ 
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem'
                    }}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Gửi mã OTP'}
                  </Button>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="Mã OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      sx={{ mb: 3 }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={isLoading}
                      sx={{ 
                        mb: 2,
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem'
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : 'Xác nhận'}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      sx={{ mb: 3 }}
                    >
                      Gửi lại mã OTP
                    </Button>
                  </>
                )}
              </form>
            )}

            <Divider sx={{ my: 3 }}>Hoặc đăng nhập với</Divider>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#DB4437',
                  color: '#DB4437',
                  '&:hover': {
                    borderColor: '#DB4437',
                    bgcolor: 'rgba(219, 68, 55, 0.1)'
                  }
                }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={handleFacebookLogin}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#4267B2',
                  color: '#4267B2',
                  '&:hover': {
                    borderColor: '#4267B2',
                    bgcolor: 'rgba(66, 103, 178, 0.1)'
                  }
                }}
              >
                Facebook
              </Button>
            </Stack>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có tài khoản?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}
                >
                  Đăng ký ngay
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login; 