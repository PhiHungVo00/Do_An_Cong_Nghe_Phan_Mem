import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Badge as MuiBadge,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Close,
} from '@mui/icons-material';
import { Challenge, Badge, Voucher, Event, LeaderboardEntry } from '../types';
import HomeChallengeCard from '../components/home/ChallengeCard';
import { challengeAPI } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`challenges-tabpanel-${index}`}
      aria-labelledby={`challenges-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data for leaderboard
const mockLeaderboard: LeaderboardEntry[] = [
  {
    userId: '1',
    name: 'Nguyễn Văn A',
    avatar: 'https://source.unsplash.com/100x100/?portrait,1',
    points: 15000,
    completedChallenges: 25,
    badges: {
      common: 10,
      rare: 5,
      epic: 2,
      legendary: 1,
    },
    rank: 1,
    progress: 75,
    level: 15,
  },
  // ... add more mock leaderboard entries
];

// Mock data for challenges
const challenges: Challenge[] = [
  {
    id: '1',
    title: 'Thử thách mua sắm thông minh',
    description: 'Mua sắm các sản phẩm thân thiện với môi trường và nhận thưởng hấp dẫn',
    badge: {
      id: 'b1',
      name: 'Eco Shopper',
      image: 'https://source.unsplash.com/400x300/?eco-friendly',
      rarity: 'RARE'
    },
    difficulty: 'EASY',
    category: 'SHOPPING',
    criteria: {
      type: 'PURCHASE',
      target: 3,
      current: 0
    },
    rewards: [
      {
        type: 'VOUCHER',
        value: 500000,
        description: 'Voucher giảm giá 500.000đ'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 1234,
    shareCount: 156
  },
  {
    id: '2',
    title: 'Người mua có tâm',
    description: 'Đánh giá 10 sản phẩm chi tiết để giúp cộng đồng mua sắm tốt hơn',
    badge: {
      id: 'b2',
      name: 'Expert Reviewer',
      image: 'https://source.unsplash.com/400x300/?review',
      rarity: 'COMMON'
    },
    difficulty: 'MEDIUM',
    category: 'SOCIAL',
    criteria: {
      type: 'REVIEW',
      target: 10,
      current: 0
    },
    rewards: [
      {
        type: 'POINTS',
        value: 200,
        description: 'Badge Người mua có tâm + 200 điểm'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 856,
    shareCount: 89
  },
  {
    id: '3',
    title: 'Săn deal thông minh',
    description: 'Hoàn thành 5 đơn hàng trong chương trình flash sale',
    badge: {
      id: 'b3',
      name: 'Smart Buyer',
      image: 'https://source.unsplash.com/400x300/?sale',
      rarity: 'EPIC'
    },
    difficulty: 'HARD',
    category: 'SHOPPING',
    criteria: {
      type: 'PURCHASE',
      target: 5,
      current: 0
    },
    rewards: [
      {
        type: 'CASHBACK',
        value: 200000,
        description: 'Hoàn tiền 10% tối đa 200.000đ'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 2341,
    shareCount: 445
  },
  {
    id: '4',
    title: 'Người bạn thân thiết',
    description: 'Giới thiệu 5 người bạn sử dụng ứng dụng và có đơn hàng đầu tiên',
    badge: {
      id: 'b4',
      name: 'Friendly Referrer',
      image: 'https://source.unsplash.com/400x300/?friends',
      rarity: 'RARE'
    },
    difficulty: 'MEDIUM',
    category: 'SOCIAL',
    criteria: {
      type: 'COLLECTION',
      target: 5,
      current: 0
    },
    rewards: [
      {
        type: 'VOUCHER',
        value: 300000,
        description: 'Voucher 300.000đ cho mỗi người'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 567,
    shareCount: 234
  },
  {
    id: '5',
    title: 'Thử thách tiết kiệm',
    description: 'Tích lũy 1.000.000đ tiết kiệm từ các ưu đãi và mã giảm giá',
    badge: {
      id: 'b5',
      name: 'Smart Saver',
      image: 'https://source.unsplash.com/400x300/?savings',
      rarity: 'EPIC'
    },
    difficulty: 'HARD',
    category: 'ACHIEVEMENT',
    criteria: {
      type: 'COLLECTION',
      target: 1000000,
      current: 0
    },
    rewards: [
      {
        type: 'VOUCHER',
        value: 200000,
        description: 'Voucher 200.000đ + Badge Người mua thông thái'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 789,
    shareCount: 167
  },
  {
    id: '6',
    title: 'Khám phá sản phẩm mới',
    description: 'Mua và đánh giá 5 sản phẩm mới ra mắt trên hệ thống',
    badge: {
      id: 'b6',
      name: 'Early Adopter',
      image: 'https://source.unsplash.com/400x300/?new-product',
      rarity: 'RARE'
    },
    difficulty: 'MEDIUM',
    category: 'SOCIAL',
    criteria: {
      type: 'COLLECTION',
      target: 5,
      current: 0
    },
    rewards: [
      {
        type: 'CASHBACK',
        value: 200000,
        description: 'Hoàn tiền 20% cho mỗi sản phẩm'
      }
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    status: 'IN_PROGRESS',
    participants: 432,
    shareCount: 98
  }
];

const mockBadges: Badge[] = [
  {
    id: 'b1',
    name: 'Mua sắm thông thái',
    image: 'https://source.unsplash.com/100x100/?badge',
    description: 'Hoàn thành 5 đơn hàng trong tháng',
    rarity: 'RARE',
    dateEarned: new Date('2024-03-15'),
    challenge: '1',
  },
  {
    id: 'b2',
    name: 'Reviewer chuyên nghiệp',
    image: 'https://source.unsplash.com/100x100/?review',
    description: 'Viết 10 đánh giá chi tiết',
    rarity: 'EPIC',
    dateEarned: new Date('2024-03-20'),
    challenge: '2',
  },
];

const mockEvents: Event[] = [
  {
    id: 'e1',
    title: 'Tuần lễ vàng',
    description: 'Giảm giá sốc toàn bộ sản phẩm',
    type: 'SALE',
    startDate: new Date('2024-03-25'),
    endDate: new Date('2024-03-31'),
    image: 'https://source.unsplash.com/400x200/?sale',
    rewards: [
      {
        type: 'CASHBACK',
        value: 20,
        description: 'Hoàn tiền 20%',
      },
    ],
    status: 'UPCOMING',
    participants: 1234,
  },
];

const mockVouchers: Voucher[] = [
  {
    id: 'v1',
    code: 'SAVE100K',
    type: 'FIXED',
    value: 100000,
    minSpend: 500000,
    expiryDate: new Date('2024-03-31'),
    status: 'ACTIVE',
  },
];

const Challenges: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openBadges, setOpenBadges] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({ open: false, message: '', type: 'success' });
  const [filters, setFilters] = useState({
    difficulty: 'ALL',
    category: 'ALL',
    status: 'ALL',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle filter changes
  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  // Filter challenges
  const filteredChallenges = challenges.filter(challenge => {
    if (filters.difficulty !== 'ALL' && challenge.difficulty !== filters.difficulty) return false;
    if (filters.category !== 'ALL' && challenge.category !== filters.category) return false;
    if (filters.status !== 'ALL' && challenge.status !== filters.status) return false;
    if (searchQuery && !challenge.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.participants || 0) - (a.participants || 0);
      case 'endingSoon':
        return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      case 'newest':
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      default:
        return 0;
    }
  });

  // Share challenge
  const handleShare = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setOpenShare(true);
  };

  const handleSharePlatform = (platform: string) => {
    // Implement actual sharing logic here
    setNotification({
      open: true,
      message: `Đã chia sẻ thử thách trên ${platform}`,
      type: 'success',
    });
    setOpenShare(false);
  };

  // Filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'COMMON':
        return '#808080';
      case 'RARE':
        return '#0088FE';
      case 'EPIC':
        return '#8E44AD';
      case 'LEGENDARY':
        return '#FFD700';
      default:
        return '#808080';
    }
  };

  const handleCloseDialog = () => {
    setSelectedChallenge(null);
  };

  const handleJoinChallenge = (challengeId: string) => {
    console.log('Join challenge:', challengeId);
    // TODO: Implement challenge join logic
  };

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching challenges from API...');
        const res = await challengeAPI.getAll();
        console.log('API response:', res);
        const challengeData = Array.isArray(res) ? res : (res?.challenges || []);
        console.log('Processed challenge data:', challengeData);
        console.log('Number of challenges:', challengeData.length);
        
        // Map _id to id for compatibility with Challenge interface
        const mappedChallenges = challengeData.map((challenge: any) => ({
          ...challenge,
          id: challenge._id || challenge.id
        }));
        
        console.log('Mapped challenges:', mappedChallenges);
        setChallenges(mappedChallenges);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError('Không thể tải thử thách. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: 'primary.main',
              borderRadius: 2,
            }
          }}
        >
          Thử thách
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tham gia các thử thách để nhận thưởng hấp dẫn và nâng cao trải nghiệm mua sắm của bạn
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
      <Grid container spacing={3}>
          {challenges.map((challenge) => {
            console.log('Rendering challenge:', challenge);
            const image =
              'image' in challenge
                ? (challenge as any).image
                : challenge.badge?.image || 'https://source.unsplash.com/800x600/?challenge';
            const reward =
              'reward' in challenge
                ? (challenge as any).reward
                : challenge.rewards?.[0]?.description || '';
            return (
          <Grid item xs={12} sm={6} md={4} key={challenge.id}>
                <HomeChallengeCard
                  title={challenge.title}
                  description={challenge.description}
                  image={image}
                  reward={reward}
                  participants={challenge.participants || 0}
              progress={0}
                  daysLeft={Math.max(0, Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))}
                  onJoin={() => {}}
            />
          </Grid>
            );
          })}
      </Grid>
      )}

      {/* Challenge Detail Dialog */}
      <Dialog
        open={!!selectedChallenge}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedChallenge && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">{selectedChallenge.title}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {/* Add challenge detail content */}
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Challenges; 