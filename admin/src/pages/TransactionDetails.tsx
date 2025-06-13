import React from 'react';
import {
  Box,
  Card,
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
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

const TransactionDetails: React.FC = () => {
  const transactionData = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    datasets: [
      {
        label: 'Số giao dịch',
        data: [12, 15, 10, 14, 16, 13, 18, 11, 15, 12, 14, 16, 13, 17, 15],
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
        text: 'Biểu đồ giao dịch theo ngày'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const transactions = [
    {
      id: 'TX001',
      date: '2024-03-15',
      customer: 'Nguyễn Văn A',
      amount: 2500000,
      status: 'completed',
      items: 3,
    },
    {
      id: 'TX002',
      date: '2024-03-15',
      customer: 'Trần Thị B',
      amount: 1800000,
      status: 'completed',
      items: 2,
    },
    {
      id: 'TX003',
      date: '2024-03-15',
      customer: 'Lê Văn C',
      amount: 3200000,
      status: 'pending',
      items: 4,
    },
    {
      id: 'TX004',
      date: '2024-03-14',
      customer: 'Phạm Thị D',
      amount: 950000,
      status: 'completed',
      items: 1,
    },
    {
      id: 'TX005',
      date: '2024-03-14',
      customer: 'Hoàng Văn E',
      amount: 4200000,
      status: 'cancelled',
      items: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: '#4caf50', label: 'Hoàn thành' };
      case 'pending':
        return { color: '#ff9800', label: 'Đang xử lý' };
      case 'cancelled':
        return { color: '#f44336', label: 'Đã hủy' };
      default:
        return { color: '#9e9e9e', label: 'Không xác định' };
    }
  };

  const stats = [
    { label: 'Tổng giao dịch', value: '428' },
    { label: 'Giao dịch thành công', value: '389' },
    { label: 'Đang xử lý', value: '28' },
    { label: 'Đã hủy', value: '11' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
        Chi tiết giao dịch
      </Typography>
      
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Line options={options} data={transactionData} />
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Giao dịch gần đây
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã GD</TableCell>
                    <TableCell>Ngày</TableCell>
                    <TableCell>Khách hàng</TableCell>
                    <TableCell align="right">Số SP</TableCell>
                    <TableCell align="right">Giá trị</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell align="right">{transaction.items}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusColor(transaction.status).label}
                          sx={{
                            backgroundColor: `${getStatusColor(transaction.status).color}20`,
                            color: getStatusColor(transaction.status).color,
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TransactionDetails; 