import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  Schedule,
  PlayArrow,
} from '@mui/icons-material';
import { LiveEvent } from '../../types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface LiveEventCardProps {
  event: LiveEvent;
  onJoin: (eventId: string) => void;
}

const LiveEventCard: React.FC<LiveEventCardProps> = ({ event, onJoin }) => {
  const isLive = event.status === 'LIVE';
  const isUpcoming = event.status === 'UPCOMING';

  const formatEventTime = (date: Date) => {
    return format(date, 'HH:mm - dd/MM/yyyy', { locale: vi });
  };

  const getStatusColor = () => {
    switch (event.status) {
      case 'LIVE':
        return 'error';
      case 'UPCOMING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = () => {
    switch (event.status) {
      case 'LIVE':
        return 'Đang diễn ra';
      case 'UPCOMING':
        return 'Sắp diễn ra';
      default:
        return 'Đã kết thúc';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={event.host.avatar}
        alt={event.host.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={event.host.avatar}
            sx={{ width: 32, height: 32, mr: 1 }}
          />
          <Typography variant="subtitle1">
            {event.host.name}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          {event.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {event.description}
        </Typography>

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule fontSize="small" color="action" />
            <Typography variant="body2">
              {formatEventTime(event.startTime)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Visibility fontSize="small" color="action" />
            <Typography variant="body2">
              {event.viewers.toLocaleString('vi-VN')} người xem
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {event.products.length} sản phẩm
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
          />
          {(isLive || isUpcoming) && (
            <Button
              variant={isLive ? 'contained' : 'outlined'}
              color={isLive ? 'error' : 'primary'}
              onClick={() => onJoin(event.id)}
              startIcon={isLive ? <PlayArrow /> : undefined}
            >
              {isLive ? 'Tham gia ngay' : 'Đặt lịch'}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default LiveEventCard; 