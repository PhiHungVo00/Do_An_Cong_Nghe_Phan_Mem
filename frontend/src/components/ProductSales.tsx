import React from 'react';
import { Card, CardContent, Typography, Box, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const sales = [
  {
    label: 'Đã đóng gói',
    value: 756,
    percent: '+5.7%',
    color: '#6C63FF',
    gradient: 'linear-gradient(180deg, #EDEAFF 0%, #F6F8FB 100%)',
    bar: 'linear-gradient(90deg, #6C63FF 0%, #A084FF 100%)',
  },
  {
    label: 'Đã giao',
    value: 1052,
    percent: '+7.3%',
    color: '#FFB300',
    gradient: 'linear-gradient(180deg, #FFF6E0 0%, #F6F8FB 100%)',
    bar: 'linear-gradient(90deg, #FFB300 0%, #FFD580 100%)',
  },
  {
    label: 'Đã vận chuyển',
    value: 1564,
    percent: '+11.7%',
    color: '#00BFA6',
    gradient: 'linear-gradient(180deg, #E0F7F4 0%, #F6F8FB 100%)',
    bar: 'linear-gradient(90deg, #00BFA6 0%, #7CF9E5 100%)',
  },
];

function formatVND(value: number) {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

const ProductSales: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ borderRadius: 4, boxShadow: 2, mb: 3, p: 0, bgcolor: '#fff' }}>
      <CardContent sx={{ pb: '20px!important', pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 20 }}>
            Doanh số sản phẩm
          </Typography>
          <Button
            endIcon={<ArrowDropDownIcon />}
            onClick={handleClick}
            sx={{ bgcolor: '#F6F8FB', color: '#222', borderRadius: 3, fontWeight: 600, textTransform: 'none', px: 2, py: 0.5, boxShadow: 'none', fontSize: 14, minHeight: 0, minWidth: 0, height: 36 }}
          >
            Tháng trước
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Tháng trước</MenuItem>
            <MenuItem onClick={handleClose}>Tháng này</MenuItem>
          </Menu>
        </Box>
        <Box sx={{ display: 'flex', gap: 0, justifyContent: 'space-between', alignItems: 'end', height: 180 }}>
          {sales.map((s, idx) => (
            <Box key={idx} sx={{ flex: 1, px: 1, borderRight: idx < 2 ? '1.5px dashed #E0E0E0' : 'none', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>{s.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5 }}>{formatVND(s.value)}</Typography>
              <Typography variant="body2" sx={{ color: '#16C784', fontWeight: 700, mb: 1 }}>{s.percent}</Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'end', width: '100%' }}>
                <Box sx={{ width: '100%', height: 100, borderRadius: 2, background: s.gradient, display: 'flex', alignItems: 'end', justifyContent: 'center', position: 'relative' }}>
                  <Box sx={{ width: '80%', height: 6, borderRadius: 2, background: s.bar, position: 'absolute', bottom: 8, left: '10%' }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductSales; 