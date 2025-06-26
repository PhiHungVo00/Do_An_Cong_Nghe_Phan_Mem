import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  InputBase,
  IconButton,
  Badge,
  Card,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Kitchen,
  Weekend,
  KingBed,
  Bathtub,
  ElectricalServices,
  SmartToy,
  ArrowForward,
  NavigateBefore,
  NavigateNext,
  Search as SearchIcon,
  LocalOffer,
  Favorite,
  History,
  ShoppingCart as CartIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  TrendingUp,
  Star,
  LocationOn,
  KeyboardArrowDown,
  MyLocation,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel';
import CategoryCard from '../components/home/CategoryCard';
import ProductCard from '../components/home/ProductCard';
import DeliveryAddressBar from '../components/home/DeliveryAddressBar';
import { styled } from '@mui/material/styles';
import ChallengeCard from '../components/home/ChallengeCard';
import EventCard from '../components/home/EventCard';
import { Images } from '../assets/index';
import { productAPI, salesEventAPI, challengeAPI } from '../services/api';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import Skeleton from '@mui/material/Skeleton';

const StyledCarousel = styled(Carousel)(({ theme }) => ({
  '& .MuiIconButton-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: 'black',
    borderRadius: '50%',
    margin: 0,
    padding: '12px',
    opacity: 0.7,
    transition: 'all 0.3s ease',
    '&:hover': {
      opacity: 1,
      backgroundColor: 'white',
    }
  },
  '& .MuiPaginationItem-root': {
    color: 'rgba(255, 255, 255, 0.6)',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: 'white',
    }
  }
}));

const StyledProductCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>(localStorage.getItem('deliveryAddress') || 'Chưa có địa chỉ');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [addressDetails, setAddressDetails] = useState({
    streetNumber: '',
    streetName: '',
    ward: '',
    district: '',
    city: '',
  });
  
  // State cho dữ liệu từ API
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<any[]>([]);
  const [salesEvents, setSalesEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Thêm state cho địa chỉ giao hàng
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [tempAddress, setTempAddress] = useState(deliveryAddress);

  // Thêm state cho thử thách
  const [challenges, setChallenges] = useState<any[]>([]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter(id => id !== productId);
      } else {
        updated = [...prev, productId];
      }
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddToCart = (productId: string) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleJoinChallenge = (challengeId: string) => {
    // TODO: Implement join challenge functionality
    console.log('Join challenge:', challengeId);
  };

  const handleRegisterEvent = (eventId: string) => {
    // TODO: Implement register event functionality
    console.log('Register event:', eventId);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderProductCard = (product: any) => (
    <ProductCard
      id={product._id}
      name={product.name}
      image={
        product.images?.[0]?.startsWith('/assets/')
          ? `http://localhost:5000${product.images[0]}`
          : (product.images?.[0] || product.image || '/placeholder-product.jpg')
      }
      price={product.price}
      rating={product.rating}
      reviews={product.reviewCount || product.reviews || 0}
      discount={product.discount}
      isFavorite={favorites.includes(product._id)}
      onToggleFavorite={() => handleToggleFavorite(product._id)}
      onAddToCart={() => handleAddToCart(product._id)}
    />
  );

  const handleOpenAddressDialog = () => {
    setTempAddress(deliveryAddress);
    setOpenAddressDialog(true);
  };
  const handleCloseAddressDialog = () => setOpenAddressDialog(false);
  const handleSaveAddress = () => {
    const fullAddress = `${addressDetails.streetNumber} ${addressDetails.streetName}, ${addressDetails.ward}, ${addressDetails.district}, ${addressDetails.city}`;
    setDeliveryAddress(fullAddress);
    localStorage.setItem('deliveryAddress', fullAddress);
    setOpenAddressDialog(false);
    // Reset form
    setAddressDetails({
      streetNumber: '',
      streetName: '',
      ward: '',
      district: '',
      city: '',
    });
  };

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data from API...');
        
        const [featured, events] = await Promise.all([
          productAPI.getFeatured(),
          salesEventAPI.getAll()
        ]);
        
        console.log('Featured products:', featured);
        console.log('Sales events:', events);
        
        // Extract products from API response
        const featuredProductsData = Array.isArray(featured) ? featured : (featured?.data || featured?.products || []);
        const salesEventsData = Array.isArray(events) ? events : (events?.data || events?.events || []);
        
        setFeaturedProducts(featuredProductsData);
        setSalesEvents(salesEventsData);
        
        // Lấy sản phẩm bán chạy và đang sale
        const [bestSellersData, onSaleData] = await Promise.all([
          productAPI.getAll({ sortBy: 'soldCount', sortOrder: 'desc', limit: 4 }),
          productAPI.getAll({ sortBy: 'discount', sortOrder: 'desc', limit: 4 })
        ]);
        
        console.log('Best sellers:', bestSellersData);
        console.log('On sale products:', onSaleData);
        
        // Extract products from API response
        const bestSellersProducts = Array.isArray(bestSellersData) ? bestSellersData : (bestSellersData?.data || bestSellersData?.products || []);
        const onSaleProductsData = Array.isArray(onSaleData) ? onSaleData : (onSaleData?.data || onSaleData?.products || []);
        
        setBestSellers(bestSellersProducts);
        setOnSaleProducts(onSaleProductsData);
        
        // Lấy thử thách
        const challengeRes = await challengeAPI.getAll();
        const challengeData = Array.isArray(challengeRes) ? challengeRes : (challengeRes?.challenges || []);
        setChallenges(challengeData);
        
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data cho banner
  const bannerItems = [
    {
      image: Images.thietbinhabep,
      title: 'Siêu Sale Thiết Bị Nhà Bếp',
      description: 'Giảm đến 50% cho các sản phẩm cao cấp',
      link: '/promotion/kitchen-sale',
      bgColor: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
    },
    {
      image: Images.smarthome,
      title: 'Nhà Thông Minh',
      description: 'Điều khiển từ xa - Tiện lợi tối đa',
      link: '/category/smart-home',
      bgColor: 'linear-gradient(45deg, #4ECDC4, #556270)',
    },
    {
      image: Images.uudaigiadung,
      title: 'Ưu Đãi Điện Gia Dụng',
      description: 'Thanh toán qua ví SmartPay - Giảm thêm 15%',
      link: '/promotion/appliance-sale',
      bgColor: 'linear-gradient(45deg, #6C63FF, #3F3D56)',
    },
  ];

  // Mock data cho danh mục
  const categories = [
    { id: 'kitchen', name: 'Nhà Bếp', image: Images.kitchen, icon: <Kitchen fontSize="large" /> },
    { id: 'livingroom', name: 'Phòng Khách', image: Images.livingroom, icon: <Weekend fontSize="large" /> },
    { id: 'bedroom', name: 'Phòng Ngủ', image: Images.bedroom, icon: <KingBed fontSize="large" /> },
    { id: 'bathroom', name: 'Phòng Tắm', image: Images.bathroom, icon: <Bathtub fontSize="large" /> },
    { id: 'appliance', name: 'Điện Gia Dụng', image: Images.appliance, icon: <ElectricalServices fontSize="large" /> },
    { id: 'smart', name: 'Đồ Dùng Thông Minh', image: Images.smart, icon: <SmartToy fontSize="large" /> },
  ];

  // Mock data cho sản phẩm đã xem
  const recentlyViewed = [
    {
      id: 9,
      name: 'Máy Lọc Nước RO',
      image: Images.maylocnuoc,
      price: 8990000,
      rating: 4.7,
      reviews: 234,
      discount: 15,
    },
    {
      id: 10,
      name: 'Bếp Từ Đôi',
      image: Images.beptu,
      price: 3990000,
      rating: 4.8,
      reviews: 189,
      discount: 20,
    },
    {
      id: 11,
      name: 'Máy Hút Mùi',
      image: Images.mayhutmui,
      price: 2990000,
      rating: 4.6,
      reviews: 156,
      discount: 10,
    },
    {
      id: 12,
      name: 'Máy Rửa Bát',
      image: Images.mayruabat,
      price: 15900000,
      rating: 4.9,
      reviews: 89,
      discount: 25,
    },
  ];

  const features = [
    {
      icon: <ShippingIcon fontSize="large" />,
      title: 'Miễn phí vận chuyển',
      description: 'Cho đơn hàng từ 500.000đ',
    },
    {
      icon: <SecurityIcon fontSize="large" />,
      title: 'Thanh toán an toàn',
      description: 'Bảo mật thông tin',
    },
    {
      icon: <SupportIcon fontSize="large" />,
      title: 'Hỗ trợ 24/7',
      description: 'Tư vấn nhiệt tình',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Grid container spacing={3}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2, mb: 2 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rounded" width="100%" height={36} sx={{ mt: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  // Render sản phẩm yêu thích
  const allProducts = [...featuredProducts, ...bestSellers, ...onSaleProducts];
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p._id, p])).values());

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Thanh địa chỉ giao hàng */}
        <DeliveryAddressBar address={deliveryAddress} onChangeAddress={handleOpenAddressDialog} />

        <Dialog open={openAddressDialog} onClose={handleCloseAddressDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            Cập nhật địa chỉ giao hàng
            <IconButton
              aria-label="close"
              onClick={handleCloseAddressDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Số nhà"
                    value={addressDetails.streetNumber}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, streetNumber: e.target.value }))}
                    placeholder="Ví dụ: 123"
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Tên đường"
                    value={addressDetails.streetName}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, streetName: e.target.value }))}
                    placeholder="Ví dụ: Đường Nguyễn Văn Linh"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phường/Xã"
                    value={addressDetails.ward}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, ward: e.target.value }))}
                    placeholder="Ví dụ: Phường Tân Thuận Tây"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Quận/Huyện"
                    value={addressDetails.district}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, district: e.target.value }))}
                    placeholder="Ví dụ: Quận 7"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tỉnh/Thành phố"
                    value={addressDetails.city}
                    onChange={(e) => setAddressDetails(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Ví dụ: TP. Hồ Chí Minh"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Hoặc tìm kiếm trên bản đồ:
              </Typography>

              <TextField
                fullWidth
                placeholder="Tìm kiếm địa chỉ trên bản đồ..."
                value={tempAddress}
                onChange={(e) => setTempAddress(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddressDialog}>Hủy</Button>
            <Button 
              onClick={handleSaveAddress} 
              variant="contained"
              disabled={!addressDetails.streetNumber || !addressDetails.streetName || !addressDetails.ward || !addressDetails.district || !addressDetails.city}
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

      {/* Thanh tìm kiếm */}
      <Container maxWidth="lg" sx={{ my: 2 }}>
        <Paper
          component="form"
          onSubmit={handleSearch}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>

      {/* Banner Carousel */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        <StyledCarousel
          autoPlay
          animation="slide"
          duration={500}
          interval={5000}
          indicators={true}
          navButtonsAlwaysVisible={true}
          NextIcon={<NavigateNext sx={{ fontSize: 28 }} />}
          PrevIcon={<NavigateBefore sx={{ fontSize: 28 }} />}
          sx={{ maxWidth: 1100, mx: 'auto', borderRadius: 3, boxShadow: 2 }}
        >
          {bannerItems.map((item, i) => (
            <Paper
              key={i}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: 2,
                minHeight: { xs: 200, sm: 280, md: 340 },
                maxHeight: { xs: 240, sm: 320, md: 400 },
              }}
              onClick={() => navigate(item.link)}
            >
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: item.bgColor,
                    opacity: 0.15,
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: '100%',
                    height: { xs: 200, sm: 280, md: 340 },
                    objectFit: 'cover',
                    borderRadius: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.03)',
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  color: 'white',
                  p: { xs: 2, sm: 3 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    maxWidth: '700px',
                    opacity: 0.85,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.15)',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Paper>
          ))}
        </StyledCarousel>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        {/* Features */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Sản phẩm bán chạy */}
        <Box sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              <Badge badgeContent="HOT" color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.8rem' } }}>
                Sản Phẩm Bán Chạy
              </Badge>
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/best-sellers')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
              {(bestSellers || []).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sản phẩm đang sale */}
        <Box sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              <LocalOffer color="error" />
              Flash Sale
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/sale')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
              {(onSaleProducts || []).map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product._id}>
                  {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Danh mục sản phẩm */}
        <Box sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              Danh Mục Sản Phẩm
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/products')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Box 
                  onClick={() => navigate(`/products/${category.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <CategoryCard {...category} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ mb: 8 }} />

        {/* Sản phẩm đã xem gần đây */}
        <Box sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              <History />
              Sản Phẩm Đã Xem
            </Typography>
          </Box>
          <Grid container spacing={3}>
              {(recentlyViewed || []).map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                  {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Sản phẩm yêu thích */}
        <Box sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              <Favorite color="error" />
              Sản Phẩm Yêu Thích
            </Typography>
          </Box>
          {favorites.length > 0 ? (
            <Grid container spacing={3}>
              {uniqueProducts
                .filter((product: any) => favorites.includes(product._id))
                .map((product: any) => (
                  <Grid item xs={12} sm={6} md={3} key={product._id}>
                    {renderProductCard(product)}
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Favorite sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                Bạn chưa có sản phẩm yêu thích nào
              </Typography>
              <Typography>
                Hãy thêm sản phẩm vào danh sách yêu thích để xem lại sau
              </Typography>
            </Box>
          )}
        </Box>

        {/* Challenges Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              Thử thách
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/challenges')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
            {challenges.map((challenge) => (
              <Grid item xs={12} sm={6} md={3} key={challenge._id}>
                <EventCard
                  {...challenge}
                  type="challenge"
                  buttonText="Tham gia ngay"
                  onClick={() => handleJoinChallenge(challenge._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* Events Section */}
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              px: { xs: 2, md: 0 }
            }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '2rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 60,
                  height: 4,
                  backgroundColor: 'primary.main',
                  borderRadius: 2,
                }
              }}
            >
              Sự kiện
            </Typography>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate('/events')}
              sx={{ 
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'white',
                }
              }}
            >
              Xem tất cả
            </Button>
          </Box>
          <Grid container spacing={3}>
              {(salesEvents || []).map((event) => (
                <Grid item xs={12} sm={6} md={3} key={event._id}>
                <EventCard
                  {...event}
                  type="event"
                  buttonText="Đăng ký tham gia"
                    onClick={() => handleRegisterEvent(event._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </Box>
  );
};

export default Home; 