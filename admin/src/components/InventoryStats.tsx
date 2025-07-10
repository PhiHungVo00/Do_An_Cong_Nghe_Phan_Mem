import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface InventoryStats {
  totalProducts: number;
  outOfStock: number;
  lowStock: number;
  inStock: number;
}

const InventoryStats: React.FC = () => {
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem thống kê tồn kho');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/products/inventory/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setStats(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải thống kê tồn kho'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải thống kê tồn kho');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateProductStatuses = async () => {
    try {
      setUpdating(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để cập nhật trạng thái sản phẩm');
        return;
      }

      await axios.post('http://localhost:5000/api/products/inventory/update-status', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh stats after update
      await fetchStats();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Lỗi khi cập nhật trạng thái: ${err.response?.data?.message || err.message}`);
      } else {
        setError('Có lỗi xảy ra khi cập nhật trạng thái sản phẩm');
      }
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info">
        Không có dữ liệu thống kê tồn kho
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" component="h2" display="flex" alignItems="center">
          <InventoryIcon sx={{ mr: 1 }} />
          Thống Kê Tồn Kho
        </Typography>
        <Box>
          <Tooltip title="Cập nhật trạng thái tất cả sản phẩm">
            <IconButton 
              onClick={updateProductStatuses} 
              disabled={updating}
              color="primary"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Tổng số sản phẩm */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng sản phẩm
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalProducts}
                  </Typography>
                </Box>
                <InventoryIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sản phẩm có hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Có hàng
                  </Typography>
                  <Typography variant="h4" component="div" color="success.main">
                    {stats.inStock}
                  </Typography>
                </Box>
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sản phẩm sắp hết hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Sắp hết hàng
                  </Typography>
                  <Typography variant="h4" component="div" color="warning.main">
                    {stats.lowStock}
                  </Typography>
                </Box>
                <WarningIcon color="warning" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sản phẩm hết hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Hết hàng
                  </Typography>
                  <Typography variant="h4" component="div" color="error.main">
                    {stats.outOfStock}
                  </Typography>
                </Box>
                <ErrorIcon color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Thông tin bổ sung */}
      <Box mt={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Tỷ lệ tồn kho
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`${((stats.inStock / stats.totalProducts) * 100).toFixed(1)}% Có hàng`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${((stats.lowStock / stats.totalProducts) * 100).toFixed(1)}% Sắp hết hàng`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`${((stats.outOfStock / stats.totalProducts) * 100).toFixed(1)}% Hết hàng`}
                color="error"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Cảnh báo */}
      {(stats.lowStock > 0 || stats.outOfStock > 0) && (
        <Box mt={3}>
          <Alert severity="warning">
            <Typography variant="body2">
              {stats.outOfStock > 0 && `${stats.outOfStock} sản phẩm đã hết hàng. `}
              {stats.lowStock > 0 && `${stats.lowStock} sản phẩm sắp hết hàng. `}
              Vui lòng kiểm tra và cập nhật tồn kho.
            </Typography>
          </Alert>
        </Box>
      )}

      {/* Nút cập nhật */}
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          variant="contained"
          onClick={updateProductStatuses}
          disabled={updating}
          startIcon={updating ? <CircularProgress size={20} /> : <RefreshIcon />}
        >
          {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái sản phẩm'}
        </Button>
      </Box>
    </Box>
  );
};

export default InventoryStats; 