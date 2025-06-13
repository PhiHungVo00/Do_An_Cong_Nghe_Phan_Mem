import React, { useState } from 'react';
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
} from '@mui/icons-material';

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    address: 'Hà Nội, Việt Nam',
    avatar: 'https://source.unsplash.com/150x150/?portrait',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleEditClick = () => {
    setEditedProfile(profile);
    setShowPasswordDialog(true);
  };

  const handlePasswordVerification = () => {
    // TODO: Implement actual password verification
    if (password === '123456') { // Demo password
      setShowPasswordDialog(false);
      setIsEditing(true);
      setPassword('');
      setError('');
    } else {
      setError('Mật khẩu không chính xác');
    }
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    setShowSuccess(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleAvatarChange = () => {
    // TODO: Implement avatar upload
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thông tin cá nhân
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={profile.avatar}
                  sx={{ width: 150, height: 150, mb: 2, mx: 'auto' }}
                />
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'background.paper',
                    }}
                    onClick={handleAvatarChange}
                  >
                    <CameraIcon />
                  </IconButton>
                )}
              </Box>
              <Typography variant="h6" gutterBottom>
                {profile.fullName}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {profile.email}
              </Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  sx={{ mt: 2 }}
                >
                  Chỉnh sửa thông tin
                </Button>
              ) : (
                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Lưu
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Hủy
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Chi tiết tài khoản
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={isEditing ? editedProfile.fullName : profile.fullName}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, fullName: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={isEditing ? editedProfile.email : profile.email}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, email: e.target.value })
                    }
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={isEditing ? editedProfile.phone : profile.phone}
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
                    value={isEditing ? editedProfile.address : profile.address}
                    onChange={(e) =>
                      setEditedProfile({ ...editedProfile, address: e.target.value })
                    }
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onClose={() => setShowPasswordDialog(false)}>
        <DialogTitle>Xác thực mật khẩu</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Vui lòng nhập mật khẩu để tiếp tục chỉnh sửa thông tin
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPasswordDialog(false)}>Hủy</Button>
          <Button onClick={handlePasswordVerification} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Đã cập nhật thông tin thành công!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 