import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Avatar, Rating, TextField, Button, Card, CardContent, CardHeader, CardActions, Grid, Chip, ImageList, ImageListItem, CircularProgress, Alert
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

  useEffect(() => {
    fetchReviews();
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>Đánh giá của khách hàng</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      <Grid container spacing={3}>
        {reviews.length === 0 && <Typography>Chưa có đánh giá nào.</Typography>}
        {reviews.map((review) => (
          <Grid item xs={12} md={6} lg={4} key={review._id}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardHeader
                avatar={<Avatar src={review.customerAvatar}>{review.customerName[0]}</Avatar>}
                title={<Typography fontWeight="bold">{review.customerName}</Typography>}
                subheader={<>
                  <Rating value={review.rating} readOnly size="small" sx={{ verticalAlign: 'middle' }} />
                  <Chip label={`Đơn hàng: ${review.orderId.slice(-6)}`} size="small" sx={{ ml: 1 }} />
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>{new Date(review.createdAt).toLocaleString()}</Typography>
                </>}
              />
              <CardContent>
                <Typography sx={{ mb: 1 }}>{review.content}</Typography>
                {review.images && review.images.length > 0 && (
                  <ImageList cols={review.images.length > 2 ? 2 : 1} rowHeight={120} sx={{ mb: 1 }}>
                    {review.images.map((img, idx) => (
                      <ImageListItem key={idx}>
                        <img src={img} alt={`review-img-${idx}`} style={{ borderRadius: 8, objectFit: 'cover', width: '100%', height: '100%' }} />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
                {review.reply ? (
                  <Box sx={{ bgcolor: '#E3F2FD', p: 1.5, borderRadius: 1, mt: 1 }}>
                    <Typography variant="subtitle2" color="primary">Phản hồi của shop:</Typography>
                    <Typography>{review.reply}</Typography>
                    {review.repliedAt && <Typography variant="caption" color="text.secondary">{new Date(review.repliedAt).toLocaleString()}</Typography>}
                  </Box>
                ) : (
                  replyingId === review._id ? (
                    <Box sx={{ mt: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Phản hồi của shop"
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        sx={{ mb: 1 }}
                      />
                      <Button variant="contained" size="small" onClick={() => handleReply(review._id)} disabled={!replyText.trim()} sx={{ mr: 1 }}>Gửi</Button>
                      <Button size="small" onClick={() => { setReplyingId(null); setReplyText(''); }}>Hủy</Button>
                    </Box>
                  ) : (
                    <CardActions>
                      <Button size="small" onClick={() => { setReplyingId(review._id); setReplyText(''); }}>Phản hồi</Button>
                    </CardActions>
                  )
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Reviews; 