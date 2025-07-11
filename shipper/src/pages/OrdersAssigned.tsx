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
  LinearProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocalShipping,
  CheckCircle,
  Person,
  Phone,
  LocationOn,
  AccessTime,
  AttachMoney,
  ShoppingCart,
  DirectionsCar,
  DeliveryDining,
  Warning,
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
  deliveryStatus?: 'picked_up' | 'in_transit' | 'delivered';
}

const OrdersAssigned: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; orderId: string | null }>({
    open: false,
    orderId: null,
  });
  const theme = useTheme();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await shipperApi.getAssignedOrders();
      // Chỉ hiển thị đơn hàng chưa giao (không phải 'delivered')
      const activeOrders = (response.orders || []).filter((order: any) => 
        order.deliveryStatus !== 'delivered' && order.status !== 'Đã giao hàng'
      );
      setOrders(activeOrders);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrder(orderId);
      await shipperApi.updateOrderStatus(orderId, status);
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, deliveryStatus: status as any }
          : order
      ));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!confirmDialog.orderId) return;
    
    try {
      setUpdatingOrder(confirmDialog.orderId);
      await shipperApi.confirmDelivery(confirmDialog.orderId);
      // Xóa đơn hàng khỏi danh sách sau khi xác nhận giao hàng
      setOrders(orders.filter(order => order._id !== confirmDialog.orderId));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Không thể xác nhận giao hàng');
    } finally {
      setUpdatingOrder(null);
      setConfirmDialog({ open: false, orderId: null });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return 'warning';
      case 'in_transit': return 'info';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'picked_up': return 'Đã nhận hàng';
      case 'in_transit': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      default: return 'Chờ xử lý';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'picked_up': return <DirectionsCar />;
      case 'in_transit': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      default: return <Warning />;
    }
  };

  const stats = {
    total: orders.length,
    pickedUp: orders.filter(o => o.deliveryStatus === 'picked_up').length,
    inTransit: orders.filter(o => o.deliveryStatus === 'in_transit').length,
    delivered: orders.filter(o => o.deliveryStatus === 'delivered').length,
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
          Đơn hàng đang giao
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Quản lý và theo dõi các đơn hàng đang được giao
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                    {stats.total}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Tổng đơn hàng
                  </Typography>
                </Box>
                <LocalShipping sx={{ fontSize: 48, opacity: 0.8 }} />
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
                    {stats.pickedUp}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đã nhận hàng
                  </Typography>
                </Box>
                <DirectionsCar sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
              color: 'white',
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {stats.inTransit}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đang giao
                  </Typography>
                </Box>
                <DeliveryDining sx={{ fontSize: 48, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

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
                    {stats.delivered}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Đã giao
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
          <LocalShipping sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
            Không có đơn hàng nào
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Hiện tại không có đơn hàng nào đang được giao
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
                      label={getStatusLabel(order.deliveryStatus || 'pending')}
                      color={getStatusColor(order.deliveryStatus || 'pending')}
                      size="small"
                      icon={getStatusIcon(order.deliveryStatus || 'pending')}
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

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    {!order.deliveryStatus && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleUpdateStatus(order._id, 'picked_up')}
                        disabled={updatingOrder === order._id}
                        sx={{
                          py: 1,
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
                          },
                        }}
                      >
                        {updatingOrder === order._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          'Đã nhận hàng'
                        )}
                      </Button>
                    )}

                    {order.deliveryStatus === 'picked_up' && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleUpdateStatus(order._id, 'in_transit')}
                        disabled={updatingOrder === order._id}
                        sx={{
                          py: 1,
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0097A7 0%, #00695C 100%)',
                          },
                        }}
                      >
                        {updatingOrder === order._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          'Bắt đầu giao'
                        )}
                      </Button>
                    )}

                    {order.deliveryStatus === 'in_transit' && (
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => setConfirmDialog({ open: true, orderId: order._id })}
                        disabled={updatingOrder === order._id}
                        sx={{
                          py: 1,
                          fontWeight: 600,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #388E3C 0%, #2E7D32 100%)',
                          },
                        }}
                      >
                        {updatingOrder === order._id ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          'Xác nhận giao hàng'
                        )}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, orderId: null })}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          Xác nhận giao hàng
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xác nhận đã giao hàng thành công cho đơn hàng này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, orderId: null })}
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelivery}
            variant="contained"
            color="success"
            disabled={updatingOrder === confirmDialog.orderId}
          >
            {updatingOrder === confirmDialog.orderId ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Xác nhận'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrdersAssigned; 