import React from 'react';
import { Box, Card, Container, Typography, Grid, Paper } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AccessDetails: React.FC = () => {
  const dailyAccessData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    datasets: [
      {
        label: 'Lượt truy cập',
        data: [45, 52, 38, 41, 56, 48, 54, 42, 47, 38, 42, 44, 46, 49, 53],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
      }
    ]
  };

  const deviceAccessData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        label: 'Lượt truy cập theo thiết bị',
        data: [320, 250, 41],
        backgroundColor: [
          'rgba(108, 99, 255, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Lượt truy cập theo ngày'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Phân bố thiết bị truy cập'
      }
    }
  };

  const accessStats = [
    { label: 'Tổng lượt truy cập', value: '611' },
    { label: 'Trung bình/ngày', value: '45' },
    { label: 'Thời gian TB/phiên', value: '5m 32s' },
    { label: 'Tỷ lệ thoát', value: '35.8%' },
  ];

  const pageStats = [
    { page: 'Trang chủ', views: 245 },
    { page: 'Sản phẩm', views: 189 },
    { page: 'Giỏ hàng', views: 132 },
    { page: 'Thanh toán', views: 98 },
    { page: 'Tài khoản', views: 76 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Chi tiết lượt truy cập
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Line options={lineOptions} data={dailyAccessData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Thống kê truy cập
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {accessStats.map((stat, index) => (
                <Grid item xs={6} key={index}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {stat.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {stat.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Bar options={barOptions} data={deviceAccessData} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Trang được xem nhiều nhất
            </Typography>
            <Box sx={{ mt: 2 }}>
              {pageStats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < pageStats.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <Typography variant="body1">{stat.page}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {stat.views} lượt xem
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccessDetails; 