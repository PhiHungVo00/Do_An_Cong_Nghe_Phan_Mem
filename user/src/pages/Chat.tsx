import React, { useEffect, useState, useRef } from 'react';
import { Box, Container, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, CircularProgress } from '@mui/material';
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
    // Lấy thông tin user hiện tại
    authAPI.getCurrentUser().then(setUser).catch(() => setUser(null));
    // Lấy adminId thật từ backend
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
        console.log('adminId:', data._id);
      })
      .catch((err) => {
        setAdminId(null);
        setError('Không tìm thấy admin hoặc lỗi hệ thống.');
        console.error('Lỗi lấy adminId:', err);
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
      // Reload messages
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
      <Paper sx={{ p: 2, minHeight: 500, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Chat với Admin</Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, bgcolor: '#f9f9f9', borderRadius: 2, p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItem key={msg._id} sx={{ justifyContent: msg.from === user?._id ? 'flex-end' : 'flex-start' }}>
                  {msg.from !== user?._id && <Avatar sx={{ mr: 1, width: 32, height: 32 }}>A</Avatar>}
                  <Paper sx={{ p: 1.5, bgcolor: msg.from === user?._id ? 'primary.light' : 'grey.100', color: 'text.primary', borderRadius: 2, maxWidth: 320 }}>
                    <ListItemText primary={msg.content} secondary={new Date(msg.createdAt).toLocaleTimeString('vi-VN')} />
                  </Paper>
                  {msg.from === user?._id && <Avatar sx={{ ml: 1, width: 32, height: 32 }}>T</Avatar>}
                </ListItem>
              ))}
              <div ref={messagesEndRef} />
            </List>
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
            disabled={sending}
          />
          <Button variant="contained" onClick={handleSend} disabled={sending || !input.trim() || !adminId}>
            Gửi
          </Button>
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