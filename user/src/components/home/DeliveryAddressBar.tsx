import React, { useState } from 'react';
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
import AddressSelector from './AddressSelector';

interface DeliveryAddressBarProps {
  address: string;
  onChangeAddress?: (newAddress: string) => void;
}

const DeliveryAddressBar: React.FC<DeliveryAddressBarProps> = ({
  address,
  onChangeAddress,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAddressSelector, setOpenAddressSelector] = useState(false);

  const handleOpenAddressSelector = () => {
    setOpenAddressSelector(true);
  };

  const handleCloseAddressSelector = () => {
    setOpenAddressSelector(false);
  };

  const handleSaveAddress = (newAddress: string) => {
    if (onChangeAddress) {
      onChangeAddress(newAddress);
    }
  };

  return (
    <>
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
            onClick={handleOpenAddressSelector}
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

      <AddressSelector
        open={openAddressSelector}
        onClose={handleCloseAddressSelector}
        onSave={handleSaveAddress}
        currentAddress={address}
      />
    </>
  );
};

export default DeliveryAddressBar; 