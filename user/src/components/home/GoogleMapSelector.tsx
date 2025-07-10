import React, { useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  MyLocation,
  Search as SearchIcon,
  Place as PlaceIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '../GoogleMapsProvider';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 12,
    minWidth: 600,
    maxWidth: '90vw',
    maxHeight: '90vh',
    [theme.breakpoints.down('sm')]: {
      minWidth: '95vw',
      margin: 8,
    },
  },
}));

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: 400,
  borderRadius: 8,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
}));

interface GoogleMapSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectAddress: (address: {
    formatted_address: string;
    lat: number;
    lng: number;
    street_number?: string;
    route?: string;
    ward?: string;
    district?: string;
    city?: string;
  }) => void;
}

// Default center (Hà Nội)
const defaultCenter = {
  lat: 21.0285,
  lng: 105.8542,
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const GoogleMapSelector: React.FC<GoogleMapSelectorProps> = ({
  open,
  onClose,
  onSelectAddress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [center, setCenter] = useState(defaultCenter);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  
  const mapRef = useRef<google.maps.Map | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);

  // Use Google Maps context
  const { isLoaded, loadError } = useGoogleMaps();

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    geocoder.current = new google.maps.Geocoder();
  }, []);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      setSelectedLocation({ lat, lng });
      setShowInfoWindow(true);
      
      // Reverse geocode to get address
      if (geocoder.current) {
        geocoder.current.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const address = results[0];
              setSelectedLocation(prev => ({
                ...prev!,
                address: address.formatted_address,
              }));
            }
          }
        );
      }
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !geocoder.current) return;

    setIsLoading(true);
    setError(null);

    try {
      geocoder.current.geocode(
        { address: searchQuery + ', Vietnam' },
        (results, status) => {
          setIsLoading(false);
          
          if (status === 'OK' && results && results[0]) {
            const location = results[0].geometry.location;
            const newCenter = {
              lat: location.lat(),
              lng: location.lng(),
            };
            
            setCenter(newCenter);
            setSelectedLocation({
              lat: newCenter.lat,
              lng: newCenter.lng,
              address: results[0].formatted_address,
            });
            setShowInfoWindow(true);
            
            // Pan map to new location
            if (mapRef.current) {
              mapRef.current.panTo(newCenter);
              mapRef.current.setZoom(16);
            }
          } else {
            setError('Không tìm thấy địa chỉ. Vui lòng thử lại.');
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      setError('Lỗi khi tìm kiếm địa chỉ.');
    }
  }, [searchQuery]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = { lat: latitude, lng: longitude };
        
        setCenter(newCenter);
        setSelectedLocation({
          lat: latitude,
          lng: longitude,
        });
        setShowInfoWindow(true);
        
        if (mapRef.current) {
          mapRef.current.panTo(newCenter);
          mapRef.current.setZoom(16);
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setError('Không thể lấy vị trí hiện tại.');
        console.error('Geolocation error:', error);
      }
    );
  }, []);

  const handleConfirmLocation = useCallback(() => {
    if (!selectedLocation) return;

    // Parse address components
    const addressComponents = {
      formatted_address: selectedLocation.address || 'Địa chỉ đã chọn',
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    };

    onSelectAddress(addressComponents);
    onClose();
  }, [selectedLocation, onSelectAddress, onClose]);

  const handleClose = useCallback(() => {
    setSelectedLocation(null);
    setShowInfoWindow(false);
    setSearchQuery('');
    setError(null);
    onClose();
  }, [onClose]);

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <PlaceIcon color="primary" />
            <Typography variant="h6">Chọn địa chỉ trên bản đồ</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Tìm kiếm địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              startIcon={isLoading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              Tìm
            </Button>
            <Button
              variant="outlined"
              onClick={handleUseCurrentLocation}
              disabled={isLoading}
              startIcon={<MyLocation />}
            >
              Vị trí hiện tại
            </Button>
          </Box>
        </Box>

        {/* Map */}
        <MapContainer>
          {loadError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Lỗi khi tải Google Maps: {loadError.message}
            </Alert>
          )}
          
          {!isLoaded ? (
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              height="400px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {selectedLocation && (
                <Marker
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onClick={() => setShowInfoWindow(true)}
                />
              )}

              {showInfoWindow && selectedLocation && (
                <InfoWindow
                  position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  onCloseClick={() => setShowInfoWindow(false)}
                >
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Địa chỉ đã chọn:
                    </Typography>
                    <Typography variant="body2">
                      {selectedLocation.address || 'Địa chỉ đã chọn'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </Typography>
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </MapContainer>

        {/* Instructions */}
        <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Hướng dẫn:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            • Nhập địa chỉ vào ô tìm kiếm hoặc click "Vị trí hiện tại"
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Click vào bản đồ để chọn địa chỉ chính xác
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Địa chỉ sẽ được hiển thị trong khung thông tin
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Hủy
        </Button>
        <Button
          onClick={handleConfirmLocation}
          variant="contained"
          disabled={!selectedLocation}
          startIcon={<PlaceIcon />}
        >
          Xác nhận địa chỉ
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};

export default GoogleMapSelector; 