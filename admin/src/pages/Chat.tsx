import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, CircularProgress, Divider, ListItemButton } from '@mui/material';
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
      // Reload messages
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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ display: 'flex', minHeight: 500 }}>
        {/* Danh sách user */}
        <Box sx={{ width: 260, borderRight: 1, borderColor: 'divider', p: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Khách hàng</Typography>
          {loadingUsers ? <CircularProgress /> : (
            <List>
              {users.map((u) => (
                <ListItemButton
                  key={u._id}
                  selected={selectedUser?._id === u._id}
                  onClick={() => setSelectedUser(u)}
                >
                  <Avatar src={u.avatar} sx={{ mr: 1 }}>{u.fullName?.[0] || u.email?.[0]}</Avatar>
                  <ListItemText primary={u.fullName || u.email} />
                </ListItemButton>
              ))}
              {users.length === 0 && <Typography color="text.secondary">Chưa có khách nào chat</Typography>}
            </List>
          )}
        </Box>
        {/* Khung chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>Chat với khách</Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
            {loadingMessages ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : selectedUser ? (
              <List>
                {messages.map((msg) => (
                  <ListItem key={msg._id} sx={{ justifyContent: msg.from === selectedUser._id ? 'flex-start' : 'flex-end' }}>
                    {msg.from === selectedUser._id && <Avatar sx={{ mr: 1, width: 32, height: 32 }}>{selectedUser.fullName?.[0] || selectedUser.email?.[0]}</Avatar>}
                    <Paper sx={{ p: 1.5, bgcolor: msg.from === selectedUser._id ? 'grey.100' : 'primary.light', color: 'text.primary', borderRadius: 2, maxWidth: 320 }}>
                      <ListItemText primary={msg.content} secondary={new Date(msg.createdAt).toLocaleTimeString('vi-VN')} />
                    </Paper>
                    {msg.from !== selectedUser._id && <Avatar sx={{ ml: 1, width: 32, height: 32 }}>A</Avatar>}
                  </ListItem>
                ))}
                <div ref={messagesEndRef} />
              </List>
            ) : (
              <Typography color="text.secondary">Chọn khách để chat</Typography>
            )}
          </Box>
          {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              disabled={sending || !selectedUser}
            />
            <Button variant="contained" onClick={handleSend} disabled={sending || !input.trim() || !selectedUser}>
              Gửi
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 