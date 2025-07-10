import React, { useState } from 'react';
import {
  Box, Typography, Accordion, AccordionSummary, AccordionDetails, Paper, Divider, Link, List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import InfoIcon from '@mui/icons-material/Info';

const HelpCenter: React.FC = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        <HelpOutlineIcon sx={{ mr: 1, fontSize: 36 }} />Trung tâm hỗ trợ
      </Typography>
      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6"><InfoIcon sx={{ mr: 1 }} />Câu hỏi thường gặp (FAQ)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem>
                <ListItemText
                          primary="Làm thế nào để nhập sản phẩm mới?"
        secondary="Vào mục Sản phẩm, nhấn nút 'Nhập sản phẩm mới', điền thông tin và lưu lại."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Làm sao để xuất báo cáo doanh thu?"
                  secondary="Vào mục Báo cáo, chọn loại báo cáo và thời gian, sau đó nhấn 'Xuất báo cáo'."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Tôi quên mật khẩu, phải làm sao?"
                  secondary="Tại màn hình đăng nhập, nhấn 'Quên mật khẩu' và làm theo hướng dẫn để đặt lại mật khẩu."
                />
              </ListItem>
            </List>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ my: 2 }} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6"><InfoIcon sx={{ mr: 1 }} />Hướng dẫn sử dụng</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>Các bước cơ bản:</Typography>
            <List>
              <ListItem><ListItemText primary="1. Đăng nhập vào hệ thống bằng tài khoản của bạn." /></ListItem>
              <ListItem><ListItemText primary="2. Quản lý sản phẩm, đơn hàng, khách hàng qua các mục tương ứng." /></ListItem>
              <ListItem><ListItemText primary="3. Xem báo cáo, lịch sự kiện, đánh giá khách hàng." /></ListItem>
              <ListItem><ListItemText primary="4. Cài đặt hệ thống, tài khoản, giao diện theo nhu cầu." /></ListItem>
            </List>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Xem thêm hướng dẫn chi tiết tại <Link href="#" color="primary">trang tài liệu</Link>.</Typography>
          </AccordionDetails>
        </Accordion>
        <Divider sx={{ my: 2 }} />
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6"><ContactSupportIcon sx={{ mr: 1 }} />Liên hệ hỗ trợ</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Hotline: <b>1900 1234</b></Typography>
            <Typography>Email: <Link href="mailto:support@yourshop.com">support@yourshop.com</Link></Typography>
            <Typography sx={{ mt: 1 }}>Hoặc gửi yêu cầu hỗ trợ qua <Link href="#" color="primary">biểu mẫu này</Link>.</Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default HelpCenter; 