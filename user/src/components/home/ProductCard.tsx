import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  discount?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  rating,
  reviews,
  discount,
  isFavorite = false,
  onToggleFavorite,
  onAddToCart,
}) => {
  const navigate = useNavigate();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Discount badge */}
      {discount && discount > 0 && (
        <Chip
          label={`-${discount}%`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1,
          }}
        />
      )}

      {/* Favorite button */}
      <IconButton
        onClick={onToggleFavorite}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'background.paper',
          '&:hover': {
            bgcolor: 'background.paper',
          },
        }}
      >
        {isFavorite ? (
          <Favorite color="error" />
        ) : (
          <FavoriteBorder />
        )}
      </IconButton>

      {/* Product image */}
      <CardMedia
        component="img"
        image={image}
        alt={name}
        sx={{
          pt: '75%',
          cursor: 'pointer',
        }}
        onClick={() => navigate(`/product/${id}`)}
      />

      {/* Product details */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
            mb: 1,
            cursor: 'pointer',
            '&:hover': {
              color: 'primary.main',
            },
          }}
          onClick={() => navigate(`/product/${id}`)}
        >
          {name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.5} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({reviews})
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
            {formatPrice(price * (1 - (discount || 0) / 100))}
          </Typography>
          {discount && discount > 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {formatPrice(price)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={onAddToCart}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Thêm vào giỏ
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 