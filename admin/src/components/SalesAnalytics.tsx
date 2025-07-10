import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
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
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface SalesData {
  labels: string[];
  revenue: number[];
  orders: number[];
  totalRevenue: number;
  totalOrders: number;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#222',
      titleColor: '#fff',
      bodyColor: '#FFD600',
      borderColor: '#6C63FF',
      borderWidth: 2,
      titleFont: { weight: 'bold' as const, size: 16, family: 'Montserrat' },
      bodyFont: { weight: 'bold' as const, size: 18, family: 'Montserrat' },
      callbacks: {
        title: (ctx: any) => `Thời gian: ${ctx[0].label}`,
        label: (ctx: any) => `Doanh thu: ${ctx.parsed.y.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
      },
      displayColors: false,
      padding: 16,
      caretSize: 8,
      cornerRadius: 12,
      boxPadding: 8,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      shadowBlur: 8,
      shadowColor: 'rgba(108,99,255,0.2)'
    },
  },
  animation: {
    duration: 1200,
    easing: 'easeInOutQuart' as const,
  },
  elements: {
    line: {
      borderWidth: 4,
      borderJoinStyle: 'round' as const,
      borderCapStyle: 'round' as const,
      tension: 0.5,
      fill: true,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowBlur: 12,
      shadowColor: 'rgba(108,99,255,0.15)'
    },
    point: {
      radius: 6,
      backgroundColor: '#fff',
      borderColor: '#6C63FF',
      borderWidth: 3,
      hoverRadius: 10,
      hoverBorderWidth: 4,
      hoverBackgroundColor: '#FFD600',
      hoverBorderColor: '#6C63FF',
      pointStyle: 'circle' as const,
      shadowOffsetX: 0,
      shadowOffsetY: 2,
      shadowBlur: 8,
      shadowColor: 'rgba(108,99,255,0.2)'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#ECECFF', borderDash: [6, 6] },
      ticks: {
        callback: (v: string | number) => `${Number(v).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
        color: '#6C63FF',
        font: { size: 16, family: 'Montserrat', weight: 'bold' as const },
        padding: 8,
      },
      border: { color: '#6C63FF', width: 2 },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#6C63FF', font: { size: 16, family: 'Montserrat', weight: 'bold' as const }, padding: 8 },
      border: { color: '#6C63FF', width: 2 },
    },
  },
};

const SalesAnalytics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem phân tích doanh số');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/analytics/sales?period=${period}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSalesData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu doanh số'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu doanh số');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [period]);

  const chartData = salesData ? {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Doanh thu',
        data: salesData.revenue,
        borderColor: '#6C63FF',
        backgroundColor: (ctx: any) => {
          const ctx2 = ctx.chart.ctx;
          const gradient = ctx2.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(108,99,255,0.15)');
          gradient.addColorStop(1, 'rgba(108,99,255,0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  } : {
    labels: [],
    datasets: []
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 5, boxShadow: 3, mb: 3, p: 0, bgcolor: '#fff' }}>
        <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ borderRadius: 5, boxShadow: 3, mb: 3, p: 0, bgcolor: '#fff' }}>
      <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 22 }}>
            Phân tích doanh số
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant={period === 'week' ? 'contained' : 'outlined'}
              onClick={() => setPeriod('week')}
              size="small"
            >
              Tuần
            </Button>
            <Button 
              variant={period === 'month' ? 'contained' : 'outlined'}
              onClick={() => setPeriod('month')}
              size="small"
            >
              Tháng
            </Button>
            <Button 
              variant={period === 'year' ? 'contained' : 'outlined'}
              onClick={() => setPeriod('year')}
              size="small"
            >
              Năm
            </Button>
          </Box>
        </Box>
        {salesData && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tổng doanh thu: {salesData.totalRevenue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng đơn hàng: {salesData.totalOrders}
            </Typography>
          </Box>
        )}
        <Box sx={{ height: 240, width: '98%', mt: 1, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {salesData && salesData.labels.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <Typography variant="body2" color="text.secondary">
              Không có dữ liệu doanh số
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesAnalytics; 