import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  customersWithOrders: number;
  inactiveCustomers: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPurchases: number;
  lastPurchaseDate: string;
  type: string;
  isActive: boolean;
  createdAt: string;
}

const CustomerStats: React.FC = () => {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [vipCustomers, setVipCustomers] = useState<Customer[]>([]);
  const [newCustomers, setNewCustomers] = useState<Customer[]>([]);
  const [inactiveCustomers, setInactiveCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'vip' | 'new' | 'inactive'>('stats');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem thống kê khách hàng');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Fetch stats
      const statsResponse = await axios.get('http://localhost:5000/api/customers/stats', { headers });
      setStats(statsResponse.data);

      // Fetch VIP customers
      const vipResponse = await axios.get('http://localhost:5000/api/customers/vip?limit=5', { headers });
      setVipCustomers(vipResponse.data);

      // Fetch new customers
      const newResponse = await axios.get('http://localhost:5000/api/customers/new?limit=5', { headers });
      setNewCustomers(newResponse.data);

      // Fetch inactive customers
      const inactiveResponse = await axios.get('http://localhost:5000/api/customers/inactive?days=30', { headers });
      setInactiveCustomers(inactiveResponse.data);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải thống kê khách hàng'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải thống kê khách hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert severity="info">
        Không có dữ liệu thống kê khách hàng
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h5" component="h2" display="flex" alignItems="center">
          <PeopleIcon sx={{ mr: 1 }} />
          Thống Kê Khách Hàng
        </Typography>
        <Box>
          <Tooltip title="Làm mới dữ liệu">
            <IconButton onClick={fetchData} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Tab Navigation */}
      <Box mb={3}>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant={activeTab === 'stats' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('stats')}
            startIcon={<PeopleIcon />}
          >
            Tổng quan
          </Button>
          <Button
            variant={activeTab === 'vip' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('vip')}
            startIcon={<StarIcon />}
          >
            Khách VIP
          </Button>
          <Button
            variant={activeTab === 'new' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('new')}
            startIcon={<PersonAddIcon />}
          >
            Khách mới
          </Button>
          <Button
            variant={activeTab === 'inactive' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('inactive')}
            startIcon={<WarningIcon />}
          >
            Không hoạt động
          </Button>
        </Box>
      </Box>

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <>
          <Grid container spacing={3}>
            {/* Tổng khách hàng */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng khách hàng
                      </Typography>
                      <Typography variant="h4" component="div">
                        {stats.totalCustomers}
                      </Typography>
                    </Box>
                    <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Khách hàng hoạt động */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Đang hoạt động
                      </Typography>
                      <Typography variant="h4" component="div" color="success.main">
                        {stats.activeCustomers}
                      </Typography>
                    </Box>
                    <TrendingUpIcon color="success" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Khách hàng mới tháng này */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Mới tháng này
                      </Typography>
                      <Typography variant="h4" component="div" color="info.main">
                        {stats.newCustomersThisMonth}
                      </Typography>
                    </Box>
                    <PersonAddIcon color="info" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Khách hàng có đơn hàng */}
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Có đơn hàng
                      </Typography>
                      <Typography variant="h4" component="div" color="warning.main">
                        {stats.customersWithOrders}
                      </Typography>
                    </Box>
                    <StarIcon color="warning" sx={{ fontSize: 40 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Thông tin bổ sung */}
          <Box mt={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tỷ lệ khách hàng
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Chip
                    label={`${((stats.activeCustomers / stats.totalCustomers) * 100).toFixed(1)}% Đang hoạt động`}
                    color="success"
                    variant="outlined"
                  />
                  <Chip
                    label={`${((stats.newCustomersThisMonth / stats.totalCustomers) * 100).toFixed(1)}% Mới tháng này`}
                    color="info"
                    variant="outlined"
                  />
                  <Chip
                    label={`${((stats.customersWithOrders / stats.totalCustomers) * 100).toFixed(1)}% Có đơn hàng`}
                    color="warning"
                    variant="outlined"
                  />
                  <Chip
                    label={`${((stats.inactiveCustomers / stats.totalCustomers) * 100).toFixed(1)}% Không hoạt động`}
                    color="error"
                    variant="outlined"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}

      {/* VIP Customers Tab */}
      {activeTab === 'vip' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <StarIcon sx={{ mr: 1 }} />
              Khách Hàng VIP (Mua nhiều nhất)
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số đơn hàng</TableCell>
                    <TableCell>Mua hàng cuối</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vipCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.totalPurchases} 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatDate(customer.lastPurchaseDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.isActive ? 'Hoạt động' : 'Không hoạt động'} 
                          color={customer.isActive ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* New Customers Tab */}
      {activeTab === 'new' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <PersonAddIcon sx={{ mr: 1 }} />
              Khách Hàng Mới
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ngày tham gia</TableCell>
                    <TableCell>Số đơn hàng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {newCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{formatDate(customer.createdAt)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.totalPurchases} 
                          color="info" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.isActive ? 'Hoạt động' : 'Không hoạt động'} 
                          color={customer.isActive ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Inactive Customers Tab */}
      {activeTab === 'inactive' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <WarningIcon sx={{ mr: 1 }} />
              Khách Hàng Không Hoạt Động (30+ ngày)
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Mua hàng cuối</TableCell>
                    <TableCell>Tổng đơn hàng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inactiveCustomers.map((customer) => (
                    <TableRow key={customer._id}>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{formatDate(customer.lastPurchaseDate)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.totalPurchases} 
                          color="warning" 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.isActive ? 'Hoạt động' : 'Không hoạt động'} 
                          color={customer.isActive ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Cảnh báo */}
      {stats.inactiveCustomers > 0 && (
        <Box mt={3}>
          <Alert severity="warning">
            <Typography variant="body2">
              Có {stats.inactiveCustomers} khách hàng không hoạt động trong 30 ngày qua. 
              Vui lòng liên hệ để kích hoạt lại.
            </Typography>
          </Alert>
        </Box>
      )}
    </Box>
  );
};

export default CustomerStats; 