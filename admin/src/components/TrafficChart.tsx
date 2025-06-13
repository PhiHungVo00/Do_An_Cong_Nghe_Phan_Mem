import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';
import { Bar } from 'react-chartjs-2';
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

const trafficData = {
  labels: ['Google', 'Shopify', 'Facebook'],
  datasets: [
    {
      label: 'Traffic',
      data: [17, 17, 17],
      backgroundColor: ['#6C63FF', '#FFB300', '#00BFA6'],
      borderRadius: 8,
      barThickness: 24,
    },
  ],
};

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

const percentLabels = [
  { color: '#6C63FF', border: '#6C63FF', top: 22 },
  { color: '#FFB300', border: '#FFB300', top: 72 },
  { color: '#00BFA6', border: '#00BFA6', top: 122 },
];

const TrafficChart: React.FC = () => {
  const [tab, setTab] = useState('week');
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
          onChange={(_, v) => v && setTab(v)}
          size="small"
          sx={{ bgcolor: '#F6F8FB', borderRadius: 3, mb: 2, p: 0.5, minWidth: 220 }}
        >
          <ToggleButton value="week" sx={{ textTransform: 'none', fontWeight: 600, px: 4, border: 0, borderRadius: 2, color: tab === 'week' ? '#6C63FF' : '#222', bgcolor: tab === 'week' ? '#fff' : 'transparent', boxShadow: tab === 'week' ? 1 : 0 }}>Tuần</ToggleButton>
          <ToggleButton value="month" sx={{ textTransform: 'none', fontWeight: 600, px: 4, border: 0, borderRadius: 2, color: tab === 'month' ? '#6C63FF' : '#222', bgcolor: tab === 'month' ? '#fff' : 'transparent', boxShadow: tab === 'month' ? 1 : 0 }}>Tháng</ToggleButton>
        </ToggleButtonGroup>
        <Box sx={{ position: 'relative', height: 180, mt: 1 }}>
          <Bar data={trafficData} options={options} height={120} />
          {/* Custom labels on bars */}
          {percentLabels.map((label, idx) => (
            <Box key={idx} sx={{ position: 'absolute', left: { xs: 180, md: 240 }, top: label.top, bgcolor: '#fff', border: `2px solid ${label.border}`, color: label.color, borderRadius: 2, px: 1.5, py: 0.2, fontWeight: 700, fontSize: 14, minWidth: 44, textAlign: 'center', boxShadow: 1 }}>
              17%
            </Box>
          ))}
        </Box>
        <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, bgcolor: '#6C63FF', borderRadius: '50%' }} /> <Typography variant="caption">Google</Typography></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, bgcolor: '#FFB300', borderRadius: '50%' }} /> <Typography variant="caption">Shopify</Typography></Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 12, height: 12, bgcolor: '#00BFA6', borderRadius: '50%' }} /> <Typography variant="caption">Facebook</Typography></Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TrafficChart; 