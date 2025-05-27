import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const trafficData = {
  labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
  datasets: [
    {
      label: 'Lượt truy cập',
      data: [1200, 1500, 1800, 2000, 1700, 2100, 2500],
      borderColor: '#0288d1',
      backgroundColor: 'rgba(2,136,209,0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#0288d1',
      pointBorderColor: '#fff',
      pointRadius: 6,
    },
  ],
};

const TrafficDetails: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        <TrendingUpIcon sx={{ mr: 1, fontSize: 36, color: '#0288d1' }} /> Lượt truy cập
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4, bgcolor: '#e3f2fd' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>Biểu đồ lượt truy cập 7 ngày gần nhất</Typography>
            <Line data={trafficData} options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
              responsive: true,
              maintainAspectRatio: false,
            }} height={260} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ color: '#388e3c' }}>Tổng kết</Typography>
            <Box sx={{ fontSize: 32, fontWeight: 'bold', color: '#0288d1', mb: 1 }}>12,800 lượt</Box>
            <Chip label="+8% so với tuần trước" color="success" sx={{ fontWeight: 'bold', mb: 2 }} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">Ngày cao nhất: <b>Chủ nhật</b> (2,500 lượt)</Typography>
            <Typography variant="body1">Ngày thấp nhất: <b>Thứ 2</b> (1,200 lượt)</Typography>
            <Typography variant="body1">Tỉ lệ chuyển đổi: <b>3.2%</b></Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: '#fffde7' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#fbc02d' }}>Chi tiết lượt truy cập theo ngày</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ngày</TableCell>
                <TableCell>Lượt truy cập</TableCell>
                <TableCell>Tỉ lệ chuyển đổi</TableCell>
                <TableCell>Thiết bị phổ biến</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trafficData.labels.map((day, idx) => (
                <TableRow key={day}>
                  <TableCell>{day}</TableCell>
                  <TableCell sx={{ color: '#0288d1', fontWeight: 'bold' }}>{trafficData.datasets[0].data[idx]}</TableCell>
                  <TableCell>{[2.8, 3.0, 3.1, 3.3, 3.0, 3.5, 3.6][idx]}%</TableCell>
                  <TableCell>
                    <Chip label={idx % 2 === 0 ? 'Mobile' : 'Desktop'} color={idx % 2 === 0 ? 'info' : 'primary'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TrafficDetails; 