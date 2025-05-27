import React, { useState } from 'react';
import { Box, Typography, IconButton, Avatar, Button, Stack, Snackbar, Menu, MenuItem, Badge, Popover, List, ListItem, ListItemText, ListItemAvatar, Divider, TextField, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MailOutline, NotificationsNone, CalendarMonth, Download, Menu as MenuIcon, InsertDriveFile, AccountCircle, CheckCircle, Send, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const messages = [
  {
    id: 1,
    sender: 'Nguyễn Văn A',
    content: 'Tôi muốn đặt hàng sản phẩm nồi cơm điện',
    time: '10:30',
    read: false,
    avatar: 'https://i.pravatar.cc/150?img=1',
    chatHistory: [
      { sender: 'Nguyễn Văn A', content: 'Chào shop, tôi muốn đặt hàng nồi cơm điện', time: '10:30' },
      { sender: 'Shop', content: 'Chào anh, shop có nhiều loại nồi cơm điện, anh muốn loại nào ạ?', time: '10:31' },
      { sender: 'Nguyễn Văn A', content: 'Tôi muốn loại có công nghệ nấu thông minh', time: '10:32' },
      { sender: 'Shop', content: 'Vâng, shop có model Sharp KS-COM18EV-ST mới nhất, giá 1.890.000đ ạ', time: '10:33' },
      { sender: 'Nguyễn Văn A', content: 'Tôi muốn đặt hàng sản phẩm nồi cơm điện', time: '10:34' }
    ]
  },
  {
    id: 2,
    sender: 'Trần Thị B',
    content: 'Khi nào có hàng mới về ạ?',
    time: '09:15',
    read: false,
    avatar: 'https://i.pravatar.cc/150?img=5',
    chatHistory: [
      { sender: 'Trần Thị B', content: 'Chào shop, khi nào có hàng mới về ạ?', time: '09:15' },
      { sender: 'Shop', content: 'Chào chị, dự kiến tuần sau shop sẽ nhập hàng mới ạ', time: '09:16' },
      { sender: 'Trần Thị B', content: 'Shop có thể thông báo cho em khi có hàng không ạ?', time: '09:17' },
      { sender: 'Shop', content: 'Vâng, chị để lại số điện thoại, shop sẽ liên hệ ngay khi có hàng ạ', time: '09:18' }
    ]
  },
  {
    id: 3,
    sender: 'Lê Văn C',
    content: 'Cảm ơn shop đã giao hàng nhanh',
    time: 'Hôm qua',
    read: true,
    avatar: 'https://i.pravatar.cc/150?img=8',
    chatHistory: [
      { sender: 'Lê Văn C', content: 'Cảm ơn shop đã giao hàng nhanh', time: 'Hôm qua' },
      { sender: 'Shop', content: 'Cảm ơn anh đã tin tưởng shop ạ', time: 'Hôm qua' },
      { sender: 'Lê Văn C', content: 'Sản phẩm chất lượng tốt, em sẽ ủng hộ shop dài dài', time: 'Hôm qua' },
      { sender: 'Shop', content: 'Cảm ơn anh, mong anh tiếp tục ủng hộ shop ạ', time: 'Hôm qua' }
    ]
  },
  {
    id: 4,
    sender: 'Phạm Thị D',
    content: 'Shop có chương trình khuyến mãi gì không?',
    time: '08:45',
    read: false,
    avatar: 'https://i.pravatar.cc/150?img=9',
    chatHistory: [
      { sender: 'Phạm Thị D', content: 'Chào shop, shop có chương trình khuyến mãi gì không?', time: '08:45' },
      { sender: 'Shop', content: 'Chào chị, hiện tại shop đang có chương trình giảm giá 20% cho tất cả sản phẩm ạ', time: '08:46' },
      { sender: 'Phạm Thị D', content: 'Vậy khi nào chương trình kết thúc ạ?', time: '08:47' },
      { sender: 'Shop', content: 'Chương trình sẽ kéo dài đến hết tháng này ạ', time: '08:48' }
    ]
  },
  {
    id: 5,
    sender: 'Hoàng Văn E',
    content: 'Tôi muốn đổi trả sản phẩm',
    time: 'Hôm qua',
    read: true,
    avatar: 'https://i.pravatar.cc/150?img=12',
    chatHistory: [
      { sender: 'Hoàng Văn E', content: 'Chào shop, tôi muốn đổi trả sản phẩm', time: 'Hôm qua' },
      { sender: 'Shop', content: 'Chào anh, anh có thể cho shop biết lý do đổi trả không ạ?', time: 'Hôm qua' },
      { sender: 'Hoàng Văn E', content: 'Sản phẩm bị lỗi màn hình', time: 'Hôm qua' },
      { sender: 'Shop', content: 'Vâng, shop sẽ hỗ trợ anh đổi trả. Anh có thể mang sản phẩm đến cửa hàng hoặc gửi qua bưu điện ạ', time: 'Hôm qua' }
    ]
  }
];

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Đơn hàng mới',
    content: 'Bạn có đơn hàng mới từ khách hàng Nguyễn Văn A',
    time: '5 phút trước',
    icon: '🛍️'
  },
  {
    id: 2,
    type: 'info',
    title: 'Doanh thu tăng',
    content: 'Doanh thu tháng này tăng 15% so với tháng trước',
    time: '1 giờ trước',
    icon: '📈'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Sản phẩm sắp hết hàng',
    content: 'Nồi cơm điện Sharp KS-COM18EV-ST chỉ còn 5 sản phẩm',
    time: '2 giờ trước',
    icon: '⚠️'
  },
  {
    id: 4,
    type: 'success',
    title: 'Khuyến mãi thành công',
    content: 'Chương trình giảm giá 20% đã kết thúc với 150 đơn hàng',
    time: 'Hôm qua',
    icon: '🎉'
  },
  {
    id: 5,
    type: 'info',
    title: 'Báo cáo doanh thu',
    content: 'Báo cáo doanh thu tuần này đã được cập nhật',
    time: 'Hôm qua',
    icon: '📊'
  }
];

