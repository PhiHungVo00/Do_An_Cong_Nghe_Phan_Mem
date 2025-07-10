import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup, Stack, CircularProgress, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TrafficData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
  }>;
}

const options = {
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
  },
  scales: {
    x: { beginAtZero: true, max: 25, grid: { color: '#F0F0F0' }, display: false },
    y: { grid: { display: false }, ticks: { font: { size: 15 }, color: '#222' } },
  },
  maintainAspectRatio: false,
};

const TrafficChart: React.FC = () => {
  const [tab, setTab] = useState('week');
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem dữ liệu lưu lượng');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/analytics/traffic?period=${tab}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTrafficData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu lưu lượng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu lưu lượng');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
  }, [tab]);

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, newTab: string | null) => {
    if (newTab !== null) {
      setTab(newTab);
    }
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0 }}>
        <CardContent sx={{ pb: '16px!important', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 180 }}>
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

  if (!trafficData) {
    return (
      <Alert severity="info">
        Không có dữ liệu lưu lượng
      </Alert>
    );
  }

  const chartData = {
    labels: trafficData.labels,
    datasets: [
      {
        label: 'Traffic',
        data: trafficData.datasets[0].data,
        backgroundColor: trafficData.datasets[0].backgroundColor,
        borderRadius: 8,
        barThickness: 24,
      },
    ],
  };

  const percentLabels = trafficData.labels.map((label, index) => ({
    color: trafficData.datasets[0].backgroundColor[index],
    border: trafficData.datasets[0].backgroundColor[index],
    top: 22 + (index * 50),
    percentage: trafficData.datasets[0].data[index]
  }));

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0 }}>
      <CardContent sx={{ pb: '16px!important', pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Lưu lượng
          </Typography>
          <Box sx={{ color: '#bbb', fontSize: 22, fontWeight: 700, cursor: 'pointer' }}>...</Box>
        </Box>
        <ToggleButtonGroup
          value={tab}
          exclusive
          onChange={handleTabChange}
          size="small"
          sx={{ bgcolor: '#F6F8FB', borderRadius: 3, mb: 2, p: 0.5, minWidth: 220 }}
        >
          <ToggleButton value="week" sx={{ textTransform: 'none', fontWeight: 600, px: 4, border: 0, borderRadius: 2, color: tab === 'week' ? '#6C63FF' : '#222', bgcolor: tab === 'week' ? '#fff' : 'transparent', boxShadow: tab === 'week' ? 1 : 0 }}>Tuần</ToggleButton>
          <ToggleButton value="month" sx={{ textTransform: 'none', fontWeight: 600, px: 4, border: 0, borderRadius: 2, color: tab === 'month' ? '#6C63FF' : '#222', bgcolor: tab === 'month' ? '#fff' : 'transparent', boxShadow: tab === 'month' ? 1 : 0 }}>Tháng</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ position: 'relative', height: 180, mt: 1 }}>
          <Bar data={chartData} options={options} height={120} />
          {/* Custom labels on bars */}
          {percentLabels.map((label, idx) => (
            <Box key={idx} sx={{ position: 'absolute', left: { xs: 180, md: 240 }, top: label.top, bgcolor: '#fff', border: `2px solid ${label.border}`, color: label.color, borderRadius: 2, px: 1.5, py: 0.2, fontWeight: 700, fontSize: 14, minWidth: 44, textAlign: 'center', boxShadow: 1 }}>
              {label.percentage}%
            </Box>
          ))}
        </Box>
        <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          {trafficData.labels.map((label, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: trafficData.datasets[0].backgroundColor[index], borderRadius: '50%' }} /> 
              <Typography variant="caption">{label}</Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrafficChart; 