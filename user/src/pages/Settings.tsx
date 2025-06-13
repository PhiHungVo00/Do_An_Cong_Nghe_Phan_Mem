import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

interface SystemSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  language: string;
  currency: string;
  itemsPerPage: number;
  maintenanceMode: boolean;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    darkMode: false,
    emailNotifications: true,
    language: 'vi',
    currency: 'VND',
    itemsPerPage: 10,
    maintenanceMode: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSettingChange = (setting: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // TODO: Implement API call to save settings
    setShowSuccess(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Cài đặt hệ thống
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DarkModeIcon /> Giao diện
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.darkMode}
                      onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                    />
                  }
                  label="Chế độ tối"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon /> Thông báo
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                    />
                  }
                  label="Nhận thông báo qua email"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LanguageIcon /> Ngôn ngữ & Tiền tệ
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Ngôn ngữ"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Tiền tệ"
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                    </TextField>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon /> Bảo mật & Hiển thị
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Số sản phẩm mỗi trang"
                      value={settings.itemsPerPage}
                      onChange={(e) => handleSettingChange('itemsPerPage', parseInt(e.target.value))}
                      InputProps={{ inputProps: { min: 5, max: 50 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.maintenanceMode}
                          onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                        />
                      }
                      label="Chế độ bảo trì"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  size="large"
                >
                  Lưu cài đặt
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin hệ thống
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phiên bản: 1.0.0
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cập nhật lần cuối: {new Date().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trạng thái: Hoạt động
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Đã lưu cài đặt thành công!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 