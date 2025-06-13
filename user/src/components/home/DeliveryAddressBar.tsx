import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LocationOn, KeyboardArrowDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DeliveryAddressBarProps {
  address: string;
  onChangeAddress?: () => void;
}

const DeliveryAddressBar: React.FC<DeliveryAddressBarProps> = ({
  address,
  onChangeAddress,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ minHeight: 48 }}>
        <Button
          startIcon={<LocationOn color="primary" />}
          endIcon={<KeyboardArrowDown />}
          onClick={() => navigate('/delivery-address')}
          sx={{
            textTransform: 'none',
            color: 'text.primary',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Box sx={{ textAlign: 'left', ml: 1 }}>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ lineHeight: 1 }}
            >
              Giao đến
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                maxWidth: isMobile ? 150 : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {address}
            </Typography>
          </Box>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default DeliveryAddressBar; 