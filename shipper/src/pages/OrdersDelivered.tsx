import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  AccessTime,
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  CalendarToday,
  Star,
} from '@mui/icons-material';
import { shipperApi } from '../api/shipperApi';

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  deliveredAt: string;
  deliveryTime?: number; // in minutes
  rating?: number;
}

const OrdersDelivered: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shipperApi.getDeliveredOrders();
      setOrders(response.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgDeliveryTime = orders.reduce((sum, order) => sum + (order.deliveryTime || 0), 0) / totalOrders;
    const avgRating = orders.reduce((sum, order) => sum + (order.rating || 0), 0) / totalOrders;

    return {
      totalOrders,
      totalRevenue,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      avgRating: Math.round(avgRating * 10) / 10,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
          Đơn hàng đã giao
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Lịch sử giao hàng và thống kê hiệu suất
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.totalOrders}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đơn đã giao
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Tổng doanh thu
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.avgDeliveryTime}m
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Thời gian TB
                  </Typography>
                </Box>
                <CalendarToday sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.avgRating}/5
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đánh giá TB
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
          }}
        >
          <CheckCircle sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            Chưa có đơn hàng nào
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Bạn chưa có đơn hàng nào đã giao thành công
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Order Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      #{order.orderNumber}
                    </Typography>
                    <Chip
                      label="Đã giao"
                      color="success"
                      size="small"
                      icon={<CheckCircle />}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Customer Info */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Person sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.customer.name}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {order.customer.phone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mr: 1, mt: 0.2 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary', flex: 1 }}>
                        {order.customer.address}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Order Details */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ShoppingCart sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.items.length} sản phẩm
                      </Typography>
                    </Box>
                    {/* Danh sách sản phẩm */}
                    <Box sx={{ ml: 3, mb: 1 }}>
                      {order.items.map((item, idx) => {
                        const name = (item as any).product?.name ?? (item as any).name ?? 'Không rõ tên';
                        const price = (item as any).product?.price ?? (item as any).price ?? 0;
                        return (
                          <Typography key={idx} variant="body2" sx={{ color: 'text.secondary' }}>
                            - {name} x {item.quantity} ({formatCurrency(price)})
                          </Typography>
                        );
                      })}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AttachMoney sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Giao: {order.deliveredAt ? formatDate(order.deliveredAt) : 'Không có ngày'}
                      </Typography>
                    </Box>
                    {order.deliveryTime && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarToday sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Thời gian: {formatDuration(order.deliveryTime)}
                        </Typography>
                      </Box>
                    )}
                    {order.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ fontSize: 20, color: 'warning.main', mr: 1 }} />
                        <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                          {order.rating}/5 sao
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrdersDelivered; 