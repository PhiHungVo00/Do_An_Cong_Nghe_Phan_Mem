import React, { useState } from 'react';
import {
  Box, Typography, Switch, FormControlLabel, Paper, Divider, Grid, Button, TextField, Avatar, InputLabel, Select, MenuItem, FormControl, Alert, Dialog, DialogTitle, DialogContent, DialogActions
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

const Settings: React.FC = () => {
  // Store info
  const [storeName, setStoreName] = useState('Cửa hàng ABC');
  const [address, setAddress] = useState('123 Đường XYZ, Quận 1, TP.HCM');
  const [phone, setPhone] = useState('0123456789');
  const [email, setEmail] = useState('contact@store.com');
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

  // Payment
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [bankSaved, setBankSaved] = useState(false);

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>Cài đặt hệ thống</Typography>
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
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setPwSuccess(true)}>Đổi mật khẩu</Button>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><NotificationsActiveIcon sx={{ mr: 1 }} />Cài đặt thông báo</Typography>
        <FormControlLabel control={<Switch checked={notifyEmail} onChange={() => setNotifyEmail(!notifyEmail)} />} label={<><EmailIcon sx={{ mr: 1 }} />Nhận thông báo qua email</>} />
        <FormControlLabel control={<Switch checked={notifyBrowser} onChange={() => setNotifyBrowser(!notifyBrowser)} />} label={<><NotificationsActiveIcon sx={{ mr: 1 }} />Nhận thông báo trên trình duyệt</>} />
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><SecurityIcon sx={{ mr: 1 }} />Cài đặt bảo mật</Typography>
        <FormControlLabel control={<Switch checked={enable2FA} onChange={() => setEnable2FA(!enable2FA)} />} label="Bật xác thực 2 lớp (2FA)" />
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}><Brightness4Icon sx={{ mr: 1 }} />Cài đặt giao diện</Typography>
        <FormControlLabel control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />} label={darkMode ? 'Chế độ tối' : 'Chế độ sáng'} />
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <ColorLensIcon sx={{ mr: 1 }} />
          <TextField type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} sx={{ width: 60, minWidth: 60, p: 0, border: 'none' }} />
          <Typography sx={{ ml: 2 }}>Màu chủ đạo</Typography>
        </Box>
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
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setBankSaved(true)}>Lưu</Button>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Hủy</Button>
            <Button color="error" disabled={deleteConfirm !== 'DELETE'}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default Settings; 