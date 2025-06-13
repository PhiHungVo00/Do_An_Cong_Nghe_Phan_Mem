import React from 'react';
import { Box, Card, Container, Typography, Grid, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
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

const RevenueDetails: React.FC = () => {
  const revenueData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu (triệu VNĐ)',
        data: [1800, 2200, 1900, 2800, 2000, 2400, 2600, 2300, 2700, 3000, 2800, 3200],
        borderColor: '#6C63FF',
        backgroundColor: 'rgba(108, 99, 255, 0.1)',
        fill: true,
      }
    ]
  };

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

  const topProducts = [
    { name: 'Sản phẩm A', revenue: 520000000 },
    { name: 'Sản phẩm B', revenue: 480000000 },
    { name: 'Sản phẩm C', revenue: 350000000 },
    { name: 'Sản phẩm D', revenue: 280000000 },
    { name: 'Sản phẩm E', revenue: 250000000 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Chi tiết doanh thu
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Line options={options} data={revenueData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Top 5 sản phẩm doanh thu cao nhất
            </Typography>
            <Box sx={{ mt: 2 }}>
              {topProducts.map((product, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < topProducts.length - 1 ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <Typography variant="body1">{product.name}</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.revenue)}
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
                    3.200.000.000 ₫
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">So với tháng trước</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                    +14.3%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Số đơn hàng</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    428
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">Giá trị trung bình/đơn</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    7.476.635 ₫
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