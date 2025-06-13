import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Security,
  Loop,
} from '@mui/icons-material';

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  reviews: Review[];
  relatedProducts: {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // TODO: Thay thế bằng API call thực tế
        const mockProduct: Product = {
          id: productId || '',
          name: 'Nồi cơm điện thông minh',
          price: 2490000,
          images: Array.from({ length: 4 }, (_, i) => `https://picsum.photos/800/800?random=${i}`),
          description: `
            - Công nghệ nấu 3D với 6 cảm biến nhiệt
            - Dung tích 1.8L, phù hợp cho gia đình 4-6 người
            - Lòng nồi phủ ceramic chống dính
            - 12 chế độ nấu thông minh
            - Hẹn giờ nấu và giữ ấm tới 24 giờ
            - Thiết kế hiện đại, sang trọng
          `,
          specifications: {
            'Thương hiệu': 'Philips',
            'Xuất xứ': 'Nhật Bản',
            'Dung tích': '1.8L',
            'Công suất': '860W',
            'Chất liệu': 'Thép không gỉ, Ceramic',
            'Bảo hành': '24 tháng',
          },
          rating: 4.5,
          reviewCount: 128,
          stock: 45,
          brand: 'Philips',
          reviews: Array.from({ length: 5 }, (_, i) => ({
            id: `review-${i}`,
            userId: `user-${i}`,
            userName: `Người dùng ${i + 1}`,
            userAvatar: `https://i.pravatar.cc/40?img=${i}`,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: 'Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh, đóng gói cẩn thận.',
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            helpful: Math.floor(Math.random() * 50),
          })),
          relatedProducts: Array.from({ length: 4 }, (_, i) => ({
            id: `related-${i}`,
            name: `Sản phẩm liên quan ${i + 1}`,
            price: Math.floor(Math.random() * 2000000) + 500000,
            image: `https://picsum.photos/400/400?random=${i + 10}`,
            rating: Math.floor(Math.random() * 5) + 1,
          })),
        };
        setProduct(mockProduct);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    setSnackbar({
      open: true,
      message: 'Đã thêm sản phẩm vào giỏ hàng',
      severity: 'success',
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={product.images[selectedImage]}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                mb: 2,
              }}
            />
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              {isFavorite ? (
                <Favorite color="error" />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
          </Box>
          <Grid container spacing={1}>
            {product.images.map((image, index) => (
              <Grid item xs={3} key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: index === selectedImage ? '2px solid primary.main' : 'none',
                  }}
                  onClick={() => setSelectedImage(index)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({product.reviewCount} đánh giá)
            </Typography>
          </Box>
          <Typography variant="h4" color="primary" gutterBottom>
            {product.price.toLocaleString()}đ
          </Typography>
          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Số lượng:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                size="small"
                sx={{ width: 100 }}
              />
              <Typography variant="body2" sx={{ ml: 2 }}>
                Còn {product.stock} sản phẩm
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              fullWidth
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Chia sẻ
            </Button>
          </Box>

          <Grid container spacing={2}>
            {[
              { icon: <LocalShipping />, text: 'Giao hàng miễn phí' },
              { icon: <Security />, text: 'Bảo hành 24 tháng' },
              { icon: <Loop />, text: 'Đổi trả trong 30 ngày' },
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  {item.icon}
                  <Typography variant="body2">{item.text}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              aria-label="product tabs"
            >
              <Tab label="Thông số kỹ thuật" />
              <Tab label="Đánh giá" />
              <Tab label="Sản phẩm liên quan" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <List>
              {Object.entries(product.specifications).map(([key, value]) => (
                <ListItem key={key} divider>
                  <ListItemText
                    primary={key}
                    secondary={value}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              {product.reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar src={review.userAvatar} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{review.userName}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="body2" paragraph>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              {product.relatedProducts.map((relatedProduct) => (
                <Grid item xs={12} sm={6} md={3} key={relatedProduct.id}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={relatedProduct.image}
                      alt={relatedProduct.name}
                    />
                    <CardContent>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="h3"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {relatedProduct.name}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {relatedProduct.price.toLocaleString()}đ
                      </Typography>
                      <Rating value={relatedProduct.rating} readOnly size="small" />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 