interface ChatWindowProps {
  open: boolean;
  onClose: () => void;
  chat: typeof messages[0];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ open, onClose, chat }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chat.chatHistory]);

  const handleSend = () => {
    if (newMessage.trim()) {
      // TODO: Implement send message logic
      setNewMessage('');
    }
  };

  if (!open) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 380,
        height: 600,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }}
    >
      {/* Chat Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#6C63FF', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <Avatar src={chat.avatar} sx={{ width: 40, height: 40, border: '2px solid #fff' }}>{chat.sender[0]}</Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{chat.sender}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>Đang hoạt động</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          <Close />
        </IconButton>
      </Box>

      {/* Chat Messages */}
      <Box sx={{ 
        flex: 1, 
        p: 2, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: '#F6F8FB',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#ccc',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#999',
        }
      }}>
        {chat.chatHistory.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.sender === 'Shop' ? 'flex-end' : 'flex-start',
              gap: 0.5
            }}
          >
            <Box
              sx={{
                maxWidth: '80%',
                p: 1.5,
                borderRadius: 2,
                bgcolor: msg.sender === 'Shop' ? '#6C63FF' : '#fff',
                color: msg.sender === 'Shop' ? '#fff' : '#222',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  [msg.sender === 'Shop' ? 'right' : 'left']: '-8px',
                  transform: 'translateY(-50%)',
                  borderStyle: 'solid',
                  borderWidth: '8px 8px 8px 0',
                  borderColor: msg.sender === 'Shop' 
                    ? 'transparent #6C63FF transparent transparent'
                    : 'transparent #fff transparent transparent',
                  [msg.sender === 'Shop' ? 'left' : 'right']: 'auto'
                }
              }}
            >
              <Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>{msg.content}</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
              {msg.time}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Chat Input */}
      <Box sx={{ 
        p: 2, 
        bgcolor: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        gap: 1
      }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              bgcolor: '#F6F8FB',
              '&:hover': {
                bgcolor: '#F0F0F0'
              },
              '&.Mui-focused': {
                bgcolor: '#fff',
                boxShadow: '0 0 0 2px #6C63FF'
              }
            }
          }}
        />
        <IconButton 
          onClick={handleSend}
          sx={{ 
            bgcolor: '#6C63FF',
            color: '#fff',
            '&:hover': { 
              bgcolor: '#5A52E0',
              transform: 'scale(1.05)',
              transition: 'all 0.2s'
            }
          }}
        >
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};

