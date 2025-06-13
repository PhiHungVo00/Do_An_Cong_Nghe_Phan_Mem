import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Chip,
  CardActions,
  keyframes,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.4);
  }
  70% {
    transform: scale(0.98);
    box-shadow: 0 0 0 10px rgba(25, 118, 210, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
  }
`;

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'challenge' | 'event';
  status: string;
  startDate?: Date;
  endDate?: Date;
  participants?: number;
  reward?: string;
  buttonText: string;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  image,
  type,
  status,
  startDate,
  endDate,
  participants,
  reward,
  buttonText,
  onClick,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isClicked, setIsClicked] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  React.useEffect(() => {
    const registeredItems = JSON.parse(localStorage.getItem('registeredItems') || '{}');
    setIsRegistered(!!registeredItems[`${type}-${id}`]);
  }, [id, type]);

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'sắp diễn ra':
      case 'upcoming':
        return 'warning';
      case 'đang diễn ra':
      case 'ongoing':
        return 'success';
      case 'đã kết thúc':
      case 'ended':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleClick = () => {
    if (isRegistered) {
      enqueueSnackbar(
        `Bạn đã ${type === 'challenge' ? 'tham gia' : 'đăng ký'} ${title} trước đó!`,
        {
          variant: 'info',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }
      );
      return;
    }

    setIsClicked(true);
    
    const registeredItems = JSON.parse(localStorage.getItem('registeredItems') || '{}');
    registeredItems[`${type}-${id}`] = true;
    localStorage.setItem('registeredItems', JSON.stringify(registeredItems));
    
    setTimeout(() => {
      setIsClicked(false);
      setIsRegistered(true);
      if (onClick) onClick();
      
      enqueueSnackbar(
        `${type === 'challenge' ? 'Tham gia' : 'Đăng ký'} ${title} thành công!`,
        {
          variant: 'success',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          action: (
            <CheckCircleOutlineIcon sx={{ color: 'white', ml: 1 }} />
          ),
        }
      );
    }, 300);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Chip
            label={status}
            color={getStatusColor()}
            size="small"
            sx={{ ml: 1 }}
          />
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {description}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {startDate && endDate && (
            <Typography variant="body2" color="text.secondary">
              Thời gian: {formatDate(startDate)} - {formatDate(endDate)}
            </Typography>
          )}
          {participants !== undefined && (
            <Typography variant="body2" color="text.secondary">
              Số người tham gia: {participants}
            </Typography>
          )}
          {reward && (
            <Typography variant="body2" color="text.secondary">
              Giải thưởng: {reward}
            </Typography>
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant={isRegistered ? "outlined" : "contained"}
          onClick={handleClick}
          startIcon={isRegistered ? <HowToRegIcon /> : null}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            animation: isClicked ? `${pulseAnimation} 0.3s ease-in-out` : 'none',
            '&:hover': {
              transform: 'scale(1.02)',
              transition: 'transform 0.2s ease',
              backgroundColor: isRegistered ? 'rgba(25, 118, 210, 0.08)' : undefined,
            },
            '&:active': {
              transform: 'scale(0.98)',
            },
          }}
        >
          {isRegistered 
            ? `Đã ${type === 'challenge' ? 'tham gia' : 'đăng ký'}` 
            : buttonText
          }
        </Button>
      </CardActions>
    </Card>
  );
};

export default EventCard; 