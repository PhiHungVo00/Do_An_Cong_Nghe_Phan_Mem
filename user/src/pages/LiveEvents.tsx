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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {!selectedEvent ? (
        <>
          {/* Hero Section */}
          <Box
            sx={{
              position: 'relative',
              mb: 6,
              borderRadius: 4,
              overflow: 'hidden',
              height: 400,
            }}
          >
            <Box
              component="img"
              src="https://source.unsplash.com/1600x900/?modern-kitchen"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.7)',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                p: 4,
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom>
                Sự Kiện Trực Tiếp
              </Typography>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Khám phá các sản phẩm mới và ưu đãi độc quyền
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  icon={<Whatshot />}
                  label="Đang diễn ra"
                  color="error"
                  sx={{ bgcolor: 'error.main' }}
                />
                <Chip
                  icon={<TrendingUp />}
                  label="Sắp diễn ra"
                  sx={{ bgcolor: 'warning.main' }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Live Events Grid */}
          <Grid container spacing={4}>
            {mockLiveEvents.map((event) => (
              <Grid item xs={12} md={6} lg={4} key={event.id}>
                <Paper
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={event.thumbnailUrl}
                      alt={event.title}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label="LIVE"
                        color="error"
                        size="small"
                        icon={<PlayArrow />}
                      />
                      <Chip
                        label={`${event.viewers} người xem`}
                        size="small"
                        icon={<Visibility />}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {event.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Avatar src={event.host.avatar} sx={{ mr: 1 }} />
                      <Box>
                        <Typography variant="subtitle2">
                          {event.host.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {event.host.followers.toLocaleString()} người theo dõi
                        </Typography>
                      </Box>
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      {event.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={event.rating} readOnly size="small" />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          ({event.reviews})
                        </Typography>
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <ArrowForward />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Live Event View Component will be implemented here
        <Box>
          <IconButton
            onClick={() => setSelectedEvent(null)}
            sx={{ position: 'absolute', top: 16, left: 16 }}
          >
            <Close />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default LiveEvents; 