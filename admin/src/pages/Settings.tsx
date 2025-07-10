import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Switch, FormControlLabel, Paper, Divider, Grid, Button, TextField, Avatar, InputLabel, Select, MenuItem, FormControl, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Snackbar
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LanguageIcon from '@mui/icons-material/Language';
import LockIcon from '@mui/icons-material/Lock';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import DeleteIcon from '@mui/icons-material/Delete';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

interface Settings {
  store: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
  };
  notifications: {
    email: boolean;
    browser: boolean;
  };
  security: {
    enable2FA: boolean;
  };
  theme: {
    darkMode: boolean;
    primaryColor: string;
  };
  preferences: {
    language: string;
    timezone: string;
  };
  payment: {
    bankName: string;
    bankAccount: string;
    accountHolder: string;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');

  // Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);

  // Notification
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(false);

  // Security
  const [enable2FA, setEnable2FA] = useState(false);

  // Theme
  const [darkMode, setDarkMode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#1976d2');

  // Language & timezone
  const [language, setLanguage] = useState('vi');
  const [timezone, setTimezone] = useState('Asia/Ho_Chi_Minh');

  // Delete account dialog
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  // Payment
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankSaved, setBankSaved] = useState(false);

  // Success messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem cài đặt');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/settings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;
      setSettings(data);
      
      // Update form states
      setStoreName(data.store.name);
      setAddress(data.store.address);
      setPhone(data.store.phone);
      setEmail(data.store.email);
      setLogo(data.store.logo);
      setNotifyEmail(data.notifications.email);
      setNotifyBrowser(data.notifications.browser);
      setEnable2FA(data.security.enable2FA);
      setDarkMode(data.theme.darkMode);
      setPrimaryColor(data.theme.primaryColor);
      setLanguage(data.preferences.language);
      setTimezone(data.preferences.timezone);
      setBankName(data.payment.bankName);
      setBankAccount(data.payment.bankAccount);
      setAccountHolder(data.payment.accountHolder);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải cài đặt'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải cài đặt');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateStoreInfo = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/store', {
        name: storeName,
        address,
        phone,
        email,
        logo
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi cập nhật thông tin cửa hàng');
      } else {
        setError('Có lỗi xảy ra khi cập nhật thông tin cửa hàng');
      }
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPwSuccess(true);
      setSuccessMessage(response.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPwSuccess(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi đổi mật khẩu');
      } else {
        setError('Có lỗi xảy ra khi đổi mật khẩu');
      }
    } finally {
      setSaving(false);
    }
  };

  const updateNotifications = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/notifications', {
        email: notifyEmail,
        browser: notifyBrowser
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi cập nhật cài đặt thông báo');
      } else {
        setError('Có lỗi xảy ra khi cập nhật cài đặt thông báo');
      }
    } finally {
      setSaving(false);
    }
  };

  const updateSecurity = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/security', {
        enable2FA
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi cập nhật cài đặt bảo mật');
      } else {
        setError('Có lỗi xảy ra khi cập nhật cài đặt bảo mật');
      }
    } finally {
      setSaving(false);
    }
  };

  const updateTheme = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/theme', {
        darkMode,
        primaryColor
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi cập nhật cài đặt giao diện');
      } else {
        setError('Có lỗi xảy ra khi cập nhật cài đặt giao diện');
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/preferences', {
        language,
        timezone
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccessMessage(response.data.message);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi cập nhật cài đặt ngôn ngữ và múi giờ');
      } else {
        setError('Có lỗi xảy ra khi cập nhật cài đặt ngôn ngữ và múi giờ');
      }
    } finally {
      setSaving(false);
    }
  };

  const updatePayment = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://localhost:5000/api/settings/payment', {
        bankName,
        bankAccount,
        accountHolder
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBankSaved(true);
      setSuccessMessage(response.data.message);
      setTimeout(() => {
        setBankSaved(false);
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi lưu thông tin thanh toán');
      } else {
        setError('Có lỗi xảy ra khi lưu thông tin thanh toán');
      }
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Vui lòng nhập chính xác "DELETE" để xác nhận');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      await axios.delete('http://localhost:5000/api/settings/account', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          password: deletePassword
        }
      });

      // Clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lỗi khi xóa tài khoản');
      } else {
        setError('Có lỗi xảy ra khi xóa tài khoản');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>Cài đặt hệ thống</Typography>
      
      {successMessage && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setSuccessMessage(null)}>
          <Alert severity="success" onClose={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        </Snackbar>
      )}

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Thông tin cửa hàng</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={2}>
            <Avatar src={logo} sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 32 }}>{storeName[0]}</Avatar>
          </Grid>
          <Grid item xs={12} sm={10}>
            <TextField label="Tên cửa hàng" value={storeName} onChange={e => setStoreName(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Địa chỉ" value={address} onChange={e => setAddress(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} />
            <Button variant="outlined" size="small" component="label">Tải logo lên<input type="file" hidden onChange={e => { if(e.target.files?.[0]) setLogo(URL.createObjectURL(e.target.files[0])); }} /></Button>
            <Button variant="contained" sx={{ mt: 2, ml: 2 }} onClick={updateStoreInfo} disabled={saving}>
              {saving ? <CircularProgress size={20} /> : 'Lưu thông tin'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><LockIcon sx={{ mr: 1 }} />Đổi mật khẩu</Typography>
        {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>Đổi mật khẩu thành công!</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}><TextField label="Mật khẩu cũ" type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Mật khẩu mới" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth /></Grid>
          <Grid item xs={12} sm={4}><TextField label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} fullWidth /></Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={changePassword} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Đổi mật khẩu'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><NotificationsActiveIcon sx={{ mr: 1 }} />Cài đặt thông báo</Typography>
        <FormControlLabel control={<Switch checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} />} label={<><EmailIcon sx={{ mr: 1 }} />Nhận thông báo qua email</>} />
        <FormControlLabel control={<Switch checked={notifyBrowser} onChange={() => setNotifyBrowser(!notifyBrowser)} />} label={<><NotificationsActiveIcon sx={{ mr: 1 }} />Nhận thông báo trên trình duyệt</>} />
        <Button variant="contained" sx={{ mt: 2 }} onClick={updateNotifications} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Lưu cài đặt'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><SecurityIcon sx={{ mr: 1 }} />Cài đặt bảo mật</Typography>
        <FormControlLabel control={<Switch checked={enable2FA} onChange={() => setEnable2FA(!enable2FA)} />} label="Bật xác thực 2 lớp (2FA)" />
        <Button variant="contained" sx={{ mt: 2 }} onClick={updateSecurity} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Lưu cài đặt'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><Brightness4Icon sx={{ mr: 1 }} />Cài đặt giao diện</Typography>
        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label={darkMode ? 'Chế độ tối' : 'Chế độ sáng'} />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <ColorLensIcon sx={{ mr: 1 }} />
          <TextField type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} sx={{ width: 60, minWidth: 60, p: 0, border: 'none' }} />
          <Typography sx={{ ml: 2 }}>Màu chủ đạo</Typography>
        </Box>
        <Button variant="contained" sx={{ mt: 2 }} onClick={updateTheme} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Lưu cài đặt'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><LanguageIcon sx={{ mr: 1 }} />Cài đặt ngôn ngữ & múi giờ</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Ngôn ngữ</InputLabel>
              <Select value={language} label="Ngôn ngữ" onChange={e => setLanguage(e.target.value)}>
                <MenuItem value="vi">Tiếng Việt</MenuItem>
                <MenuItem value="en">English</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Múi giờ</InputLabel>
              <Select value={timezone} label="Múi giờ" onChange={e => setTimezone(e.target.value)}>
                <MenuItem value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="Asia/Bangkok">Bangkok</MenuItem>
                <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={updatePreferences} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Lưu cài đặt'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Cài đặt thanh toán</Typography>
        {bankSaved && <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 2 }}>Lưu thông tin thanh toán thành công!</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField label="Tên ngân hàng" value={bankName} onChange={e => setBankName(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Số tài khoản" value={bankAccount} onChange={e => setBankAccount(e.target.value)} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Tên chủ tài khoản" value={accountHolder} onChange={e => setAccountHolder(e.target.value)} fullWidth />
          </Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={updatePayment} disabled={saving}>
          {saving ? <CircularProgress size={20} /> : 'Lưu'}
        </Button>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Cài đặt in hóa đơn</Typography>
        <Box sx={{ color: 'text.secondary' }}>(Tính năng này sẽ sớm được cập nhật: mẫu hóa đơn, logo, thông tin hiển thị...)</Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}><DeleteIcon sx={{ mr: 1 }} />Xóa tài khoản</Typography>
        <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>Xóa tài khoản</Button>
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Xác nhận xóa tài khoản</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.</Typography>
            <TextField label="Nhập 'DELETE' để xác nhận" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} fullWidth sx={{ mt: 2 }} />
            <TextField label="Nhập mật khẩu để xác nhận" type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} fullWidth sx={{ mt: 2 }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
            <Button color="error" disabled={deleteConfirm !== 'DELETE' || !deletePassword} onClick={deleteAccount}>
              {saving ? <CircularProgress size={20} /> : 'Xóa'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Settings; 