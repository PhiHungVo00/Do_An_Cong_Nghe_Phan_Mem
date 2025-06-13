import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
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

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Dữ liệu mẫu cho biểu đồ
  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        label: 'Doanh thu',
        data: [12000000, 19000000, 15000000, 25000000, 22000000, 30000000, 28000000, 32000000, 35000000, 40000000, 38000000, 45000000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Số lượng đơn hàng',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 55, 60, 65],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tổng quan doanh thu và đơn hàng',
      },
    },
  };

  const handleGenerateReport = () => {
    // Xử lý tạo báo cáo
    console.log('Tạo báo cáo:', { reportType, startDate, endDate });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Báo cáo
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Loại báo cáo</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Loại báo cáo"
                >
                  <MenuItem value="sales">Báo cáo doanh thu</MenuItem>
                  <MenuItem value="products">Báo cáo sản phẩm</MenuItem>
                  <MenuItem value="customers">Báo cáo khách hàng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Từ ngày"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Đến ngày"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerateReport}
                sx={{ height: '100%' }}
              >
                Xem báo cáo
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Line data={chartData} options={chartOptions} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports; 