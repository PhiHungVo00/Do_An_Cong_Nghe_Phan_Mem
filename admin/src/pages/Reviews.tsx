import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Rating, TextField, Button, Card, CardContent, CardHeader, CardActions, Grid, Chip, ImageList, ImageListItem, CircularProgress, Alert, Tabs, Tab, List, ListItem
} from '@mui/material';
import axios from 'axios';

interface Review {
  _id: string;
  orderId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  content: string;
  images: string[];
  createdAt: string;
  reply?: string;
  repliedAt?: string;
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [shopReviews, setShopReviews] = useState<any[]>([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopError, setShopError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
      setShopLoading(true);
    fetch('http://localhost:5000/api/reviews/shop')
        .then(res => res.json())
        .then(data => setShopReviews(data.reviews || []))
        .catch(() => setShopError('Không thể tải đánh giá shop'))
        .finally(() => setShopLoading(false));
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/reviews', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setReviews(res.data.reviews);
      setError(null);
    } catch (err: any) {
      setError('Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vui lòng đăng nhập để phản hồi');
        return;
      }
      await axios.post(`http://localhost:5000/api/reviews/${id}/reply`, { reply: replyText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Phản hồi thành công!');
      setReplyingId(null);
      setReplyText('');
      fetchReviews();
    } catch (err: any) {
      setError('Không thể gửi phản hồi');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>Đánh giá shop</Typography>
      {shopLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
          ) : shopError ? (
            <Alert severity="error">{shopError}</Alert>
          ) : shopReviews.length > 0 ? (
        <Grid container spacing={3}>
              {shopReviews.map((review) => (
            <Grid item xs={12} md={6} lg={4} key={review._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, height: '100%' }}>
                <CardHeader
                  avatar={<Avatar src={review.customerAvatar}>{review.customerName?.[0]}</Avatar>}
                  title={<Typography fontWeight={700}>{review.customerName}</Typography>}
                  subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating} readOnly size="small" />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  }
                />
                <CardContent>
                  <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                    {review.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
              ))}
        </Grid>
          ) : (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Chưa có đánh giá nào cho shop
        </Typography>
      )}
    </Box>
  );
};

export default Reviews; 