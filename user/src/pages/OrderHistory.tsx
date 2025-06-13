import React from 'react';
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
} from '@mui/material';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
} from '@mui/icons-material';
import { useCart } from '../contexts/CartContext';
import { formatCurrency } from '../utils/format';

const OrderHistory: React.FC = () => {
  const { orderHistory } = useCart();
  const [expandedOrder, setExpandedOrder] = React.useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const handleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Lịch sử đơn hàng
      </Typography>

      {orderHistory.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Bạn chưa có đơn hàng nào
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {orderHistory.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Đơn hàng #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status) as any}
                    />
                    <IconButton
                      onClick={() => handleExpandOrder(order.id.toString())}
                      aria-label="show more"
                    >
                      {expandedOrder === order.id.toString() ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                </Box>

                <Collapse in={expandedOrder === order.id.toString()}>
                  <Divider sx={{ my: 2 }} />

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Sản phẩm</TableCell>
                          <TableCell align="right">Giá</TableCell>
                          <TableCell align="right">Số lượng</TableCell>
                          <TableCell align="right">Tổng</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  component="img"
                                  src={item.image}
                                  alt={item.name}
                                  sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                                />
                                <Box>
                                  <Typography variant="body1">{item.name}</Typography>
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
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                              {formatCurrency(
                                item.quantity *
                                  (item.discount
                                    ? item.price * (1 - item.discount / 100)
                                    : item.price)
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              Tổng cộng
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {formatCurrency(order.total)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Địa chỉ giao hàng:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.shippingAddress}
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Phương thức thanh toán:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.paymentMethod}
                    </Typography>
                  </Box>
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