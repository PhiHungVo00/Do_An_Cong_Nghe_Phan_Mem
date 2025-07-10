import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  Alert,
  Button,
  ButtonGroup,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

interface TransactionData {
  transactionData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }>;
  };
  recentTransactions: Array<{
    _id: string;
    orderNumber: string;
    date: string;
    customer: string;
    totalAmount: number;
    status: string;
    items: Array<{
      productName: string;
      quantity: number;
      price: number;
    }>;
  }>;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

const TransactionDetails: React.FC = () => {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  const fetchTransactionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem chi tiết giao dịch');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/analytics/transaction-details?period=${period}`, {
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
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu giao dịch'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu giao dịch');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, [period]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã giao hàng':
      case 'Đã hoàn thành':
        return { color: '#4caf50', label: 'Hoàn thành' };
      case 'Đang xử lý':
        return { color: '#ff9800', label: 'Đang xử lý' };
      case 'Đã hủy':
        return { color: '#f44336', label: 'Đã hủy' };
      default:
        return { color: '#9e9e9e', label: 'Không xác định' };
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
          Không có dữ liệu giao dịch
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          Chi tiết giao dịch
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            variant={period === 'week' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('week')}
          >
            Tuần
          </Button>
          <Button 
            variant={period === 'month' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('month')}
          >
            Tháng
          </Button>
          <Button 
            variant={period === 'year' ? 'contained' : 'outlined'}
            onClick={() => setPeriod('year')}
          >
            Năm
          </Button>
        </ButtonGroup>
      </Box>
      
      <Grid container spacing={3}>
        {data.stats.map((stat, index) => (
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
            <Line options={options} data={data.transactionData} />
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
                  {data.recentTransactions.map((transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>{transaction.orderNumber}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>{transaction.customer}</TableCell>
                      <TableCell align="right">{transaction.items.length}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(transaction.totalAmount)}
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