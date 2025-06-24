import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Rating, TextField, Button, Alert, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { reviewAPI } from '../services/api';

const ShopReview: React.FC = () => {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reviewAPI.getShopReviews();
      setReviews(res.reviews || []);
    } catch (err: any) {
      setError(err.message || 'Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async () => {
    if (!rating || !comment) return;
    setSubmitting(true);
    setError(null);
    try {
      await reviewAPI.createShop({ rating, content: comment });
      setSuccess('Gửi đánh giá thành công!');
      setRating(null);
      setComment('');
      fetchReviews();
    } catch (err: any) {
      setError(err.message || 'Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(null), 2000);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Đánh giá về Shop</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Viết đánh giá của bạn</Typography>
        <Rating
          value={rating}
          onChange={(_, newValue) => setRating(newValue)}
          size="large"
        />
        <TextField
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          label="Nhận xét về shop"
          value={comment}
          onChange={e => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!rating || !comment || submitting}
          onClick={handleSubmit}
        >
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </Box>
      <Divider sx={{ my: 4 }} />
      <Typography variant="h6" gutterBottom>Đánh giá gần đây</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {reviews.map((review) => (
            <React.Fragment key={review._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={600}>{review.customerName || 'Ẩn danh'}</Typography>
                      <Rating value={review.rating} size="small" readOnly />
                      <Typography variant="caption" color="text.secondary">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</Typography>
                    </Box>
                  }
                  secondary={review.content}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
          {reviews.length === 0 && !loading && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Chưa có đánh giá nào cho shop
            </Typography>
          )}
        </List>
      )}
    </Container>
  );
};

export default ShopReview; 