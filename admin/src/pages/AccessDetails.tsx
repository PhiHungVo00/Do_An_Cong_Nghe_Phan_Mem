import React, { useState, useEffect } from 'react';
import { Box, Card, Container, Typography, Grid, Paper, CircularProgress, Alert } from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
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

interface AccessData {
  dailyAccessData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }>;
  };
  deviceAccessData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
    }>;
  };
  accessStats: Array<{
    label: string;
    value: string;
  }>;
  pageStats: Array<{
    page: string;
    views: number;
  }>;
}

const AccessDetails: React.FC = () => {
  const [data, setData] = useState<AccessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccessData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem chi tiết truy cập');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/analytics/access-details', {
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
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu truy cập'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu truy cập');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccessData();
  }, []);

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
          Không có dữ liệu truy cập
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Chi tiết lượt truy cập
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Line options={lineOptions} data={data.dailyAccessData} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Thống kê truy cập
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {data.accessStats.map((stat, index) => (
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
            <Bar options={barOptions} data={data.deviceAccessData} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Trang được xem nhiều nhất
            </Typography>
            <Box sx={{ mt: 2 }}>
              {data.pageStats.map((stat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 1.5,
                    borderBottom: index < data.pageStats.length - 1 ? '1px solid #e0e0e0' : 'none'
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