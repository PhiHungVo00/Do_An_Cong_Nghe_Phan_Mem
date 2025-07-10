import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Box, Select, MenuItem, InputLabel, FormControl, TextField, Stack, Button, Snackbar, CircularProgress, Alert
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

interface TopSellingProduct {
  _id: string;
  name: string;
  price: number;
  soldCount: number;
  revenue: number;
  image: string;
  status: string;
  lastSoldDate: string;
}

function formatVND(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const TopSellingTable: React.FC = () => {
  const [products, setProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<TopSellingProduct[]>([]);
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [sold, setSold] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchTopSellingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem sản phẩm bán chạy');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/analytics/top-selling-products', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải dữ liệu sản phẩm bán chạy'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải dữ liệu sản phẩm bán chạy');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopSellingProducts();
  }, []);

  // Filter logic
  const handleFilter = () => {
    let filtered = products;
    if (date) filtered = filtered.filter(p => p.lastSoldDate === date);
    if (price) filtered = filtered.filter(p => p.price >= Number(price));
    if (sold) filtered = filtered.filter(p => p.soldCount >= Number(sold));
    setFilteredProducts(filtered);
  };

  const handleReset = () => {
    setDate('');
    setPrice('');
    setSold('');
    setFilteredProducts(products);
  };

  const handleExport = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.jpg';
    return `http://localhost:5000/assets/products/${imagePath}`;
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0, bgcolor: '#fff' }}>
        <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0, bgcolor: '#fff' }}>
      <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20 }}>
            Sản phẩm bán chạy
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <TextField 
                type="date" 
                label="Ngày bán" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                size="small" 
                InputLabelProps={{ shrink: true }} 
              />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <TextField 
                type="number" 
                label="Giá tối thiểu" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                size="small" 
              />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <TextField 
                type="number" 
                label="Đã bán tối thiểu" 
                value={sold} 
                onChange={e => setSold(e.target.value)} 
                size="small" 
              />
            </FormControl>
            <Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleFilter}>
              Lọc
            </Button>
            <Button variant="text" size="small" onClick={handleReset}>
              Đặt lại
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              sx={{
                bgcolor: '#6C63FF',
                color: '#fff',
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                px: 2,
                py: 0.8,
                fontSize: 13,
                minHeight: 0,
                minWidth: 0,
                height: 32,
                boxShadow: 'none',
                ml: 1,
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: '#5A52E0',
                  boxShadow: '0 4px 12px rgba(108, 99, 255, 0.2)',
                  transform: 'translateY(-1px)',
                  transition: 'all 0.2s ease-in-out'
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: 'none'
                }
              }}
            >
              Xuất file
            </Button>
          </Stack>
        </Box>
        <TableContainer sx={{ maxHeight: 340, minHeight: 340, overflowY: 'auto', borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Sản phẩm</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Đã bán</TableCell>
                <TableCell>Doanh thu</TableCell>
                <TableCell>Ngày bán gần nhất</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar 
                          src={getImageUrl(product.image)} 
                          alt={product.name} 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 1,
                            border: '2px solid #f0f0f0'
                          }} 
                        />
                        <Typography fontWeight={600} sx={{ fontSize: 14 }}>
                          {product.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatVND(product.price)}</TableCell>
                    <TableCell>{product.soldCount}</TableCell>
                    <TableCell>{formatVND(product.revenue)}</TableCell>
                    <TableCell>
                      {product.lastSoldDate ? new Date(product.lastSoldDate).toLocaleDateString('vi-VN') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ 
                        color: product.status === 'In Stock' ? 'success.main' : 'error.main', 
                        fontWeight: 600,
                        fontSize: 13
                      }}>
                        {product.status === 'In Stock' ? 'Còn hàng' : 'Hết hàng'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body2" color="text.secondary">
                      Không có dữ liệu sản phẩm bán chạy
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message="Đã lưu về máy"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Card>
  );
};

export default TopSellingTable; 