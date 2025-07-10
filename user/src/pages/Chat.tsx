import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, CircularProgress, InputAdornment, IconButton, Fade } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { messageAPI, authAPI } from '../services/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Danh sách từ ngữ tục tĩu cần chặn (có thể mở rộng)
const BAD_WORDS = [
  'địt', 'lồn', 'cặc', 'buồi', 'đụ', 'đéo', 'fuck', 'shit', 'bitch', 'dm', 'vcl', 'cl', 'cc', 'ngu', 'chó', 'đĩ', 'dcm', 'dmm', 'f*ck', 'b!tch', 'pussy', 'asshole', 'motherfucker', 'bastard', 'slut', 'rape', 'rape', 'dumb', 'suck', 'súc vật', 'đần', 'khốn', 'khốn nạn', 'mẹ mày', 'bố mày', 'con mẹ mày', 'con chó', 'thằng chó', 'thằng ngu', 'thằng đần', 'thằng khốn', 'thằng lồn', 'thằng cặc', 'thằng địt', 'thằng đụ', 'thằng đéo', 'thằng buồi', 'thằng bựa', 'thằng bỉ ổi', 'thằng bẩn', 'thằng bẩn thỉu', 'thằng bẩn tính', 'thằng bẩn tưởi', 'thằng bẩn bựa', 'thằng bẩn bỉ', 'thằng bẩn bỉ ổi', 'thằng bẩn bỉ ổi bựa', 'thằng bẩn bỉ ổi bựa đê tiện', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn thằng cặc', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn thằng cặc thằng địt', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn thằng cặc thằng địt thằng đụ', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn thằng cặc thằng địt thằng đụ thằng đéo', 'thằng bẩn bỉ ổi bựa đê tiện khốn nạn chó đĩ lồn cặc buồi địt đụ đéo fuck shit bitch dm vcl cl cc ngu chó đĩ dcm dmm f*ck b!tch pussy asshole motherfucker bastard slut rape dumb suck súc vật đần khốn khốn nạn mẹ mày bố mày con mẹ mày con chó thằng chó thằng ngu thằng đần thằng khốn thằng lồn thằng cặc thằng địt thằng đụ thằng đéo thằng buồi'];

function containsBadWords(text: string) {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    authAPI.getCurrentUser().then(setUser).catch(() => setUser(null));
    fetch(`${API_BASE_URL}/auth/admin`)
      .then(async res => {
        if (!res.ok) throw new Error('Không tìm thấy admin');
        const data = await res.json();
        if (data && data._id && typeof data._id === 'string' && data._id.length === 24) {
          setAdminId(data._id);
        } else {
          setAdminId(null);
          setError('Không tìm thấy admin hợp lệ. Vui lòng liên hệ quản trị viên.');
        }
      })
      .catch((err) => {
        setAdminId(null);
        setError('Không tìm thấy admin hoặc lỗi hệ thống.');
      });
  }, []);

  useEffect(() => {
    if (!user || !adminId) return;
    setLoading(true);
    messageAPI.getMessages(adminId)
      .then(res => setMessages(res.messages || []))
      .catch(() => setError('Không thể tải tin nhắn'))
      .finally(() => setLoading(false));
  }, [user, adminId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !adminId) return;
    if (containsBadWords(input)) {
      setError('Tin nhắn chứa từ ngữ không phù hợp. Vui lòng nhập lại!');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await messageAPI.sendMessage(adminId, input);
      setInput('');
      const res = await messageAPI.getMessages(adminId);
      setMessages(res.messages || []);
    } catch (err: any) {
      setError('Không gửi được tin nhắn');
    } finally {
      setSending(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 2, minHeight: 500, display: 'flex', flexDirection: 'column', borderRadius: 4, boxShadow: 6, bgcolor: '#f4f6fb' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom align="center" sx={{ letterSpacing: 1, color: 'primary.main' }}>
          Chat với Admin
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, bgcolor: '#e9eaf3', borderRadius: 3, p: 2, boxShadow: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {messages.map((msg, idx) => {
                const isUser = msg.from === user?._id;
                return (
                  <Fade in key={msg._id || idx} timeout={400}>
                    <ListItem
                      sx={{
                        justifyContent: isUser ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        border: 'none',
                        bgcolor: 'transparent',
                        px: 0,
                      }}
                      disableGutters
                    >
                      {!isUser && (
                        <Avatar sx={{ mr: 1, width: 36, height: 36, bgcolor: '#6C63FF', fontWeight: 700 }}>A</Avatar>
                      )}
                      <Paper
                        elevation={isUser ? 3 : 1}
                        sx={{
                          p: 1.5,
                          bgcolor: isUser ? 'primary.main' : '#fff',
                          color: isUser ? '#fff' : 'text.primary',
                          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                          maxWidth: 320,
                          minWidth: 60,
                          boxShadow: isUser ? '0 2px 12px 0 rgba(108,99,255,0.10)' : '0 1px 4px 0 rgba(0,0,0,0.04)',
                          position: 'relative',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Typography variant="body1" sx={{ wordBreak: 'break-word', fontSize: 15, fontWeight: 500 }}>{msg.content}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: isUser ? 'rgba(255,255,255,0.7)' : 'grey.600', textAlign: isUser ? 'right' : 'left' }}>
                          {isUser ? (user?.fullName || 'Bạn') : 'Admin'} • {new Date(msg.createdAt).toLocaleTimeString('vi-VN')}
                        </Typography>
                      </Paper>
                      {isUser && (
                        <Avatar sx={{ ml: 1, width: 36, height: 36, bgcolor: '#FFD600', color: '#6C63FF', fontWeight: 700 }}>
                          {user?.fullName?.[0] || 'T'}
                        </Avatar>
                      )}
                    </ListItem>
                  </Fade>
                );
              })}
              <div ref={messagesEndRef} />
            </List>
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
            disabled={sending}
            sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton color="primary" onClick={handleSend} disabled={sending || !input.trim() || !adminId}>
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
        {!adminId && (
          <Typography color="error" sx={{ mt: 2 }}>
            Không thể gửi tin nhắn vì không tìm thấy admin. Vui lòng liên hệ quản trị viên.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Chat; 