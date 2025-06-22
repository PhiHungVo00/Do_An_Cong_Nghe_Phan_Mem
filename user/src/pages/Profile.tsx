import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Card,
  CardContent,
  IconButton,
  Divider,
  Breadcrumbs,
  Link,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CameraAlt as CameraIcon,
  History as HistoryIcon,
  ShoppingCart as CartIcon,
  Settings as SettingsIcon,
  NavigateNext,
  AccountCircle,
  Security,
  Notifications,
  Payment,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAPI, authAPI } from '../services/api';
import { useSnackbar } from 'notistack';

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  username?: string;
  role: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await customerAPI.getProfile();
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (err) {
        setError('Không thể tải thông tin cá nhân. Vui lòng thử lại sau.');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setShowPasswordDialog(true);
  };

  const handlePasswordVerification = async () => {
    try {
      // Verify current password by trying to get profile with current token
      await customerAPI.getProfile();
      setShowPasswordDialog(false);
      setIsEditing(true);
      setPassword('');
      setError('');
    } catch (err) {
      setError('Mật khẩu không chính xác hoặc phiên đăng nhập đã hết hạn');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await customerAPI.updateProfile(editedProfile);
      setProfile(response.data);
      setIsEditing(false);
      enqueueSnackbar('Cập nhật thông tin thành công!', {
        variant: 'success',
      });
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.', {
        variant: 'error',
      });
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile || {});
  };

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload
    enqueueSnackbar('Tính năng cập nhật ảnh đại diện sẽ có sớm!', {
      variant: 'info',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Không thể tải thông tin cá nhân'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/" underline="hover">
          Trang chủ
        </Link>
        <Typography color="text.primary">Thông tin cá nhân</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <AccountCircle sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Thông tin cá nhân
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Avatar
                  src={profile.avatar || '/default-avatar.jpg'}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto',
                    fontSize: '3rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {profile.fullName.charAt(0).toUpperCase()}
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'background.paper',
                      border: 2,
                      borderColor: 'primary.main',
                      '&:hover': { backgroundColor: 'primary.light' }
                    }}
                    onClick={handleAvatarChange}
                  >
                    <CameraIcon />
                  </IconButton>
                )}
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {profile.fullName}
              </Typography>
              
              <Typography color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>
              
              <Chip 
                label={profile.role === 'user' ? 'Khách hàng' : profile.role}
                color="primary"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Thành viên từ: {formatDate(profile.createdAt)}
              </Typography>

              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Chỉnh sửa thông tin
                </Button>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    disabled={saving}
                    sx={{ flex: 1 }}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ flex: 1 }}
                  >
                    Hủy
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Thao tác nhanh
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/order-history')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Lịch sử đơn hàng
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CartIcon />}
                  onClick={() => navigate('/cart')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Giỏ hàng
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SettingsIcon />}
                  onClick={() => navigate('/settings')}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Cài đặt
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Chi tiết tài khoản
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={isEditing ? editedProfile.fullName || '' : profile.fullName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, fullName: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập"
                    value={profile.username || ''}
                    disabled
                    InputProps={{
                      startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    }}
                    helperText="Không thể thay đổi"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={isEditing ? editedProfile.email || '' : profile.email}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={isEditing ? editedProfile.phone || '' : profile.phone || ''}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    multiline
                    rows={3}
                    value={isEditing ? editedProfile.address || '' : profile.address || ''}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, address: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
                Bảo mật tài khoản
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Security sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Mật khẩu
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cập nhật mật khẩu định kỳ
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Notifications sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Thông báo
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quản lý thông báo email
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Verification Dialog */}
      <Dialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockIcon sx={{ mr: 1, color: 'primary.main' }} />
            Xác thực mật khẩu
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Vui lòng nhập mật khẩu hiện tại để chỉnh sửa thông tin cá nhân
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handlePasswordVerification();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>
            Hủy
          </Button>
          <Button
            onClick={handlePasswordVerification}
            variant="contained"
            disabled={!password}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 