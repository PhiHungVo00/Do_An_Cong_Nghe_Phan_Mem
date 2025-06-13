import React, { useState } from 'react';
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
import { products as allProducts, Product } from '../data/products';

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

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('268 Lý Thường Kiệt, Phường 14, Quận 10, Hồ Chí Minh');
  const [favorites, setFavorites] = useState<number[]>([]);
  const featuredProducts = allProducts.filter((product: Product) => product.featured);

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
  // Mock data cho sản phẩm bán chạy
  const bestSellers = [
    {
      id: 1,
      name: 'Máy Lọc Không Khí Samsung',
      image: Images.maylockksamsung,
      price: 4990000,
      rating: 4.8,
      reviews: 356,
      discount: 10,
      soldCount: 1234,
    },
    {
      id: 2,
      name: 'Robot Hút Bụi Thông Minh',
      image: Images.robothutbui,
      price: 7990000,
      rating: 4.7,
      reviews: 245,
      discount: 15,
      soldCount: 987,
    },
    {
      id: 3,
      name: 'Nồi Chiên Không Dầu',
      image: Images.noichienkhongdau,
      price: 2490000,
      rating: 4.9,
      reviews: 567,
      discount: 20,
      soldCount: 2345,
    },
    {
      id: 4,
      name: 'Máy Pha Cà Phê Tự Động',
      image: Images.mayphacaphe,
      price: 5990000,
      rating: 4.6,
      reviews: 189,
      discount: 12,
      soldCount: 876,
    },
  ];

  // Mock data cho sản phẩm đang sale
  const onSaleProducts = [
    {
      id: 5,
      name: 'Smart TV QLED 65"',
      image: Images.smarttv,
      price: 35900000,
      rating: 4.7,
      reviews: 123,
      discount: 30,
    },
    {
      id: 6,
      name: 'Tủ Lạnh Side by Side',
      image: Images.tulanh,
      price: 28900000,
      rating: 4.8,
      reviews: 234,
      discount: 25,
    },
    {
      id: 7,
      name: 'Máy Giặt Cửa Trước',
      image: Images.maygiat,
      price: 12900000,
      rating: 4.6,
      reviews: 178,
      discount: 35,
    },
    {
      id: 8,
      name: 'Lò Vi Sóng Digital',
      image: Images.lovisong,
      price: 3990000,
      rating: 4.5,
      reviews: 156,
      discount: 40,
    },
  ];

  // Mock data cho sản phẩm đã xem
  const recentlyViewed = [
    {
      id: 9,
      name: 'Máy Lọc Nước RO',
      image: Images.maylocnuoc,
      price: 6990000,
      rating: 4.6,
      reviews: 145,
      discount: 10,
    },
    {
      id: 10,
      name: 'Bếp Điện Từ Đôi',
      image: Images.bepdientu,
      price: 8990000,
      rating: 4.7,
      reviews: 167,
      discount: 15,
    },
    {
      id: 11,
      name: 'Máy Rửa Chén',
      image: Images.mayruachen,
      price: 9990000,
      rating: 4.8,
      reviews: 189,
      discount: 20,
    },
    {
      id: 12,
      name: 'Máy Sấy Quần Áo',
      image: Images.maysayquanao,
      price: 11990000,
      rating: 4.5,
      reviews: 134,
      discount: 12,
    },
  ];

  // Mock data cho Challenges
  const challenges = [
    {
      id: '1',
      title: 'Thử thách tiết kiệm mùa hè',
      description: 'Tham gia thử thách mua sắm thông minh với các sản phẩm tiết kiệm điện trong mùa hè này. Cơ hội nhận nhiều phần quà hấp dẫn.',
      image: 'https://source.unsplash.com/800x600/?summer-sale',
      status: 'Đang diễn ra',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-03-31'),
      participants: 1234,
      reward: 'Voucher giảm giá lên đến 2.000.000đ',
    },
    {
      id: '2',
      title: 'Thử thách nhà thông minh',
      description: 'Khám phá và trải nghiệm các sản phẩm smart home. Chia sẻ cách bạn biến ngôi nhà thành không gian sống thông minh.',
      image: 'https://source.unsplash.com/800x600/?smart-home',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      participants: 856,
      reward: 'Bộ sản phẩm smart home trị giá 5.000.000đ',
    },
    {
      id: '3',
      title: 'Thử thách sống xanh',
      description: 'Tham gia thử thách sử dụng các sản phẩm thân thiện với môi trường. Cùng nhau tạo nên một lối sống bền vững.',
      image: 'https://source.unsplash.com/800x600/?eco-friendly',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-15'),
      endDate: new Date('2024-05-15'),
      participants: 567,
      reward: 'Combo sản phẩm eco-friendly trị giá 3.000.000đ',
    },
    {
      id: '4',
      title: 'Đánh giá 5 sao - Nhận quà khủng',
      description: 'Viết đánh giá chi tiết và chất lượng cho 5 sản phẩm bất kỳ. Cơ hội nhận ngay voucher mua sắm giá trị.',
      image: 'https://source.unsplash.com/800x600/?review-rating',
      status: 'Đang diễn ra',
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-03-25'),
      participants: 789,
      reward: 'Voucher mua sắm 1.000.000đ',
    },
    {
      id: '5',
      title: 'Thử thách tiết kiệm nước',
      description: 'Sử dụng các thiết bị thông minh để tiết kiệm nước. Chia sẻ kết quả và nhận giải thưởng hấp dẫn.',
      image: 'https://source.unsplash.com/800x600/?water-saving',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-05'),
      endDate: new Date('2024-05-05'),
      participants: 432,
      reward: 'Máy lọc nước thông minh trị giá 6.000.000đ',
    },
    {
      id: '6',
      title: 'Góc bếp công nghệ',
      description: 'Quay video nấu ăn sử dụng các thiết bị nhà bếp thông minh. Chia sẻ công thức và bí quyết nấu nướng.',
      image: 'https://source.unsplash.com/800x600/?smart-kitchen',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-05-10'),
      participants: 345,
      reward: 'Bộ thiết bị nhà bếp cao cấp trị giá 8.000.000đ',
    },
    {
      id: '7',
      title: 'Thử thách trang trí nhà thông minh',
      description: 'Chia sẻ ý tưởng trang trí nhà với các thiết bị thông minh. Tạo không gian sống hiện đại và tiện nghi.',
      image: 'https://source.unsplash.com/800x600/?smart-decoration',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-20'),
      endDate: new Date('2024-05-20'),
      participants: 278,
      reward: 'Bộ đèn thông minh trị giá 4.000.000đ',
    },
    {
      id: '8',
      title: 'Thử thách an ninh thông minh',
      description: 'Chia sẻ giải pháp bảo vệ ngôi nhà với các thiết bị an ninh thông minh. Xây dựng hệ thống bảo vệ toàn diện.',
      image: 'https://source.unsplash.com/800x600/?smart-security',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31'),
      participants: 423,
      reward: 'Bộ camera an ninh trị giá 7.000.000đ',
    },
  ];

  // Mock data cho Events
  const events = [
    {
      id: '1',
      title: 'Hội chợ công nghệ 2024',
      description: 'Khám phá các xu hướng công nghệ mới nhất và trải nghiệm các sản phẩm độc đáo tại hội chợ công nghệ lớn nhất năm.',
      image: 'https://source.unsplash.com/800x600/?tech-fair',
      status: 'Đang diễn ra',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-20'),
      participants: 2500,
    },
    {
      id: '2',
      title: 'Workshop Smart Living',
      description: 'Tham gia workshop để học hỏi cách tối ưu không gian sống với các giải pháp thông minh từ các chuyên gia hàng đầu.',
      image: 'https://source.unsplash.com/800x600/?smart-living',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-10'),
      endDate: new Date('2024-04-10'),
      participants: 150,
    },
    {
      id: '3',
      title: 'Tech Talk: Tương lai của IoT',
      description: 'Buổi nói chuyện chuyên sâu về xu hướng IoT và cách áp dụng vào cuộc sống hàng ngày với các chuyên gia công nghệ.',
      image: 'https://source.unsplash.com/800x600/?iot-technology',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-20'),
      endDate: new Date('2024-04-20'),
      participants: 300,
    },
    {
      id: '4',
      title: 'Triển lãm nhà thông minh 2024',
      description: 'Tham quan và trải nghiệm không gian sống thông minh với các công nghệ hiện đại nhất. Cơ hội mua sắm với ưu đãi đặc biệt.',
      image: 'https://source.unsplash.com/800x600/?smart-home-expo',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-04-25'),
      endDate: new Date('2024-04-28'),
      participants: 1800,
    },
    {
      id: '5',
      title: 'Workshop: Tối ưu năng lượng trong gia đình',
      description: 'Học hỏi cách sử dụng các thiết bị thông minh để tiết kiệm năng lượng và bảo vệ môi trường.',
      image: 'https://source.unsplash.com/800x600/?energy-saving',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-05-05'),
      endDate: new Date('2024-05-05'),
      participants: 200,
    },
    {
      id: '6',
      title: 'Ngày hội công nghệ cho người cao tuổi',
      description: 'Giới thiệu các sản phẩm công nghệ thân thiện với người cao tuổi. Hướng dẫn sử dụng và tư vấn chọn mua.',
      image: 'https://source.unsplash.com/800x600/?elderly-tech',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-05-15'),
      participants: 250,
    },
    {
      id: '7',
      title: 'Hội thảo An ninh mạng cho Nhà thông minh',
      description: 'Tìm hiểu về các giải pháp bảo mật và bảo vệ thiết bị thông minh trong nhà khỏi các mối đe dọa mạng.',
      image: 'https://source.unsplash.com/800x600/?cybersecurity',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-05-20'),
      endDate: new Date('2024-05-20'),
      participants: 180,
    },
    {
      id: '8',
      title: 'Ngày hội Khởi nghiệp Công nghệ',
      description: 'Gặp gỡ và kết nối với các startup trong lĩnh vực smart home và IoT. Cơ hội đầu tư và hợp tác.',
      image: 'https://source.unsplash.com/800x600/?tech-startup',
      status: 'Sắp diễn ra',
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-06-02'),
      participants: 400,
    },
  ];

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: number) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', productId);
    navigate('/cart');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Join challenge:', challengeId);
    // TODO: Implement challenge join logic
  };

  const handleRegisterEvent = (eventId: string) => {
    console.log('Register event:', eventId);
    // TODO: Implement event registration logic
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Thanh địa chỉ giao hàng */}
      <DeliveryAddressBar address={deliveryAddress} />

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
      <Box sx={{ position: 'relative', mb: 6 }}>
        <StyledCarousel
          autoPlay
          animation="slide"
          duration={500}
          interval={5000}
          indicators={true}
          navButtonsAlwaysVisible={true}
          NextIcon={<NavigateNext sx={{ fontSize: 32 }} />}
          PrevIcon={<NavigateBefore sx={{ fontSize: 32 }} />}
        >
          {bannerItems.map((item, i) => (
            <Paper
              key={i}
              sx={{
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                borderRadius: { xs: 0, md: 2 },
                boxShadow: 3,
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
                    opacity: 0.2,
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
                    height: { xs: '300px', sm: '400px', md: '500px' },
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
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
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                  color: 'white',
                  p: { xs: 3, sm: 4, md: 5 },
                  textAlign: { xs: 'center', md: 'left' },
                }}
              >
                <Typography 
                  variant="h3" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                    maxWidth: '600px',
                    opacity: 0.9,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
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
            {bestSellers.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
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
            {onSaleProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
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
            {recentlyViewed.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <ProductCard
                  {...product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={() => handleToggleFavorite(product.id)}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
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
              {featuredProducts
                .filter((product: Product) => favorites.includes(product.id))
                .map((product: Product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <ProductCard
                      {...product}
                      onAddToCart={() => handleAddToCart(product.id)}
                      onToggleFavorite={() => handleToggleFavorite(product.id)}
                      isFavorite={favorites.includes(product.id)}
                    />
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
              <Grid item xs={12} sm={6} md={3} key={challenge.id}>
                <EventCard
                  {...challenge}
                  type="challenge"
                  buttonText="Tham gia ngay"
                  onClick={() => handleJoinChallenge(challenge.id)}
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
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={3} key={event.id}>
                <EventCard
                  {...event}
                  type="event"
                  buttonText="Đăng ký tham gia"
                  onClick={() => handleRegisterEvent(event.id)}
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