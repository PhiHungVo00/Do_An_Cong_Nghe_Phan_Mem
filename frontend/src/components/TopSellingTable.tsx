import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Box, Select, MenuItem, InputLabel, FormControl, TextField, Stack, Button, Snackbar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';

const allProducts = [
  { name: 'Nồi cơm điện', price: 120, sold: 320, earning: 38400, img: 'https://cdn.tgdd.vn/Products/Images/1979/238857/noi-com-dien-1-2l-sharp-ksh-d12v-ava-600x600.jpg', date: '2024-06-01', status: 'In Stock' },
  { name: 'Máy xay sinh tố', price: 80, sold: 210, earning: 16800, img: 'https://cdn.tgdd.vn/Products/Images/1943/238857/may-xay-sinh-to-ava-600x600.jpg', date: '2024-06-03', status: 'In Stock' },
  { name: 'Quạt điện', price: 60, sold: 150, earning: 9000, img: 'https://cdn.tgdd.vn/Products/Images/2162/238857/quat-dien-ava-600x600.jpg', date: '2024-06-05', status: 'Out of Stock' },
  { name: 'Bàn ủi hơi nước', price: 95, sold: 180, earning: 17100, img: 'https://cdn.tgdd.vn/Products/Images/1944/238857/ban-ui-hoi-nuoc-ava-600x600.jpg', date: '2024-06-07', status: 'In Stock' },
  { name: 'Máy lọc không khí', price: 250, sold: 90, earning: 22500, img: 'https://cdn.tgdd.vn/Products/Images/2002/238857/may-loc-khong-khi-ava-600x600.jpg', date: '2024-06-10', status: 'In Stock' },
  { name: 'Nồi chiên không dầu', price: 180, sold: 140, earning: 25200, img: 'https://cdn.tgdd.vn/Products/Images/1979/238857/noi-chien-khong-dau-ava-600x600.jpg', date: '2024-06-12', status: 'In Stock' },
  { name: 'Máy hút bụi', price: 200, sold: 110, earning: 22000, img: 'https://cdn.tgdd.vn/Products/Images/2003/238857/may-hut-bui-ava-600x600.jpg', date: '2024-06-15', status: 'Out of Stock' },
  { name: 'Ấm siêu tốc', price: 45, sold: 300, earning: 13500, img: 'https://cdn.tgdd.vn/Products/Images/1979/238857/am-sieu-toc-ava-600x600.jpg', date: '2024-06-18', status: 'In Stock' },
  { name: 'Máy sấy tóc', price: 55, sold: 170, earning: 9350, img: 'https://cdn.tgdd.vn/Products/Images/2004/238857/may-say-toc-ava-600x600.jpg', date: '2024-06-20', status: 'In Stock' },
  { name: 'Bếp hồng ngoại', price: 160, sold: 75, earning: 12000, img: 'https://cdn.tgdd.vn/Products/Images/1979/238857/bep-hong-ngoai-ava-600x600.jpg', date: '2024-06-22', status: 'In Stock' },
];

function formatVND(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const TopSellingTable: React.FC = () => {
  const [date, setDate] = useState('');
  const [price, setPrice] = useState('');
  const [sold, setSold] = useState('');
  const [products, setProducts] = useState(allProducts);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Filter logic
  const handleFilter = () => {
    let filtered = allProducts;
    if (date) filtered = filtered.filter(p => p.date === date);
    if (price) filtered = filtered.filter(p => p.price >= Number(price));
    if (sold) filtered = filtered.filter(p => p.sold >= Number(sold));
    setProducts(filtered);
  };
  const handleReset = () => {
    setDate(''); setPrice(''); setSold(''); setProducts(allProducts);
  };
  const handleExport = () => {
    setSnackbarOpen(true);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0, bgcolor: '#fff' }}>
      <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20 }}>
            Sản phẩm bán chạy
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <TextField type="date" label="Ngày bán" value={date} onChange={e => setDate(e.target.value)} size="small" InputLabelProps={{ shrink: true }} />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <TextField type="number" label="Giá tối thiểu" value={price} onChange={e => setPrice(e.target.value)} size="small" />
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <TextField type="number" label="Đã bán tối thiểu" value={sold} onChange={e => setSold(e.target.value)} size="small" />
            </FormControl>
            <Button variant="contained" color="primary" size="small" startIcon={<FilterListIcon />} onClick={handleFilter}>Lọc</Button>
            <Button variant="text" size="small" onClick={handleReset}>Đặt lại</Button>
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
                <TableCell>Ngày bán</TableCell>
                <TableCell>Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={p.img} alt={p.name} sx={{ width: 32, height: 32, mr: 1 }} />
                      <Typography fontWeight={600}>{p.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatVND(p.price)}</TableCell>
                  <TableCell>{p.sold}</TableCell>
                  <TableCell>{formatVND(p.earning)}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <Box sx={{ color: p.status === 'In Stock' ? 'success.main' : 'error.main', fontWeight: 600 }}>
                      {p.status === 'In Stock' ? 'Còn hàng' : 'Hết hàng'}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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