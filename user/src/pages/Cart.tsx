import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Breadcrumbs,
  Link,
  Divider,
  Alert,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  NavigateNext,
  ShoppingCart,
  LocalShipping,
  Payment,
  Receipt,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../services/api';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    enqueueSnackbar('Đã xóa sản phẩm khỏi giỏ hàng', {
      variant: 'success',
      autoHideDuration: 3000,
    });
  };

  const handleCheckout = async () => {
    if (!shippingAddress || !paymentMethod) {
      enqueueSnackbar('Vui lòng điền đầy đủ thông tin', {
        variant: 'error',
      });
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        items: cartItems.map(item => ({
          productId: String(item.id),
          productName: item.name,
          quantity: item.quantity,
          price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
          image: item.image || '',
          brand: item.brand || ''
        })),
        shippingAddress,
        paymentMethod,
        totalAmount: getCartTotal()
      };

      await orderAPI.create(orderData);
      
      clearCart();
    setIsCheckoutDialogOpen(false);
    enqueueSnackbar('Đặt hàng thành công!', {
      variant: 'success',
    });
    navigate('/order-history');
    } catch (error) {
      enqueueSnackbar('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', {
        variant: 'error',
      });
      console.error('Error placing order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountedPrice = (item: any) => {
    return item.discount ? item.price * (1 - item.discount / 100) : item.price;
  };

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
        <Typography color="text.primary">Giỏ hàng</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <ShoppingCart sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Giỏ hàng
      </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Hãy khám phá các sản phẩm của chúng tôi và thêm vào giỏ hàng
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            startIcon={<ArrowForward />}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Paper elevation={2}>
              <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                      <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                      <TableCell align="right">Thành tiền</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {cartItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Card sx={{ width: 80, height: 80 }}>
                              <CardMedia
                            component="img"
                                height="80"
                                image={item.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.name}
                                sx={{ objectFit: 'cover' }}
                          />
                            </Card>
                          <Box>
                              <Typography variant="subtitle1" fontWeight={600}>
                                {item.name}
                              </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.brand}
                            </Typography>
                              {item.discount && item.discount > 0 && (
                                <Chip
                                  label={`-${item.discount}%`}
                                  color="error"
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                          {item.discount && item.discount > 0 ? (
                            <Box>
                            <Typography
                              variant="body2"
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                                {formatPrice(item.price)}
                              </Typography>
                              <Typography variant="body1" color="error" fontWeight="bold">
                                {formatPrice(getDiscountedPrice(item))}
                            </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body1" fontWeight="bold">
                              {formatPrice(item.price)}
                            </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              sx={{ 
                                border: 1, 
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'action.hover' }
                              }}
                          >
                            <RemoveIcon />
                          </IconButton>
                            <Typography sx={{ mx: 2, minWidth: 30, textAlign: 'center' }}>
                              {item.quantity}
                            </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= (item.stock || 99)}
                              sx={{ 
                                border: 1, 
                                borderColor: 'divider',
                                '&:hover': { backgroundColor: 'action.hover' }
                              }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold" color="primary">
                            {formatPrice(getDiscountedPrice(item) * item.quantity)}
                          </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFromCart(item.id)}
                            sx={{ 
                              border: 1, 
                              borderColor: 'error.main',
                              '&:hover': { backgroundColor: 'error.light' }
                            }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                Tổng đơn hàng
              </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography variant="body1">Tạm tính</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">{formatPrice(getCartTotal())}</Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">Phí vận chuyển</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">
                      {getCartTotal() >= 500000 ? 'Miễn phí' : formatPrice(30000)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6" fontWeight={700}>
                      Tổng cộng
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {formatPrice(getCartTotal() + (getCartTotal() >= 500000 ? 0 : 30000))}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setIsCheckoutDialogOpen(true)}
                disabled={cartItems.length === 0}
                sx={{ py: 1.5, mb: 2 }}
              >
                Tiến hành thanh toán
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/products')}
                startIcon={<ArrowForward />}
              >
                Tiếp tục mua sắm
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Checkout Dialog */}
      <Dialog
        open={isCheckoutDialogOpen}
        onClose={() => setIsCheckoutDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Payment sx={{ mr: 1, color: 'primary.main' }} />
            Thông tin thanh toán
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Địa chỉ giao hàng"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            multiline
            rows={3}
              sx={{ mb: 3 }}
              placeholder="Nhập địa chỉ giao hàng chi tiết..."
          />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Phương thức thanh toán"
            >
              <MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
                <MenuItem value="bank">Chuyển khoản ngân hàng</MenuItem>
              <MenuItem value="momo">Ví MoMo</MenuItem>
                <MenuItem value="vnpay">VNPay</MenuItem>
            </Select>
          </FormControl>

            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Lưu ý:</strong> Đơn hàng sẽ được xử lý trong vòng 24-48 giờ làm việc.
              </Typography>
            </Alert>

            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Tổng đơn hàng: {formatPrice(getCartTotal() + (getCartTotal() >= 500000 ? 0 : 30000))}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCheckoutDialogOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleCheckout}
            variant="contained"
            disabled={loading || !shippingAddress || !paymentMethod}
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 