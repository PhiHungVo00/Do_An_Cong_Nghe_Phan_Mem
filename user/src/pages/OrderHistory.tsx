import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Link,
  Badge,
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  NavigateNext,
  ShoppingBag,
  LocalShipping,
  Payment,
  Receipt,
} from '@mui/icons-material';
import { orderAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  brand?: string;
  sku?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await orderAPI.getUserOrders();
        setOrders(response.data || []);
      } catch (err) {
        setError('Không thể tải lịch sử đơn hàng. Vui lòng thử lại sau.');
        console.error('Error loading orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'chờ xử lý':
        return 'warning';
      case 'processing':
      case 'đang xử lý':
        return 'info';
      case 'shipped':
      case 'đã giao':
        return 'primary';
      case 'delivered':
      case 'đã hoàn thành':
        return 'success';
      case 'cancelled':
      case 'đã hủy':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipped': 'Đã giao',
      'delivered': 'Đã hoàn thành',
      'cancelled': 'Đã hủy',
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'đã thanh toán':
        return 'success';
      case 'pending':
      case 'chờ thanh toán':
        return 'warning';
      case 'failed':
      case 'thất bại':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'paid': 'Đã thanh toán',
      'pending': 'Chờ thanh toán',
      'failed': 'Thất bại',
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link color="inherit" href="/" underline="hover">
          Trang chủ
        </Link>
        <Typography color="text.primary">Lịch sử đơn hàng</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Receipt sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Lịch sử đơn hàng
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Bạn chưa có đơn hàng nào
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Hãy khám phá các sản phẩm của chúng tôi và tạo đơn hàng đầu tiên
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            startIcon={<ShoppingBag />}
          >
            Mua sắm ngay
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order._id}>
              <Paper 
                elevation={2}
                sx={{ 
                  p: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: 4,
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Đơn hàng #{order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt: {formatDate(order.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tổng tiền: {formatPrice(order.totalAmount)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status) as any}
                      variant="outlined"
                    />
                    <Chip
                      label={getPaymentStatusText(order.paymentStatus)}
                      color={getPaymentStatusColor(order.paymentStatus) as any}
                      size="small"
                    />
                    <IconButton
                      onClick={() => handleExpandOrder(order._id)}
                      aria-label="show more"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      {expandedOrder === order._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedOrder === order._id}>
                  <Divider sx={{ my: 3 }} />

                  {/* Order Items */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Chi tiết sản phẩm
                    </Typography>
                    <Grid container spacing={2}>
                      {order.items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ height: '100%' }}>
                            <CardMedia
                              component="img"
                              height="140"
                              image={item.image || '/placeholder-product.jpg'}
                              alt={item.productName}
                            />
                            <CardContent>
                              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                {item.productName}
                              </Typography>
                              {item.brand && (
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Thương hiệu: {item.brand}
                                </Typography>
                              )}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Số lượng: {item.quantity}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {formatPrice(item.price)}
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Order Summary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      Tổng quan đơn hàng
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Địa chỉ giao hàng:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.shippingAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Payment sx={{ mr: 1, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Phương thức thanh toán:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.paymentMethod}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Order Summary Table */}
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Đơn giá</TableCell>
                          <TableCell align="right">Số lượng</TableCell>
                          <TableCell align="right">Thành tiền</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  component="img"
                                  src={item.image || '/placeholder-product.jpg'}
                                  alt={item.productName}
                                  sx={{ 
                                    width: 50, 
                                    height: 50, 
                                    objectFit: 'cover', 
                                    borderRadius: 1 
                                  }}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={600}>
                                    {item.productName}
                                  </Typography>
                                  {item.brand && (
                                    <Typography variant="caption" color="text.secondary">
                                      {item.brand}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              {formatPrice(item.price)}
                            </TableCell>
                            <TableCell align="right">
                              <Badge badgeContent={item.quantity} color="primary">
                                <ShoppingBag />
                              </Badge>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {formatPrice(item.price * item.quantity)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              Tổng cộng
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                              {formatPrice(order.totalAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Collapse>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderHistory; 