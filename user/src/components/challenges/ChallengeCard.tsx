import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
  CardMedia,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents,
  Timer,
  CheckCircle,
  Group,
  Star,
  Share,
  Favorite,
  TrendingUp,
} from '@mui/icons-material';
import { Challenge } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  progress?: number;
  isParticipating?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
  progress = 0,
  isParticipating = false,
}) => {
  const isCompleted = progress === 100;
  const isActive = new Date() >= challenge.startDate && new Date() <= challenge.endDate;
  const isUpcoming = new Date() < challenge.startDate;

  const formatDate = (date: Date) => {
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };

  const getCriteriaText = () => {
    const { type, target } = challenge.criteria;
    switch (type as 'PURCHASE' | 'REVIEW' | 'COLLECTION') {
      case 'PURCHASE':
        return `Mua ${target} sản phẩm`;
      case 'REVIEW':
        return `Viết ${target} đánh giá`;
      case 'COLLECTION':
        return `Sưu tập ${target} sản phẩm`;
      default:
        return '';
    }
  };

  const getRewardText = () => {
    const primaryReward = challenge.rewards[0];
    if (!primaryReward) return '';
    
    switch (primaryReward.type) {
      case 'POINTS':
        return `${primaryReward.value} điểm`;
      case 'BADGE':
        return primaryReward.description;
      case 'VOUCHER':
        return `${primaryReward.value.toLocaleString()}đ`;
      case 'CASHBACK':
        return `${primaryReward.value.toLocaleString()}đ`;
      default:
        return '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'success';
      case 'MEDIUM':
        return 'warning';
      case 'HARD':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => `0 20px 40px ${theme.palette.action.hover}`,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="240"
          image={challenge.badge?.image || 'https://source.unsplash.com/800x600/?challenge'}
          alt={challenge.title}
          sx={{ 
            objectFit: 'cover',
            filter: 'brightness(0.9)',
          }}
        />
        
        {/* Overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* Top badges */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            justifyContent: 'space-between',
          }}
        >
          <Stack direction="row" spacing={1}>
            <Chip
              size="small"
              label={challenge.difficulty}
              color={getDifficultyColor(challenge.difficulty)}
              sx={{ 
                fontWeight: 600,
                backdropFilter: 'blur(8px)',
                backgroundColor: (theme) => `${theme.palette[getDifficultyColor(challenge.difficulty)].main}CC`,
              }}
            />
            {isParticipating && (
              <Chip
                size="small"
                label="Đang tham gia"
                color="primary"
                sx={{ 
                  fontWeight: 600,
                  backdropFilter: 'blur(8px)',
                  backgroundColor: (theme) => `${theme.palette.primary.main}CC`,
                }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Chia sẻ thử thách">
              <IconButton size="small" sx={{ color: 'white', backdropFilter: 'blur(8px)' }}>
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lưu thử thách">
              <IconButton size="small" sx={{ color: 'white', backdropFilter: 'blur(8px)' }}>
                <Favorite fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Bottom info */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            color: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {challenge.title}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Group fontSize="small" />
              <Typography variant="body2">
                {(challenge.participants || 0).toLocaleString()} người tham gia
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp fontSize="small" />
              <Typography variant="body2">
                {challenge.shareCount} lượt chia sẻ
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        <Stack spacing={3}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6,
            }}
          >
            {challenge.description}
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="primary" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <Star fontSize="small" />
                Tiêu chí thử thách
              </Typography>
              <Typography variant="body2" color="text.primary">
                {getCriteriaText()}
              </Typography>
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="secondary" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <EmojiEvents fontSize="small" />
                Phần thưởng
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: (theme) => theme.palette.secondary.light,
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {getRewardText()}
                  </Typography>
                </Avatar>
                <Typography variant="body2" color="text.primary">
                  {challenge.rewards[0]?.description}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 600,
                }}
              >
                <Timer fontSize="small" />
                Thời gian
              </Typography>
              <Typography variant="body2" color="text.primary">
                {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
              </Typography>
            </Box>
          </Stack>

          {isParticipating && (
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Tiến độ hoàn thành
                </Typography>
                <Typography 
                  variant="body2" 
                  color={isCompleted ? 'success.main' : 'primary.main'} 
                  fontWeight="bold"
                >
                  {progress}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                color={isCompleted ? 'success' : 'primary'}
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: (theme) => theme.palette.action.hover,
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }}
              />
            </Box>
          )}
        </Stack>

        <Box sx={{ mt: 3 }}>
          {isCompleted ? (
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<CheckCircle />}
              disabled
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Đã hoàn thành
            </Button>
          ) : isParticipating ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Đang tham gia
            </Button>
          ) : isUpcoming ? (
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => onJoin(challenge.id)}
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            >
              Đặt lịch nhắc nhở
            </Button>
          ) : isActive ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onJoin(challenge.id)}
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: (theme) => `0 8px 16px ${theme.palette.primary.main}40`,
                '&:hover': {
                  boxShadow: (theme) => `0 12px 24px ${theme.palette.primary.main}60`,
                }
              }}
            >
              Tham gia ngay
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              disabled
              sx={{ 
                borderRadius: 3,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              Đã kết thúc
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard; 