const DashboardHeader: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mailAnchorEl, setMailAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChat, setSelectedChat] = useState<typeof messages[0] | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<typeof notifications[0] | null>(null);
  const unreadCount = messages.filter(m => !m.read).length;
  const unreadNotifications = notifications.length;
  const navigate = useNavigate();

  const handleExport = () => setSnackbarOpen(true);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMailClick = (event: React.MouseEvent<HTMLElement>) => {
    setMailAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMailClose = () => {
    setMailAnchorEl(null);
  };

  const handleChatClick = (chat: typeof messages[0]) => {
    setSelectedChat(chat);
    setMailAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Thực hiện logic đăng xuất ở đây nếu cần
    setAnchorEl(null);
    navigate('/login');
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#16C784';
      case 'warning':
        return '#FFB300';
      case 'info':
        return '#6C63FF';
      default:
        return '#6C63FF';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Top row: Title + icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Bảng điều khiển</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            sx={{ bgcolor: '#F6F8FB', mr: 1 }}
            onClick={handleMailClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <MailOutline sx={{ color: '#6C63FF' }} />
            </Badge>
          </IconButton>
          <Popover
            open={Boolean(mailAnchorEl)}
            anchorEl={mailAnchorEl}
            onClose={handleMailClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Tin nhắn ({unreadCount} mới)</Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {messages.map((message, index) => (
                <React.Fragment key={message.id}>
                  <ListItem 
                    button
                    onClick={() => handleChatClick(message)}
                    sx={{ 
                      py: 2,
                      px: 2,
                      bgcolor: !message.read ? '#F6F8FB' : 'transparent',
                      '&:hover': { bgcolor: '#F0F0F0' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={message.avatar} sx={{ bgcolor: '#6C63FF' }}>{message.sender[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 600 }}>{message.sender}</Typography>
                          <Typography variant="caption" color="text.secondary">{message.time}</Typography>
                        </Box>
                      }
                      secondary={message.content}
                      secondaryTypographyProps={{
                        sx: { 
                          color: !message.read ? '#222' : 'text.secondary',
                          fontWeight: !message.read ? 500 : 400
                        }
                      }}
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Popover>
          <IconButton 
            sx={{ bgcolor: '#F6F8FB', mr: 1 }}
            onClick={handleNotificationClick}
          >
            <Badge badgeContent={unreadNotifications} color="error">
              <NotificationsNone sx={{ color: '#6C63FF' }} />
            </Badge>
          </IconButton>
          <Popover
            open={Boolean(notificationAnchorEl)}
            anchorEl={notificationAnchorEl}
            onClose={handleNotificationClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Thông báo ({unreadNotifications} mới)</Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem 
                    button
                    onClick={() => setSelectedNotification(notification)}
                    sx={{ 
                      py: 2,
                      px: 2,
                      '&:hover': { bgcolor: '#F6F8FB' }
                    }}
                  >
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${getNotificationColor(notification.type)}15`,
                      color: getNotificationColor(notification.type),
                      fontSize: 20,
                      mr: 2
                    }}>
                      {notification.icon}
                    </Box>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontWeight: 600 }}>{notification.title}</Typography>
                          <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                        </Box>
                      }
                      secondary={notification.content}
                      secondaryTypographyProps={{
                        sx: { 
                          color: 'text.secondary',
                          fontSize: 13
                        }
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Popover>
          <IconButton sx={{ bgcolor: '#F6F8FB', mr: 1 }} onClick={handleAvatarClick}>
            <AccountCircle sx={{ color: '#6C63FF', fontSize: 38 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
          <IconButton sx={{ bgcolor: '#F6F8FB' }}><MenuIcon sx={{ color: '#6C63FF' }} /></IconButton>
        </Box>
      </Box>
      {/* Bottom row: Action buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<InsertDriveFile />} sx={{ bgcolor: '#F6F8FB', color: '#222', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 2, boxShadow: 'none' }}>Tổng quan</Button>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<CalendarMonth />} sx={{ bgcolor: '#F6F8FB', color: '#222', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 2, boxShadow: 'none' }}>Dữ liệu định giá ngày 18.09.2024</Button>
          <Button startIcon={<Download />} variant="contained" sx={{ bgcolor: '#6C63FF', color: '#fff', borderRadius: 2, fontWeight: 600, textTransform: 'none', px: 3, boxShadow: 'none' }} onClick={handleExport}>Xuất file</Button>
        </Stack>
      </Box>
      {/* Chat Window */}
      <ChatWindow
        open={Boolean(selectedChat)}
        onClose={() => setSelectedChat(null)}
        chat={selectedChat || messages[0]}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbar-root': {
            top: '24px !important'
          }
        }}
      >
        <Box
          sx={{
            bgcolor: '#16C784',
            color: '#fff',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: '0 4px 12px rgba(22, 199, 132, 0.15)',
            animation: 'slideIn 0.3s ease-out',
            '@keyframes slideIn': {
              '0%': { transform: 'translateY(-100%)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 }
            }
          }}
        >
          <CheckCircle sx={{ fontSize: 20 }} />
          <Typography sx={{ fontWeight: 600 }}>Đã lưu về máy</Typography>
        </Box>
      </Snackbar>
      {/* Dialog chi tiết thông báo */}
      <Dialog
        open={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }
        }}
      >
        {selectedNotification && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: `${getNotificationColor(selectedNotification.type)}15`,
                color: getNotificationColor(selectedNotification.type),
                fontSize: 28
              }}>{selectedNotification.icon}</Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{selectedNotification.title}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedNotification.time}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 0 }}>
              <Typography sx={{ fontSize: 15, color: '#222', lineHeight: 1.7 }}>{selectedNotification.content}</Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'flex-end', pr: 3, pb: 2 }}>
              <Button onClick={() => setSelectedNotification(null)} variant="contained" sx={{ bgcolor: '#6C63FF', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, boxShadow: 'none', '&:hover': { bgcolor: '#5A52E0' } }}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DashboardHeader; 