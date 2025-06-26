import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CardMedia,
  IconButton,
  Avatar,
  Paper,
  Chip,
  Stack,
  Rating,
} from '@mui/material';
import {
  PlayArrow,
  Visibility,
  Close,
  TrendingUp,
  Whatshot,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LiveEvent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  status: 'LIVE' | 'UPCOMING' | 'ENDED';
  startTime: Date;
  endTime: Date;
  host: {
    id: string;
    name: string;
    avatar: string;
    followers: number;
  };
  products: {
    id: string;
    name: string;
    price: number;
    salePrice: number;
    image: string;
    stock: number;
    soldCount: number;
    featured: boolean;
    order: number;
  }[];
  viewers: number;
  likes: number;
  shares: number;
  categories: string[];
  tags: string[];
  rating: number;
  reviews: number;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'TEXT' | 'EMOJI' | 'PRODUCT';
  timestamp: Date;
}

// Mock data
const mockLiveEvents: LiveEvent[] = [
  {
    id: '1',
    title: 'Siêu sale đồ gia dụng cao cấp',
    description: 'Giảm giá sốc lên đến 50% các sản phẩm gia dụng cao cấp từ các thương hiệu hàng đầu. Đặc biệt có các combo thiết bị nhà bếp thông minh với ưu đãi độc quyền.',
    thumbnailUrl: 'https://source.unsplash.com/800x400/?smart-kitchen',
    streamUrl: 'https://example.com/stream1',
    status: 'LIVE',
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    host: {
      id: 'host1',
      name: 'Nguyễn Thị Hương',
      avatar: 'https://source.unsplash.com/100x100/?portrait',
      followers: 15000,
    },
    products: [
      {
        id: 'p1',
        name: 'Bộ nồi cơm điện thông minh 2 ngăn',
        price: 2990000,
        salePrice: 1990000,
        image: 'https://source.unsplash.com/300x300/?rice-cooker',
        stock: 50,
        soldCount: 30,
        featured: true,
        order: 1,
      },
      {
        id: 'p2',
        name: 'Máy rửa chén tự động 3 tầng',
        price: 15990000,
        salePrice: 12990000,
        image: 'https://source.unsplash.com/300x300/?dishwasher',
        stock: 20,
        soldCount: 15,
        featured: true,
        order: 2,
      },
      {
        id: 'p3',
        name: 'Tủ lạnh inverter 4 cánh',
        price: 25990000,
        salePrice: 21990000,
        image: 'https://source.unsplash.com/300x300/?refrigerator',
        stock: 10,
        soldCount: 8,
        featured: true,
        order: 3,
      },
    ],
    viewers: 1200,
    likes: 850,
    shares: 120,
    categories: ['Nhà bếp', 'Điện tử', 'Gia dụng'],
    tags: ['Siêu sale', 'Freeship', 'Độc quyền'],
    rating: 4.8,
    reviews: 256,
  },
];

const mockChatMessages: ChatMessage[] = [
  {
    id: 'm1',
    userId: 'u1',
    userName: 'Minh Anh',
    userAvatar: 'https://source.unsplash.com/50x50/?avatar',
    content: 'Sản phẩm này có bảo hành mấy năm vậy?',
    type: 'TEXT',
    timestamp: new Date(Date.now() - 5000),
  },
];

