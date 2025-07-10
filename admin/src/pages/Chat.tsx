import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, CircularProgress, Divider, ListItemButton, InputAdornment, IconButton, Fade, Badge } from '@mui/material';
import { Send as SendIcon, FiberManualRecord as OnlineIcon } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Chat: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lấy danh sách user đã chat (distinct from/to)
  useEffect(() => {
    setLoadingUsers(true);
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/messages`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setUsers(res.data.users || []))
      .catch(() => setError('Không thể tải danh sách user'))
      .finally(() => setLoadingUsers(false));
  }, []);

  // Lấy lịch sử chat với user được chọn
  useEffect(() => {
    if (!selectedUser) return;
    setLoadingMessages(true);
    const token = localStorage.getItem('token');
    axios.get(`${API_BASE_URL}/messages/${selectedUser._id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => setMessages(res.data.messages || []))
      .catch(() => setError('Không thể tải tin nhắn'))
      .finally(() => setLoadingMessages(false));
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selectedUser) return;
    setSending(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_BASE_URL}/messages`, {
        to: selectedUser._id,
        content: input
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setInput('');
      const res = await axios.get(`${API_BASE_URL}/messages/${selectedUser._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      setError('Không gửi được tin nhắn');
    } finally {
      setSending(false);
    }
  };

  // Giả lập trạng thái online cho user (random)
  const isUserOnline = (userId: string) => {
    return userId.charCodeAt(0) % 2 === 0;
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ display: 'flex', minHeight: 500, borderRadius: 4, boxShadow: 6, bgcolor: '#f4f6fb' }}>
        {/* Danh sách user */}
        <Box sx={{ width: 270, borderRight: 1, borderColor: 'divider', p: 2, bgcolor: '#f9f9f9', borderRadius: '16px 0 0 16px' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom align="center" color="primary.main">Khách hàng</Typography>
          {loadingUsers ? <CircularProgress /> : (
            <List sx={{ gap: 1 }}>
              {users.map((u) => (
                <ListItemButton
                  key={u._id}
                  selected={selectedUser?._id === u._id}
                  onClick={() => setSelectedUser(u)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: selectedUser?._id === u._id ? 'primary.light' : 'transparent',
                    boxShadow: selectedUser?._id === u._id ? 2 : 0,
                    transition: 'all 0.2s',
                  }}
                >
                  <Badge
                    color={isUserOnline(u._id) ? 'success' : 'default'}
                    variant="dot"
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  >
                    <Avatar src={u.avatar} sx={{ mr: 1, width: 40, height: 40, fontWeight: 700, bgcolor: '#6C63FF' }}>{u.fullName?.[0] || u.email?.[0]}</Avatar>
                  </Badge>
                  <ListItemText
                    primary={<Typography fontWeight={600} fontSize={15}>{u.fullName || u.email}</Typography>}
                    secondary={<Typography fontSize={12} color="text.secondary">{isUserOnline(u._id) ? 'Online' : 'Offline'}</Typography>}
                  />
                </ListItemButton>
              ))}
              {users.length === 0 && <Typography color="text.secondary">Chưa có khách nào chat</Typography>}
            </List>
          )}
        </Box>
        {/* Khung chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom align="center" color="primary.main">Chat với khách</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, bgcolor: '#e9eaf3', borderRadius: 3, p: 2, boxShadow: 1 }}>
            {loadingMessages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : selectedUser ? (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((msg, idx) => {
                  const isUser = msg.from === selectedUser._id;
                  return (
                    <Fade in key={msg._id || idx} timeout={400}>
                      <ListItem
                        sx={{
                          justifyContent: isUser ? 'flex-start' : 'flex-end',
                          alignItems: 'flex-end',
                          border: 'none',
                          bgcolor: 'transparent',
                          px: 0,
                        }}
                        disableGutters
                      >
                        {isUser && (
                          <Avatar sx={{ mr: 1, width: 36, height: 36, bgcolor: '#6C63FF', fontWeight: 700 }}>{selectedUser.fullName?.[0] || selectedUser.email?.[0]}</Avatar>
                        )}
                        <Paper
                          elevation={isUser ? 1 : 3}
                          sx={{
                            p: 1.5,
                            bgcolor: isUser ? '#fff' : 'primary.main',
                            color: isUser ? 'text.primary' : '#fff',
                            borderRadius: isUser ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                            maxWidth: 320,
                            minWidth: 60,
                            boxShadow: isUser ? '0 1px 4px 0 rgba(0,0,0,0.04)' : '0 2px 12px 0 rgba(108,99,255,0.10)',
                            position: 'relative',
                            transition: 'all 0.2s',
                          }}
                        >
                          <Typography variant="body1" sx={{ wordBreak: 'break-word', fontSize: 15, fontWeight: 500 }}>{msg.content}</Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: isUser ? 'grey.600' : 'rgba(255,255,255,0.7)', textAlign: isUser ? 'left' : 'right' }}>
                            {isUser ? (selectedUser.fullName || selectedUser.email) : 'Admin'} • {new Date(msg.createdAt).toLocaleTimeString('vi-VN')}
                          </Typography>
                        </Paper>
                        {!isUser && (
                          <Avatar sx={{ ml: 1, width: 36, height: 36, bgcolor: '#FFD600', color: '#6C63FF', fontWeight: 700 }}>A</Avatar>
                        )}
                      </ListItem>
                    </Fade>
                  );
                })}
                <div ref={messagesEndRef} />
              </List>
            ) : (
              <Typography color="text.secondary">Chọn khách để chat</Typography>
            )}
          </Box>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
            <TextField
              fullWidth
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={sending || !selectedUser}
              sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton color="primary" onClick={handleSend} disabled={sending || !input.trim() || !selectedUser}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 