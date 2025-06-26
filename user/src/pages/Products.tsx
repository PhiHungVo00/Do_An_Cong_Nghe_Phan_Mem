import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Breadcrumbs,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Pagination,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Button,
  IconButton,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  LocalOffer as LocalOfferIcon,
  Favorite,
  Star,
  ExpandMore,
  Clear,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useCart } from '../contexts/CartContext';
import { productAPI } from '../services/api';
import { styled } from '@mui/material/styles';

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

// Định nghĩa các danh mục và tiêu đề
const categoryDetails = {
  kitchen: {
    title: 'Thiết Bị Nhà Bếp',
    description: 'Các thiết bị nhà bếp hiện đại, thông minh giúp việc nấu nướng trở nên dễ dàng và tiện lợi hơn.',
    banner: '/assets/smarthome.jpg',
  },
  livingroom: {
    title: 'Thiết Bị Phòng Khách',
    description: 'Các thiết bị điện tử và nội thất thông minh cho phòng khách hiện đại.',
    banner: '/assets/smarthome.jpg',
  },
  bedroom: {
    title: 'Thiết Bị Phòng Ngủ',
    description: 'Các thiết bị thông minh giúp không gian nghỉ ngơi của bạn thoải mái hơn.',
    banner: '/assets/smarthome.jpg',
  },
  bathroom: {
    title: 'Thiết Bị Phòng Tắm',
    description: 'Các thiết bị phòng tắm hiện đại mang lại trải nghiệm spa tại nhà.',
    banner: '/assets/smarthome.jpg',
  },
  appliance: {
    title: 'Điện Gia Dụng',
    description: 'Các thiết bị điện gia dụng thông minh giúp cuộc sống tiện nghi hơn.',
    banner: '/assets/smarthome.jpg',
  },
  smart: {
    title: 'Thiết Bị Thông Minh',
    description: 'Các thiết bị thông minh kết nối IoT, điều khiển qua điện thoại.',
    banner: '/assets/smarthome.jpg',
  },
};

