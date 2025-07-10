import React, { useState, useEffect } from 'react';
import { Box, Card, Container, Typography, Grid, Paper, CircularProgress, Alert, Button, ButtonGroup } from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueData {
  monthlyData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }>;
  };
  topProducts: Array<{
    _id: string;
    totalRevenue: number;
    totalQuantity: number;
  }>;
  stats: {
    currentMonthRevenue: number;
    revenueChange: number;
    orderCount: number;
    avgOrderValue: number;
  };
}

const RevenueDetails: React.FC = () => {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('year');

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem chi tiết doanh thu');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/analytics/revenue-details?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu doanh thu'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu doanh thu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [period]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Biểu đồ doanh thu theo tháng'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">
          Không có dữ liệu doanh thu
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Chi tiết doanh thu
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            variant={period === 'month' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('month')}
          >
            Tháng
          </Button>
          <Button 
            variant={period === 'quarter' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('quarter')}
          >
            Quý
          </Button>
          <Button 
            variant={period === 'year' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('year')}
          >
            Năm
          </Button>
        </ButtonGroup>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Line options={options} data={data.monthlyData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Top 5 sản phẩm doanh thu cao nhất
            </Typography>
            <Box sx={{ mt: 2 }}>
              {data.topProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < data.topProducts.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <Typography variant="body1">{product._id}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.totalRevenue)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Thống kê nhanh
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Doanh thu tháng này</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.stats.currentMonthRevenue)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">So với tháng trước</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: data.stats.revenueChange >= 0 ? '#4caf50' : '#f44336' }}>
                    {data.stats.revenueChange >= 0 ? '+' : ''}{data.stats.revenueChange.toFixed(1)}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Số đơn hàng</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {data.stats.orderCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Giá trị trung bình/đơn</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.stats.avgOrderValue)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RevenueDetails; 