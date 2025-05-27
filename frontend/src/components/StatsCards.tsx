import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { TrendingUp, Group, ShoppingCart, Inventory2, ArrowForward, ArrowUpward } from '@mui/icons-material';

const stats = [
  {
    title: 'Tổng doanh thu',
    value: 2189000,
    percent: '+7.52%',
    percentColor: '#16C784',
    icon: <TrendingUp />,
    iconBg: '#F3F0FF',
    iconColor: '#6C63FF',
    change: 3256000,
    changeText: 'so với tháng trước',
  },
  {
    title: 'Lượt truy cập',
    value: '611',
    percent: '+6.20%',
    percentColor: '#16C784',
    icon: <Group />,
    iconBg: '#F3F0FF',
    iconColor: '#6C63FF',
    change: '+27',
    changeText: 'so với tháng trước',
  },
  {
    title: 'Giao dịch',
    value: '$3,250',
    percent: '+3.56%',
    percentColor: '#16C784',
    icon: <ShoppingCart />,
    iconBg: '#F3F0FF',
    iconColor: '#6C63FF',
    change: '+$365',
    changeText: 'so với tháng trước',
  },
  {
    title: 'Sản phẩm',
    value: '980',
    percent: '+3.72%',
    percentColor: '#16C784',
    icon: <Inventory2 />,
    iconBg: '#F3F0FF',
    iconColor: '#6C63FF',
    change: '+70',
    changeText: 'so với tháng trước',
  },
];

function formatVND(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const StatsCards: React.FC = () => (
  <Grid container spacing={3}>
    {stats.map((stat, idx) => (
      <Grid item xs={12} sm={6} md={3} key={idx}>
        <Card sx={{ borderRadius: 4, boxShadow: 2, p: 0 }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1.5, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ bgcolor: stat.iconBg, color: stat.iconColor, width: 40, height: 40 }}>{stat.icon}</Avatar>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{stat.title}</Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, fontSize: 28, mt: 1 }}>
              {typeof stat.value === 'number' ? formatVND(stat.value) : stat.value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: stat.percentColor, fontWeight: 700 }}>{stat.percent}</Typography>
              <ArrowUpward sx={{ color: stat.percentColor, fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {stat.changeText} {stat.change ? (typeof stat.change === 'number' ? formatVND(stat.change) : stat.change) : ''}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default StatsCards; 