const Products: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  
  // State cho dữ liệu từ API
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho filter và pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Lấy search query từ URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get('search');
    if (search) {
      setSearchQuery(search);
    }
  }, [location.search]);

  // Fetch dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories và brands
        const [categoriesData, brandsData] = await Promise.all([
          productAPI.getCategories(),
          productAPI.getBrands()
        ]);

        setCategories(categoriesData.data || []);
        setBrands(brandsData.data || []);

        // Fetch products với filters
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
          sortBy: sortBy === 'popular' ? 'soldCount' : sortBy === 'rating' ? 'rating' : sortBy === 'newest' ? 'createdAt' : 'price',
          sortOrder: sortBy === 'price-asc' ? 'asc' : 'desc'
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (categoryId && categoryId !== 'all') {
          params.category = categoryId;
        }

        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(',');
        }

        // Lọc theo khoảng giá
        if (priceRange !== 'all') {
          const [min, max] = priceRange.split('-').map(Number);
          params.minPrice = min;
          params.maxPrice = max || undefined;
        }

        const productsData = await productAPI.getAll(params);
        
        setProducts(productsData.products || []);
        setTotalPages(productsData.totalPages || 1);
        setTotalProducts(productsData.totalProducts || 0);

      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, searchQuery, sortBy, priceRange, selectedBrands, currentPage]);

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    enqueueSnackbar(`Đã thêm ${product.name} vào giỏ hàng`, {
      variant: 'success',
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriceRange('all');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSortBy('popular');
    setCurrentPage(1);
    navigate('/products');
  };

  const getCategoryInfo = () => {
    if (!categoryId || categoryId === 'all') {
      return {
        title: 'Tất cả sản phẩm',
        description: 'Khám phá tất cả các sản phẩm của chúng tôi',
        banner: '/assets/smarthome.jpg',
      };
    }
    return categoryDetails[categoryId as keyof typeof categoryDetails] || {
      title: 'Danh mục không tồn tại',
      description: '',
      banner: '',
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const renderProductCard = (product: any) => (
    <StyledProductCard key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
      <Box sx={{ position: 'relative', p: 2 }}>
        <img 
          src={
            product.images?.[0]?.startsWith('/assets/')
              ? `http://localhost:5000${product.images[0]}`
              : (product.images?.[0] || '/placeholder-product.jpg')
          }
          alt={product.name}
          style={{ 
            width: '100%', 
            height: 200, 
            objectFit: 'cover',
            borderRadius: 8
          }}
        />
        {product.discount > 0 && (
          <Chip
            label={`-${product.discount}%`}
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontWeight: 'bold'
            }}
          />
        )}
        <IconButton
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { backgroundColor: 'white' }
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleFavorite(product._id);
          }}
        >
          <Favorite 
            color={favorites.includes(product._id) ? 'error' : 'action'} 
          />
        </IconButton>
      </Box>
      
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h3" gutterBottom sx={{ 
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}>
          {product.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Star sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {product.rating || 0} ({product.reviewCount || 0} đánh giá)
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            {formatPrice(product.price)}
          </Typography>
          {product.originalPrice && product.originalPrice > product.price && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </Typography>
          )}
        </Box>
        
        <Button
          variant="contained"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart(product);
          }}
          sx={{ mt: 'auto' }}
        >
          Thêm vào giỏ
        </Button>
      </Box>
    </StyledProductCard>
  );

  const categoryInfo = getCategoryInfo();

  if (loading && products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Banner */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '200px', md: '300px' },
          overflow: 'hidden',
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={categoryInfo.banner}
          alt={categoryInfo.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            textAlign: 'center',
            p: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
            }}
          >
            {categoryInfo.title}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: '800px',
              fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
            }}
          >
            {categoryInfo.description}
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
          >
            Trang chủ
          </Link>
          <Link
            color="inherit"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate('/products');
            }}
          >
            Sản phẩm
          </Link>
          {categoryId && categoryId !== 'all' && (
            <Typography color="text.primary">{categoryInfo.title}</Typography>
          )}
        </Breadcrumbs>

        {/* Filters and Search */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SortIcon sx={{ mr: 1 }} />
                  Sắp xếp theo
                </Box>
              </InputLabel>
              <Select
                value={sortBy}
                label="Sắp xếp theo"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="popular">Phổ biến nhất</MenuItem>
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="price-asc">Giá tăng dần</MenuItem>
                <MenuItem value="price-desc">Giá giảm dần</MenuItem>
                <MenuItem value="rating">Đánh giá cao nhất</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalOfferIcon sx={{ mr: 1 }} />
                  Khoảng giá
                </Box>
              </InputLabel>
              <Select
                value={priceRange}
                label="Khoảng giá"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="all">Tất cả mức giá</MenuItem>
                <MenuItem value="0-1000000">Dưới 1 triệu</MenuItem>
                <MenuItem value="1000000-5000000">1 - 5 triệu</MenuItem>
                <MenuItem value="5000000-10000000">5 - 10 triệu</MenuItem>
                <MenuItem value="10000000-20000000">10 - 20 triệu</MenuItem>
                <MenuItem value="20000000">Trên 20 triệu</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Brand Filters */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Thương hiệu:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {brands.map((brand: any) => (
              <Chip
                key={brand._id}
                label={brand.name}
                onClick={() => {
                  setSelectedBrands((prev: string[]) =>
                    prev.includes(brand._id)
                      ? prev.filter((b: string) => b !== brand._id)
                      : [...prev, brand._id]
                  );
                }}
                color={selectedBrands.includes(brand._id) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        </Box>

        {/* Active Filters */}
        {(selectedBrands.length > 0 || priceRange !== 'all' || searchQuery) && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Bộ lọc đang áp dụng:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedBrands.map((brandId) => {
                const brand = brands.find(b => b._id === brandId);
                return brand ? (
                  <Chip
                    key={brandId}
                    label={brand.name}
                    onDelete={() => setSelectedBrands(prev => prev.filter(id => id !== brandId))}
                    sx={{ m: 0.5 }}
                  />
                ) : null;
              })}
              {priceRange !== 'all' && (
                <Chip
                  label={`Giá: ${
                    {
                      '0-1000000': 'Dưới 1 triệu',
                      '1000000-5000000': '1 - 5 triệu',
                      '5000000-10000000': '5 - 10 triệu',
                      '10000000-20000000': '10 - 20 triệu',   
                      '20000000': 'Trên 20 triệu',
                    }[priceRange]
                  }`}
                  onDelete={() => setPriceRange('all')}       
                  sx={{ m: 0.5 }}
                />
              )}
              {searchQuery && (
                <Chip
                  label={`Tìm kiếm: ${searchQuery}`}
                  onDelete={() => setSearchQuery('')}
                  sx={{ m: 0.5 }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Results Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="text.secondary">
            Hiển thị {products.length} sản phẩm
          </Typography>
        </Box>

        {/* Products Grid */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product._id}>
                {renderProductCard(product)}
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info" sx={{ my: 4 }}>
            Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm
          </Alert>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Products; 