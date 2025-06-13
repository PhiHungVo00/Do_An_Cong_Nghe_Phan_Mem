import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import { Delete, Share } from '@mui/icons-material';
import { Cart as CartType } from '../../types';

interface PersonalCartProps {
  cart: CartType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveProduct: (productId: string) => void;
  onShareCart: () => void;
  onApplyCoupon: (code: string) => Promise<number>;
}

const PersonalCart: React.FC<PersonalCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveProduct,
  onShareCart,
  onApplyCoupon,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cart.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const total = discount
    ? subtotal * (1 - discount / 100)
    : subtotal;

  const handleApplyCoupon = async () => {
    try {
      const discountPercent = await onApplyCoupon(couponCode);
      setDiscount(discountPercent);
      setError(null);
    } catch (err) {
      setError('Mã giảm giá không hợp lệ');
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {cart.name}
          </Typography>
          <IconButton onClick={onShareCart}>
            <Share />
          </IconButton>
        </Box>

        <Grid container spacing={2}>
          {cart.products.map((product) => (
            <Grid item xs={12} key={product.id}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price.toLocaleString('vi-VN')}đ
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <TextField
                      type="number"
                      size="small"
                      value={product.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          onUpdateQuantity(product.id, value);
                        }
                      }}
                      sx={{ width: 80 }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => onRemoveProduct(product.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="subtitle1">
                  {(product.price * product.quantity).toLocaleString('vi-VN')}đ
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="outlined"
            onClick={handleApplyCoupon}
            disabled={!couponCode}
          >
            Áp dụng
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Tạm tính:</Typography>
            <Typography>{subtotal.toLocaleString('vi-VN')}đ</Typography>
          </Box>
          {discount && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Giảm giá:</Typography>
              <Typography color="error">
                -{discount}% (-{(subtotal * discount / 100).toLocaleString('vi-VN')}đ)
              </Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Tổng cộng:</Typography>
            <Typography variant="h6" color="primary">
              {total.toLocaleString('vi-VN')}đ
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonalCart; 