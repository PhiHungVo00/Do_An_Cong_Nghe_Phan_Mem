import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Assignment,
  LocalShipping,
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  AccessTime,
  AttachMoney,
  ShoppingCart,
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
  estimatedDelivery?: string;
}

const OrdersAvailable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingOrder, setAcceptingOrder] = useState<string | null>(null);
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shipperApi.getAvailableOrders();
      setOrders(response.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAcceptingOrder(orderId);
      await shipperApi.acceptOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể nhận đơn hàng');
    } finally {
      setAcceptingOrder(null);
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

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
  };

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
          Đơn hàng chờ nhận
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Quản lý và nhận các đơn hàng đang chờ giao
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
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
                    {stats.total}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Tổng đơn hàng
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
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
                    {stats.pending}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đang chờ
                  </Typography>
                </Box>
                <LocalShipping sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
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
                    {stats.accepted}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đã nhận
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 48, opacity: 0.8 }} />
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
          <Assignment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            Không có đơn hàng nào
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hiện tại không có đơn hàng nào đang chờ nhận
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
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      #{order.orderNumber}
                    </Typography>
                    <Chip
                      label="Chờ nhận"
                      color="warning"
                      size="small"
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AccessTime sx={{ fontSize: 20, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {order.createdAt ? formatDate(order.createdAt) : 'Không có ngày'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Action Button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleAcceptOrder(order._id)}
                    disabled={acceptingOrder === order._id}
                    sx={{
                      py: 1.5,
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                      },
                    }}
                  >
                    {acceptingOrder === order._id ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Nhận đơn hàng'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OrdersAvailable; 