import React from 'react';
import { Box, Grid } from '@mui/material';
import DashboardHeader from '../components/DashboardHeader';
import StatsCards from '../components/StatsCards';
import SalesAnalytics from '../components/SalesAnalytics';
import TrafficChart from '../components/TrafficChart';
import TopSellingProducts from '../components/TopSellingProducts';
import ProductSales from '../components/ProductSales';
import InventoryStats from '../components/InventoryStats';
import CustomerStats from '../components/CustomerStats';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ bgcolor: '#F6F8FB', minHeight: '100vh', px: { xs: 1, sm: 3, md: 5 }, py: 3 }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <DashboardHeader />
        <Box sx={{ mt: { xs: 2, md: 3 } }}>
          <StatsCards />
        </Box>
        <Grid container spacing={3} sx={{ mt: { xs: 1, md: 2 } }}>
          <Grid item xs={12} md={8}>
            <SalesAnalytics />
          </Grid>
          <Grid item xs={12} md={4}>
            <TrafficChart />
          </Grid>
        </Grid>
        <Grid container spacing={3} sx={{ mt: { xs: 1, md: 2 } }}>
          <Grid item xs={12} md={8}>
            <TopSellingProducts />
          </Grid>
          <Grid item xs={12} md={4}>
            <ProductSales />
          </Grid>
        </Grid>
        <Box sx={{ mt: { xs: 1, md: 2 } }}>
          <InventoryStats />
        </Box>
        <Box sx={{ mt: { xs: 1, md: 2 } }}>
          <CustomerStats />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard; 