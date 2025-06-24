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
  CircularProgress,
  Chip,
  Breadcrumbs,
  Link,
  Paper,
  Badge,
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
  Star,
  NavigateNext,
  Add,
  Remove,
} from '@mui/icons-material';
import { productAPI, reviewAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useSnackbar } from 'notistack';

interface Review {
  _id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
  category: string;
  discount?: number;
  soldCount?: number;
  reviews: Review[];
  relatedProducts?: any[];
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
  const { addToCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product details
        const productData = await productAPI.getById(productId);
        setProduct(productData.data);
        
        // Fetch reviews
        setReviewsLoading(true);
        const reviewsData = await reviewAPI.getProductReviews(productId);
        setReviews(reviewsData.data || []);
        
        // Fetch related products
        const relatedData = await productAPI.getAll({
          category: productData.data.category,
          limit: 4
        });
        setRelatedProducts(relatedData.data || []);
        
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
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

  const handleQuantityIncrement = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: parseInt(product._id) || 0,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        brand: product.brand,
        discount: product.discount,
        rating: product.rating || 0,
        reviews: product.reviewCount || 0,
        category: product.category || '',
        description: product.description || '',
        stock: product.stock || 0
      }, quantity);
      enqueueSnackbar(`Đã thêm ${product.name} vào giỏ hàng`, {
        variant: 'success',
    });
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
      await navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
      } else {
        // Fallback for browsers that don't support Web Share API
        navigator.clipboard.writeText(window.location.href);
        enqueueSnackbar('Đã sao chép link sản phẩm', {
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Không tìm thấy sản phẩm'}
        </Alert>
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
        <Link color="inherit" href="/products" underline="hover">
          Sản phẩm
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <Paper 
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2
              }}
            >
              <img
                src={product.images[selectedImage] || '/placeholder-product.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                }}
              />
              {product.discount && product.discount > 0 && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}
                />
              )}
            </Paper>
            
            {/* Thumbnail images */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {product.images.map((image, index) => (
                <Paper
                  key={index}
                  elevation={selectedImage === index ? 4 : 1}
                  sx={{
                    cursor: 'pointer',
                    border: selectedImage === index ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                    }}
                />
                </Paper>
            ))}
            </Box>
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            {product.name}
          </Typography>
            
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.1} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount} đánh giá)
            </Typography>
          </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
              {product.originalPrice && product.originalPrice > product.price && (
                <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
          </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary" paragraph>
            {product.description}
          </Typography>
            </Box>

            {/* Quantity selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1" fontWeight={600}>
              Số lượng:
            </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <IconButton 
                  onClick={handleQuantityDecrement}
                  disabled={quantity <= 1}
                  size="small"
                >
                  <Remove />
                </IconButton>
              <TextField
                value={quantity}
                onChange={handleQuantityChange}
                  type="number"
                  size="small"
                  sx={{ 
                    width: 80,
                    '& .MuiOutlinedInput-root': {
                      border: 'none',
                      '& fieldset': { border: 'none' },
                    }
                  }}
                inputProps={{ min: 1, max: product.stock }}
                />
                <IconButton 
                  onClick={handleQuantityIncrement}
                  disabled={quantity >= product.stock}
                size="small"
                >
                  <Add />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product.stock} sản phẩm có sẵn
              </Typography>
          </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ flex: 1, py: 1.5 }}
            >
                {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
            </Button>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ 
                  border: 1, 
                  borderColor: 'divider',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
              </IconButton>
              <IconButton
              onClick={handleShare}
                sx={{ 
                  border: 1, 
                  borderColor: 'divider',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <Share />
              </IconButton>
            </Box>

            {/* Product features */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">Miễn phí vận chuyển cho đơn hàng từ 500.000đ</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Security sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">Bảo hành chính hãng {product.specifications?.['Bảo hành'] || '12 tháng'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Loop sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">Đổi trả trong 30 ngày</Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Product Tabs */}
      <Box sx={{ mt: 6 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label="Mô tả" />
          <Tab label="Thông số kỹ thuật" />
          <Tab label={`Đánh giá (${product.reviewCount})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" whiteSpace="pre-line">
            {product.description}
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            {Object.entries(product.specifications || {}).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">{key}:</Typography>
                  <Typography variant="body2" fontWeight={600}>{value}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {/* Form viết đánh giá */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Viết đánh giá của bạn</Typography>
            <Rating
              value={reviewRating}
              onChange={(_, newValue) => setReviewRating(newValue)}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              label="Nhận xét"
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            {reviewError && (
              <Typography color="error" sx={{ mt: 1 }}>{reviewError}</Typography>
            )}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              disabled={!reviewRating || !reviewComment || reviewSubmitting}
              onClick={async () => {
                setReviewSubmitting(true);
                setReviewError(null);
                try {
                  await reviewAPI.create({
                    productId: product._id,
                    rating: reviewRating as number,
                    comment: reviewComment,
                  });
                  setReviewRating(null);
                  setReviewComment('');
                  // Reload reviews
                  const reviewsData = await reviewAPI.getProductReviews(product._id);
                  setReviews(reviewsData.data || []);
                } catch (err: any) {
                  setReviewError(err.message || 'Gửi đánh giá thất bại');
                } finally {
                  setReviewSubmitting(false);
                }
              }}
            >
              Gửi đánh giá
            </Button>
          </Box>
          {reviewsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
          </Box>
          ) : reviews.length > 0 ? (
            <List>
              {reviews.map((review) => (
                <ListItem key={review._id} alignItems="flex-start" sx={{ px: 0 }}>
                  <Avatar src={review.userAvatar} sx={{ mr: 2 }}>
                    {review.userName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {review.userName}
                      </Typography>
                      <Rating value={review.rating} size="small" readOnly sx={{ ml: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {formatDate(review.createdAt)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary">
                      {review.comment}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                Chưa có đánh giá nào cho sản phẩm này
              </Typography>
            </Box>
          )}
          </TabPanel>
      </Box>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
            Sản phẩm liên quan
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((relatedProduct) => (
              <Grid item xs={12} sm={6} md={3} key={relatedProduct._id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                    }}
                  onClick={() => navigate(`/product/${relatedProduct._id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                    image={relatedProduct.images?.[0] || '/placeholder-product.jpg'}
                      alt={relatedProduct.name}
                    />
                    <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                    }}>
                        {relatedProduct.name}
                      </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={relatedProduct.rating || 0} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({relatedProduct.reviewCount || 0})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatPrice(relatedProduct.price)}
                    </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
        </Box>
      )}
    </Container>
  );
};

export default ProductDetail; 