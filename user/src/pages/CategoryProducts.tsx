import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Slider,
  Chip,
  IconButton,
  Rating,
  SelectChangeEvent,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Favorite, FavoriteBorder } from '@mui/icons-material';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  stock: number;
  brand: string;
}

const sortOptions = [
  { value: 'price_asc', label: 'Giá: Thấp đến cao' },
  { value: 'price_desc', label: 'Giá: Cao đến thấp' },
  { value: 'rating_desc', label: 'Đánh giá cao nhất' },
  { value: 'newest', label: 'Mới nhất' },
];

const CategoryProducts: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // TODO: Thay thế bằng API call thực tế
        const mockProducts: Product[] = Array.from({ length: 50 }, (_, i) => ({
          id: `product-${i}`,
          name: `Sản phẩm gia dụng ${i + 1}`,
          price: Math.floor(Math.random() * 9000000) + 1000000,
          image: `https://picsum.photos/400/400?random=${i}`,
          description: 'Mô tả chi tiết về sản phẩm sẽ được hiển thị ở đây...',
          rating: Math.floor(Math.random() * 5) + 1,
          reviewCount: Math.floor(Math.random() * 1000),
          stock: Math.floor(Math.random() * 50),
          brand: ['Samsung', 'LG', 'Panasonic', 'Philips', 'Electrolux'][Math.floor(Math.random() * 5)],
        }));
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleFavoriteToggle = (productId: string) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'newest':
        default:
          return 0;
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const brands = Array.from(new Set(products.map(p => p.brand)));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tìm kiếm
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Tên sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card>

          <Card sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Khoảng giá
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={10000000}
              step={100000}
              valueLabelFormat={(value) => `${value.toLocaleString()}đ`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Typography>{priceRange[0].toLocaleString()}đ</Typography>
              <Typography>{priceRange[1].toLocaleString()}đ</Typography>
            </Box>
          </Card>

          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thương hiệu
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {brands.map((brand) => (
                <Chip
                  key={brand}
                  label={brand}
                  onClick={() => handleBrandToggle(brand)}
                  color={selectedBrands.includes(brand) ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Products Grid */}
        <Grid item xs={12} md={9}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">
              {filteredProducts.length} sản phẩm
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select value={sortBy} onChange={handleSortChange} label="Sắp xếp theo">
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2}>
            {paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                    onClick={() => handleFavoriteToggle(product.id)}
                  >
                    {favorites.includes(product.id) ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
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
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {product.price.toLocaleString()}đ
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.reviewCount})
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Thương hiệu: {product.brand}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      fullWidth
                      onClick={() => {/* TODO: Implement add to cart */}}
                    >
                      Thêm vào giỏ
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={Math.ceil(filteredProducts.length / itemsPerPage)}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CategoryProducts; 