const LiveEvents: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [messageInput, setMessageInput] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 'currentUser',
      userName: 'Bạn',
      userAvatar: 'https://source.unsplash.com/50x50/?user',
      content: messageInput,
      type: 'TEXT',
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm, dd/MM/yyyy', { locale: vi });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, bgcolor: '#181c24', minHeight: '100vh' }}>
      {/* Video + Info */}
      <Box sx={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 900, mb: 2, borderRadius: 4, overflow: 'hidden', boxShadow: 6, position: 'relative', bgcolor: '#000' }}>
          <iframe
            width="100%"
            height="506"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="YouTube live event"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ display: 'block', width: '100%', borderRadius: 16, minHeight: 320, background: '#000' }}
          />
          {/* LIVE badge */}
          <Box sx={{ position: 'absolute', top: 20, left: 20, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'error.main', borderRadius: '50%', boxShadow: '0 0 8px 2px #ff1744', animation: 'livePulse 1.2s infinite alternate' }} />
            <Typography variant="subtitle2" sx={{ color: 'error.main', fontWeight: 700, letterSpacing: 1 }}>LIVE</Typography>
          </Box>
          {/* Viewers overlay */}
          <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: 'rgba(0,0,0,0.7)', px: 2, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility sx={{ color: '#fff', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>1.200 đang xem</Typography>
          </Box>
        </Box>
        <Typography variant="h3" fontWeight={700} align="center" gutterBottom sx={{ color: '#fff', mt: 2 }}>
          Sự Kiện Trực Tiếp Đặc Biệt
        </Typography>
        <Typography variant="h6" color="#b0b3b8" align="center" sx={{ mb: 2 }}>
          Khám phá các sản phẩm mới, ưu đãi độc quyền và nhận quà hấp dẫn khi tham gia livestream cùng chúng tôi!
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Chip icon={<TrendingUp />} label="Đang diễn ra" color="error" sx={{ fontWeight: 600, bgcolor: 'error.main', color: '#fff' }} />
          <Chip icon={<Whatshot />} label="Siêu sale" color="warning" sx={{ fontWeight: 600 }} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, justifyContent: 'center' }}>
          <Avatar src="https://source.unsplash.com/100x100/?portrait" />
          <Box>
            <Typography fontWeight={600} sx={{ color: '#fff' }}>PEWPEW</Typography>
            <Typography variant="body2" color="#b0b3b8">15.000 người theo dõi</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating value={4.8} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="#b0b3b8">(256 đánh giá)</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mb: 2 }}>
          <Chip label="#SiêuSale" variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} />
          <Chip label="#Freeship" variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} />
          <Chip label="#ĐộcQuyền" variant="outlined" sx={{ color: '#fff', borderColor: '#fff' }} />
        </Box>
        {/* Like/Share buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <IconButton sx={{ color: '#ff1744', bgcolor: '#fff', '&:hover': { bgcolor: '#ffeaea' } }}><Whatshot /></IconButton>
          <IconButton sx={{ color: '#1976d2', bgcolor: '#fff', '&:hover': { bgcolor: '#e3f2fd' } }}><TrendingUp /></IconButton>
        </Box>
      </Box>
      {/* Chat mockup */}
      <Box sx={{ flex: 1, minWidth: 320, maxWidth: 400, bgcolor: '#23272f', borderRadius: 4, boxShadow: 3, p: 2, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', height: 600 }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2 }}>
          Chat trực tiếp
        </Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', mb: 2, pr: 1 }}>
          {/* Chat messages mockup */}
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src="https://source.unsplash.com/50x50/?user1" sx={{ width: 28, height: 28 }} />
            <Box sx={{ bgcolor: '#31343b', color: '#fff', px: 2, py: 1, borderRadius: 2, fontSize: 14 }}>
              Sản phẩm này còn hàng không shop?
            </Box>
          </Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'row-reverse' }}>
            <Avatar src="https://source.unsplash.com/50x50/?user2" sx={{ width: 28, height: 28 }} />
            <Box sx={{ bgcolor: '#1976d2', color: '#fff', px: 2, py: 1, borderRadius: 2, fontSize: 14 }}>
              Còn bạn nhé! Mua ngay để nhận ưu đãi.
            </Box>
          </Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src="https://source.unsplash.com/50x50/?user3" sx={{ width: 28, height: 28 }} />
            <Box sx={{ bgcolor: '#31343b', color: '#fff', px: 2, py: 1, borderRadius: 2, fontSize: 14 }}>
              Có freeship không shop?
            </Box>
          </Box>
          <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'row-reverse' }}>
            <Avatar src="https://source.unsplash.com/50x50/?user2" sx={{ width: 28, height: 28 }} />
            <Box sx={{ bgcolor: '#1976d2', color: '#fff', px: 2, py: 1, borderRadius: 2, fontSize: 14 }}>
              Có freeship toàn quốc cho đơn từ 500k nhé!
            </Box>
          </Box>
        </Box>
        {/* Input mockup */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Avatar src="https://source.unsplash.com/50x50/?user4" sx={{ width: 28, height: 28 }} />
          <Box sx={{ flex: 1, bgcolor: '#31343b', borderRadius: 2, px: 2, py: 1, color: '#b0b3b8', fontSize: 14 }}>
            Nhập tin nhắn...
          </Box>
          <IconButton sx={{ color: '#1976d2' }}><ArrowForward /></IconButton>
        </Box>
      </Box>
      {/* Hiệu ứng live pulse */}
      <style>{`
        @keyframes livePulse {
          0% { box-shadow: 0 0 8px 2px #ff1744; }
          100% { box-shadow: 0 0 16px 6px #ff1744; }
        }
      `}</style>
    </Container>
  );
};

export default LiveEvents; 