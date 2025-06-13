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
} from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import ProductCard from '../components/home/ProductCard';
import { products as allProducts, Product } from '../data/products';
import { useSnackbar } from 'notistack';
import { useCart } from '../contexts/CartContext';

// Định nghĩa các danh mục và tiêu đề
const categoryDetails = {
  kitchen: {
    title: 'Thiết Bị Nhà Bếp',
    description: 'Các thiết bị nhà bếp hiện đại, thông minh giúp việc nấu nướng trở nên dễ dàng và tiện lợi hơn.',
    banner: 'https://source.unsplash.com/1600x400/?modern-kitchen',
  },
  livingroom: {
    title: 'Thiết Bị Phòng Khách',
    description: 'Các thiết bị điện tử và nội thất thông minh cho phòng khách hiện đại.',
    banner: 'https://source.unsplash.com/1600x400/?modern-living-room',
  },
  bedroom: {
    title: 'Thiết Bị Phòng Ngủ',
    description: 'Các thiết bị thông minh giúp không gian nghỉ ngơi của bạn thoải mái hơn.',
    banner: 'https://source.unsplash.com/1600x400/?modern-bedroom',
  },
  bathroom: {
    title: 'Thiết Bị Phòng Tắm',
    description: 'Các thiết bị phòng tắm hiện đại mang lại trải nghiệm spa tại nhà.',
    banner: 'https://source.unsplash.com/1600x400/?modern-bathroom',
  },
  appliance: {
    title: 'Điện Gia Dụng',
    description: 'Các thiết bị điện gia dụng thông minh giúp cuộc sống tiện nghi hơn.',
    banner: 'https://source.unsplash.com/1600x400/?home-appliances',
  },
  smart: {
    title: 'Thiết Bị Thông Minh',
    description: 'Các thiết bị thông minh kết nối IoT, điều khiển qua điện thoại.',
    banner: 'https://source.unsplash.com/1600x400/?smart-home',
  },
};

const Products: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    let filteredProducts = [...allProducts];

    // Lọc theo danh mục
    if (categoryId && categoryId !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === categoryId);
    }

    // Lọc theo search query
    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo thương hiệu
    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        selectedBrands.includes(product.brand)
      );
    }

    // Lọc theo khoảng giá
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filteredProducts = filteredProducts.filter(product =>
        product.price >= min && (max ? product.price <= max : true)
      );
    }

    // Sắp xếp
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        filteredProducts.sort((a, b) => b.reviews - a.reviews);
    }

    setProducts(filteredProducts);
    setLoading(false);
  }, [categoryId, searchQuery, sortBy, priceRange, selectedBrands]);

  const handleToggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (productId: number) => {
    const product = allProducts.find((p: Product) => p.id === productId);
    if (product) {
      addToCart(product, 1);
      enqueueSnackbar(`Đã thêm ${product.name} vào giỏ hàng`, {
        variant: 'success',
      });
    }
  };

  const getCategoryInfo = () => {
    if (!categoryId || categoryId === 'all') {
      return {
        title: 'Tất cả sản phẩm',
        description: 'Khám phá tất cả các sản phẩm của chúng tôi',
        banner: 'https://source.unsplash.com/1600x400/?electronics-store',
      };
    }
    return categoryDetails[categoryId as keyof typeof categoryDetails] || {
      title: 'Danh mục không tồn tại',
      description: '',
      banner: '',
    };
  };

  // Lấy danh sách thương hiệu từ sản phẩm đã lọc theo danh mục
  const availableBrands = Array.from(
    new Set(
      allProducts
        .filter((p: Product) => !categoryId || categoryId === 'all' || p.category === categoryId)
        .map((p: Product) => p.brand)
    )
  );

  // Tính toán số trang
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categoryInfo = getCategoryInfo();

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
            {availableBrands.map((brand: string) => (
              <Chip
                key={brand}
                label={brand}
                onClick={() => {
                  setSelectedBrands((prev: string[]) =>
                    prev.includes(brand)
                      ? prev.filter((b: string) => b !== brand)
                      : [...prev, brand]
                  );
                }}
                color={selectedBrands.includes(brand) ? 'primary' : 'default'}
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
              {selectedBrands.map((brand) => (
                <Chip
                  key={brand}
                  label={`Thương hiệu: ${brand}`}
                  onDelete={() => {
                    setSelectedBrands((prev) =>
                      prev.filter((b) => b !== brand)
                    );
                  }}
                  sx={{ m: 0.5 }}
                />
              ))}
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
            {currentProducts.map((product) => (
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