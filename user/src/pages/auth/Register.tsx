import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Person,
  Phone,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const steps = ['Thông tin cá nhân', 'Xác thực email', 'Hoàn tất'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [fakeOtp, setFakeOtp] = useState('');

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!fullName || !email || !username || !password || !confirmPassword || !phone) {
          setError('Vui lòng điền đầy đủ thông tin.');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Mật khẩu xác nhận không khớp.');
          return false;
        }
        if (password.length < 8) {
          setError('Mật khẩu phải có ít nhất 8 ký tự.');
          return false;
        }
        if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
          setError('Email không hợp lệ.');
          return false;
        }
        if (!/^[0-9]{10}$/.test(phone)) {
          setError('Số điện thoại không hợp lệ.');
          return false;
        }
        if (username.length < 3) {
          setError('Tên đăng nhập phải có ít nhất 3 ký tự.');
          return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          setError('Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới.');
          return false;
        }
        break;
      case 1:
        if (!otp) {
          setError('Vui lòng nhập mã OTP.');
          return false;
        }
        if (otp.length !== 6) {
          setError('Mã OTP phải có 6 số.');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    try {
      setIsLoading(true);
      setError(null);

      switch (activeStep) {
        case 0:
          // Tạo OTP giả 6 số
          const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
          setFakeOtp(generatedOtp);
          console.log('🔐 OTP giả được tạo:', generatedOtp);
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          setOtpSent(true);
          break;
        case 1:
          // Xác thực OTP giả
          if (otp !== fakeOtp) {
            setError('Mã OTP không đúng. Vui lòng kiểm tra lại.');
            return;
          }
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
          break;
        case 2:
          // Hoàn tất đăng ký với API thật
          try {
            const userData = {
              fullName,
              username,
              email,
              password,
              phone,
            };
            
            const response = await authAPI.register(userData);
            console.log('✅ Đăng ký thành công:', response);
            
            // Hiển thị thông báo thành công
            setError(null);
            
            // Chuyển đến trang đăng nhập sau 2 giây
            setTimeout(() => {
              navigate('/login');
            }, 2000);
            
          } catch (err: any) {
            console.error('❌ Lỗi đăng ký:', err);
            setError(err?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            return;
          }
          return;
      }

      setActiveStep((prev) => prev + 1);
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Tạo OTP giả mới
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setFakeOtp(newOtp);
      console.log('🔐 OTP giả mới được tạo:', newOtp);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setOtpSent(true);
    } catch (err) {
      setError('Không thể gửi lại mã OTP. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              label="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
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
              sx={{ mb: 2 }}
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
            <TextField
              fullWidth
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography paragraph>
              Chúng tôi đã gửi mã xác thực đến email: {email}
            </Typography>
            
            {/* Hiển thị OTP giả cho test */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>🔐 OTP giả (chỉ để test):</strong> {fakeOtp}
              </Typography>
            </Alert>
            
            <TextField
              fullWidth
              label="Mã xác thực (OTP)"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="text"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Gửi lại mã OTP
            </Button>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            {isLoading ? (
              <>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Đang tạo tài khoản...
                </Typography>
                <Typography paragraph>
                  Vui lòng chờ trong giây lát.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom color="success.main">
                  ✅ Đăng ký thành công!
                </Typography>
                <Typography paragraph>
                  Tài khoản của bạn đã được tạo thành công.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đang chuyển đến trang đăng nhập...
                </Typography>
              </>
            )}
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Đăng ký tài khoản
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {renderStepContent()}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0 || isLoading}
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Quay lại
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Hoàn tất'
            ) : (
              'Tiếp tục'
            )}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 