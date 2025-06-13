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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';
import { CartItem } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, placeOrder } = useCart();
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

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

  const handleCheckout = () => {
    if (!shippingAddress || !paymentMethod) {
      enqueueSnackbar('Vui lòng điền đầy đủ thông tin', {
        variant: 'error',
      });
      return;
    }

    placeOrder(shippingAddress, paymentMethod);
    setIsCheckoutDialogOpen(false);
    enqueueSnackbar('Đặt hàng thành công!', {
      variant: 'success',
    });
    navigate('/order-history');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Giỏ hàng
      </Typography>

      {cartItems.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Giỏ hàng của bạn đang trống
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Tiếp tục mua sắm
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">Giá</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="right">Tổng</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item: CartItem) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.name}
                            sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.brand}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {item.discount ? (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              {formatCurrency(item.price)}
                            </Typography>
                            <Typography variant="body1" color="error">
                              {formatCurrency(item.price * (1 - item.discount / 100))}
                            </Typography>
                          </>
                        ) : (
                          formatCurrency(item.price)
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(
                          item.quantity *
                            (item.discount
                              ? item.price * (1 - item.discount / 100)
                              : item.price)
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tổng đơn hàng
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="subtitle1">Tạm tính</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1">{formatCurrency(getCartTotal())}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setIsCheckoutDialogOpen(true)}
                sx={{ mt: 2 }}
              >
                Tiến hành thanh toán
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/products')}
                sx={{ mt: 2 }}
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
        <DialogTitle>Thông tin thanh toán</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Địa chỉ giao hàng"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            multiline
            rows={3}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Phương thức thanh toán</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              label="Phương thức thanh toán"
            >
              <MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
              <MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
              <MenuItem value="credit_card">Thẻ tín dụng/Ghi nợ</MenuItem>
              <MenuItem value="momo">Ví MoMo</MenuItem>
              <MenuItem value="zalopay">ZaloPay</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCheckoutDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCheckout}>
            Xác nhận đặt hàng
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Cart; 