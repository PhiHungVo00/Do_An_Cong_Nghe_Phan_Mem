import React, { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, Group, ShoppingCart, Inventory2, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DashboardStats {
  revenue: {
    current: number;
    change: number;
    changeAmount: number;
  };
  traffic: {
    current: number;
    change: number;
    changeAmount: number;
  };
  orders: {
    current: number;
    change: number;
    changeAmount: number;
  };
  products: {
    current: number;
    change: number;
    changeAmount: number;
  };
  customers: {
    current: number;
    change: number;
    changeAmount: number;
  };
}

function formatVND(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const StatsCards: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem thống kê');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/analytics/stats', {
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
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải thống kê'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải thống kê');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 4, boxShadow: 2, p: 0 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
                <CircularProgress />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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
        Không có dữ liệu thống kê
      </Alert>
    );
  }

  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: stats.revenue.current,
      percent: `${stats.revenue.change >= 0 ? '+' : ''}${stats.revenue.change.toFixed(2)}%`,
      percentColor: stats.revenue.change >= 0 ? '#16C784' : '#FF6B6B',
      icon: <TrendingUp />,
      iconBg: '#F3F0FF',
      iconColor: '#6C63FF',
      change: stats.revenue.changeAmount,
      changeText: 'so với tháng trước',
      route: '/revenue-details'
    },
    {
      title: 'Lượt truy cập',
      value: stats.traffic.current,
      percent: `${stats.traffic.change >= 0 ? '+' : ''}${stats.traffic.change.toFixed(2)}%`,
      percentColor: stats.traffic.change >= 0 ? '#16C784' : '#FF6B6B',
      icon: <Group />,
      iconBg: '#F3F0FF',
      iconColor: '#6C63FF',
      change: stats.traffic.changeAmount,
      changeText: 'so với tháng trước',
      route: '/access-details'
    },
    {
      title: 'Giao dịch',
      value: stats.orders.current,
      percent: `${stats.orders.change >= 0 ? '+' : ''}${stats.orders.change.toFixed(2)}%`,
      percentColor: stats.orders.change >= 0 ? '#16C784' : '#FF6B6B',
      icon: <ShoppingCart />,
      iconBg: '#F3F0FF',
      iconColor: '#6C63FF',
      change: stats.orders.changeAmount,
      changeText: 'so với tháng trước',
      route: '/transaction-details'
    },
    {
      title: 'Sản phẩm',
      value: stats.products.current,
      percent: `${stats.products.change >= 0 ? '+' : ''}${stats.products.change.toFixed(2)}%`,
      percentColor: stats.products.change >= 0 ? '#16C784' : '#FF6B6B',
      icon: <Inventory2 />,
      iconBg: '#F3F0FF',
      iconColor: '#6C63FF',
      change: stats.products.changeAmount,
      changeText: 'so với tháng trước',
      route: '/products'
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card 
            sx={{ 
              borderRadius: 4, 
              boxShadow: 2, 
              p: 0,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              }
            }}
            onClick={() => navigate(stat.route)}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ bgcolor: stat.iconBg, color: stat.iconColor, width: 40, height: 40 }}>{stat.icon}</Avatar>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, fontSize: 28, mt: 1 }}>
                {typeof stat.value === 'number' ? formatVND(stat.value) : stat.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ color: stat.percentColor, fontWeight: 700 }}>{stat.percent}</Typography>
                {stat.percent.includes('+') ? (
                  <ArrowUpward sx={{ color: stat.percentColor, fontSize: 18 }} />
                ) : (
                  <ArrowDownward sx={{ color: stat.percentColor, fontSize: 18 }} />
                )}
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  {stat.changeText} {stat.change ? (typeof stat.change === 'number' ? formatVND(stat.change) : stat.change) : ''}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards; 