import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Avatar, CircularProgress, Alert, Chip } from '@mui/material';
import { TrendingUp, LocalOffer } from '@mui/icons-material';
import axios from 'axios';

interface TopProduct {
  _id: string;
  name: string;
  soldCount: number;
  price: number;
  image: string;
}

const TopSellingProducts: React.FC = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để xem sản phẩm bán chạy');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/analytics/top-selling?limit=5', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else {
          setError(`Lỗi: ${err.response?.data?.message || err.message || 'Không thể tải sản phẩm bán chạy'}`);
        }
      } else {
        setError('Có lỗi xảy ra khi tải sản phẩm bán chạy');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <CircularProgress />
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

  if (!products || products.length === 0) {
    return (
      <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            Không có dữ liệu sản phẩm bán chạy
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0 }}>
      <CardContent sx={{ pb: '16px!important', pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ color: '#6C63FF', mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Sản phẩm bán chạy
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {products.map((product, index) => (
            <Box key={product._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, bgcolor: index === 0 ? '#F3F0FF' : 'transparent' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar 
                  src={`http://localhost:5000/assets/products/${product.image}`}
                  sx={{ width: 50, height: 50, borderRadius: 2 }}
                />
                {index < 3 && (
                  <Chip 
                    label={`#${index + 1}`}
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: -8, 
                      right: -8, 
                      bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã bán: {product.soldCount} sản phẩm
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#6C63FF' }}>
                  {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </Typography>
                <LocalOffer sx={{ color: '#FFB300', fontSize: 16 }} />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopSellingProducts; 