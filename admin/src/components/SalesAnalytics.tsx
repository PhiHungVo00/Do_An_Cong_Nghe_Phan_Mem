import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';
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
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  datasets: [
    {
      label: 'Revenue',
      data: [21000, 25000, 22000, 28000, 26000, 30000, 27000, 29000],
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
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      backgroundColor: '#fff',
      titleColor: '#222',
      bodyColor: '#6C63FF',
      borderColor: '#eee',
      borderWidth: 1,
      titleFont: { weight: 'bold' as const, size: 14 },
      bodyFont: { weight: 'bold' as const, size: 16 },
      callbacks: {
        title: (ctx: any) => `Tháng ${ctx[0].label}`,
        label: (ctx: any) => `${ctx.parsed.y.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
      },
      displayColors: false,
      padding: 12,
      caretSize: 6,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: { color: '#F0F0F0', borderDash: [4, 4] },
      ticks: {
        callback: (v: string | number) => `${Number(v).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,
        color: '#888',
        font: { size: 14 },
        stepSize: 5000,
      },
      min: 10000,
      max: 32000,
    },
    x: {
      grid: { display: false },
      ticks: { color: '#888', font: { size: 14 } },
    },
  },
};

const SalesAnalytics: React.FC = () => (
  <Card sx={{ borderRadius: 5, boxShadow: 3, mb: 3, p: 0, bgcolor: '#fff' }}>
    <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 22 }}>
          Phân tích doanh số
        </Typography>
        <Button startIcon={<CalendarMonth />} sx={{ bgcolor: '#F6F8FB', color: '#222', borderRadius: 3, fontWeight: 600, textTransform: 'none', px: 2.5, py: 1, boxShadow: 'none', fontSize: 14, minHeight: 0, minWidth: 0, height: 36 }}>
          Dữ liệu định giá ngày 18.09.2024
        </Button>
      </Box>
      <Box sx={{ height: 240, width: '98%', mt: 1, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </CardContent>
  </Card>
);

export default SalesAnalytics; 