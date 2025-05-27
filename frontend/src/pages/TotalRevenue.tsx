import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const revenueData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
  datasets: [
    {
      label: 'Doanh thu (triệu VND)',
      data: [120, 150, 180, 200, 170, 210],
      backgroundColor: [
        '#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'
      ],
      borderRadius: 8,
    },
  ],
};

const TotalRevenue: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        <MonetizationOnIcon sx={{ mr: 1, fontSize: 36, color: '#fbc02d' }} /> Tổng doanh thu
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4, bgcolor: '#fffde7' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>Biểu đồ doanh thu 6 tháng gần nhất</Typography>
            <Bar data={revenueData} options={{
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
              responsive: true,
              maintainAspectRatio: false,
            }} height={260} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ color: '#388e3c' }}>Tổng kết</Typography>
            <Box sx={{ fontSize: 32, fontWeight: 'bold', color: '#d32f2f', mb: 1 }}>1,030,000,000 VND</Box>
            <Chip label="+12% so với 6 tháng trước" color="success" sx={{ fontWeight: 'bold', mb: 2 }} />
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">Doanh thu cao nhất: <b>Tháng 6</b> (210 triệu VND)</Typography>
            <Typography variant="body1">Doanh thu thấp nhất: <b>Tháng 1</b> (120 triệu VND)</Typography>
            <Typography variant="body1">Số đơn hàng: <b>2,350</b></Typography>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, bgcolor: '#e3f2fd' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#0288d1' }}>Chi tiết doanh thu theo tháng</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tháng</TableCell>
                <TableCell>Doanh thu (triệu VND)</TableCell>
                <TableCell>Số đơn hàng</TableCell>
                <TableCell>Tăng trưởng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueData.labels.map((month, idx) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  <TableCell sx={{ color: '#d32f2f', fontWeight: 'bold' }}>{revenueData.datasets[0].data[idx]}</TableCell>
                  <TableCell>{[350, 400, 420, 450, 380, 450][idx]}</TableCell>
                  <TableCell>
                    <Chip label={idx % 2 === 0 ? '+5%' : '+2%'} color={idx % 2 === 0 ? 'success' : 'info'} />
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

export default TotalRevenue; 